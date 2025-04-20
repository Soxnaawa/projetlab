document.addEventListener('DOMContentLoaded', () => {
  // Gardez seulement le code pour la navigation active
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav ul li a');
  
  navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
          link.style.fontWeight = 'bold';
          link.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }
  });
});