import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {patchData} from '../extension/bundle.js';

test('patch changes only the three approved ranges and rejects duplicate or missing targets', () => {
  const targets = [
    ['function Tools.IsYiManEffectClosed()if Tools.IsWebGL()then return true end;return false end;', 'function Tools.IsYiManEffectClosed()return false end;'],
    ['if not Tools.IsWebGL()then table.insert(c,"yiman")end;', 'table.insert(c,"yiman");'],
    ['if ak==103 and Tools.IsWebGL()then i=d(a.Click)else i=d(a.Sound)end;', 'i=d(ak==262 and a.Emo or ak==103 and a.Click or a.Sound);'],
  ];
  const key = new TextEncoder().encode('wrelupqezdfrqdsd');
  const encode = (text, phase) => Uint8Array.from(new TextEncoder().encode(text), (b,i)=>b^key[(i+phase)%key.length]);
  const source = new Uint8Array(1024).fill(0xa5), expected = source.slice();
  let offset = 37;
  for (const [index,[before,after]] of targets.entries()) {
    source.set(encode(before,index*3),offset);
    expected.set(encode(after.padEnd(before.length,' '),index*3),offset);
    offset += before.length + 53;
  }
  const snapshot = source.slice();
  assert.deepEqual(patchData(source),expected);
  assert.deepEqual(source,snapshot);
  const duplicate=source.slice();duplicate.set(encode(targets[0][0],0),700);
  assert.throws(()=>patchData(duplicate),/Unsupported script layout/);
  const missing=source.slice();missing[37]^=1;
  assert.throws(()=>patchData(missing),/Unsupported script layout/);
});

test('bridge coalesces report bursts and preserves a terminal failure', async () => {
  let receive, scheduled;
  const sent=[];
  const window={addEventListener:(_,fn)=>receive=fn,postMessage(){}};
  const context={window,location:{origin:'https://game.maj-soul.com',pathname:'/1/'},
    setTimeout:fn=>{assert.equal(scheduled,undefined);scheduled=fn;return 1;},
    chrome:{storage:{onChanged:{addListener(){}}},runtime:{sendMessage:async message=>{sent.push(message);return {ok:true,config:{enabled:false}};}}}};
  vm.runInNewContext(fs.readFileSync(new URL('../extension/bridge.js',import.meta.url),'utf8'),context);
  const report=body=>receive({source:window,origin:context.location.origin,data:{type:'yakuman-stream-report',report:{transport:'module-stream',...body}}});
  for(let i=0;i<100;i++)report({bundleReads:i});
  report({failure:'cache-checksum'});
  report({bundleReads:200,runtimeReady:true});
  assert.equal(sent.filter(m=>m.action==='report').length,0);
  scheduled();
  const reports=sent.filter(m=>m.action==='report');
  assert.equal(reports.length,1);
  assert.equal(reports[0].report.failure,'cache-checksum');
});
