(()=>{
 const defaults={size:100,theme:'normal',images:'show',lines:'normal',linear:false};
 const key='media.accessibility.v1',root=document.documentElement,form=document.querySelector('#accessibility-form'),dialog=document.querySelector('#accessibility-dialog');
 const clean=s=>({size:[100,125,150,200].includes(+s?.size)?+s.size:100,theme:['normal','light','dark','cream'].includes(s?.theme)?s.theme:'normal',images:['show','gray','hide'].includes(s?.images)?s.images:'show',lines:['normal','wide','extra'].includes(s?.lines)?s.lines:'normal',linear:s?.linear===true});
 let state={...defaults};try{state=clean(JSON.parse(localStorage.getItem(key)))}catch{}
 function apply(save=false){
  root.dataset.a11ySize=state.size;root.dataset.a11yTheme=state.theme;root.dataset.a11yImages=state.images;root.dataset.a11yLines=state.lines;
  root.style.setProperty('--a11y-scale',state.size/100);root.classList.toggle('a11y-enlarged',state.size>100);root.classList.toggle('a11y-high-zoom',state.size>=150);root.classList.toggle('a11y-custom',state.theme!=='normal'||state.size!==100||state.lines!=='normal');
  for(const [name,value] of Object.entries(state)){const el=form.elements[name];if(el.type==='checkbox')el.checked=value;else el.value=String(value)}
  document.dispatchEvent(new CustomEvent('media:accessibility',{detail:state}));
  if(save){try{localStorage.setItem(key,JSON.stringify(state));document.querySelector('#a11y-status').textContent='Настройки сохранены.'}catch{document.querySelector('#a11y-status').textContent='Настройки применены. Сохранение в браузере недоступно.'}}
 }
 document.querySelectorAll('[data-accessibility]').forEach(b=>b.addEventListener('click',()=>openDialog(dialog,b)));
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('change',()=>{state=clean({size:form.elements.size.value,theme:form.elements.theme.value,images:form.elements.images.value,lines:form.elements.lines.value,linear:form.elements.linear.checked});apply(true)});
 document.querySelector('#a11y-reset').addEventListener('click',()=>{state={...defaults};apply(true)});
 document.querySelector('#a11y-done').addEventListener('click',()=>closeDialog(dialog));
 apply();
})();
