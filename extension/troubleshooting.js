import {checkForUpdates} from './updates.js';
import {setupLanguage,translate} from './i18n.js';
import {setupTheme} from './theme.js';
import {setupDropdowns} from './dropdown.js';
await setupLanguage();
await setupTheme();
setupDropdowns();
async function refresh(){
  const all=await chrome.storage.session.get(null);
  const diagnostics=Object.fromEntries(Object.entries(all).filter(([key])=>key.startsWith('diagnostics:')));
  document.querySelector('#details').textContent=Object.keys(diagnostics).length?JSON.stringify(diagnostics,null,2):translate('No startup diagnostics have been captured in this browser session.');
}
document.querySelector('#refresh').addEventListener('click',()=>void refresh());
document.addEventListener('languagechange',()=>void refresh());
await refresh();

const currentVersion=chrome.runtime.getManifest().version;
let updateMessage='', updateVersion='', checking=false;
function renderUpdates(){
  document.querySelector('#installed-version').textContent=translate('Installed version: ')+currentVersion;
  document.querySelector('#update-status').textContent=translate(updateMessage)+updateVersion;
  document.querySelector('#check-updates').disabled=checking;
}
document.querySelector('#check-updates').addEventListener('click',async()=>{
  if(checking)return;
  checking=true;updateMessage='Checking for updates…';updateVersion='';renderUpdates();
  try{
    const result=await checkForUpdates(currentVersion);
    updateMessage=result.available?'Update available: ':'You are up to date.';
    updateVersion=result.available?result.version:'';
    document.querySelector('#release-link').href=result.url;
  }catch{updateMessage='Could not check for updates. Check your connection and try again, or open releases below.';}
  finally{checking=false;renderUpdates();}
});
document.addEventListener('languagechange',renderUpdates);
renderUpdates();
