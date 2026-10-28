document.querySelector('#contact-open').addEventListener('click',e=>openDialog(document.querySelector('#contact-dialog'),e.currentTarget));
/* Only the outside viewport receives a closed-state floor. No slide-main heights.
   A clone measures collapsed content without toggling the real disclosures. */
(()=>{
 const deck=document.querySelector('.story-deck'),viewport=deck.querySelector('.story-viewport');
 let floor=0,held=false,timer,holdTimer,width=0;
 const apply=()=>{viewport.style.minHeight=(held?Math.max(floor,viewport.getBoundingClientRect().height):floor)+'px'};
 function refresh(){
  const free=deck.dataset.linear==='true'||document.documentElement.classList.contains('a11y-high-zoom');
  if(free){floor=0;apply();deck.dataset.measured='true';width=deck.clientWidth;return}
  const clone=viewport.cloneNode(true);clone.setAttribute('data-measuring','');clone.setAttribute('aria-hidden','true');clone.inert=true;clone.style.minHeight='0px';
  clone.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  clone.querySelectorAll('.story-slide').forEach(s=>{s.hidden=false;s.inert=true;s.style.removeProperty('min-height')});
  clone.querySelectorAll('details').forEach(d=>{d.open=false;const summary=d.querySelector('summary'),label=summary?.querySelector('.disclosure-label');if(label)label.textContent=summary.dataset.collapsibleLabel;const mark=summary?.querySelector('.disclosure-symbol');if(mark)mark.textContent='+'});
  deck.append(clone);const heights=[...clone.querySelectorAll('.story-slide')].map(s=>Math.ceil(s.getBoundingClientRect().height));clone.remove();
  floor=Math.max(...heights);apply();deck.dataset.closedHeights=JSON.stringify(heights);deck.dataset.closedFrame=floor;deck.dataset.measured='true';width=deck.clientWidth;
 }
 function release(){held=false;clearTimeout(holdTimer);window.removeEventListener('scrollend',release);apply()}
 function hold(){held=true;apply();clearTimeout(holdTimer);window.addEventListener('scrollend',release,{once:true});holdTimer=setTimeout(release,650)}
 const schedule=()=>{clearTimeout(timer);timer=setTimeout(refresh,80)};
 new ResizeObserver(()=>{if(deck.clientWidth!==width)schedule()}).observe(deck);document.addEventListener('media:accessibility',schedule);window.addEventListener('resize',schedule);
 document.fonts.ready.then(()=>Promise.all([...viewport.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})))).then(refresh);
 window.mediaFrame={refresh,hold};
})();
/* A loaded alternate may crossfade only under the CSS fine-pointer hover query. */
document.querySelectorAll('.doctor-photo').forEach(photo=>{
 const primary=photo.querySelector('img'),alternate=photo.querySelector('img.alternate');
 if(!primary||!alternate||primary.getAttribute('src')===alternate.getAttribute('src'))return;
 const ready=()=>photo.classList.toggle('has-alternate',alternate.complete&&alternate.naturalWidth>0);
 alternate.addEventListener('load',ready);alternate.addEventListener('error',()=>photo.classList.remove('has-alternate'));ready();
});
/* Keep native anchors and the slider's explicit scroll aligned with the real header. */
(()=>{const header=document.querySelector('header.header');if(!header)return;
 const sync=()=>document.documentElement.style.setProperty('--header-height',header.getBoundingClientRect().height+'px');
 new ResizeObserver(sync).observe(header);sync();})();
