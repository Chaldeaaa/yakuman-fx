import test from 'node:test';
import assert from 'node:assert/strict';

test('page bridge cannot enable, reload, change settings, or prepare outside a supported top frame', async () => {
  let receive, reloads = 0;
  const settings = {}, session = {};
  globalThis.chrome = {
    runtime: {id:'test', getURL:p=>'chrome-extension://test/'+p, getManifest:()=>({version:'0.3.0'}), onMessage:{addListener:fn=>{receive=fn;}}},
    storage: {local:{get:async()=>settings,set:async values=>Object.assign(settings,values)}, session:{set:async values=>Object.assign(session,values),remove:async()=>{}}},
    tabs: {get:async id=>({id,url:'https://game.maj-soul.com/1/'}),reload:async()=>{reloads++;},onRemoved:{addListener(){}}},
    action: {setBadgeText:async()=>{}},
  };
  try {
    await import('../extension/background.js');
    const page={id:'test',url:'https://game.maj-soul.com/1/',frameId:0,tab:{id:7}};
    const send=(message,sender=page)=>new Promise(resolve=>receive(message,sender,resolve));
    assert.equal((await send({action:'enable',tabId:7})).ok,false);
    assert.equal(reloads,0); assert.equal(settings.enabled,undefined);
    assert.equal((await send({action:'prepare'},{...page,frameId:1})).ok,false);
    assert.equal((await send({action:'prepare'},{...page,url:'https://example.com/'})).ok,false);
    assert.deepEqual(await send({action:'prepare'}),{ok:true,config:{enabled:false}});
    assert.equal((await send({action:'enable',tabId:7},{id:'test',url:'chrome-extension://test/popup.html'})).ok,true);
    assert.equal(settings.enabled,true); assert.equal(reloads,1);
    settings.enabled=false;
    await send({action:'report',report:{bundleReads:-100,installed:true,runtimeReady:true,failure:'x'.repeat(500),account:'not persisted'}});
    const saved=session['diagnostics:7'].hook;
    assert.equal(saved.bundleReads,0); assert.equal(saved.failure.length,100); assert.equal(saved.account,undefined);
  } finally {delete globalThis.chrome;}
});
