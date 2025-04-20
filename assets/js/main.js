// Language toggle functionality
const toggleBtn = document.getElementById('lang-toggle');
const overlay = document.getElementById('lang-transition-overlay');

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

  document.addEventListener('DOMContentLoaded', () => {
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

    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) toggleBtn.textContent = 'Español';
  });

  document.body.classList.add('js-enabled');
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

// Hamburger menu toggle (handles both navs)
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const closeMenuBtn = document.getElementById('close-menu');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu functionality when "X" is clicked
closeMenuBtn.addEventListener('click', () => {
  navLinks.classList.remove('active');  // Hide the menu
});

// Close menu when clicking outside of it
const navLinkElements = document.querySelectorAll('#nav-links a');

navLinkElements.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});


// Sticky navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}


// Popup submit RSVP button
document.addEventListener("DOMContentLoaded", function () {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxYalcjtL5BraUZ7eAMYg5NTQS01NaXI0KGEkubguatPrlf1x5gV9KH_Yh91J2r07I0sg/exec";

  const forms = document.querySelectorAll(".rsvp-form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.closest(".lang.active")) return;

      const formData = new FormData(form);

      fetch(scriptURL, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            showConfirmationPopup();
            form.reset();
          } else {
            alert("There was an issue with your RSVP. Please try again.");
          }
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });
  });

  function showConfirmationPopup() {
    const isSpanish = document.querySelector('.lang-es.active');
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

    setTimeout(() => {
      popup.remove();
    }, 3000);
  }
});

