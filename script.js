
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

// Close menu after clicking a link
navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth",
      block: "start"
    });

    // Keep the URL in sync with the selected section
    history.replaceState(null, "", targetId);
  });
});

// Highlight the navigation link for the visible section
const observer = new IntersectionObserver(
  (entries) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort(
        (a, b) =>
          b.intersectionRatio - a.intersectionRatio
      );

    if (!visibleSections.length) return;

    const currentId = visibleSections[0].target.id;

    navItems.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${currentId}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  },
  {
    rootMargin: "-15% 0px -60% 0px",
    threshold: [0, 0.15, 0.3, 0.5]
  }
);

sections.forEach((section) => observer.observe(section));

// Automatic footer year
document.getElementById("year").textContent =
  new Date().getFullYear();

// Close mobile menu with Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }
});

/* Leadership cards reveal animation */

const teamCards = document.querySelectorAll(".team-card");

if ("IntersectionObserver" in window) {
  const teamObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  teamCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 120}ms`;
    teamObserver.observe(card);
  });
} else {
  teamCards.forEach((card) => {
    card.classList.add("revealed");
  });
}

/* ==============================
   PORTFOLIO CATEGORY FILTERS
============================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    // Update selected button
    filterButtons.forEach((btn) => {
      const isActive = btn === button;

      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    // Show only matching projects
    projectCards.forEach((card) => {
      const category = card.dataset.category;

      const shouldShow =
        selectedCategory === "all" ||
        category === selectedCategory;

      card.hidden = !shouldShow;
    });
  });
});
