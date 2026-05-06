window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Z09CQZZVHQ');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    
    const topbar = document.getElementById('topbar');
    const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });

    
    const navToggle = document.getElementById('navToggle');
    const mainNav   = document.getElementById('mainNav');
    if (navToggle && mainNav) {
      navToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });

      mainNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', (e) => {
        if (!topbar.contains(e.target)) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
