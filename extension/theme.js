const choices=['night','day','system'];
export async function setupTheme(){
  const media=matchMedia('(prefers-color-scheme: dark)');
  let choice='night';
  function apply(value){
    choice=choices.includes(value)?value:'night';
    document.documentElement.dataset.theme=choice==='system'?(media.matches?'night':'day'):choice;
    const toggle=document.getElementById('theme-toggle');
    if(toggle){
      const label=document.documentElement.dataset.theme==='night'?'Switch to day mode':'Switch to night mode';
      toggle.setAttribute('aria-label',label);
      toggle.title=label;
    }
    for(const button of document.querySelectorAll('button[data-theme]'))button.setAttribute('aria-pressed',String(button.dataset.theme===choice));
  }
  apply((await chrome.storage.local.get('theme')).theme);
  document.getElementById('theme-toggle')?.addEventListener('click',async()=>{
    apply(document.documentElement.dataset.theme==='night'?'day':'night');
    await chrome.storage.local.set({theme:choice});
  });
  for(const button of document.querySelectorAll('button[data-theme]'))button.addEventListener('click',async()=>{
    apply(button.dataset.theme);
    await chrome.storage.local.set({theme:choice});
  });
  media.addEventListener('change',()=>{if(choice==='system')apply(choice);});
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.theme)apply(changes.theme.newValue);});
}
