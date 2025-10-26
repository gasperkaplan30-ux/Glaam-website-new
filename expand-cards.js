(function(){
  'use strict';

  function isMobile(){ return window.matchMedia('(max-width: 768px)').matches; }

  let openCard = null;

  function closeOpen(){
    if (!openCard) return;
    openCard.classList.remove('is-expanded');
    openCard.setAttribute('aria-expanded','false');
    openCard = null;
  }

  function toggle(card){
    if (!isMobile()) return;
    if (openCard === card){ closeOpen(); return; }
    closeOpen();
    card.classList.add('is-expanded');
    card.setAttribute('aria-expanded','true');
    openCard = card;
    // Bring into view for smaller screens
    setTimeout(()=>{ try{ card.scrollIntoView({behavior:'smooth', block:'center'}); }catch(_){} }, 100);
  }

  function onDocClick(e){
    if (!isMobile()) return;
    const card = e.target.closest('.product-card');
    if (!card) { closeOpen(); return; }
    // Ignore clicks on interactive controls inside the card (buttons etc.)
    if (e.target.closest('button, a, input, select, textarea')) return;
  }

  function onGridClick(e){
    if (!isMobile()) return;
    const card = e.target.closest('.product-card');
    if (!card) return;
    if (e.target.closest('button, a, input, select, textarea')) return;
    toggle(card);
  }

  function onKey(e){
    if (!isMobile()) return;
    const focused = document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('product-card') ? document.activeElement : null;
    if (e.key === 'Escape') { closeOpen(); }
    if ((e.key === 'Enter' || e.key === ' ') && focused) { e.preventDefault(); toggle(focused); }
  }

  function enhanceCards(){
    document.querySelectorAll('.products-grid .product-card').forEach(card => {
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex','0');
      card.setAttribute('role','button');
      card.setAttribute('aria-expanded','false');
    });
  }

  function init(){
    enhanceCards();
    // Delegate on container level to catch dynamic content
    document.addEventListener('click', onGridClick, { passive: true });
    document.addEventListener('click', onDocClick,  { passive: true });
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', ()=>{ if (!isMobile()) closeOpen(); });

    // Keep enhancements if DOM changes
    const mo = new MutationObserver(enhanceCards);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
