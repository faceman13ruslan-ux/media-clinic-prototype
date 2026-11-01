(()=>{
 document.querySelectorAll('.price-accordion').forEach(details=>{const summary=details.querySelector(':scope > summary');const sync=()=>summary.setAttribute('aria-expanded',String(details.open));details.addEventListener('toggle',sync);sync()});
 const dialogs=[...document.querySelectorAll('.patient-modal')];if(!dialogs.length)return;
 
 function openDialog(dialog,focusTarget){if(!dialog)return;const current=dialogs.find(d=>d.open);if(current&&current!==dialog)current.close();const card=document.querySelector(`[data-patient-dialog="${dialog.id}"]`);if(!dialog.open){if(card && focusTarget)card.focus();dialog.showModal();}document.documentElement.classList.add('patient-modal-open');dialog.querySelector('.patient-modal-close').focus();if(focusTarget&&focusTarget!==dialog)requestAnimationFrame(()=>focusTarget.scrollIntoView({block:'start'}))}
 document.querySelectorAll('[data-patient-dialog]').forEach(card=>card.addEventListener('click',()=>openDialog(document.getElementById(card.dataset.patientDialog))));
 dialogs.forEach(dialog=>{dialog.querySelector('.patient-modal-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{if(!dialogs.some(d=>d.open))document.documentElement.classList.remove('patient-modal-open')})});
 function reveal(){let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}if(!id)return;const target=document.getElementById(id);if(!target)return;const dialog=target.matches('.patient-modal')?target:target.closest('.patient-modal');if(dialog)openDialog(dialog,target)}
 addEventListener('hashchange',reveal);reveal();
})();
