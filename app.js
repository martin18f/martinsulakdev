import { inject } from "@vercel/analytics"

(() => {
  const root = document.documentElement;

  const themeBtn = document.getElementById("themeBtn");
  const printBtn = document.getElementById("printBtn");
  const yearEl   = document.getElementById("year");
  const skillSearch = document.getElementById("skillSearch");

  yearEl.textContent = new Date().getFullYear();

  // THEME (localStorage) - OK, nič citlivé
  const THEME_KEY = "cv.theme";
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  });

  // PRINT
  printBtn.addEventListener("click", () => window.print());

  // SKILL FILTER (highlight tags)
  function normalize(s){ return (s || "").toLowerCase().trim(); }

  skillSearch?.addEventListener("input", () => {
    const q = normalize(skillSearch.value);
    const tags = Array.from(document.querySelectorAll("[data-skill]"));

    tags.forEach(t => t.classList.remove("hl"));
    if (!q) return;

    tags.forEach(t => {
      const val = normalize(t.getAttribute("data-skill") || t.textContent);
      if (val.includes(q)) t.classList.add("hl");
    });
  });

  // Active section highlight (optional)
  const navLinks = Array.from(document.querySelectorAll(".nav a"));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navLinks.forEach(a => a.classList.remove("active"));
    const id = "#" + visible.target.id;
    const link = navLinks.find(a => a.getAttribute("href") === id);
    if (link) link.classList.add("active");
  }, { threshold: [0.25, 0.35, 0.5] });

  sections.forEach(s => io.observe(s));
})();