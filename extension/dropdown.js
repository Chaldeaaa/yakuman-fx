export function setupDropdowns(){
  const renders=[];
  for(const select of document.querySelectorAll('.setting-row select')){
    const wrapper=document.createElement('div');wrapper.className='dropdown';
    const trigger=document.createElement('button');trigger.type='button';trigger.className='dropdown-trigger';
    const caption=document.createElement('span');
    const arrow=document.createElement('span');arrow.className='dropdown-arrow';arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');
    trigger.append(caption,arrow);
    const list=document.createElement('div');list.className='dropdown-menu';list.id=select.id+'-menu';list.setAttribute('role','listbox');list.hidden=true;
    trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-controls',list.id);trigger.setAttribute('aria-expanded','false');
    const label=document.querySelector(`label[for="${select.id}"]`);
    label.id=select.id+'-label';trigger.setAttribute('aria-labelledby',label.id+' '+select.id+'-value');caption.id=select.id+'-value';list.setAttribute('aria-labelledby',label.id);
    select.hidden=true;select.after(wrapper);wrapper.append(trigger,list);
    const close=()=>{list.hidden=true;trigger.setAttribute('aria-expanded','false');};
    const options=()=>Array.from(list.querySelectorAll('button'));
    function open(){
      document.dispatchEvent(new Event('dropdownclose'));
      list.hidden=false;trigger.setAttribute('aria-expanded','true');
      options()[Math.max(0,select.selectedIndex)]?.focus();
    }
    function render(){
      caption.textContent=select.selectedOptions[0]?.textContent||'';
      list.replaceChildren();
      for(const option of select.options){
        const button=document.createElement('button');button.type='button';button.className='dropdown-option';button.tabIndex=-1;button.setAttribute('role','option');button.setAttribute('aria-selected',String(option.selected));
        const text=document.createElement('span');text.textContent=option.textContent;
        const check=document.createElement('span');check.className='dropdown-check';check.textContent=option.selected?'✓':'';check.setAttribute('aria-hidden','true');button.append(text,check);
        button.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));close();trigger.focus();});
        list.append(button);
      }
    }
    trigger.addEventListener('click',()=>list.hidden?open():close());
    trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();open();}});
    list.addEventListener('keydown',event=>{
      const buttons=options(),index=buttons.indexOf(document.activeElement);
      if(event.key==='Escape'){event.preventDefault();close();trigger.focus();}
      else if(event.key==='Tab')close();
      else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
        event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[next]?.focus();
      }
    });
    label.addEventListener('click',()=>trigger.focus());
    document.addEventListener('pointerdown',event=>{if(!wrapper.contains(event.target))close();});
    wrapper.addEventListener('focusout',event=>{if(!wrapper.contains(event.relatedTarget))close();});
    document.addEventListener('dropdownclose',close);
    select.addEventListener('change',render);renders.push(()=>{close();render();});render();
  }
  const refresh=()=>{for(const render of renders)render();};
  document.addEventListener('languagechange',refresh);
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&(changes.theme||changes.language))refresh();});
}
