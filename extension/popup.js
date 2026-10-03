import {setupLanguage,translate} from './i18n.js';
import {setupTheme} from './theme.js';
import {describeStatus} from './status.js';
import {clientForUrl} from './clients.js';
await setupLanguage();
await setupTheme();
document.getElementById('settings').addEventListener('click',()=>void chrome.runtime.openOptionsPage());
const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
const valid=!!clientForUrl(tab?.url);
let busy=false, actionError=null, revision=0;
function render(view,enabled=false){
  document.querySelector('#status-title').textContent=translate(view.title);
  document.querySelector('#status-hint').textContent=translate(view.hint);
  for(const id of ['enable','restore','reload'])document.querySelector('#'+id).disabled=!valid||busy||(id==='restore'&&!enabled);
}
async function refresh(){
  const current=++revision;
  const settings=await chrome.storage.local.get('enabled');
  const state=valid?(await chrome.storage.session.get('tab:'+tab.id))['tab:'+tab.id]:null;
  if(current!==revision||busy)return;
  render(describeStatus({valid,enabled:settings.enabled,state,error:actionError}),!!settings.enabled);
}
async function act(action){
  if(busy)return;
  if(action==='enable'&&!confirm(translate('Enable native effects and reload the game now? Continue only when you are in the lobby.')))return;
  if(action==='reload'&&!confirm(translate('Reload the game now? Continue only when you are in the lobby.')))return;
  busy=true;actionError=null;
  render({title:'Working…',hint:action==='restore'?'Turning off automatic effects…':'Reloading the game…'});
  try{const result=await chrome.runtime.sendMessage({action,tabId:tab.id});if(!result?.ok)throw Error(result?.error||'Action failed');}
  catch(error){actionError=error.message;}
  finally{busy=false;await refresh();}
}
for(const action of ['enable','restore','reload'])document.querySelector('#'+action).addEventListener('click',()=>void act(action));
chrome.storage.onChanged.addListener((changes,area)=>{if((area==='local'&&changes.enabled)||(area==='session'&&changes['tab:'+tab?.id]))void refresh();});
document.addEventListener('languagechange',()=>void refresh());
await refresh();
