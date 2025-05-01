document.addEventListener("DOMContentLoaded", () => {

  // Fetch the navbar HTML and inject it
  fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer) {
        navbarContainer.innerHTML = data;
        console.log("Navbar loaded successfully"); // Debugging line

        // After navbar is loaded, initialize features and scroll to saved hash
        setTimeout(() => {
          initNavbarFeatures();
          scrollToSavedHash();
        }, 100);
      } else {
        console.error("Navbar container not found."); // Debugging line
      }
    })
    .catch((error) => {
      console.error("Error loading navbar:", error); // Debugging line
    });

  // Initialize navbar features (e.g., language toggle, menu interactions)
  function initNavbarFeatures() {
    const toggleBtn = document.getElementById('lang-toggle');
    const overlay = document.getElementById('lang-transition-overlay');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const closeMenuBtn = document.getElementById('close-menu');
    const navLinkElements = document.querySelectorAll('#nav-links a');
    const navbar = document.querySelector('.navbar');

    // Language toggle functionality
    if (toggleBtn && overlay) {
      toggleBtn.addEventListener('click', () => {
        overlay.classList.add('active');

        setTimeout(() => {
          const englishElements = document.querySelectorAll('.lang-en');
          const spanishElements = document.querySelectorAll('.lang-es');
          const isEnglishActive = Array.from(englishElements).some(el => el.classList.contains('active'));

          englishElements.forEach(el => {
            el.classList.toggle('active', !isEnglishActive);
            el.style.display = !isEnglishActive ? 'flex' : 'none';
          });

          spanishElements.forEach(el => {
            el.classList.toggle('active', isEnglishActive);
            el.style.display = isEnglishActive ? 'flex' : 'none';
          });

          toggleBtn.textContent = isEnglishActive ? 'English' : 'Español';

          setTimeout(() => {
            overlay.classList.remove('active');
          }, 300);
        }, 300);
      });

      // Default to English on load
      const englishElements = document.querySelectorAll('.lang-en');
      const spanishElements = document.querySelectorAll('.lang-es');

      englishElements.forEach(el => {
        el.classList.add('active');
        el.style.display = 'flex';
      });

      spanishElements.forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
      });

      toggleBtn.textContent = 'Español';
      document.body.classList.add('js-enabled');
    }

    // Hamburger menu toggle
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }

    // Close menu functionality when "X" is clicked
    if (closeMenuBtn && navLinks) {
      closeMenuBtn.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    }

    // Close menu when clicking a nav link
    navLinkElements.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href === '#rsvp') {
          const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/wedding-site/';

          if (!isIndexPage) {
            e.preventDefault();
            window.location.href = 'index.html#rsvp';
            return;
          }

          sessionStorage.setItem('scrollToHash', 'rsvp');
        } else if (href.startsWith('#')) {
          sessionStorage.setItem('scrollToHash', href.substring(1));
        }

        navLinks.classList.remove('active');
      });
    });

    // Sticky navbar on scroll
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }
  }

  // Countdown (if present)
  const countDownDate = new Date("Aug 20, 2025 13:00:00").getTime();

  function updateCountdowns() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelectorAll('.countdown-box').forEach(box => {
      box.querySelector('.days').textContent = days;
      box.querySelector('.hours').textContent = hours;
      box.querySelector('.minutes').textContent = minutes;
      box.querySelector('.seconds').textContent = seconds;
    });
  }

  if (document.querySelector('.countdown-box')) {
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    window.addEventListener('load', () => {
      document.querySelectorAll('.countdown-box').forEach(box => {
        box.classList.add('visible');
      });
    });
  }

  // Popup RSVP submission handler
  const scriptURL = "https://script.google.com/macros/s/AKfycbxy31SBix1alG_2R0l9Yg4hLX4MMLnK8Etb8Ui6jpec5APJvOQaq-cpX9Fbx-DU2JOSBg/exec";
    const forms = document.querySelectorAll(".rsvp-form");
    const loadingIndicator = document.getElementById("rsvp-loading");
    
    let submitting = false; // Prevents double submissions
    
    forms.forEach((form) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the form from submitting the usual way
    
        if (submitting) return; // Prevent double submission
  
        // ✅ Check if reCAPTCHA has been completed
        const recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse.length === 0) {
          alert("Please complete the reCAPTCHA.");
          return;
        }
    
        // ✅ Append reCAPTCHA response to form data
        const formData = new FormData(form);
        formData.append("g-recaptcha-response", recaptchaResponse);
    
        submitting = true;
        loadingIndicator.style.display = "block"; // Show loading
    
        fetch(scriptURL, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              showConfirmationPopup(form);
              form.reset();
              grecaptcha.reset(); // ✅ Optional: reset captcha for future submissions
            } else {
              alert("There was an issue with your RSVP. Please try again.");
            }
          })
          .catch((error) => {
            alert("Error: " + error.message);
          })
          .finally(() => {
            submitting = false;
            loadingIndicator.style.display = "none"; // Hide loading
          });
      });
    });
  
    function showConfirmationPopup(form) {
      const isSpanish = form.closest(".lang-es") !== null;
      const popup = document.createElement("div");
      popup.textContent = isSpanish
        ? "🎉 ¡RSVP enviado con éxito!"
        : "🎉 RSVP submitted successfully!";
    
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.padding = "1rem 2rem";
      popup.style.backgroundColor = "#fff";
      popup.style.border = "2px solid #AAB99A";
      popup.style.borderRadius = "10px";
      popup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
      popup.style.zIndex = "9999";
    
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 3000);
    }
  
});
