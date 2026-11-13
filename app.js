/**
 * ==========================================================================
 * PulseFlow AI - Main Front-End Application Logic
 * SANKAR GROUP - Front-End Development Internship Assessment
 * ==========================================================================
 * Architecture Overview:
 *  1. Toast Notification System
 *  2. Theme Manager (Dark / Light Mode with localStorage)
 *  3. Navigation, Scroll Spy & Mobile Drawer
 *  4. Pricing Plan Billing Switcher (Monthly vs. Annual)
 *  5. "How It Works" Interactive Preview Switcher
 *  6. Accessible FAQ Accordion
 *  7. Interactive Modal (Get Started / Sign-Up) with Plan Pre-Selection
 *  8. Form Validation Engine & Demo Request Submission
 * ==========================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Toast Notification System
     -------------------------------------------------------------------------- */
  function showToast(title, description) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${description}</div>
      </div>
    `;

    container.appendChild(toast);

    // Trigger reveal transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  /* --------------------------------------------------------------------------
     2. Theme Management (Dark / Light Mode)
     -------------------------------------------------------------------------- */
  const THEME_STORAGE_KEY = 'pulseflow_theme';

  function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Detect preference: stored in localStorage -> system preference -> default 'dark'
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      console.warn('localStorage not accessible, defaulting to dark mode');
    }

    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark');

    applyTheme(initialTheme);

    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (e) {}
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const sunIcon = toggleBtn.querySelector('.icon-sun');
    const moonIcon = toggleBtn.querySelector('.icon-moon');

    if (theme === 'light') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      toggleBtn.setAttribute('aria-label', 'Switch to light theme');
    }
  }

  /* --------------------------------------------------------------------------
     3. Navigation, Scroll Spy & Mobile Drawer
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Sticky navbar backdrop effect on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }

      // Scroll Spy for highlighting active link
      let currentId = '';
      const scrollPosition = window.scrollY + 130;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });

    // Smooth scroll offset handler for all anchor jumps
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 76;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Close mobile drawer if open
          closeMobileMenu();
        }
      });
    });

    // Mobile Drawer Setup
    const mobileToggle = document.getElementById('nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileBackdrop = document.getElementById('mobile-backdrop');

    function openMobileMenu() {
      mobileToggle?.classList.add('open');
      mobileDrawer?.classList.add('open');
      mobileBackdrop?.classList.add('open');
      document.body.style.overflow = 'hidden';
      mobileToggle?.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
      mobileToggle?.classList.remove('open');
      mobileDrawer?.classList.remove('open');
      mobileBackdrop?.classList.remove('open');
      document.body.style.overflow = '';
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }

    mobileToggle?.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileBackdrop?.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Pricing Billing Switcher (Monthly vs Annual 20% Discount)
     -------------------------------------------------------------------------- */
  function initPricingSwitcher() {
    const billingSwitch = document.getElementById('billing-toggle');
    const proPriceEl = document.getElementById('price-pro');
    const entPriceEl = document.getElementById('price-enterprise');
    const monthlyLabel = document.getElementById('label-monthly');
    const annualLabel = document.getElementById('label-annual');

    if (!billingSwitch || !proPriceEl || !entPriceEl) return;

    billingSwitch.addEventListener('change', () => {
      const isAnnual = billingSwitch.checked;
      if (isAnnual) {
        proPriceEl.textContent = '23';
        entPriceEl.textContent = '64';
        monthlyLabel?.classList.remove('active');
        annualLabel?.classList.add('active');
      } else {
        proPriceEl.textContent = '29';
        entPriceEl.textContent = '79';
        monthlyLabel?.classList.add('active');
        annualLabel?.classList.remove('active');
      }
    });

    monthlyLabel?.addEventListener('click', () => {
      billingSwitch.checked = false;
      billingSwitch.dispatchEvent(new Event('change'));
    });

    annualLabel?.addEventListener('click', () => {
      billingSwitch.checked = true;
      billingSwitch.dispatchEvent(new Event('change'));
    });
  }

  /* --------------------------------------------------------------------------
     5. How It Works Interactive Preview Switcher
     -------------------------------------------------------------------------- */
  function initHowItWorksTabs() {
    const stepCards = document.querySelectorAll('.step-card');
    const stepViews = document.querySelectorAll('.step-view');

    stepCards.forEach(card => {
      card.addEventListener('click', () => {
        const stepIndex = card.getAttribute('data-step');

        stepCards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');

        stepViews.forEach(view => {
          if (view.getAttribute('data-view') === stepIndex) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Accessible FAQ Accordion
     -------------------------------------------------------------------------- */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      questionBtn?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Interactive Modal (Get Started / Sign-Up)
     -------------------------------------------------------------------------- */
  function initModal() {
    const modalOverlay = document.getElementById('signup-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalPlanSelect = document.getElementById('modal-plan-select');

    if (!modalOverlay) return;

    function openModal() {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const firstInput = modalOverlay.querySelector('input');
        firstInput?.focus();
      }, 100);
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Attach trigger to all buttons with data-open-modal
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const requestedPlan = btn.getAttribute('data-plan');
        if (requestedPlan && modalPlanSelect) {
          modalPlanSelect.value = requestedPlan;
        }
        openModal();
      });
    });

    modalCloseBtn?.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Form Validation Engine & Demo Request Submissions
     -------------------------------------------------------------------------- */
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  function validateInput(inputEl, type, minLength = 2) {
    if (!inputEl) return true;
    const val = (inputEl.value || '').trim();
    const fieldName = inputEl.getAttribute('data-field-name') || inputEl.name || 'Field';
    const errorEl = document.getElementById(`${inputEl.id}-error`);

    let error = null;

    if (!val) {
      error = `${fieldName} is required.`;
    } else if (type === 'email' && !EMAIL_REGEX.test(val)) {
      error = 'Please enter a valid work email (e.g. name@company.com).';
    } else if (type === 'text' && val.length < minLength) {
      error = `${fieldName} must be at least ${minLength} characters.`;
    } else if (type === 'password' && val.length < 8) {
      error = 'Password must be at least 8 characters long.';
    }

    if (error) {
      inputEl.classList.add('is-invalid');
      inputEl.classList.remove('is-valid');
      if (errorEl) {
        errorEl.textContent = error;
        errorEl.classList.add('visible');
      }
      return false;
    } else {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      return true;
    }
  }

  function initForms() {
    // 1. Demo Request Form
    const demoForm = document.getElementById('demo-form');
    const demoSuccessCard = document.getElementById('demo-success-card');
    const demoResetBtn = document.getElementById('demo-reset-btn');

    if (demoForm) {
      const nameIn = document.getElementById('demo-name');
      const emailIn = document.getElementById('demo-email');
      const compIn = document.getElementById('demo-company');
      const sizeIn = document.getElementById('demo-team-size');

      nameIn?.addEventListener('input', () => validateInput(nameIn, 'text', 2));
      emailIn?.addEventListener('input', () => validateInput(emailIn, 'email'));
      compIn?.addEventListener('input', () => validateInput(compIn, 'text', 2));
      sizeIn?.addEventListener('change', () => validateInput(sizeIn, 'select'));

      demoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const vName = validateInput(nameIn, 'text', 2);
        const vEmail = validateInput(emailIn, 'email');
        const vComp = validateInput(compIn, 'text', 2);
        const vSize = validateInput(sizeIn, 'select');

        if (!vName || !vEmail || !vComp || !vSize) {
          showToast('Incomplete Form', 'Please review and correct the marked fields.');
          return;
        }

        const submitBtn = demoForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spinSlow 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" stroke="currentColor" stroke-dasharray="32" stroke-linecap="round"></circle>
          </svg>
          Reserving Demo Slot...
        `;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          demoForm.style.display = 'none';
          if (demoSuccessCard) {
            demoSuccessCard.classList.add('active');
            const userEmailDisplay = document.getElementById('success-user-email');
            if (userEmailDisplay) {
              userEmailDisplay.textContent = emailIn.value;
            }
          }

          showToast('Demo Reserved! 🎉', `Confirmation details sent to ${emailIn.value}.`);
        }, 900);
      });

      demoResetBtn?.addEventListener('click', () => {
        demoForm.reset();
        [nameIn, emailIn, compIn, sizeIn].forEach(input => {
          input?.classList.remove('is-invalid', 'is-valid');
        });
        demoForm.style.display = 'block';
        demoSuccessCard?.classList.remove('active');
      });
    }

    // 2. Modal Sign Up Form
    const modalForm = document.getElementById('modal-signup-form');
    if (modalForm) {
      const modalName = document.getElementById('modal-name');
      const modalEmail = document.getElementById('modal-email');
      const modalPass = document.getElementById('modal-password');

      modalName?.addEventListener('input', () => validateInput(modalName, 'text', 2));
      modalEmail?.addEventListener('input', () => validateInput(modalEmail, 'email'));
      modalPass?.addEventListener('input', () => validateInput(modalPass, 'password'));

      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const vName = validateInput(modalName, 'text', 2);
        const vEmail = validateInput(modalEmail, 'email');
        const vPass = validateInput(modalPass, 'password');

        if (!vName || !vEmail || !vPass) {
          showToast('Sign-Up Incomplete', 'Please fill in all required fields accurately.');
          return;
        }

        const submitBtn = modalForm.querySelector('button[type="submit"]');
        const origBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Provisioning Workspace...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnText;

          const modalOverlay = document.getElementById('signup-modal');
          modalOverlay?.classList.remove('open');
          document.body.style.overflow = '';

          modalForm.reset();
          [modalName, modalEmail, modalPass].forEach(input => input?.classList.remove('is-invalid', 'is-valid'));

          showToast('Account Created! 🚀', `Welcome aboard, ${modalName.value}! Check your email for login keys.`);
        }, 850);
      });
    }

    // 3. Footer Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      const newsEmail = document.getElementById('newsletter-email');
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const vEmail = validateInput(newsEmail, 'email');
        if (!vEmail) return;

        showToast('Subscribed! ✉️', 'Welcome to the Weekly Engineering Velocity newsletter.');
        newsEmail.value = '';
        newsEmail.classList.remove('is-valid');
      });
    }
  }

  /* --------------------------------------------------------------------------
     Initialization on DOM Ready
     -------------------------------------------------------------------------- */
  function start() {
    initTheme();
    initNavigation();
    initPricingSwitcher();
    initHowItWorksTabs();
    initFaqAccordion();
    initModal();
    initForms();

    console.log('⚡ PulseFlow AI loaded successfully.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // Expose toast helper globally if needed
  window.PulseFlow = {
    showToast: showToast
  };
})();
