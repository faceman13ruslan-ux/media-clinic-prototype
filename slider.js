/* Intrinsic-height section slider. No transforms, inner scrolling or autoplay. */
(()=>{
 const deck=document.querySelector('.story-deck');if(!deck)return;
 const slides=[...deck.querySelectorAll('[data-story-slide]')];
 const tabs=[...deck.querySelectorAll('[data-story-target]')];
 const viewport=deck.querySelector('.story-viewport');
 const previous=[...deck.querySelectorAll('[data-story-prev]')];
 const next=[...deck.querySelectorAll('[data-story-next]')];
 const status=deck.querySelector('[data-story-status]');
 let active=0,touch=null,linear=false;
 const indexFor=id=>slides.findIndex(s=>s.id===id||s.querySelector('[id="'+CSS.escape(id)+'"]'));
 const headerHeight=()=>document.querySelector('header.header').getBoundingClientRect().height;
 const scrollToDeck=()=>window.scrollTo({top:Math.max(0,deck.getBoundingClientRect().top+window.scrollY-headerHeight()-12),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 function select(index,{scroll=false,focus=null,hash=true,announce=true}={}){
  if(index<0||index>=slides.length)return false;
  const outgoing=slides[active],changing=active!==index;
  if(changing&&!linear&&scroll&&deck.getBoundingClientRect().top<headerHeight())window.mediaFrame?.hold();
  if(changing&&!linear){outgoing.querySelectorAll('details[open]').forEach(d=>d.open=false);document.dispatchEvent(new CustomEvent('media:slide-leave',{detail:{id:outgoing.id}}));}
  active=index;
  slides.forEach((slide,i)=>{slide.hidden=!linear&&i!==index;slide.inert=!linear&&i!==index;slide.setAttribute('role',linear?'region':'tabpanel');slide.setAttribute('aria-labelledby',tabs[i].id);slide.tabIndex=-1;});
  tabs.forEach((tab,i)=>{tab.setAttribute('role',linear?'button':'tab');tab.setAttribute('aria-controls',slides[i].id);if(linear){tab.removeAttribute('aria-selected');tab.setAttribute('aria-current',i===index?'true':'false');}else{tab.removeAttribute('aria-current');tab.setAttribute('aria-selected',String(i===index));}tab.tabIndex=linear||i===index?0:-1;});
  previous.forEach(b=>b.disabled=index===0);next.forEach(b=>b.disabled=index===slides.length-1);
  deck.querySelectorAll('[data-story-count]').forEach(e=>e.textContent=`${index+1} / ${slides.length}`);
  deck.dataset.activeSlide=slides[index].id;

  if(announce)status.textContent=`Раздел ${index+1} из ${slides.length}: ${slides[index].querySelector('h2').textContent}`;
  if(hash)history.replaceState(null,'','#'+slides[index].id);
  const tab=tabs[index],strip=tab.parentElement;
  if(tab.offsetLeft<strip.scrollLeft)strip.scrollLeft=tab.offsetLeft;
  else if(tab.offsetLeft+tab.offsetWidth>strip.scrollLeft+strip.clientWidth)strip.scrollLeft=tab.offsetLeft+tab.offsetWidth-strip.clientWidth;
  requestAnimationFrame(()=>{
   if(scroll){if(linear)slides[index].scrollIntoView({behavior:"instant",block:"start"});else {
    const top=deck.getBoundingClientRect().top;
    if(top<headerHeight()+12||top>innerHeight*.25)scrollToDeck();
   }}
   if(focus==='heading'){const heading=slides[index].querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}
   else if(focus==='tab'||document.activeElement?.disabled||outgoing.contains(document.activeElement))tab.focus({preventScroll:true});
  });
  return true;
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>select(i,{scroll:true}));
  tab.addEventListener('keydown',e=>{
   if(e.altKey||e.ctrlKey||e.metaKey||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   e.preventDefault();
   const index=e.key==='Home'?0:e.key==='End'?slides.length-1:Math.max(0,Math.min(slides.length-1,i+(e.key==='ArrowRight'?1:-1)));
   select(index,{scroll:true,focus:'tab'});
  });
 });
 previous.forEach(b=>b.addEventListener('click',()=>select(active-1,{scroll:true,focus:b.closest('.story-bottom')?'tab':null})));
 next.forEach(b=>b.addEventListener('click',()=>select(active+1,{scroll:true,focus:b.closest('.story-bottom')?'tab':null})));
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');if(!a||a.hasAttribute('data-page'))return;
  let id;try{id=decodeURIComponent(a.hash.slice(1));}catch{return;}
  const index=indexFor(id);if(index<0)return;
  e.preventDefault();select(index,{scroll:true,focus:'heading'});
 },true);
 document.addEventListener('media:reveal-section',e=>{
  const index=indexFor(e.detail.id);if(index<0)return;
  e.preventDefault();select(index,{scroll:true,focus:'heading'});
 });
 window.addEventListener('hashchange',()=>{
  const index=indexFor(location.hash.slice(1));if(index>=0)select(index,{scroll:true,focus:'heading',hash:false});
 });
 viewport.addEventListener('touchstart',e=>{
  if(linear||e.touches.length!==1||e.target.closest('a,button,input,textarea,select,summary,label,[contenteditable]')){touch=null;return;}
  touch={x:e.touches[0].clientX,y:e.touches[0].clientY,axis:null,dx:0,dy:0};
 },{passive:true});
 viewport.addEventListener('touchmove',e=>{
  if(!touch||e.touches.length!==1){touch=null;return;}
  touch.dx=e.touches[0].clientX-touch.x;touch.dy=e.touches[0].clientY-touch.y;
  if(!touch.axis&&Math.max(Math.abs(touch.dx),Math.abs(touch.dy))>12)touch.axis=Math.abs(touch.dx)>Math.abs(touch.dy)*1.4?'x':'y';
 },{passive:true});
 viewport.addEventListener('touchend',()=>{
  const gesture=touch;touch=null;
  if(gesture?.axis==='x'&&Math.abs(gesture.dx)>=60&&Math.abs(gesture.dx)>Math.abs(gesture.dy)*1.4)select(active+(gesture.dx<0?1:-1),{scroll:true});
 },{passive:true});
 viewport.addEventListener('touchcancel',()=>touch=null,{passive:true});
 deck.dataset.enhanced='true';deck.setAttribute('role','region');
 deck.querySelector('.story-toolbar').hidden=false;deck.querySelector('.story-bottom').hidden=false;
 deck.querySelector('.story-tabs').setAttribute('role','tablist');
 document.addEventListener('media:accessibility',e=>{linear=!!e.detail.linear;deck.dataset.linear=String(linear);deck.querySelector('.story-tabs').setAttribute('role',linear?'navigation':'tablist');deck.querySelector('.story-bottom').hidden=linear;deck.querySelector('[data-story-controls=top]').hidden=linear;select(active,{hash:false,announce:false});});
 const initial=indexFor(location.hash.slice(1));
 select(initial>=0?initial:0,{hash:false,scroll:initial>=0,announce:false});
})();
