/* assets/js/main.js
   FINAL - Robust hero slider and UI initialization
   - Preloads 4 hero images and paints #hero-slide background
   - Prev/Next controls + auto-rotate + reset timer
   - Mobile panel open/close
   - Email popup timed show and global click-to-close
   - Normalize sponsor images sizes and lazy loading behaviors
   - Safe, small and fast
*/

(() => {
  'use strict';

  // ========== CONFIG ==========
  const HERO_IMAGES = [
    'assets/images/real-estate.jpg',
    'assets/images/trading-chart.jpg',
    'assets/images/gold-coins.jpg',
    'assets/images/crypto-building.jpg'
  ];
  const AUTO_DELAY = 4500;

  // ========== ELEMENT REFERENCES ==========
  const heroSlide = document.getElementById('hero-slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const hamburger = document.getElementById('hamburger');
  const mobilePanel = document.getElementById('mobile-panel');
  const mobileClose = document.getElementById('mobile-close');
  const emailPopup = document.getElementById('email-popup');
  const emailForm = document.getElementById('email-form');
  const emailInput = document.getElementById('email-input');

  // ========== HELPERS ==========
  function preload(src){
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({src, ok:true});
      img.onerror = () => resolve({src, ok:false});
      img.src = src;
    });
  }

  // ========== HERO SLIDER ==========
  let slides = [], idx = 0, autoTimer = null;

  async function initHero(){
    if(!heroSlide) {
      console.warn('hero-slide not found; hero will not animate.');
      return;
    }

    // preload images
    const results = await Promise.all(HERO_IMAGES.map(preload));
    slides = results.filter(r => r.ok).map(r => r.src);

    if(slides.length === 0){
      console.warn('No hero images loaded - check filenames in assets/images.');
      return;
    }

    // apply first slide
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
    // make a smooth fade swap
    heroSlide.style.transition = 'opacity .45s ease, transform .45s ease';
    heroSlide.style.opacity = 0;
    setTimeout(() => {
      heroSlide.style.backgroundImage = `url('${src}')`;
      heroSlide.style.backgroundSize = 'cover';
      heroSlide.style.backgroundPosition = 'center';
      heroSlide.style.opacity = 1;
    }, 200);
  }

  // ========== MOBILE PANEL ==========
  function openMobile(){ mobilePanel && mobilePanel.classList.add('open'); hamburger && hamburger.setAttribute('aria-expanded','true'); }
  function closeMobile(){ mobilePanel && mobilePanel.classList.remove('open'); hamburger && hamburger.setAttribute('aria-expanded','false'); }

  function initMobile(){
    if(!hamburger || !mobilePanel) return;
    hamburger.addEventListener('click', (e) => { e.stopPropagation(); openMobile(); });
    mobileClose && mobileClose.addEventListener('click', (e) => { e.stopPropagation(); closeMobile(); });
    document.addEventListener('click', (e) => {
      if(mobilePanel.classList.contains('open')){
        if(!mobilePanel.contains(e.target) && !hamburger.contains(e.target)) closeMobile();
      }
    });
    mobilePanel.addEventListener('click', (e) => e.stopPropagation());
  }

  // ========== EMAIL POPUP ==========
  let popupVisible = false;
  function showPopup(){ if(popupVisible) return; popupVisible = true; if(emailPopup){ emailPopup.style.display = 'block'; emailPopup.setAttribute('aria-hidden','false'); } }
  function hidePopup(){ if(!popupVisible) return; popupVisible = false; if(emailPopup){ emailPopup.style.display = 'none'; emailPopup.setAttribute('aria-hidden','true'); } }

  function initPopup(){
    if(!emailPopup) return;
    setTimeout(showPopup, 4000);
    document.addEventListener('click', () => hidePopup(), {capture:true});
    emailPopup.addEventListener('click', (e) => e.stopPropagation());
    if(emailForm && emailInput){
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = (emailInput.value || '').trim();
        if(!/^\S+@\S+\.\S+$/.test(v)){ emailInput.focus(); return; }
        emailForm.innerHTML = '<div style="padding:12px 0;color:#021a33">Thank you — we will contact you shortly.</div>';
        setTimeout(hidePopup, 1400);
      });
    }
  }

  // ========== SPONSOR NORMALIZE ==========
  function normalizeSponsors(){
    try{
      const imgs = document.querySelectorAll('.sponsors img');
      imgs.forEach(img => {
        if(!img.classList.contains('sponsor')) img.classList.add('sponsor');
        img.style.maxHeight = '48px';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
      });
    } catch(e){}
  }

  // ========== INIT ==========
  function init(){
    initHero();
    initMobile();
    initPopup();
    normalizeSponsors();

    // slight reveal for enter-fade-up elements
    requestAnimationFrame(() => {
      document.querySelectorAll('.enter-fade-up').forEach(el => el.classList.add('visible'));
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
