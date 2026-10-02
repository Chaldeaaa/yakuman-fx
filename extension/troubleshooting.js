import {setupLanguage,translate} from './i18n.js';
import {setupTheme} from './theme.js';
await setupLanguage();
await setupTheme();
async function refresh(){
  const all=await chrome.storage.session.get(null);
  const diagnostics=Object.fromEntries(Object.entries(all).filter(([key])=>key.startsWith('diagnostics:')));
  document.querySelector('#details').textContent=Object.keys(diagnostics).length?JSON.stringify(diagnostics,null,2):translate('No startup diagnostics have been captured in this browser session.');
}
document.querySelector('#refresh').addEventListener('click',()=>void refresh());
document.addEventListener('languagechange',()=>void refresh());
await refresh();
