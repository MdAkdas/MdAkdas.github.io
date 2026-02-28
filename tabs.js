const tabLinks = Array.from(document.querySelectorAll(".tab-link"));
const themeToggle = document.getElementById("theme-toggle");
const heroLine = document.getElementById("hero-line");
const sectionIds = ["hero", "experience", "projects", "education", "hobbies", "contact"];
const sections = Object.fromEntries(sectionIds.map((id) => [id, document.getElementById(id)]));

let activeSection = "hero";
let hasInteracted = false;

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  if (themeToggle) {
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to black theme");
  }
}

function updateNavStyles() {
  tabLinks.forEach((button) => {
    const isActive = hasInteracted && button.dataset.tab === activeSection;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.setAttribute("tabindex", "0");
  });
}

function focusSection(id, smooth = true) {
  if (!sections[id]) return;
  activeSection = id;
  hasInteracted = true;
  updateNavStyles();

  if (id === "hero") {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    requestAnimationFrame(() => {
      try {
        sections.hero?.focus({ preventScroll: true });
      } catch {
        sections.hero?.focus();
      }
    });
    return;
  }

  sections[id].scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  requestAnimationFrame(() => {
    const target = sections[id];
    if (!target) return;
    try {
      target.focus({ preventScroll: true });
    } catch {
      target.focus();
    }
  });
}

function goHome() {
  focusSection("hero");
}

function runHeroTyping() {
  if (!heroLine) return;
  const fullText = heroLine.dataset.fullText;
  if (!fullText) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroLine.textContent = fullText;
    return;
  }

  let i = 0;
  heroLine.textContent = "";
  const timer = setInterval(() => {
    heroLine.textContent += fullText.charAt(i);
    i += 1;
    if (i >= fullText.length) {
      clearInterval(timer);
    }
  }, 20);
}

tabLinks.forEach((button) => {
  button.addEventListener("click", () => {
    focusSection(button.dataset.tab);
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

  const activeElement = document.activeElement;
  const idx = tabLinks.findIndex((btn) => btn === activeElement);
  if (idx < 0) return;

  const nextIndex =
    event.key === "ArrowRight"
      ? (idx + 1) % tabLinks.length
      : (idx - 1 + tabLinks.length) % tabLinks.length;

  tabLinks[nextIndex].focus();
});

const startTab = window.location.hash.replace("#", "");
if (startTab && sections[startTab]) {
  focusSection(startTab, false);
} else {
  updateNavStyles();
  document.body.classList.remove("hero-compact");
  sections.hero?.scrollIntoView({ behavior: "auto", block: "start" });
}

const storedTheme = localStorage.getItem("portfolio-theme");
setTheme(storedTheme === "dark" ? "dark" : "light");
runHeroTyping();
