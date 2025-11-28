/* assets/js/main.js
   Robust hero slider + UI init for Sanches Investimentos
   - Preloads hero images (4)
   - Applies background to #hero-slide so text overlays correctly
   - Prev/Next controls + auto-rotate
   - Mobile menu toggle
   - Email popup show/close
   - Safe Tawk loader (already in HTML, this won't block)
   - Graceful fallbacks and console warnings
*/

(() => {
  'use strict';

  // CONFIG - exact paths (must match filenames)
  const HERO_IMAGES = [
    'assets/images/real-estate.jpg',
    'assets/images/trading-chart.jpg',
    'assets/images/gold-coins.jpg',
    'assets/images/crypto-building.jpg'
  ];

  // DOM refs (defensive)
  const heroSlide = document.getElementById('hero-slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const hamburger = document.getElementById('hamburger');
  const mobilePanel = document.getElementById('mobile-panel');
  const mobileClose = document.getElementById('mobile-close');
  const emailPopup = document.getElementById('email-popup');
  const emailForm = document.getElementById('email-form');
  const emailInput = document.getElementById('email-input');

  // Preload utility
  function preload(src){
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({src, ok:true});
      img.onerror = () => resolve({src, ok:false});
      img.src = src;
    });
  }

  // HERO slider state
  let slides = [];
  let idx = 0;
  let autoTimer = null;
  const AUTO_DELAY = 4500;

  async function initHero(){
    if(!heroSlide){
      console.warn('hero-slide element not found in DOM.');
      return;
    }

    // preload in parallel
    const results = await Promise.all(HERO_IMAGES.map(preload));
    slides = results.filter(r => r.ok).map(r => r.src);

    if(slides.length === 0){
      // fallback: use hero LCP picture if exists (keeps layout)
      console.warn('No hero images loaded. Check filenames in assets/images.');
      return;
    }

    // show first slide quickly
    idx = 0;
    applySlide(slides[idx]);

    // auto rotate
    autoTimer = setInterval(() => {
      idx = (idx + 1) % slides.length;
      applySlide(slides[idx]);
    }, AUTO_DELAY);

    // controls
    if(prevBtn) prevBtn.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; applySlide(slides[idx]); resetAuto(); });
    if(nextBtn) nextBtn.addEventListener('click', () => { idx = (idx + 1) % slides.length; applySlide(slides[idx]); resetAuto(); });
  }

  function resetAuto(){
    if(autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      idx = (idx + 1) % slides.length;
      applySlide(slides[idx]);
    }, AUTO_DELAY);
  }

  function applySlide(src){
    if(!heroSlide) return;
    // fade: reduce opacity, swap background, restore
    heroSlide.style.transition = 'opacity .45s ease, transform .45s ease';
    heroSlide.style.opacity = 0;
    setTimeout(() => {
      heroSlide.style.backgroundImage = `url('${src}')`;
      heroSlide.style.backgroundSize = 'cover';
      heroSlide.style.backgroundPosition = 'center';
      heroSlide.style.opacity = 1;
    }, 220);
  }

  // Mobile menu logic
  function openMobile(){ mobilePanel && mobilePanel.classList.add('open'); hamburger && hamburger.setAttribute('aria-expanded','true'); }
  function closeMobile(){ mobilePanel && mobilePanel.classList.remove('open'); hamburger && hamburger.setAttribute('aria-expanded','false'); }

  function initMobile(){
    if(!hamburger || !mobilePanel) return;
    hamburger.addEventListener('click', (e) => { e.stopPropagation(); openMobile(); });
    mobileClose && mobileClose.addEventListener('click', (e) => { e.stopPropagation(); closeMobile(); });
    // click outside closes
    document.addEventListener('click', (e) => {
      if(mobilePanel.classList.contains('open')){
        if(!mobilePanel.contains(e.target) && !hamburger.contains(e.target)) closeMobile();
      }
    });
    // prevent panel clicks from bubbling
    mobilePanel.addEventListener('click', (e) => e.stopPropagation());
  }

  // Email popup
  let popupVisible = false;
  function showPopup(){ if(popupVisible) return; popupVisible = true; if(emailPopup) { emailPopup.style.display = 'block'; emailPopup.setAttribute('aria-hidden','false'); } }
  function hidePopup(){ if(!popupVisible) return; popupVisible = false; if(emailPopup) { emailPopup.style.display = 'none'; emailPopup.setAttribute('aria-hidden','true'); } }

  function initPopup(){
    if(!emailPopup) return;
    setTimeout(showPopup, 4000);
    // clicking anywhere closes it
    document.addEventListener('click', () => hidePopup(), {capture:true});
    emailPopup.addEventListener('click', (e) => e.stopPropagation());
    if(emailForm && emailInput){
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = (emailInput.value || '').trim();
        if(!/^\S+@\S+\.\S+$/.test(value)){
          emailInput.focus();
          return;
        }
        // show thank you and hide
        emailForm.innerHTML = '<div style="padding:12px 0;color:#021a33">Thanks — we will contact you shortly.</div>';
        setTimeout(hidePopup, 1400);
      });
    }
  }

  // Ensure all sponsor <img> tags have class 'sponsor' (defensive)
  function normalizeSponsors(){
    try {
      const imgs = document.querySelectorAll('.sponsors img');
      imgs.forEach(img => {
        if(!img.classList.contains('sponsor')) img.classList.add('sponsor');
        // make sure they aren't huge
        img.style.maxHeight = '48px';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
      });
    } catch(e){ /* ignore */ }
  }

  // Setup: run when DOM ready
  function init(){
    initHero();
    initMobile();
    initPopup();
    normalizeSponsors();

    // helpful console warnings if logo missing
    const logo = document.querySelector('.brand-logo');
    if(logo) logo.addEventListener('error', () => console.warn('Logo missing: ensure assets/images/logo.png exists (case-sensitive).'));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
