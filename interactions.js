/**
 * PulseFlow AI - UI Interactions & Dynamic Behaviors
 * Manages scrolling, navigation, mobile drawer, pricing toggle, accordions, modals, and toasts.
 */

import { validators, validateField, resetFormValidation } from './validation.js';

/* --------------------------------------------------------------------------
   1. Toast Notification System
   -------------------------------------------------------------------------- */
export function showToast(title, description) {
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

  // Force reflow and reveal
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
   2. Sticky Navbar & Active Section Spy
   -------------------------------------------------------------------------- */
export function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll Spy for active navigation link
    let currentId = '';
    const scrollPosition = window.scrollY + 120;

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
  });

  // Smooth scroll handler with offset for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

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
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
const mobileToggle = document.getElementById('nav-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');
const mobileBackdrop = document.getElementById('mobile-backdrop');

export function initMobileMenu() {
  if (!mobileToggle || !mobileDrawer || !mobileBackdrop) return;

  function toggleMenu() {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  mobileToggle.addEventListener('click', toggleMenu);
  mobileBackdrop.addEventListener('click', closeMobileMenu);

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });
}

function openMobileMenu() {
  mobileToggle?.classList.add('open');
  mobileDrawer?.classList.add('open');
  mobileBackdrop?.classList.add('open');
  document.body.style.overflow = 'hidden';
  mobileToggle?.setAttribute('aria-expanded', 'true');
}

export function closeMobileMenu() {
  mobileToggle?.classList.remove('open');
  mobileDrawer?.classList.remove('open');
  mobileBackdrop?.classList.remove('open');
  document.body.style.overflow = '';
  mobileToggle?.setAttribute('aria-expanded', 'false');
}

/* --------------------------------------------------------------------------
   4. Pricing Billing Switcher (Monthly vs Annual)
   -------------------------------------------------------------------------- */
export function initPricingSwitcher() {
  const billingSwitch = document.getElementById('billing-toggle');
  const proPriceEl = document.getElementById('price-pro');
  const entPriceEl = document.getElementById('price-enterprise');
  const monthlyLabel = document.getElementById('label-monthly');
  const annualLabel = document.getElementById('label-annual');

  if (!billingSwitch || !proPriceEl || !entPriceEl) return;

  // Monthly: Pro = $29, Enterprise = $79
  // Annual (20% off): Pro = $23, Enterprise = $64
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
   5. How It Works Interactive Step Switcher
   -------------------------------------------------------------------------- */
export function initHowItWorksTabs() {
  const stepCards = document.querySelectorAll('.step-card');
  const stepViews = document.querySelectorAll('.step-view');

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      const stepIndex = card.getAttribute('data-step');

      // Update active cards
      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Update views
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
   6. FAQ Accordion
   -------------------------------------------------------------------------- */
export function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean accordion behavior
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
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
   7. Modal Dialog (Sign Up / Get Started)
   -------------------------------------------------------------------------- */
const modalOverlay = document.getElementById('signup-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalPlanSelect = document.getElementById('modal-plan-select');

export function initModal() {
  if (!modalOverlay) return;

  // Open modal buttons (buttons with data-open-modal)
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedPlan = trigger.getAttribute('data-plan');
      if (preselectedPlan && modalPlanSelect) {
        modalPlanSelect.value = preselectedPlan;
      }
      openModal();
    });
  });

  modalCloseBtn?.addEventListener('click', closeModal);

  // Click outside modal card to close
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // ESC to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

function openModal() {
  modalOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus first input
  setTimeout(() => {
    const firstInput = modalOverlay?.querySelector('input');
    firstInput?.focus();
  }, 100);
}

function closeModal() {
  modalOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   8. Demo Request & Modal Form Submissions with Validation
   -------------------------------------------------------------------------- */
export function initForms() {
  // Demo Request Form
  const demoForm = document.getElementById('demo-form');
  const demoSuccessCard = document.getElementById('demo-success-card');
  const demoResetBtn = document.getElementById('demo-reset-btn');

  if (demoForm) {
    const nameInput = document.getElementById('demo-name');
    const emailInput = document.getElementById('demo-email');
    const companyInput = document.getElementById('demo-company');
    const sizeInput = document.getElementById('demo-team-size');
    const challengeInput = document.getElementById('demo-challenge');

    // Real-time validation on blur / input
    nameInput?.addEventListener('input', () => validateField(nameInput, [validators.required, validators.minLength(2)]));
    emailInput?.addEventListener('input', () => validateField(emailInput, [validators.email]));
    companyInput?.addEventListener('input', () => validateField(companyInput, [validators.required]));
    sizeInput?.addEventListener('change', () => validateField(sizeInput, [validators.required]));

    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, [validators.required, validators.minLength(2)]);
      const isEmailValid = validateField(emailInput, [validators.email]);
      const isCompanyValid = validateField(companyInput, [validators.required]);
      const isSizeValid = validateField(sizeInput, [validators.required]);

      if (!isNameValid || !isEmailValid || !isCompanyValid || !isSizeValid) {
        showToast('Submission Incomplete', 'Please correct the highlighted fields.');
        return;
      }

      // Simulate API submit with button loading state
      const submitBtn = demoForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="animation: spinSlow 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="4" stroke="currentColor" stroke-dasharray="32" stroke-linecap="round"></circle>
        </svg>
        Scheduling Demo...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Switch to success card
        demoForm.style.display = 'none';
        if (demoSuccessCard) {
          demoSuccessCard.classList.add('active');
          const successEmailDisplay = document.getElementById('success-user-email');
          if (successEmailDisplay) {
            successEmailDisplay.textContent = emailInput.value;
          }
        }

        showToast('Demo Confirmed! 🎉', `We sent a calendar invite to ${emailInput.value}.`);
      }, 900);
    });

    demoResetBtn?.addEventListener('click', () => {
      resetFormValidation(demoForm);
      demoForm.style.display = 'block';
      demoSuccessCard?.classList.remove('active');
    });
  }

  // Modal Sign-Up Form
  const modalForm = document.getElementById('modal-signup-form');
  if (modalForm) {
    const modalName = document.getElementById('modal-name');
    const modalEmail = document.getElementById('modal-email');
    const modalPassword = document.getElementById('modal-password');

    modalName?.addEventListener('input', () => validateField(modalName, [validators.required, validators.minLength(2)]));
    modalEmail?.addEventListener('input', () => validateField(modalEmail, [validators.email]));
    modalPassword?.addEventListener('input', () => validateField(modalPassword, [validators.password]));

    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(modalName, [validators.required, validators.minLength(2)]);
      const isEmailValid = validateField(modalEmail, [validators.email]);
      const isPassValid = validateField(modalPassword, [validators.password]);

      if (!isNameValid || !isEmailValid || !isPassValid) {
        showToast('Validation Error', 'Please check your information before submitting.');
        return;
      }

      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Creating Workspace...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        closeModal();
        resetFormValidation(modalForm);
        showToast('Account Initialized! 🚀', `Welcome to PulseFlow AI, ${modalName.value}! Check your inbox to verify.`);
      }, 850);
    });
  }

  // Newsletter Subscription Form (Footer)
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    const newsEmail = document.getElementById('newsletter-email');
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateField(newsEmail, [validators.email])) {
        return;
      }
      showToast('Subscribed! ✉️', 'You have been added to our Engineering Velocity dispatch.');
      newsEmail.value = '';
      newsEmail.classList.remove('is-valid');
    });
  }
}

