const logo = document.querySelector('#svg1');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.classList.contains('dark-bg')) {
      // Colors for Dark Backgrounds
      logo.style.setProperty('--logo-primary', '#0077ff');
      logo.style.setProperty('--logo-secondary', '#ffa615');
      logo.style.setProperty('--logo-class1', '#ffffff');
    } else {
      // Reset to Light Background Colors
      logo.style.setProperty('--logo-primary', '#00437f');
      logo.style.setProperty('--logo-secondary', '#ffa615');
      logo.style.setProperty('--logo-class1', '#ffffff');
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(section => observer.observe(section));