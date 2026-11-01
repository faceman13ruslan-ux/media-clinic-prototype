document.querySelector('#contact-open').addEventListener('click',e=>openDialog(document.querySelector('#contact-dialog'),e.currentTarget));
(()=>{const header=document.querySelector('header.header');const sync=()=>document.documentElement.style.setProperty('--header-height',header.getBoundingClientRect().height+'px');new ResizeObserver(sync).observe(header);sync()})();
