document.addEventListener('DOMContentLoaded', () => {
  // --- Initialization ---
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const scrollBar = document.getElementById('scrollBar');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const stats = document.querySelectorAll('[data-count]');
  const reveals = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // --- Theme Toggle ---
  let isHyper = false;
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      isHyper = !isHyper;
      if (isHyper) {
        root.setAttribute('data-theme', 'hyper');
        themeToggle.querySelector('span:last-child').textContent = 'Dark Mode';
      } else {
        root.removeAttribute('data-theme');
        themeToggle.querySelector('span:last-child').textContent = 'Hyper Mode';
      }
    });
  }

  // --- Scroll Progress Bar ---
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollBar) scrollBar.style.width = scrolled + '%';
  });

  // --- Project Filtering ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // --- Intersection Observer for Animations ---
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger number counter animation
        if (entry.target.hasAttribute('data-count') && !entry.target.classList.contains('counted')) {
          animateValue(entry.target);
          entry.target.classList.add('counted');
        }
        
        // Trigger progress bars
        if (entry.target.classList.contains('skills-bars')) {
          const fills = entry.target.querySelectorAll('.progress-fill');
          fills.forEach(fill => {
            fill.style.width = fill.getAttribute('style').match(/--target-width:\s*([^;]+)/)[1];
          });
        }
        
        // Stop observing once visible
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
  stats.forEach(el => observer.observe(el));
  
  const skillBars = document.querySelector('.skills-bars');
  if(skillBars) observer.observe(skillBars);

  // --- Number Counter Animation ---
  function animateValue(obj) {
    const target = parseInt(obj.getAttribute('data-count'));
    const duration = 2000;
    let startTimestamp = null;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      obj.innerHTML = Math.floor(easeProgress * target);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = target;
      }
    };
    window.requestAnimationFrame(step);
  }

  // --- 3D Hover Effect for Cards ---
  const hover3dCards = document.querySelectorAll('.hover-3d');
  
  hover3dCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // --- Contact Form Handling ---
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      
      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: json
        });
        
        const result = await response.json();
        if (response.status == 200) {
          formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
          formStatus.style.color = 'var(--secondary)';
          contactForm.reset();
        } else {
          formStatus.textContent = result.message || 'Something went wrong!';
          formStatus.style.color = '#f87171';
        }
      } catch (error) {
        formStatus.textContent = 'Something went wrong. Please try again.';
        formStatus.style.color = '#f87171';
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        setTimeout(() => {
          formStatus.textContent = '';
        }, 5000);
      }
    });
  }
});
