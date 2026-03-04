(() => {
  const root = document.documentElement;

  // -------------------------
  // BASIC UI
  // -------------------------
  const themeBtn = document.getElementById("themeBtn");
  const printBtn = document.getElementById("printBtn");
  const yearEl   = document.getElementById("year");
  const skillSearch = document.getElementById("skillSearch");

  yearEl.textContent = new Date().getFullYear();

  // THEME (localStorage)
  const THEME_KEY = "cv.theme";
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeBtn?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  });

  printBtn?.addEventListener("click", () => window.print());

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
  const sections = navLinks.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(a => a.classList.remove("active"));
    const id = "#" + visible.target.id;
    const link = navLinks.find(a => a.getAttribute("href") === id);
    if (link) link.classList.add("active");
  }, { threshold: [0.25, 0.35, 0.5] });

  sections.forEach(s => io.observe(s));

  // -------------------------
  // EMAILJS (CONTACT FORM)
  // -------------------------
  const contactForm = document.getElementById("contactForm");
  const sendBtn = document.getElementById("sendBtn");
  const formStatus = document.getElementById("formStatus");

 
  const EMAILJS_PUBLIC_KEY = "5Qx5Z3OC0gDjm6A4z";
  const EMAILJS_SERVICE_ID = "service_pqtdvnf";
  const EMAILJS_TEMPLATE_ID = "template_bvrgaf5";

  function setStatus(msg, kind) {
    if (!formStatus) return;
    formStatus.classList.remove("ok", "err");
    if (kind) formStatus.classList.add(kind);
    formStatus.textContent = msg || "";
  }

  function isPlaceholder(v) {
    return !v || v.includes("YOUR_");
  }

  function initEmailJS() {
    if (!window.emailjs) {
      setStatus("EmailJS SDK sa nenačítal. Skontroluj script tag.", "err");
      return false;
    }
    if (isPlaceholder(EMAILJS_PUBLIC_KEY) || isPlaceholder(EMAILJS_SERVICE_ID) || isPlaceholder(EMAILJS_TEMPLATE_ID)) {
      setStatus("Doplň EmailJS PUBLIC KEY + SERVICE ID + TEMPLATE ID v app.js.", "err");
      if (sendBtn) sendBtn.disabled = true;
      return false;
    }


    window.emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
      blockHeadless: true,
      limitRate: { id: "cv-site", throttle: 10000 } // 1 request / 10s
    });

    return true;
  }

  const emailReady = initEmailJS();

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!emailReady) return;


    const hp = contactForm.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") return;

    try {
      if (sendBtn) sendBtn.disabled = true;
      setStatus("Odosielam...", null);

      
      await window.emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        contactForm
      );

      contactForm.reset();
      setStatus("Správa bola odoslaná. Ďakujem.", "ok");
    } catch (err) {
      setStatus("Odoslanie zlyhalo. Skontroluj EmailJS IDs a template premenné.", "err");
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  });
})();