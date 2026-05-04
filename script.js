const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const revealElements = Array.from(document.querySelectorAll(".reveal"));
const scrollBar = document.getElementById("scrollBar");
const portrait = document.getElementById("portrait");
const stats = Array.from(document.querySelectorAll("[data-count]"));
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

let pulseMode = false;
const fallbackPortrait = "assets/profile.svg";

if (portrait) {
  const localPortrait = new Image();

  localPortrait.onload = () => {
    portrait.src = "assets/profile.jpg";
  };

  localPortrait.onerror = () => {
    portrait.src = fallbackPortrait;
  };

  localPortrait.src = "assets/profile.jpg";
}

const animateCount = (element) => {
  const target = Number(element.dataset.count || 0);
  const duration = 1100;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    element.textContent = Math.floor(target * (0.12 + progress * 0.88)).toString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = String(target);
    }
  };

  requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      if (entry.target.matches("[data-count]")) {
        animateCount(entry.target);
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealElements.forEach((element) => revealObserver.observe(element));
stats.forEach((element) => revealObserver.observe(element));

const updateScroll = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const value = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollBar.style.width = `${value}%`;
};

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    projectCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const show = filter === "all" || categories.includes(filter);
      card.classList.toggle("hidden", !show);
    });
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    pulseMode = !pulseMode;
    root.dataset.mode = pulseMode ? "pulse" : "calm";
    themeToggle.querySelector("span:last-child").textContent = pulseMode ? "Pulse" : "Calm";
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "there").trim();
    formStatus.textContent = `Thanks, ${name}. Your message is ready to be customized for a real backend.`;
    contactForm.reset();
  });
}

const cards = Array.from(document.querySelectorAll(".project-card, .portrait-card"));

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    card.style.transform = `perspective(1200px) rotateX(${y * -1}deg) rotateY(${x}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

root.dataset.mode = "calm";
