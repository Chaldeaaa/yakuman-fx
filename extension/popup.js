const status=document.querySelector('#status');
const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
let valid=false;
try{const url=new URL(tab.url);valid=url.origin==='https://game.maj-soul.com'&&url.pathname==='/1/';}catch{}
for(const button of document.querySelectorAll('button'))button.disabled=!valid;
async function refresh(){
  if(!valid){status.textContent='Open https://game.maj-soul.com/1/ to use Yakuman FX.';return;}
  const settings=await chrome.storage.local.get('enabled');
  const state=(await chrome.storage.session.get('tab:'+tab.id))['tab:'+tab.id];
  status.textContent=state?.message||(settings.enabled?'Automatic effects enabled. Reload in the lobby to attach.':'Automatic effects are disabled.');
}
async function act(action){
  if(action==='enable'&&!confirm('Enable native effects and reload the game now? Continue only when you are in the lobby.'))return;
  if(action==='reload'&&!confirm('Reload the game now? Continue only when you are in the lobby.'))return;
  status.textContent='Working…';
  try{const result=await chrome.runtime.sendMessage({action,tabId:tab.id});if(!result.ok)throw Error(result.error);if(action==='diagnostics'){const details=document.querySelector('#details');details.hidden=false;details.textContent=JSON.stringify(result.diagnostics,null,2);}await refresh();}catch(error){status.textContent=error.message;}
}
for(const action of ['enable','restore','reload','diagnostics'])document.querySelector('#'+action).addEventListener('click',()=>void act(action));
chrome.storage.onChanged.addListener(()=>void refresh());
await refresh();
