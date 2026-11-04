/* ═══════════════════════════════════════════════════
   MS ENGINEERING — MAIN JAVASCRIPT
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVIGATION ──────────────────────────────────────
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  // Sticky header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = 80;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ── FADE-IN OBSERVER ────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  const reveal = (el, idx) => {
    // Capped, gentle stagger so large grids don't lag behind
    const delay = Math.min(idx, 8) * 70;
    setTimeout(() => el.classList.add('visible'), delay);
  };
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentNode.children).filter(c => c.classList.contains('fade-in'));
          reveal(entry.target, Math.max(0, siblings.indexOf(entry.target)));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });

    fadeEls.forEach(el => obs.observe(el));

    // Reveal anything already within the viewport on load (covers tall grids
    // and instant scroll/anchor jumps where the observer may not re-fire).
    const revealInView = () => {
      fadeEls.forEach((el, i) => {
        if (el.classList.contains('visible')) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          el.classList.add('visible');
          obs.unobserve(el);
        }
      });
    };
    window.addEventListener('load', revealInView);

    // Safety net: never leave a fade-in element stuck invisible.
    setTimeout(() => fadeEls.forEach(el => el.classList.add('visible')), 2600);
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── CLIENT LOGO FALLBACK (show initial if img fails) ──
  document.querySelectorAll('.client-logo-box img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const initial = img.nextElementSibling;
      if (initial && initial.classList.contains('client-initial')) {
        initial.style.display = 'block';
      }
    });
    // If already broken (cached)
    if (!img.complete || img.naturalHeight === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });

  // ── SHOW MORE CLIENTS ────────────────────────────────
  const showMoreBtn = document.getElementById('show-more-clients');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const extras = document.querySelectorAll('.extra-client');
      const anyHidden = Array.from(extras).some(el => el.classList.contains('hidden'));
      extras.forEach((el, i) => {
        if (anyHidden) {
          setTimeout(() => {
            el.classList.remove('hidden');
            el.classList.add('fade-in');
            requestAnimationFrame(() => el.classList.add('visible'));
          }, i * 100);
        } else {
          el.classList.add('hidden');
          el.classList.remove('fade-in', 'visible');
        }
      });
      showMoreBtn.textContent = anyHidden ? 'Show Less ↑' : 'More Clients List ↓';
    });
  }

  // ── PROJECT "TELL ME MORE" EXPAND ───────────────────
  document.querySelectorAll('.tell-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const details = card.querySelector('.project-details');
      if (!details) return;
      const isHidden = details.classList.contains('hidden');
      details.classList.toggle('hidden', !isHidden);
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.style.transform = isHidden ? 'rotate(180deg)' : '';
      }
      btn.querySelector('.btn-label') && (btn.querySelector('.btn-label').textContent = isHidden ? 'Show Less' : 'Tell Me More');
      if (!btn.querySelector('.btn-label')) {
        // Update text node
        const textNode = Array.from(btn.childNodes).find(n => n.nodeType === 3);
        if (textNode) textNode.textContent = isHidden ? 'Show Less ' : 'Tell Me More ';
      }
    });
  });

  // ── SERVICES PAGE ACCORDION ──────────────────────────
  window.toggleService = function(id) {
    const item = document.getElementById(id);
    if (!item) return;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.service-item.open').forEach(el => el.classList.remove('open'));
    // Open clicked (if was closed)
    if (!isOpen) {
      item.classList.add('open');
      // Smooth scroll to item
      setTimeout(() => {
        const headerHeight = 90;
        const itemTop = item.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: itemTop, behavior: 'smooth' });
      }, 50);
    }
  };

  // Open first service item by default on services page
  const firstService = document.getElementById('svc-hvac');
  if (firstService) {
    firstService.classList.add('open');
  }

  // ── CONTACT FORM ────────────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      if (form.elements.website && form.elements.website.value) return;
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn.disabled) return;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      const status = document.getElementById('contact-status');
      btnText.classList.add('hidden');
      btnLoading.classList.remove('hidden');
      submitBtn.disabled = true;
      status.textContent = 'Sending your enquiry securely…';
      try {
        const config = window.MSE_CONFIG || {};
        const endpoint = (config.supabaseUrl || 'https://hutyxlxebrxdxsqihkdr.supabase.co').replace(/\/$/, '');
        const key = config.supabaseKey || config.publishableKey || 'sb_publishable_82x-k-h4z8T1Lg3piFWfgg_fxINl0u9';
        const values = new FormData(form);
        const extra = [values.get('company') ? 'Company: ' + values.get('company') : '', values.get('service') ? 'Service: ' + values.get('service') : ''].filter(Boolean).join('\n');
        const response = await fetch(endpoint + '/rest/v1/rpc/submit_enquiry', {
          method: 'POST', headers: {'Content-Type': 'application/json', apikey: key},
          body: JSON.stringify({p_name: String(values.get('name') || '').trim(), p_email: String(values.get('email') || '').trim(), p_phone: String(values.get('phone') || '').trim(), p_message: [extra, String(values.get('message') || '').trim()].filter(Boolean).join('\n\n')}),
          signal: AbortSignal.timeout(20000)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Your enquiry could not be saved. Please try again.');
        if (typeof result !== 'string' || !/^[0-9a-f-]{36}$/i.test(result)) throw new Error('We could not confirm your enquiry. Please contact us directly.');
        form.classList.add('hidden');
        document.getElementById('form-success').classList.remove('hidden');
        status.textContent = '';
      } catch (error) {
        status.textContent = error.name === 'TimeoutError' ? 'The connection timed out. Please try again or email info@msengineers.co.za.' : (error.message || 'Sending failed. Please try again or email info@msengineers.co.za.');
      } finally {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
      }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });
  }

  function validateForm() {
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const consent = document.getElementById('consent');

    if (name && !name.value.trim()) {
      showError(name, 'name-error', 'Please enter your name.');
      valid = false;
    } else if (name) clearError(name, 'name-error');

    if (email && !isValidEmail(email.value)) {
      showError(email, 'email-error', 'Please enter a valid email address.');
      valid = false;
    } else if (email) clearError(email, 'email-error');

    if (message && !message.value.trim()) {
      showError(message, 'message-error', 'Please enter your message.');
      valid = false;
    } else if (message) clearError(message, 'message-error');

    if (consent && !consent.checked) {
      showError(consent, 'consent-error', 'Please confirm you agree to be contacted.');
      valid = false;
    } else if (consent) clearError(consent, 'consent-error');

    return valid;
  }

  function validateField(field) {
    const id = field.id;
    if (id === 'name') {
      if (!field.value.trim()) showError(field, 'name-error', 'Please enter your name.');
      else clearError(field, 'name-error');
    } else if (id === 'email') {
      if (!isValidEmail(field.value)) showError(field, 'email-error', 'Please enter a valid email address.');
      else clearError(field, 'email-error');
    } else if (id === 'message') {
      if (!field.value.trim()) showError(field, 'message-error', 'Please enter your message.');
      else clearError(field, 'message-error');
    }
  }

  function showError(field, errorId, msg) {
    field.style.borderColor = '#ef4444';
    const err = document.getElementById(errorId);
    if (err) err.textContent = msg;
  }

  function clearError(field, errorId) {
    field.style.borderColor = '';
    const err = document.getElementById(errorId);
    if (err) err.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── ACTIVE NAV LINK (hash-based on homepage) ────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop().split('#')[0] || 'index.html';
    if (linkPath === currentPath && !link.getAttribute('href').includes('#')) {
      link.classList.add('active');
    }
  });

  // ── PROJECT GALLERY LIGHTBOX ────────────────────────
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  if (galleryItems.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<div class="lightbox-counter"></div>' +
      '<button class="lightbox-close" aria-label="Close gallery">&times;</button>' +
      '<button class="lightbox-btn lightbox-prev" aria-label="Previous image">&#8249;</button>' +
      '<button class="lightbox-btn lightbox-next" aria-label="Next image">&#8250;</button>' +
      '<figure class="lightbox-figure"><img src="" alt=""><figcaption class="lightbox-cap"></figcaption></figure>';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('.lightbox-cap');
    const lbCount = lb.querySelector('.lightbox-counter');
    let current = 0;

    const data = galleryItems.map(it => {
      const img = it.querySelector('img');
      const cap = it.querySelector('figcaption');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', cap: cap ? cap.textContent : '' };
    });

    function show(i) {
      current = (i + data.length) % data.length;
      const d = data[current];
      lbImg.src = d.src;
      lbImg.alt = d.alt;
      lbCap.textContent = d.cap;
      lbCount.textContent = (current + 1) + ' / ' + data.length;
    }
    function openLb(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }

    galleryItems.forEach((it, i) => {
      it.setAttribute('tabindex', '0');
      it.setAttribute('role', 'button');
      it.addEventListener('click', () => openLb(i));
      it.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); } });
    });
    lb.querySelector('.lightbox-close').addEventListener('click', closeLb);
    lb.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
    lb.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

  // ── BEFORE / AFTER SLIDER ───────────────────────────
  document.querySelectorAll('[data-ba]').forEach(slider => {
    const before = slider.querySelector('.ba-before-img');
    const handle = slider.querySelector('.ba-handle');
    const range  = slider.querySelector('.ba-range');
    if (!before || !handle) return;
    function setPos(p) {
      p = Math.max(0, Math.min(100, p));
      before.style.clipPath = 'inset(0 ' + (100 - p) + '% 0 0)';
      handle.style.left = p + '%';
    }
    if (range) range.addEventListener('input', () => setPos(parseFloat(range.value)));
    setPos(50);
  });

});
