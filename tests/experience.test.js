import test from 'node:test';
import assert from 'node:assert/strict';
import {describeStatus} from '../extension/status.js';
import {translate} from '../extension/i18n.js';
import {compareVersions, checkForUpdates} from '../extension/updates.js';

test('status distinguishes saved preference from loaded effects and gives bilingual recovery', () => {
  const cases = [
    [{valid:false}, 'Open Mahjong Soul'],
    [{valid:true,enabled:false,state:{state:'enabled'}}, 'Automatic effects off'],
    [{valid:true,enabled:false,state:{state:'disabled'}}, 'Automatic effects off'],
    [{valid:true,enabled:true}, 'Enabled for future launches'],
    [{valid:true,enabled:true,state:{state:'attached'}}, 'Loading native effects'],
    [{valid:true,enabled:true,state:{state:'enabled'}}, 'Native effects ready'],
    [{valid:true,enabled:true,error:'Failed to fetch'}, 'Resources could not load'],
    [{valid:true,enabled:true,state:{state:'error',message:'cache-checksum'}}, 'Game resources do not match'],
    [{valid:true,enabled:true,error:'unknown'}, 'Effects could not start'],
  ];
  for (const [input,title] of cases) {
    const result=describeStatus(input);
    assert.equal(result.title,title);
    assert.notEqual(translate(result.title,'zh-CN'),result.title);
    assert.notEqual(translate(result.hint,'zh-CN'),result.hint);
  }
});

test('update checks compare numeric versions, include previews and constrain destination', async () => {
  assert.equal(compareVersions('v0.10.0','0.9.9'),1);
  assert.equal(compareVersions('v0.3.0','0.3.0'),0);
  assert.equal(compareVersions('bad','0.3.0'),null);
  const request=async(url,options)=>{
    assert.equal(new URL(url).hostname,'api.github.com');
    assert.equal(options.credentials,'omit');
    return {ok:true,json:async()=>[
      {tag_name:'v0.2.12'}, {tag_name:'v0.3.0',prerelease:true,html_url:'https://evil.example/'},
      {tag_name:'v9.0.0',draft:true}, {tag_name:'invalid'},
    ]};
  };
  const result=await checkForUpdates('0.2.12',request);
  assert.equal(result.available,true);
  assert.equal(result.url,'https://github.com/Chaldeaaa/yakuman-fx/releases/tag/v0.3.0');
  assert.equal((await checkForUpdates('0.3.0',request)).available,false);
  await assert.rejects(checkForUpdates('0.3.0',async()=>({ok:false,status:403})));
  await assert.rejects(checkForUpdates('0.3.0',async()=>({ok:true,json:async()=>[]})));
});
