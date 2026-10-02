import test from 'node:test';
import assert from 'node:assert/strict';

test('extension scopes attachment, fails open on unknown builds, and restores without reloading',async()=>{
  const events={},commands=[],settings={},state={};let reloads=0,attaches=0,detaches=0,refuse=false,currentUrl='https://game.maj-soul.com/1/';
  const event=name=>({addListener(callback){events[name]=callback;}});
  globalThis.chrome={
    storage:{local:{async get(){return settings;},async set(value){Object.assign(settings,value);}},session:{async set(value){Object.assign(state,value);},async remove(){}}},
    action:{async setBadgeText(){},async setBadgeBackgroundColor(){}},
    debugger:{async attach(){attaches++;if(refuse)throw Error('Cannot access a chrome-extension:// URL of different extension');},async detach(){detaches++;},async getTargets(){return[];},async sendCommand(target,method,params){commands.push({target,method,params});return{};},onEvent:event('debug'),onDetach:event('detach')},
    webNavigation:{onBeforeNavigate:event('navigate'),onCommitted:event('committed')},
    tabs:{async get(id){return{id,url:currentUrl};},async reload(){reloads++;},onRemoved:event('removed')},
    runtime:{id:'test-extension',onMessage:event('message')},
  };
  const originalInterval=globalThis.setInterval;globalThis.setInterval=()=>0;
  try{
    await import('../extension/background.js');
    const message=action=>new Promise(resolve=>events.message({action,tabId:7},{id:'test-extension'},resolve));
    events.navigate({tabId:8,frameId:0,url:'https://example.com/'});
    assert.equal(attaches,0);
    assert.deepEqual(await message('enable'),{ok:true});assert.equal(attaches,0);assert.equal(reloads,1);
    events.committed({tabId:7,frameId:0,url:currentUrl});
    await new Promise(resolve=>setTimeout(resolve,10));assert.equal(attaches,1);assert.equal(reloads,1);
    events.debug({tabId:7},'Fetch.requestPaused',{requestId:'request',request:{method:'GET',url:'https://game.maj-soul.com/1/Build/new.framework.js.gz'},responseStatusCode:200});
    await new Promise(resolve=>setTimeout(resolve,10));
    assert.equal(state['tab:7'].state,'error');assert(commands.some(c=>c.method==='Fetch.continueRequest'));
    assert(!commands.some(c=>c.method==='Fetch.fulfillRequest'));
    assert.deepEqual(await message('restore'),{ok:true});assert.equal(settings.enabled,false);assert.equal(detaches,1);assert.equal(reloads,1);
    refuse=true;
    assert.deepEqual(await message('enable'),{ok:true});assert.equal(reloads,2);
    events.committed({tabId:7,frameId:0,url:currentUrl});
    await new Promise(resolve=>setTimeout(resolve,10));assert.match(state['tab:7'].message,/Browser refused/);assert.equal(detaches,1);
    assert.deepEqual(await message('reload'),{ok:true});assert.equal(reloads,3);
    currentUrl='chrome-extension://another-extension/newtab.html';
    const before=attaches;
    events.navigate({tabId:7,frameId:0,url:'https://game.maj-soul.com/1/'});
    await new Promise(resolve=>setTimeout(resolve,10));assert.equal(attaches,before);
    currentUrl='https://game.maj-soul.com/1/';refuse=false;
    events.committed({tabId:7,frameId:0,url:currentUrl});
    await new Promise(resolve=>setTimeout(resolve,10));assert.equal(attaches,before+1);
  }finally{globalThis.setInterval=originalInterval;delete globalThis.chrome;}
});
