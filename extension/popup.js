import {setupLanguage,translate} from './i18n.js';
import {setupTheme} from './theme.js';
await setupLanguage();
await setupTheme();
document.getElementById('settings').addEventListener('click',()=>void chrome.runtime.openOptionsPage());
const status=document.querySelector('#status');
const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
let valid=false;
try{const url=new URL(tab.url);valid=url.origin==='https://game.maj-soul.com'&&url.pathname==='/1/';}catch{}
for(const id of ['enable','restore','reload'])document.querySelector('#'+id).disabled=!valid;
async function refresh(){
  if(!valid){status.textContent=translate('Open https://game.maj-soul.com/1/ to use Yakuman FX.');return;}
  const settings=await chrome.storage.local.get('enabled');
  const state=(await chrome.storage.session.get('tab:'+tab.id))['tab:'+tab.id];
  status.textContent=translate(state?.message||(settings.enabled?'Automatic effects enabled. Reload in the lobby to attach.':'Automatic effects are disabled.'));
}
async function act(action){
  if(action==='enable'&&!confirm(translate('Enable native effects and reload the game now? Continue only when you are in the lobby.')))return;
  if(action==='reload'&&!confirm(translate('Reload the game now? Continue only when you are in the lobby.')))return;
  status.textContent=translate('Working…');
  try{const result=await chrome.runtime.sendMessage({action,tabId:tab.id});if(!result.ok)throw Error(result.error);await refresh();}catch(error){status.textContent=translate(error.message);}
}
for(const action of ['enable','restore','reload'])document.querySelector('#'+action).addEventListener('click',()=>void act(action));
chrome.storage.onChanged.addListener(()=>void refresh());
document.addEventListener('languagechange',()=>void refresh());
await refresh();
