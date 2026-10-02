const choices=['dark','light','system'];
export async function setupTheme(){
  const media=matchMedia('(prefers-color-scheme: dark)');
  const select=document.getElementById('theme');
  let choice='dark';
  function apply(value){
    // Keep preferences saved by earlier releases.
    const migrated=value==='night'?'dark':value==='day'?'light':value;
    choice=choices.includes(migrated)?migrated:'dark';
    const dark=choice==='system'?media.matches:choice==='dark';
    document.documentElement.dataset.theme=dark?'night':'day';
    if(select)select.value=choice;
  }
  apply((await chrome.storage.local.get('theme')).theme);
  select?.addEventListener('change',async()=>{
    apply(select.value);
    await chrome.storage.local.set({theme:choice});
  });
  media.addEventListener('change',()=>{if(choice==='system')apply(choice);});
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.theme)apply(changes.theme.newValue);});
}
