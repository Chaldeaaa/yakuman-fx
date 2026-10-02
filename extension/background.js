import {buildPatch,base64,sha256,supported} from './bundle.js';
import {filesystemHook} from './filesystem-hook.js';

const sessions=new Map();
const plannedDetach=new Map();
let prepared;
const isGame=url=>{try{const u=new URL(url);return u.origin==='https://game.maj-soul.com'&&u.pathname==='/1/';}catch{return false;}};
const send=(tabId,method,params={})=>chrome.debugger.sendCommand({tabId},method,params);
async function status(tabId,state,message){
  await chrome.storage.session.set({['tab:'+tabId]:{state,message}});
  await chrome.action.setBadgeText({tabId,text:state==='enabled'?'ON':state==='error'?'!':state==='attached'?'…':''}).catch(()=>{});
  await chrome.action.setBadgeBackgroundColor({tabId,color:state==='error'?'#b84242':'#267864'}).catch(()=>{});
}
async function patch(){
  if(!prepared)prepared=(async()=>{
    const response=await fetch(supported.coreUrl,{credentials:'omit',cache:'no-cache',signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw Error('Official resource download failed: '+response.status);
    return base64(await buildPatch(new Uint8Array(await response.arrayBuffer())));
  })().catch(error=>{prepared=undefined;throw error;});
  return prepared;
}
async function attach(tabId){
  if(sessions.has(tabId))return;
  const current=await chrome.tabs.get(tabId);
  if(!isGame(current.url))throw Error('Wait until the supported game page has finished navigating.');
  if(sessions.has(tabId))return;
  sessions.set(tabId,{ready:false});
  let connected=false;
  try{
    await chrome.debugger.attach({tabId},'1.3');
    connected=true;
    await send(tabId,'Fetch.enable',{patterns:[{urlPattern:'https://game.maj-soul.com/1/Build/*.framework.js.gz',requestStage:'Response'}]});
    sessions.get(tabId).ready=true;
    await status(tabId,'attached','Ready for the next game load. Reload only in the lobby.');
  }catch(error){
    sessions.delete(tabId);
    if(connected)await chrome.debugger.detach({tabId}).catch(()=>{});
    const message=error.message.includes('chrome-extension://')?
      'Browser refused debugger access. Another extension may have embedded a page in this tab. Reload in the lobby to retry; if it persists, use a profile without page-injecting extensions.':error.message;
    await status(tabId,'error',message);
    throw Error(message);
  }
}
async function detach(tabId,reason='disabled'){
  plannedDetach.set(tabId,reason);
  sessions.delete(tabId);
  await send(tabId,'Fetch.disable').catch(()=>{});
  await chrome.debugger.detach({tabId}).catch(()=>{});
}
async function finish(tabId){
  await detach(tabId,'loaded');
  await status(tabId,'enabled','Native effects loaded. Debugging disconnected.');
}
chrome.debugger.onEvent.addListener((source,method,event)=>{
  if(method!=='Fetch.requestPaused'||source.tabId===undefined)return;
  void intercept(source.tabId,event);
});
async function intercept(tabId,event){
  let fulfilled=false;
  try{
    const url=new URL(event.request.url);
    if(event.request.method!=='GET'||event.responseStatusCode!==200)return;
    if(url.origin!=='https://game.maj-soul.com'||!url.pathname.endsWith('/'+supported.frameworkName))throw Error('Unsupported client framework. No modification applied.');
    const response=await send(tabId,'Fetch.getResponseBody',{requestId:event.requestId});
    const source=response.base64Encoded?Uint8Array.from(atob(response.body),c=>c.charCodeAt(0)):new TextEncoder().encode(response.body);
    if(await sha256(source)!==supported.frameworkHash)throw Error('Unsupported client framework. No modification applied.');
    const text=new TextDecoder().decode(source),anchor='Module["FS_createDataFile"]=FS.createDataFile;';
    if(!text.includes(anchor))throw Error('Missing framework entry point.');
    const payload=await patch();
    if(!(await chrome.storage.local.get('enabled')).enabled)return;
    const hook=filesystemHook(payload,new URL(supported.coreUrl).pathname.split('/').pop(),supported.coreSize,supported.coreCrc);
    const body=base64(new TextEncoder().encode(text.replace(anchor,anchor+hook)));
    await send(tabId,'Fetch.fulfillRequest',{requestId:event.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/javascript'},{name:'Cache-Control',value:'no-store'}],body});
    fulfilled=true;
    if(sessions.has(tabId))sessions.get(tabId).installedAt=Date.now();
    await status(tabId,'attached','Temporary hook installed. Waiting for verified resource reads.');
  }catch(error){await status(tabId,'error',error.message);}
  finally{if(!fulfilled)await send(tabId,'Fetch.continueRequest',{requestId:event.requestId}).catch(()=>{});}
}
chrome.debugger.onDetach.addListener(source=>{
  sessions.delete(source.tabId);
  const reason=plannedDetach.get(source.tabId);
  plannedDetach.delete(source.tabId);
  if(reason==='loaded'){void status(source.tabId,'enabled','Native effects loaded. Debugging disconnected.');return;}
  if(reason)return;
  void status(source.tabId,'detached','Disconnected. Reload in the lobby after enabling to apply changes.');
});
chrome.webNavigation.onBeforeNavigate.addListener(details=>{
  if(details.frameId!==0)return;
  if(!isGame(details.url)){if(sessions.has(details.tabId))void detach(details.tabId);return;}
  // The old document can be an extension's new-tab page. Never attach to it.
});
chrome.webNavigation.onCommitted.addListener(details=>{
  if(details.frameId!==0||!isGame(details.url))return;
  void chrome.storage.local.get('enabled').then(settings=>{if(settings.enabled)return attach(details.tabId);}).catch(()=>{});
});
chrome.tabs.onRemoved.addListener(tabId=>{sessions.delete(tabId);plannedDetach.delete(tabId);void chrome.storage.session.remove(['tab:'+tabId,'diagnostics:'+tabId]);});
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(sender.id!==chrome.runtime.id)return;
  void(async()=>{
    const tab=await chrome.tabs.get(message.tabId);
    if(!isGame(tab.url))throw Error('Open the supported Mahjong Soul game page first.');
    if(message.action==='enable'){
      await chrome.storage.local.set({enabled:true});
      // Attach only once the fresh game document commits. This also avoids
      // third-party extension frames in the currently loaded document.
      await status(tab.id,'attached','Automatic effects enabled. Reloading the game…');
      await chrome.tabs.reload(tab.id,{bypassCache:true});
    }else if(message.action==='restore'){
      await chrome.storage.local.set({enabled:false});
      for(const tabId of [...sessions.keys()])await detach(tabId);
      await status(tab.id,'disabled','Automatic effects disabled. Reload in the lobby to remove the current temporary patch.');
    }else if(message.action==='reload'){
      // Retry after the new document commits, rather than attaching to old iframes.
      await chrome.tabs.reload(tab.id,{bypassCache:true});
    }else if(message.action==='diagnostics'){
      const state=await chrome.storage.session.get('diagnostics:'+tab.id);
      respond({ok:true,diagnostics:state['diagnostics:'+tab.id]||{reason:'No runtime diagnostic received. Connection may be detached.'}});
      return;
    }else throw Error('Unknown action');
    respond({ok:true});
  })().catch(error=>respond({ok:false,error:error.message}));
  return true;
});
// Chrome 118+ keeps debugger sessions alive; a periodic check reports our own hook only.
setInterval(()=>{
  for(const [tabId,session]of sessions)if(session.ready&&!session.checking){
    session.checking=true;
    void send(tabId,'Runtime.evaluate',{expression:'JSON.stringify({hook:window.__yakumanNative||null,unityReady:!!window.unityInstance?.Module?.HEAPU8})',returnByValue:true}).then(async result=>{
    if(sessions.get(tabId)!==session)return;
    const report=JSON.parse(result.result.value||'null');
    const value=report?.hook;
    void chrome.storage.session.set({['diagnostics:'+tabId]:{version:chrome.runtime.getManifest().version,hook:value}});
    if(value?.bundleReads>0&&report.unityReady)return finish(tabId);
    if(value?.failure)return status(tabId,'error','Resource substitution blocked: '+value.failure.reason+'. See Extension options for details.');
    if(session.installedAt&&Date.now()-session.installedAt>15000)return status(tabId,'error',value?'Hook loaded, but the expected core has not been read. See Extension options.':'Hook not found in the main game context. See Extension options.');
  }).catch(error=>{
    void chrome.storage.session.set({['diagnostics:'+tabId]:{version:chrome.runtime.getManifest().version,reason:'runtime-query-failed',error:error.message}});
    void status(tabId,'error','Runtime verification failed. See Extension options for the browser error.');
  }).finally(()=>{session.checking=false;});
  }
},3000);
// Recover sessions after a service-worker restart without forcing a game reload.
void chrome.storage.local.get('enabled').then(async settings=>{
  if(!settings.enabled)return;
  const targets=await chrome.debugger.getTargets();
  for(const target of targets){
    if(target.tabId===undefined||!isGame(target.url)||!target.attached)continue;
    try{
      await send(target.tabId,'Runtime.evaluate',{expression:'typeof window.__yakumanNative',returnByValue:true});
      sessions.set(target.tabId,{ready:true});
    }catch{ /* A target attached by another debugger is not ours. */ }
  }
}).catch(()=>{});

