/* assets/js/main.js
   Slider, mobile menu, email popup, sponsor normalization
*/

(() => {
  'use strict';

  // --- DOM refs
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-close');
  const emailPopup = document.getElementById('email-popup');
  const emailClose = document.getElementById('email-close');
  const emailForm = document.getElementById('email-form');
  const emailInput = document.getElementById('email-input');
  const whatsapp = document.getElementById('whatsapp-float');
  const sponsorsContainer = document.getElementById('sponsors');

  // --- slider state
  let idx = 0;
  let timer = null;
  const INTERVAL = 5000;

  function showSlide(n) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === n);
    });
  }

  function nextSlide() {
    idx = (idx + 1) % slides.length;
    showSlide(idx);
  }

  function prevSlide() {
    idx = (idx - 1 + slides.length) % slides.length;
    showSlide(idx);
  }

  function startAuto() {
    if (timer) clearInterval(timer);
    timer = setInterval(nextSlide, INTERVAL);
  }

  // init slider controls (defensive)
  (function initSlider(){
    if(slides.length === 0) return;
    showSlide(0);
    startAuto();
    // buttons: use controls in DOM if exist
    const prev = document.getElementById('prev-slide') || prevBtn;
    const next = document.getElementById('next-slide') || nextBtn;
    if(prev) prev.addEventListener('click', () => { prevSlide(); startAuto(); });
    if(next) next.addEventListener('click', () => { nextSlide(); startAuto(); });
  })();

  // --- mobile nav
  function openMobile(){ mobileNav.classList.add('open'); mobileNav.setAttribute('aria-hidden','false'); hamburger.setAttribute('aria-expanded','true'); }
  function closeMobile(){ mobileNav.classList.remove('open'); mobileNav.setAttribute('aria-hidden','true'); hamburger.setAttribute('aria-expanded','false'); }

  if(hamburger){
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if(mobileNav.classList.contains('open')) closeMobile(); else openMobile();
    });
  }
  if(mobileClose) mobileClose.addEventListener('click', closeMobile);
  document.addEventListener('click', (e) => {
    if(mobileNav && mobileNav.classList.contains('open')){
      if(!mobileNav.contains(e.target) && !hamburger.contains(e.target)) closeMobile();
    }
  });

  // --- email popup auto open after 10s
  setTimeout(() => {
    if(emailPopup){
      emailPopup.style.display = 'block';
      emailPopup.setAttribute('aria-hidden','false');
    }
  }, 10000);

  if(emailClose){
    emailClose.addEventListener('click', () => {
      if(emailPopup){ emailPopup.style.display='none'; emailPopup.setAttribute('aria-hidden','true'); }
    });
  }

  if(emailForm && emailInput){
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (emailInput.value || '').trim();
      if(!/^\S+@\S+\.\S+$/.test(v)){ emailInput.focus(); return; }
      // show a simple thank you message
      emailForm.innerHTML = '<div style="padding:12px;color:#fff">Thanks — we will reply shortly.</div>';
      setTimeout(() => { if(emailPopup){ emailPopup.style.display='none'; emailPopup.setAttribute('aria-hidden','true'); } }, 1400);
    });
  }

  // --- normalize sponsors (ensure height)
  (function normalizeSponsors(){
    try {
      if(!sponsorsContainer) return;
      const imgs = sponsorsContainer.querySelectorAll('img');
      imgs.forEach(img => {
        img.style.height = '48px';
        img.style.width = 'auto';
        img.style.objectFit = 'contain';
      });
    } catch(e){}
  })();

  // reveal small visual tweaks after load
  window.addEventListener('load', () => {
    document.querySelectorAll('.slide').forEach(el => el.classList.add('visible'));
  });

})();
