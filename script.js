/**
 * Aroma & Ember — Artisanal Specialty Roastery & Bakery
 * Lightweight, Vanilla JavaScript for Interactions & Micro-Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DOM Elements
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  // Reservation Modal Elements
  const reserveModal = document.getElementById('reserve-modal');
  const openReserveBtns = [
    document.getElementById('open-reserve-btn'),
    document.getElementById('mobile-reserve-btn'),
    document.getElementById('order-special-btn')
  ].filter(Boolean);
  const closeModalBtn = document.getElementById('close-modal-btn');
  const reservationForm = document.getElementById('reservation-form');
  const reservationSuccess = document.getElementById('reservation-success');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const resDateInput = document.getElementById('res-date');

  // Newsletter Elements
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  // Status Badge & Year Elements
  const storeStatusPill = document.getElementById('store-status');
  const statusText = document.getElementById('status-text');
  const currentYearSpan = document.getElementById('current-year');

  // --------------------------------------------------------------------------
  // 2. Set Current Year in Footer
  // --------------------------------------------------------------------------
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 3. Set Default Date in Reservation Form (Today or Tomorrow)
  // --------------------------------------------------------------------------
  if (resDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    resDateInput.min = `${yyyy}-${mm}-${dd}`;
    resDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // --------------------------------------------------------------------------
  // 4. Mobile Menu Hamburger Toggle
  // --------------------------------------------------------------------------
  const toggleMobileMenu = (forceState) => {
    const isCurrentlyActive = mobileToggle.classList.contains('is-active');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyActive;

    if (shouldOpen) {
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('is-open') && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Smooth Scrolling & Mobile Drawer Dismissal
  // --------------------------------------------------------------------------
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // Close mobile drawer if open
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        toggleMobileMenu(false);
      }

      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = siteHeader ? siteHeader.offsetHeight : 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Header Scrolled State & Scrollspy
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id], footer[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const onScroll = () => {
    const scrollY = window.pageYOffset;

    // Header shadow toggle
    if (siteHeader) {
      if (scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Scrollspy navigation highlight
    const headerOffset = (siteHeader ? siteHeader.offsetHeight : 80) + 60;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerOffset;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --------------------------------------------------------------------------
  // 7. Interactive Reservation Modal
  // --------------------------------------------------------------------------
  const openModal = () => {
    if (!reserveModal) return;
    reserveModal.classList.add('is-active');
    reserveModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset form display
    if (reservationForm) reservationForm.style.display = 'flex';
    if (reservationSuccess) reservationSuccess.style.display = 'none';

    // Close mobile drawer if opened from mobile button
    if (mobileMenu && mobileMenu.classList.contains('is-open')) {
      toggleMobileMenu(false);
    }
  };

  const closeModal = () => {
    if (!reserveModal) return;
    reserveModal.classList.remove('is-active');
    reserveModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openReserveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking on backdrop
  if (reserveModal) {
    reserveModal.addEventListener('click', (e) => {
      if (e.target === reserveModal) {
        closeModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reserveModal && reserveModal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Handle Reservation Submission
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Securing Your Table...';
      submitBtn.disabled = true;

      // Simulate network confirmation
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        reservationForm.reset();
        reservationForm.style.display = 'none';
        if (reservationSuccess) {
          reservationSuccess.style.display = 'block';
        }
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 8. Newsletter Form Submission
  // --------------------------------------------------------------------------
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const email = input.value.trim();

      if (email && newsletterFeedback) {
        newsletterFeedback.textContent = `Welcome to our hearth circle! An invitation has been sent to ${email}.`;
        newsletterFeedback.className = 'form-feedback success';
        newsletterForm.reset();

        setTimeout(() => {
          newsletterFeedback.textContent = '';
          newsletterFeedback.className = 'form-feedback';
        }, 5000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Dynamic "Open Now" Hours Calculation
  // --------------------------------------------------------------------------
  const updateStoreStatus = () => {
    if (!storeStatusPill || !statusText) return;

    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const currentHour = now.getHours() + (now.getMinutes() / 60);

    let isOpen = false;
    let closingTimeStr = '';

    if (day >= 1 && day <= 5) {
      // Monday - Friday: 6:30 AM (6.5) to 7:00 PM (19.0)
      if (currentHour >= 6.5 && currentHour < 19.0) {
        isOpen = true;
        closingTimeStr = '7:00 PM';
      }
    } else if (day === 6) {
      // Saturday: 7:00 AM (7.0) to 8:00 PM (20.0)
      if (currentHour >= 7.0 && currentHour < 20.0) {
        isOpen = true;
        closingTimeStr = '8:00 PM';
      }
    } else if (day === 0) {
      // Sunday: 7:30 AM (7.5) to 6:00 PM (18.0)
      if (currentHour >= 7.5 && currentHour < 18.0) {
        isOpen = true;
        closingTimeStr = '6:00 PM';
      }
    }

    if (isOpen) {
      storeStatusPill.className = 'status-pill status-open';
      statusText.textContent = `Open Now • Closes at ${closingTimeStr}`;
    } else {
      storeStatusPill.className = 'status-pill status-closed';
      const openTime = day === 0 ? '7:30 AM' : (day === 6 ? '7:00 AM' : '6:30 AM');
      statusText.textContent = `Closed Now • Hearth Opens at ${openTime}`;
    }
  };

  updateStoreStatus();
  // Update status every 5 minutes
  setInterval(updateStoreStatus, 300000);
});
