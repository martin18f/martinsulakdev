window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

gtag("js", new Date());
gtag("config", "G-Z09CQZZVHQ");

// Version management
const APP_VERSION = "1.0";

document.addEventListener("DOMContentLoaded", () => {
  const topbar = document.getElementById("topbar");
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  const themeBtn = document.getElementById("themeBtn");
  const langBtn = document.getElementById("langBtn");
  const printBtn = document.getElementById("printBtn");
  const year = document.getElementById("year");;
  const version = document.getElementById("version");
  const skillSearch = document.getElementById("skillSearch");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const sendBtn = document.getElementById("sendBtn");
  const root = document.documentElement;

  const setupInteractiveBackground = () => {
    let animationFrame = 0;
    let activeTimer = 0;
    let latestX = window.innerWidth * 0.5;
    let latestY = window.innerHeight * 0.34;

    const setBackgroundPosition = (x, y) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const offsetX = ((x / width) - 0.5) * 22;
      const offsetY = ((y / height) - 0.5) * 22;

      root.style.setProperty("--pointer-x", `${x}px`);
      root.style.setProperty("--pointer-y", `${y}px`);
      root.style.setProperty("--bg-x", `${offsetX.toFixed(2)}px`);
      root.style.setProperty("--bg-y", `${offsetY.toFixed(2)}px`);
      root.style.setProperty("--bg-x-inverse", `${(-offsetX).toFixed(2)}px`);
      root.style.setProperty("--bg-y-inverse", `${(-offsetY).toFixed(2)}px`);
    };

    const queueBackgroundPosition = (event) => {
      latestX = event.clientX;
      latestY = event.clientY;

      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        setBackgroundPosition(latestX, latestY);
        animationFrame = 0;
      });
    };

    const pulseBackground = () => {
      root.classList.add("bg-active");
      window.clearTimeout(activeTimer);
      activeTimer = window.setTimeout(() => {
        root.classList.remove("bg-active");
      }, 650);
    };

    const updateScrollShift = () => {
      root.style.setProperty("--scroll-shift", `${(window.scrollY * -0.035).toFixed(2)}px`);
    };

    setBackgroundPosition(window.innerWidth * 0.5, window.innerHeight * 0.34);
    updateScrollShift();

    window.addEventListener("pointermove", queueBackgroundPosition, { passive: true });
    window.addEventListener("pointerdown", pulseBackground, { passive: true });
    window.addEventListener("scroll", updateScrollShift, { passive: true });
    window.addEventListener("resize", () => {
      setBackgroundPosition(window.innerWidth * 0.5, window.innerHeight * 0.34);
      updateScrollShift();
    }, { passive: true });
  };

  setupInteractiveBackground();

  

  const translations = {
    sk: {
      metaTitle: "Martin Šulák • AI študent • Portfólio",
      metaDescription:
        "Osobné portfólio Martina Šuláka — študenta umelej inteligencie so zameraním na vývoj softvéru, AI/ML projekty, riadiace systémy, IoT a moderné webové technológie.",

      skip: "Preskočiť na obsah",

      navAria: "Hlavná navigácia",
      openNav: "Otvoriť navigáciu",
      quickInfo: "Rýchle informácie",
      techStackAria: "Technologický stack",
      stackEyebrow: "Tech stack",
      stackIntro: "Technológie, ktoré používam pri webových, AI/ML a engineering projektoch.",
      langBtnAria: "Prepnúť do angličtiny",
      themeAria: "Prepnúť tému",

      brandRole: "AI študent • Developer • Engineering",

      navProfile: "Profil",
      navSkills: "Zručnosti",
      navProjects: "Projekty",
      navEducation: "Vzdelanie",
      navCerts: "Certifikáty",
      navContact: "Kontakt",

      themeBtn: "Téma",
      printBtn: "Tlačiť / PDF",

      heroPill: "Umelá inteligencia • Vývoj softvéru • Engineering",
      heroSubtitle: "Študent umelej inteligencie • FEI TUKE",
      heroLead:
        "Zameriavam sa na praktické technické projekty z oblastí softvérového vývoja, umelej inteligencie, strojového učenia, riadiacich systémov a moderných webových technológií. Prepájam akademické znalosti s praktickou implementáciou v osobných aj školských projektoch.",

      quickContact: "Kontakt",
      quickProjects: "Projekty",
      quickSkills: "Zručnosti",

      portfolioLink: "Portfólio",
      linkedinSoon: "LinkedIn bude doplnený",

      kpiWeb: "weby a aplikácie",
      kpiAi: "školské projekty",
      kpiSystems: "riadenie a simulácie",

      focusTitle: "Zameranie",
      focus1: "Moderný frontend a responzívne používateľské rozhrania",
      focus2: "AI/ML experimenty, dáta a technická dokumentácia",
      focus3: "Riadiace systémy, simulácie a engineering projekty",

      profileTitle: "Profil",
      profileText:
        "Študujem umelú inteligenciu na Fakulte elektrotechniky a informatiky Technickej univerzity v Košiciach. Venujem sa web developmentu, AI/ML projektom, riadiacim systémom a IoT. Mojím cieľom je budovať technické projekty, ktoré majú praktický význam a zároveň rozvíjajú moje softvérové aj inžinierske schopnosti.",

      strengthsTitle: "Silné stránky",
      strength1: "Rýchla orientácia v technickom probléme a samostatnosť",
      strength2: "Cit pre detail, moderný vizuál a UX",
      strength3: "Dôslednosť pri debugovaní, verzovaní a dokumentácii",

      areasTitle: "Oblasti záujmu",
      areasNote:
        "Profil je priebežne rozširovaný podľa nových projektov, školských zadaní a technológií.",

      skillsTitle: "Zručnosti",
      skillsHint: "Vyhľadávanie zvýrazní relevantné technológie a tagy.",
      skillPlaceholder: "Hľadať napr. JavaScript, Git, ML...",

      frontendText:
        "Moderné rozhrania, responzívne layouty, animácie a používateľská skúsenosť.",
      aimlText:
        "Príprava dát, modelovanie, vyhodnotenie metrík a školské experimenty.",
      engineeringTitle: "Engineering",
      engineeringText:
        "Riadiace systémy, simulácie, IoT riešenia, verzovanie a technická dokumentácia.",

      projectsTitle: "Projekty",
      projectsIntro:
        "Vybrané projekty a repozitáre. Niektoré sú priamo v tomto portfóliu, iné majú vlastný repozitár alebo verejný live link.",

      ppautoDesc:
        "Webový projekt pre autosalón s moderným dizajnom, prezentáciou značiek, skladovými vozidlami a kontaktnými funkciami.",
      ppauto1: "Moderný web dizajn a responzívne rozhranie",
      ppauto2: "Prezentácia vozidiel, značiek a služieb",
      ppauto3: "Live projekt mimo tohto repozitára",

      autoskolaDesc:
        "Webový projekt pre autoškolu v Spišskej Novej Vsi s verejnou prezentáciou služieb, kurzov a kontaktných informácií.",
      autoskola1: "Prezentačný web pre lokálnu službu",
      autoskola2: "Frontend, verejný obsah a základná dynamická funkcionalita",
      autoskola3: "Samostatný repozitár a live web",

      fuelyDesc:
        "Webová aplikácia na výpočet nákladov na palivo a praktické porovnávanie nákladov pri jazde autom.",
      fuely1: "React aplikácia s čistým používateľským rozhraním",
      fuely2: "Výpočty, formuláre a validácia vstupov",
      fuely3: "Samostatný repozitár a live demo",

      desktopWidgetDesc:
        "Komerčná Windows aplikácia na pripnutie interaktívneho webového obsahu priamo na plochu ako presúvateľné a vrstviteľné widgety.",
      desktopWidget1: "Viac widgetov s vlastnou URL, opacitou a vrstvou",
      desktopWidget2: "Snapovanie, vodiace čiary a externý edit panel",
      desktopWidget3: "Dostupné cez Gumroad, Microsoft Store sa pripravuje",
      desktopWidgetBuyGumroad: "Kúpiť na Gumroad",

      stressTitle: "Detekcia stresu z reči",
      stressDesc:
        "Projekt s neurónovou sieťou zameraný na detekciu stresu z rečových dát pomocou neuronových sietí a audio príznakov.",
      stress1: "Spracovanie datasetov a príprava vstupov",
      stress2: "Experimenty s neurónovými sieťami a metriky",
      stress3: "Skupinový akademický projekt",

      uavTitle: "Riadenie UAV systému",
      uavDesc:
        "Projekt riadiacich systémov zameraný na simuláciu UAV, fuzzy reguláciu a experimenty v MATLAB/Simulink.",
      uav1: "MATLAB/Simulink simulačný workflow",
      uav2: "Fuzzy regulátor a optimalizácia",
      uav3: "Dostupné v portfóliovom repozitári",

      mlTitle: "Projekt strojového učenia",
      mlDesc:
        "Akademický projekt a experimenty zo strojového učenia zamerané na implementáciu modelov, vyhodnotenie a praktické pochopenie ML workflow.",
      ml1: "Python implementácia strojového učenia",
      ml2: "Spracovanie datasetu a vyhodnotenie modelu",
      ml3: "Dostupné v portfóliovom repozitári",

      academicTitle: "Školské zadania",
      academicDesc:
        "Školské projekty, technické správy, experimenty a dokumentácia vytvorené počas štúdia umelej inteligencie.",
      academic1: "AI, ML a programátorské zadania",
      academic2: "Reporty, dokumentácia a experimenty",
      academic3: "Priebežne rozširované počas štúdia",

      availablePortfolio: "Dostupné v portfóliovom repozitári",
      availablePortfolio2: "Dostupné v portfóliovom repozitári",
      availableRepo: "Dostupné v priečinkoch repozitára",

      certsTitle: "Certifikáty",
      certsText: "Certifikáty a absolvované kurzy sú dostupné v repozitári. Sekcia sa bude postupne rozširovať spolu s novými kurzami a technickými materiálmi.",
      certDataCampTitlePython: "Introduction to Python",
      certDataCampDescPython: "Komplexný kurz zameraný na základy programovacieho jazyka Python s praktickými cvičeniami a projektmi.",
      certDataCampTitleJavaIntro: "Introduction to Java",
      certDataCampDescJavaIntro: "Komplexný kurz zameraný na základy programovacieho jazyka Java s praktickými cvičeniami a projektmi.",
      certDataCampTitleJavaInter: "Intermediate Java",
      certDataCampDescJavaInter: "Pokročilý kurz programovacieho jazyka Java zameraný na stredne pokročilé témy s praktickými cvičeniami a projektmi.",
      
      certCodexJavaTitle: "Java",
      certCodexJavaDesc: "Objem kurzov od Codédex zameraný na učenie sa Java programovania. Poznámka: Cez GitHub Student Developer Pack som nemohol získať certifikát, pretože na ukončenie projektov a vydanie certifikátu je potrebný ich platený účet. Na obrázku je screenshot z vyplnených častí kurzu.",
      
      certMatlabControlTitle: "Control Design Onramp",
      certMatlabControlDesc: "MathWorks certifikát - úvodný kurz zameraný na základy návrhov riadiacich systémov v MATLAB prostredí.",
      
      certCiscoIoTTitle: "Introduction to IoT",
      certCiscoIoTDesc: "Cisco certifikát - kurz zameraný na úvod do IoT technológií, sieťových protokolov a praktických aplikácií.",
      
      certMatlabSymbolicTitle: "Introduction to Symbolic Math",
      certMatlabSymbolicDesc: "MathWorks certifikát - kurz zameraný na symbolickú matematiku a algebraické operácie v MATLAB.",
      
      certMatlabOnrampTitle: "MATLAB Onramp",
      certMatlabOnrampDesc: "MathWorks certifikát - úvodný kurz do MATLAB s praktickými cvičeniami a základnými konceptami.",
      
      certMatlabSimulinkTitle: "Simulink Onramp",
      certMatlabSimulinkDesc: "MathWorks certifikát - úvodný kurz do Simulink simulačného prostredia a modelovania systémov.",
      
      certElementsOfAiTitle: "Elements of AI",
      certElementsOfAiDesc: "Bezplatný kurz zameraný na základy umelej inteligencie a strojového učenia s praktickými príkladmi.",
      
      certIoTDigitalTitle: "Introduction to IoT and Digital Transformation",
      certIoTDigitalDesc: "Kurz zameraný na úvod do IoT technológií a digitálnej transformácie s praktickými aplikáciami.",
      
      viewCert: "Zobraziť certifikát",

      educationTitle: "Vzdelanie",

    universityWhen: "2024 – súčasnosť\n2. ročník",
    universitySchool:
      "Technická univerzita v Košiciach • Fakulta elektrotechniky a informatiky",
    universityField: "Odbor: Umelá inteligencia",
    university1:
      "Štúdium zamerané na umelú inteligenciu, algoritmy, programovanie a technické projekty",
    university2:
      "Praktické školské projekty z oblastí AI/ML, neurónových sietí, dát a softvérových implementácií",

    secondaryWhen: "2018 – 2022",
    secondarySchool:
      "Stredná priemyselná škola technická • Spišská Nová Ves",
    secondaryField:
      "Odbor: Programovanie CNC systémov a grafické systémy",
    secondary1:
      "Technické štúdium so zameraním na programovanie CNC systémov, technickú dokumentáciu a grafické systémy",
    secondary2:
      "Základ pre ďalšie štúdium technických, softvérových a inžinierskych oblastí",

      contactTitle: "Kontakt",
      contactIntro:
        "V prípade spolupráce, stáže alebo technického projektu ma môžeš kontaktovať cez email alebo GitHub.",

      linksTitle: "Odkazy",
      linkedinContact: "bude doplnený",

      formTitle: "Kontaktný formulár",
      formName: "Meno",
      formNamePh: "Tvoje meno",
      formEmailPh: "tvoj@email.sk",
      formSubject: "Predmet",
      formSubjectPh: "Krátky predmet",
      formMessage: "Správa",
      formMessagePh: "Napíš správu...",
      sendBtn: "Odoslať",

      formSending: "Odosielam správu...",
      formSendingButton: "Odosielam...",
      formSuccess: "Správa bola úspešne odoslaná.",
      formError:
        "Správu sa nepodarilo odoslať. Skús to znova alebo ma kontaktuj priamo cez email.",

      footerText:
        "Osobné portfólio • Umelá inteligencia & vývoj softvéru",
    },

    en: {
      metaTitle: "Martin Šulák • AI Student • Portfolio",
      metaDescription:
        "Personal portfolio of Martin Šulák — Artificial Intelligence student focused on software development, AI/ML projects, control systems, IoT, and modern web technologies.",

      skip: "Skip to content",

      navAria: "Main navigation",
      openNav: "Open navigation",
      quickInfo: "Quick information",
      techStackAria: "Technology stack",
      stackEyebrow: "Tech stack",
      stackIntro: "Tools I use across web, AI/ML, and engineering projects.",
      langBtnAria: "Switch to Slovak",
      themeAria: "Switch theme",

      brandRole: "AI Student • Developer • Engineering",

      navProfile: "Profile",
      navSkills: "Skills",
      navProjects: "Projects",
      navEducation: "Education",
      navCerts: "Certifications",
      navContact: "Contact",

      themeBtn: "Theme",
      printBtn: "Print / PDF",

      heroPill: "Artificial Intelligence • Software Development • Engineering",
      heroSubtitle: "Artificial Intelligence Student • FEI TUKE",
      heroLead:
        "I focus on practical technical projects across software development, artificial intelligence, machine learning, control systems, and modern web technologies. I combine academic knowledge with hands-on implementation through personal and academic projects.",

      quickContact: "Contact",
      quickProjects: "Projects",
      quickSkills: "Skills",

      portfolioLink: "Portfolio",
      linkedinSoon: "LinkedIn will be added",

      kpiWeb: "web apps",
      kpiAi: "academic projects",
      kpiSystems: "control & simulations",

      focusTitle: "Focus",
      focus1: "Modern frontend and responsive user interfaces",
      focus2: "AI/ML experiments, data and technical documentation",
      focus3: "Control systems, simulations and engineering projects",

      profileTitle: "Profile",
      profileText:
        "I study Artificial Intelligence at the Faculty of Electrical Engineering and Informatics, Technical University of Košice. I focus on web development, AI/ML projects, control systems and IoT. My goal is to build technical projects with practical value while developing my software and engineering skills.",

      strengthsTitle: "Strengths",
      strength1: "Fast orientation in technical problems and independent work",
      strength2: "Attention to detail, modern visual design and UX",
      strength3: "Consistency in debugging, version control and documentation",

      areasTitle: "Areas of Interest",
      areasNote:
        "This profile is continuously expanded through new projects, academic assignments and technologies.",

      skillsTitle: "Skills",
      skillsHint: "Search highlights relevant technologies and tags.",
      skillPlaceholder: "Search e.g. JavaScript, Git, ML...",

      frontendText:
        "Modern interfaces, responsive layouts, animations and user experience.",
      aimlText:
        "Data preparation, modelling, metric evaluation and academic experiments.",
      engineeringTitle: "Engineering",
      engineeringText:
        "Control systems, simulations, IoT solutions, version control and technical documentation.",

      projectsTitle: "Projects",
      projectsIntro:
        "Selected projects and repositories. Some are available directly in this portfolio, while others have their own repository or public live link.",

      ppautoDesc:
        "Automotive dealership web project with modern design, brand presentation, stock vehicles and contact features.",
      ppauto1: "Modern web design and responsive interface",
      ppauto2: "Presentation of vehicles, brands and services",
      ppauto3: "Live project outside this repository",

      autoskolaDesc:
        "Website project for a driving school in Spišská Nová Ves with public presentation of services, courses and contact information.",
      autoskola1: "Presentation website for a local service",
      autoskola2: "Frontend, public content and basic dynamic functionality",
      autoskola3: "Separate repository and live website",

      fuelyDesc:
        "Web application for calculating fuel costs and practical comparison of car travel expenses.",
      fuely1: "React application with a clean user interface",
      fuely2: "Calculations, forms and input validation",
      fuely3: "Separate repository and live demo",

      desktopWidgetDesc:
        "Commercial Windows app for pinning interactive web content directly on the desktop as movable and layered widgets.",
      desktopWidget1: "Multiple widgets with their own URL, opacity and layer",
      desktopWidget2: "Snapping, guide lines and an external edit panel",
      desktopWidget3: "Available on Gumroad, Microsoft Store coming soon",
      desktopWidgetBuyGumroad: "Buy on Gumroad",

      stressTitle: "Speech Stress Detection",
      stressDesc:
        "Neural network project focused on stress detection from speech data using neural networks and audio-based features.",
      stress1: "Dataset processing and input preparation",
      stress2: "Neural network experiments and metrics",
      stress3: "Team academic project",

      uavTitle: "UAV Control System",
      uavDesc:
        "Control systems project focused on UAV simulation, fuzzy control and MATLAB/Simulink experiments.",
      uav1: "MATLAB/Simulink simulation workflow",
      uav2: "Fuzzy logic controller and optimization",
      uav3: "Available in the portfolio repository",

      mlTitle: "Machine Learning Project",
      mlDesc:
        "Academic machine learning project and experiments focused on model implementation, evaluation and practical understanding of ML workflows.",
      ml1: "Python-based machine learning implementation",
      ml2: "Dataset processing and model evaluation",
      ml3: "Available in the portfolio repository",

      academicTitle: "Academic Assignments",
      academicDesc:
        "School projects, technical reports, experiments and documentation created during my Artificial Intelligence studies.",
      academic1: "AI, ML and programming assignments",
      academic2: "Reports, documentation and experiments",
      academic3: "Continuously expanded during studies",

      availablePortfolio: "Available in the portfolio repository",
      availablePortfolio2: "Available in the portfolio repository",
      availableRepo: "Available in repository folders",

      educationTitle: "Education",

universityWhen: "2024 – present\n2nd year",
universitySchool:
  "Technical University of Košice • Faculty of Electrical Engineering and Informatics",
universityField: "Field of study: Artificial Intelligence",
university1:
  "Studies focused on artificial intelligence, algorithms, programming and technical projects",
university2:
  "Practical academic projects in AI/ML, neural networks, data and software implementations",

secondaryWhen: "2018 – 2022",
secondarySchool:
  "Secondary Technical School • Spišská Nová Ves",
secondaryField:
  "Field of study: CNC Systems Programming and Graphic Systems",
secondary1:
  "Technical education focused on CNC systems programming, technical documentation and graphic systems",
secondary2:
  "Foundation for further study in technical, software and engineering-oriented fields",

      contactTitle: "Contact",
      contactIntro:
        "For collaboration, internships or technical projects, you can contact me by email or through GitHub.",

      linksTitle: "Links",
      linkedinContact: "to be added",

      certsTitle: "Certifications",
      certsText: "Certifications and completed courses are available in the repository. This section will gradually expand with new courses and learning materials.",
      certDataCampTitlePython: "Introduction to Python",
      certDataCampDescPython: "Comprehensive course focused on Python programming fundamentals with practical exercises and projects.",
      certDataCampTitleJavaIntro: "Introduction to Java",
      certDataCampDescJavaIntro: "Comprehensive course focused on Java programming fundamentals with practical exercises and projects.",
      certDataCampTitleJavaInter: "Intermediate Java",
      certDataCampDescJavaInter: "Advanced Java programming course focused on intermediate topics with practical exercises and projects.",
      
      certCodexJavaTitle: "Java",
      certCodexJavaDesc: "Collection of courses from Codédex focused on learning Java programming. Note: I was unable to obtain a certificate through the GitHub Student Developer Pack because completing projects and issuing certificates requires their paid account. The image is a screenshot from completed course sections.",
      
      certMatlabControlTitle: "Control Design Onramp",
      certMatlabControlDesc: "MathWorks certification - introductory course focused on control system design fundamentals in MATLAB environment.",
      
      certCiscoIoTTitle: "Introduction to IoT",
      certCiscoIoTDesc: "Cisco certification - course focused on IoT technologies, networking protocols, and practical applications.",

      certMatlabSymbolicTitle: "Introduction to Symbolic Math",
      certMatlabSymbolicDesc: "MathWorks certification - course focused on symbolic mathematics and algebraic operations in MATLAB.",
      
      certMatlabOnrampTitle: "MATLAB Onramp",
      certMatlabOnrampDesc: "MathWorks certification - introductory course to MATLAB with practical exercises and fundamental concepts.",
      
      certMatlabSimulinkTitle: "Simulink Onramp",
      certMatlabSimulinkDesc: "MathWorks certification - introductory course to Simulink simulation environment and system modeling.",
      
      certElementsOfAiTitle: "Elements of AI",
      certElementsOfAiDesc: "Free course focused on artificial intelligence fundamentals and machine learning with practical examples.",
      
      certIoTDigitalTitle: "Introduction to IoT and Digital Transformation",
      certIoTDigitalDesc: "Course focused on IoT technologies introduction and digital transformation with practical applications.",
      
      viewCert: "View Certificate",

      formTitle: "Contact Form",
      formName: "Name",
      formNamePh: "Your name",
      formEmailPh: "your@email.com",
      formSubject: "Subject",
      formSubjectPh: "Short subject",
      formMessage: "Message",
      formMessagePh: "Write your message...",
      sendBtn: "Send",

      formSending: "Sending message...",
      formSendingButton: "Sending...",
      formSuccess: "Message sent successfully.",
      formError:
        "The message could not be sent. Try again or contact me directly by email.",

      footerText:
        "Personal Portfolio • Artificial Intelligence & Software Development",
    },
  };

  const staticTextTranslations = {
    "Web Development": {
      sk: "Web Development",
      en: "Web Development",
    },
    "Artificial Intelligence": {
      sk: "Umelá inteligencia",
      en: "Artificial Intelligence",
    },
    "Machine Learning": {
      sk: "Strojové učenie",
      en: "Machine Learning",
    },
    "Control Systems": {
      sk: "Riadiace systémy",
      en: "Control Systems",
    },
    "IoT": {
      sk: "IoT",
      en: "IoT",
    },
    "Certificates": {
      sk: "Certifikáty",
      en: "Certificates",
    },
    "Completed Courses": {
      sk: "Absolvované kurzy",
      en: "Completed Courses",
    },
    "Learning Materials": {
      sk: "Študijné materiály",
      en: "Learning Materials",
    },
    "Repository Documentation": {
      sk: "Dokumentácia v repozitári",
      en: "Repository Documentation",
    },
    "GitHub Repository": {
      sk: "GitHub repozitár",
      en: "GitHub Repository",
    },
    "Live Demo": {
      sk: "Live demo",
      en: "Live Demo",
    },
    "Control": {
      sk: "Riadenie",
      en: "Control",
    },
    "Study": {
      sk: "Štúdium",
      en: "Study",
    },
  };

  const getCurrentLanguage = () => {
    return localStorage.getItem("portfolio.lang") || "sk";
  };

  const setMetaContent = (selector, content) => {
    const element = document.querySelector(selector);
    if (element && content) {
      element.setAttribute("content", content);
    }
  };

  const applyTextTranslations = (lang) => {
    const dict = translations[lang] || translations.sk;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");

      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        element.textContent = dict[key];
      }
    });
  };

  const applyAttributeTranslations = (lang) => {
    const dict = translations[lang] || translations.sk;

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const attrConfig = element.getAttribute("data-i18n-attr");

      if (!attrConfig) return;

      const pairs = attrConfig.split(",").map((pair) => pair.trim());

      pairs.forEach((pair) => {
        const [attributeName, key] = pair.split(":").map((part) => part.trim());

        if (!attributeName || !key) return;

        if (Object.prototype.hasOwnProperty.call(dict, key)) {
          element.setAttribute(attributeName, dict[key]);
        }
      });
    });
  };

  const applyLegacyPlaceholderTranslations = (lang) => {
    const dict = translations[lang] || translations.sk;

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");

      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        element.setAttribute("placeholder", dict[key]);
      }
    });
  };

  const applyStaticTextTranslations = (lang) => {
    const elements = document.querySelectorAll(
      ".tag, .badge, .project-links .link"
    );

    elements.forEach((element) => {
      if (!element.dataset.staticI18nOriginal) {
        element.dataset.staticI18nOriginal = element.textContent.trim();
      }

      const original = element.dataset.staticI18nOriginal;
      const translated = staticTextTranslations[original];

      if (translated && translated[lang]) {
        element.textContent = translated[lang];
      }
    });
  };

  const applyLineBreaks = () => {
    document.querySelectorAll(".t-when").forEach((element) => {
      element.innerHTML = element.textContent.replace(/\n/g, "<br>");
    });
  };

  const applyLanguage = (lang) => {
    const dict = translations[lang] || translations.sk;

    document.documentElement.lang = lang;
    document.title = dict.metaTitle;
    setMetaContent('meta[name="description"]', dict.metaDescription);

    applyTextTranslations(lang);
    applyAttributeTranslations(lang);
    applyLegacyPlaceholderTranslations(lang);
    applyStaticTextTranslations(lang);
    applyLineBreaks();

    if (langBtn) {
      langBtn.textContent = lang === "sk" ? "EN" : "SK";
      langBtn.setAttribute("aria-label", dict.langBtnAria);
    }

    localStorage.setItem("portfolio.lang", lang);
  };

  const savedLanguage = getCurrentLanguage();
  applyLanguage(savedLanguage);

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const currentLanguage = getCurrentLanguage();
      const nextLanguage = currentLanguage === "sk" ? "en" : "sk";
      applyLanguage(nextLanguage);
    });
  }

  const savedTheme = localStorage.getItem("portfolio.theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio.theme", nextTheme);
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -32px 0px",
      }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("visible");
    });
  }

  const handleScroll = () => {
    if (topbar) {
      topbar.classList.toggle("scrolled", window.scrollY > 24);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (navToggle && mainNav && topbar) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (!topbar.contains(event.target)) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (version) {
    version.textContent = APP_VERSION;
  }

  if (skillSearch) {
    skillSearch.addEventListener("input", () => {
      const query = skillSearch.value.trim().toLowerCase();
      const tags = document.querySelectorAll("[data-skill]");

      tags.forEach((tag) => {
        const skill = tag.getAttribute("data-skill") || "";
        const visibleText = tag.textContent || "";
        const searchable = `${skill} ${visibleText}`.toLowerCase();

        tag.classList.remove("highlight", "dim");

        if (!query) return;

        if (searchable.includes(query)) {
          tag.classList.add("highlight");
        } else {
          tag.classList.add("dim");
        }
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const activeLanguage = getCurrentLanguage();
      const dict = translations[activeLanguage] || translations.sk;
      const formData = new FormData(contactForm);

      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.textContent = dict.formSendingButton;
      }

      if (formStatus) {
        formStatus.textContent = dict.formSending;
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Form submit failed with status ${response.status}`);
        }

        contactForm.reset();

        if (formStatus) {
          formStatus.textContent = dict.formSuccess;
        }
      } catch (error) {
        if (formStatus) {
          formStatus.textContent = dict.formError;
        }
      } finally {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.textContent = dict.sendBtn;
        }
      }
    });
  }
});
