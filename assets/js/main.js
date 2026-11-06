(()=>{'use strict';
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const root=document.documentElement;
const menu=$('.menu'),links=$('.navlinks');
menu?.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});
$('.navlinks a').forEach(a=>a.addEventListener('click',()=>{links?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
// Mark the current page for clearer orientation.
const currentPage=(location.pathname.split('/').pop()||'index.html').toLowerCase();
$('.navlinks a').forEach(a=>{const target=(a.getAttribute('href')||'').split('/').pop().toLowerCase();if(target===currentPage){a.classList.add('active');a.setAttribute('aria-current','page')}});
// Lightweight back-to-top control, available on every page.
const topButton=document.createElement('button');topButton.className='back-to-top';topButton.type='button';topButton.setAttribute('aria-label','Back to top');topButton.innerHTML='<span>↑</span>';document.body.append(topButton);
topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
const syncTopButton=()=>topButton.classList.toggle('visible',window.scrollY>520);
syncTopButton();window.addEventListener('scroll',syncTopButton,{passive:true});
root.dataset.theme='dark';
// Keep the navigation clean at the top; reveal its glass surface after scrolling.
const nav=$('.nav');
const syncNavState=()=>{
 if(!nav)return;
 nav.classList.toggle('scrolled',(window.scrollY||document.documentElement.scrollTop||0)>36);
};
syncNavState();
window.addEventListener('scroll',syncNavState,{passive:true});
window.addEventListener('pageshow',syncNavState);
const progress=$('.scroll-progress')||document.createElement('div');progress.className='scroll-progress';if(!progress.parentNode)document.body.append(progress);let ticking=false;
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{syncNavState();const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';ticking=false});ticking=true}},{passive:true});
const revealObserver=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}),{threshold:.1}):null;
$$('.reveal').forEach(el=>{if(revealObserver)revealObserver.observe(el);else el.classList.add('visible')});
$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
// Portfolio guide: curated offline answers, deliberately not presented as a connected AI service.
const drawer=$('.assistant-drawer'),launch=$('.assistant-launch'),closeGuide=$('.assistant-close');
function setGuide(open){if(!drawer)return;drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));launch?.setAttribute('aria-expanded',String(open));if(open)closeGuide?.focus();else launch?.focus()}
launch?.addEventListener('click',()=>setGuide(!drawer.classList.contains('open')));closeGuide?.addEventListener('click',()=>setGuide(false));
$$('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{const reply=$('.assistant-reply',drawer);if(reply)reply.textContent=btn.dataset.answer||'';$$('[data-answer]',drawer).forEach(b=>b.classList.remove('chosen'));btn.classList.add('chosen')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setGuide(false);closeCommand()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}});
// Searchable keyboard command palette.
const overlay=$('.command-overlay'),commandInput=$('.command-search input');
function openCommand(){if(!overlay)return;overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');setTimeout(()=>commandInput?.focus(),30)}
function closeCommand(){if(!overlay)return;overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')}
overlay?.addEventListener('click',e=>{if(e.target===overlay)closeCommand()});commandInput?.addEventListener('input',()=>{const q=commandInput.value.toLowerCase();$$('.command-list a,.command-list button',overlay).forEach(a=>a.hidden=!a.textContent.toLowerCase().includes(q))});
// Project category filters.
const filterButtons=$$('.filter-button'),projectCards=$$('.project-feature[data-category]'),empty=$('.empty-filter');
filterButtons.forEach(btn=>btn.addEventListener('click',()=>{filterButtons.forEach(b=>b.classList.toggle('active',b===btn));let shown=0;projectCards.forEach(card=>{const visible=btn.dataset.filter==='all'||card.dataset.category===btn.dataset.filter;card.hidden=!visible;if(visible)shown++});if(empty)empty.hidden=shown!==0}));
// Contact message composer opens the visitor's email client; it never submits to a server.
$('#contactForm')?.addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget,data=new FormData(form);const subject=encodeURIComponent('Portfolio enquiry: '+data.get('topic'));const body=encodeURIComponent('Hello Dasindu,\n\n'+data.get('message')+'\n\nName: '+data.get('name')+'\nReply email: '+data.get('email')+'\nTopic: '+data.get('topic'));const feedback=$('.form-feedback');if(feedback)feedback.textContent='Opening your email application…';window.location.href='mailto:dasindusanujana0@gmail.com?subject='+subject+'&body='+body});
// Copy email and generated prompts.
$$('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);btn.innerHTML='COPIED ✓'}catch{btn.textContent=btn.dataset.copy}}));
const ideaBank={web:[['The one-screen portfolio','Design a single-screen portfolio that tells a complete story without scrolling.'],['Local discovery map','Imagine a lightweight directory that helps people discover useful places nearby.'],['Accessible dashboard','Rebuild a complex dashboard so a first-time visitor understands it in seconds.']],ai:[['Personal knowledge companion','Design a private assistant that helps organise notes without making the user lose control of their data.'],['AI learning path','Create an experience that turns a broad learning goal into small daily steps.'],['Human-first AI interface','Prototype an AI interface that explains its limits and gives people control over every action.']],product:[['One problem, one tool','Find a repetitive everyday task and design the smallest tool that makes it easier.'],['Offline-first notebook','Create a notes product that remains useful even when the internet disappears.'],['Personal project tracker','Design a calm project tracker that focuses on the next meaningful action.']],design:[['Motion with meaning','Create a landing page where every animation helps explain the product.'],['Type-led identity','Build a complete visual identity using typography, spacing and one accent colour.'],['Accessible dark interface','Design a dark interface with excellent contrast, focus states and reduced-motion support.']]};
let currentIdea='';$('#generateIdea')?.addEventListener('click',()=>{const category=$('#ideaCategory')?.value||'web';const list=ideaBank[category]||ideaBank.web;const item=list[Math.floor(Math.random()*list.length)];currentIdea=item[0]+'\n'+item[1];$('#ideaTitle').textContent=item[0];$('#ideaText').textContent=item[1];$('#copyIdea').disabled=false;$('.idea-output')?.classList.add('idea-updated')});
$('#copyIdea')?.addEventListener('click',async()=>{if(!currentIdea)return;const btn=$('#copyIdea');try{await navigator.clipboard.writeText(currentIdea);btn.textContent='✓ COPIED'}catch{btn.textContent='SELECT THE PROMPT TO COPY'}});
// Close mobile menu when clicking outside.
document.addEventListener('click',e=>{if(links?.classList.contains('open')&&!e.target.closest('.nav')){links.classList.remove('open');menu?.setAttribute('aria-expanded','false')}});
})();