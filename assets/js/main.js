/* assets/js/main.js
   Final robust hero slider and UI behaviors for Sanches Investimentos
   - Preloads hero images (4) and paints #hero-slide background
   - Prev/Next controls + auto-rotate
   - Mobile panel toggle (hamburger)
   - Email popup (4s) and click-outside to close
   - Normalize sponsor sizes
   - Lightweight, defensive, optimized
*/

(() => {
  'use strict';

  // --- CONFIG: must match filenames in /assets/images/
  const HERO_IMAGES = [
    'assets/images/real-estate.jpg',
    'assets/images/trading-chart.jpg',
    'assets/images/gold-coins.jpg',
    'assets/images/crypto-building.jpg'
  ];
  const AUTO_DELAY = 4500;

  // --- DOM refs
  const heroSlide = document.getElementById('hero-slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const hamburger = document.getElementById('hamburger');
  const mobilePanel = document.getElementById('mobile-panel');
  const mobileClose = document.getElementById('mobile-close');
  const emailPopup = document.getElementById('email-popup');
  const emailForm = document.getElementById('email-form');
  const emailInput = document.getElementById('email-input');
  const sponsorsContainer = document.getElementById('sponsors');

  // --- helpers
  function preload(src){
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({src, ok:true});
      img.onerror = () => resolve({src, ok:false});
      img.src = src;
    });
  }

  // --- HERO slider
  let slides = [], idx = 0, autoTimer = null;
  async function initHero(){
    if(!heroSlide) {
      console.warn('hero-slide element missing.');
      return;
    }

    // preload in parallel
    const results = await Promise.all(HERO_IMAGES.map(preload));
    slides = results.filter(r => r.ok).map(r => r.src);

    if(slides.length === 0){
      console.warn('No hero images found. Check assets/images filenames.');
      return;
    }

    // show first slide
    idx = 0;
    applySlide(slides[idx]);

    // start auto rotation
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
    heroSlide.style.transition = 'opacity .45s ease, transform .45s ease';
    heroSlide.style.opacity = 0;
    setTimeout(() => {
      heroSlide.style.backgroundImage = `url('${src}')`;
      heroSlide.style.backgroundSize = 'cover';
      heroSlide.style.backgroundPosition = 'center';
      heroSlide.style.opacity = 1;
    }, 180);
  }

  // --- Mobile panel
  function openMobile(){ if(mobilePanel) { mobilePanel.classList.add('open'); mobilePanel.setAttribute('aria-hidden','false'); hamburger.setAttribute('aria-expanded','true'); } }
  function closeMobile(){ if(mobilePanel) { mobilePanel.classList.remove('open'); mobilePanel.setAttribute('aria-hidden','true'); hamburger.setAttribute('aria-expanded','false'); } }

  function initMobile(){
    if(!hamburger || !mobilePanel) return;
    hamburger.addEventListener('click', (e) => { e.stopPropagation(); openMobile(); });
    if(mobileClose) mobileClose.addEventListener('click', (e) => { e.stopPropagation(); closeMobile(); });
    document.addEventListener('click', (e) => {
      if(mobilePanel.classList.contains('open')){
        if(!mobilePanel.contains(e.target) && !hamburger.contains(e.target)) closeMobile();
      }
    });
    mobilePanel.addEventListener('click', (e) => e.stopPropagation());
  }

  // --- Email popup
  let popupVisible = false;
  function showPopup(){ if(popupVisible) return; popupVisible = true; if(emailPopup){ emailPopup.style.display = 'block'; emailPopup.setAttribute('aria-hidden','false'); } }
  function hidePopup(){ if(!popupVisible) return; popupVisible = false; if(emailPopup){ emailPopup.style.display = 'none'; emailPopup.setAttribute('aria-hidden','true'); } }

  function initPopup(){
    if(!emailPopup) return;
    setTimeout(showPopup, 4000);
    // clicking anywhere closes popup
    document.addEventListener('click', () => hidePopup(), {capture:true});
    emailPopup.addEventListener('click', (e) => e.stopPropagation());
    if(emailForm && emailInput){
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = (emailInput.value || '').trim();
        if(!/^\S+@\S+\.\S+$/.test(v)){ emailInput.focus(); return; }
        emailForm.innerHTML = '<div style="padding:12px 0;color:#021a33">Thanks — we will reply shortly.</div>';
        setTimeout(hidePopup, 1400);
      });
    }
  }

  // --- Sponsors normalize
  function normalizeSponsors(){
    try {
      if(!sponsorsContainer) return;
      const imgs = sponsorsContainer.querySelectorAll('img');
      imgs.forEach(img => {
        if(!img.classList.contains('sponsor')) img.classList.add('sponsor');
        img.style.maxHeight = '48px';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
      });
    } catch(e){}
  }

  // --- Init
  function init(){
    initHero();
    initMobile();
    initPopup();
    normalizeSponsors();
    // reveal small animations
    requestAnimationFrame(() => {
      document.querySelectorAll('.enter-fade-up').forEach(el => el.classList.add('visible'));
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
