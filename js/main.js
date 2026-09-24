/* ============================================================
   ACERONOVA — MAIN SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. HEADER CON SCROLL
     ========================================================== */
  const header = document.getElementById('header');

  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ==========================================================
     2. MENÚ MÓVIL
     ========================================================== */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Dropdowns dentro del menú móvil
    document.querySelectorAll('.header__item--has-dropdown').forEach(item => {
      const link = item.querySelector('.header__link');
      if (!link) return;

      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('is-open');
        }
      });
    });

    // Cerrar menú al hacer clic en un enlace
    nav.querySelectorAll('a:not(.header__link)').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          nav.classList.remove('is-open');
          navToggle.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Cerrar menú al redimensionar
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }


  /* ==========================================================
     3. HERO — Pausa del vídeo
     ========================================================== */
  const heroVideo = document.querySelector('.hero__video');

  if (heroVideo) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heroVideo.pause();
      } else {
        heroVideo.play().catch(() => {});
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(heroVideo);
  }


  /* ==========================================================
     4. HERO — Parallax sutil
     ========================================================== */
  const hero = document.getElementById('hero');
  let ticking = false;

  if (hero) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            const heroVideo = hero.querySelector('.hero__video');
            const heroContent = hero.querySelector('.hero__content');

            if (heroVideo) {
              heroVideo.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
            }
            if (heroContent) {
              heroContent.style.transform = `translateY(${scrollY * 0.08}px)`;
              heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ==========================================================
     5. SCROLL REVEAL — Elementos aparecen al entrar en viewport
     ========================================================== */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {

    // Elementos a revelar con delay escalonado
    const revealSelectors = [
      // Bloque 3 — Trust
      { sel: '.trust__certs-inner', delay: 0 },
      { sel: '.trust__sectors-head', delay: 0 },

      // Bloque 4 — Soluciones
      { sel: '.solutions__head-left', delay: 0 },
      { sel: '.solutions__head-right', delay: 100 },
      { sel: '.sol-card', delay: 0, stagger: 100 },

      // Bloque 5 — Capacidades
      { sel: '.capabilities__head', delay: 0 },
      { sel: '.cap-item', delay: 0, stagger: 80 },
      { sel: '.process__head', delay: 0 },
      { sel: '.process__step', delay: 0, stagger: 70 },
      { sel: '.cap-cta', delay: 0 },

      // Bloque 6 — Proyectos
      { sel: '.projects__head', delay: 0 },
      { sel: '.project-featured', delay: 0 },
      { sel: '.project-card', delay: 0, stagger: 100 },
      { sel: '.projects__foot', delay: 0 },

      // Bloque 7 — Sostenibilidad
      { sel: '.sustainability__head', delay: 0 },
      { sel: '.sus-metric', delay: 0, stagger: 80 },
      { sel: '.sus-pillar', delay: 0, stagger: 80 },
      { sel: '.sus-roadmap__head', delay: 0 },
      { sel: '.sus-roadmap__step', delay: 0, stagger: 100 },
      { sel: '.sus-cta', delay: 0 },

      // Bloque 8 — Contacto + Footer
      { sel: '.contact__intro', delay: 0 },
      { sel: '.contact__form', delay: 100 },
      { sel: '.footer__main', delay: 0 },
      { sel: '.footer__legal', delay: 0 },
    ];

    // Preparamos cada elemento con su estado inicial + delay
    revealSelectors.forEach(({ sel, delay, stagger }) => {
      const elements = document.querySelectorAll(sel);

      elements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.setProperty('--reveal-delay', `${delay + (stagger ? index * stagger : 0)}ms`);
      });
    });

    // Observer que dispara la animación cuando entra en viewport
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          obs.unobserve(entry.target); // Solo se anima una vez
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -80px 0px', // Se activa un poco antes de que entre del todo
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }


  /* ==========================================================
     6. CONTADOR ANIMADO — Cifras del hero
     ========================================================== */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0 && 'IntersectionObserver' in window) {

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const duration = 1600;
      const startTime = performance.now();
      const decimals = parseInt(el.dataset.decimals || 0, 10);
      const suffix = el.dataset.suffix || '';

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = target * eased;

        el.textContent = current.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }


  /* ==========================================================
     7. VALIDACIÓN DEL FORMULARIO
     ========================================================== */
  const form = document.querySelector('.contact__form');

  if (form) {

    // --- Funciones de validación ---
    const validators = {
      nombre: (v) => v.trim().length >= 2 || 'Introduce tu nombre completo',
      empresa: (v) => v.trim().length >= 2 || 'Introduce el nombre de tu empresa',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Introduce un email válido',
      sector: (v) => v !== '' || 'Selecciona un sector',
      mensaje: (v) => v.trim().length >= 20 || 'Cuéntanos algo más sobre tu proyecto (mínimo 20 caracteres)',
      privacidad: (v, input) => input.checked || 'Debes aceptar la política de privacidad',
    };

    // --- Mostrar mensaje de error bajo un campo ---
    const showError = (field, message) => {
      clearError(field);

      field.classList.add('form-field--error');

      const error = document.createElement('span');
      error.className = 'form-error';
      error.textContent = message;

      field.appendChild(error);
    };

    // --- Limpiar error de un campo ---
    const clearError = (field) => {
      field.classList.remove('form-field--error');
      const existing = field.querySelector('.form-error');
      if (existing) existing.remove();
    };

    // --- Validar un campo individual ---
    const validateField = (input) => {
      const field = input.closest('.form-field');
      if (!field) return true;

      const name = input.name;
      const validator = validators[name];
      if (!validator) return true;

      const result = validator(input.value, input);

      if (result !== true) {
        showError(field, result);
        return false;
      }

      clearError(field);
      return true;
    };

    // --- Validación en tiempo real (solo si ya tenía error) ---
    form.querySelectorAll('input, select, textarea').forEach(input => {
      // Al perder el foco
      input.addEventListener('blur', () => {
        if (input.value || input.type === 'checkbox') {
          validateField(input);
        }
      });

      // Al escribir, si ya tiene error, lo limpiamos en vivo
      input.addEventListener('input', () => {
        const field = input.closest('.form-field');
        if (field && field.classList.contains('form-field--error')) {
          validateField(input);
        }
      });

      // Para el checkbox, cambio inmediato
      if (input.type === 'checkbox') {
        input.addEventListener('change', () => validateField(input));
      }
    });

    // --- Envío ---
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalid = null;

      form.querySelectorAll('input, select, textarea').forEach(input => {
        const ok = validateField(input);
        if (!ok) {
          isValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!isValid) {
        // Scroll al primer campo con error
        if (firstInvalid) {
          const yOffset = -120;
          const y = firstInvalid.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          firstInvalid.focus({ preventScroll: true });
        }
        return;
      }

      // --- Simulación de envío (aquí iría el fetch al backend) ---
      const submitBtn = form.querySelector('.contact__submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner"></span>
        Enviando...
      `;

      setTimeout(() => {
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10L8 14L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ¡Solicitud enviada!
        `;
        submitBtn.classList.add('is-success');
        form.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.classList.remove('is-success');
        }, 4000);
      }, 1400);
    });
  }


  /* ==========================================================
     8. SMOOTH SCROLL para anclas internas
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
    /* ==========================================================
     9. NAV INTERNA DE PRODUCTO — Highlight activo al hacer scroll
     ========================================================== */
  const productNav = document.getElementById('productNav');

  if (productNav && 'IntersectionObserver' in window) {

    const navLinks = productNav.querySelectorAll('.product-nav__link');
    const sections = Array.from(navLinks).map(link => {
      const id = link.getAttribute('href');
      return id ? document.querySelector(id) : null;
    }).filter(Boolean);

    if (sections.length > 0) {
      const setActive = (id) => {
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      }, {
        rootMargin: '-120px 0px -60% 0px',
        threshold: 0,
      });

      sections.forEach(section => sectionObserver.observe(section));
    }
  }
    /* ==========================================================
     10. CENTRO DE RECURSOS — Filtros, búsqueda y orden
     ========================================================== */
  const resourcesGrid = document.getElementById('resourcesGrid');

  if (resourcesGrid) {

    const cards = Array.from(resourcesGrid.querySelectorAll('.resource-card'));
    const searchInput = document.getElementById('resourceSearch');
    const searchClear = document.getElementById('searchClear');
    const searchWrap = searchInput ? searchInput.closest('.resources-search') : null;
    const resultsCount = document.getElementById('resultsCount');
    const heroCount = document.getElementById('heroCount');
    const emptyState = document.getElementById('emptyState');
    const emptyReset = document.getElementById('emptyReset');
    const clearFilters = document.getElementById('clearFilters');
    const sortSelect = document.getElementById('sortSelect');
    const filterCheckboxes = document.querySelectorAll('.filter-item input[type="checkbox"], .filter-chip input[type="checkbox"]');
    const filterToggle = document.getElementById('filterToggle');
    const filterPanel = document.getElementById('filterPanel');
    const filterBadge = document.getElementById('filterBadge');

    // Guardar el orden original de las cards
    cards.forEach((card, i) => {
      card.dataset.originalIndex = i;
    });

    // ---------- Estado actual de los filtros ----------
    const getActiveFilters = () => {
      const filters = { tipo: [], sector: [], idioma: [] };
      filterCheckboxes.forEach(cb => {
        if (cb.checked) {
          filters[cb.name].push(cb.value);
        }
      });
      return filters;
    };

    // ---------- Aplicar filtros y búsqueda ----------
    const applyFilters = () => {
      const filters = getActiveFilters();
      const query = (searchInput?.value || '').trim().toLowerCase();
      let visibleCount = 0;
      const activeFilterCount =
        filters.tipo.length + filters.sector.length + filters.idioma.length;

      cards.forEach(card => {
        const tipo = card.dataset.tipo || '';
        const sector = card.dataset.sector || '';
        const idioma = card.dataset.idioma || '';
        const title = card.dataset.title || '';
        const textContent = card.textContent.toLowerCase();

        // Coincidencia con filtros (AND entre grupos, OR dentro de cada grupo)
        const matchTipo = filters.tipo.length === 0 || filters.tipo.includes(tipo);
        const matchSector = filters.sector.length === 0 || filters.sector.includes(sector);
        const matchIdioma = filters.idioma.length === 0 || filters.idioma.includes(idioma);

        // Coincidencia con búsqueda
        const matchQuery = !query ||
          title.toLowerCase().includes(query) ||
          textContent.includes(query);

        const visible = matchTipo && matchSector && matchIdioma && matchQuery;

        card.hidden = !visible;
        if (visible) visibleCount++;
      });

      // Actualizar contadores
      if (resultsCount) resultsCount.textContent = visibleCount;
      if (heroCount) heroCount.textContent = cards.length;

      // Mostrar/ocultar estado vacío
      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }

      // Badge de filtros activos
      if (filterBadge) {
        filterBadge.textContent = activeFilterCount;
        filterBadge.classList.toggle('is-active', activeFilterCount > 0);
      }

      // Toggle del clear de búsqueda
      if (searchWrap) {
        searchWrap.classList.toggle('has-value', query.length > 0);
      }
    };

    // ---------- Ordenación ----------
    const applySort = () => {
      if (!sortSelect) return;
      const value = sortSelect.value;
      const sorted = [...cards].sort((a, b) => {
        if (value === 'alfabetico') {
          return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'es');
        }
        if (value === 'tipo') {
          const order = { ficha: 1, certificado: 2, cad: 3, guia: 4 };
          return (order[a.dataset.tipo] || 99) - (order[b.dataset.tipo] || 99);
        }
        // recientes: fecha descendente
        return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      });
      sorted.forEach(card => resourcesGrid.appendChild(card));
    };

    // ---------- Eventos ----------
    filterCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        applySort();
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          applyFilters();
        }
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        applyFilters();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        applySort();
        applyFilters();
      });
    }

    const resetAll = () => {
      filterCheckboxes.forEach(cb => { cb.checked = false; });
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'recientes';
      applySort();
      applyFilters();
    };

    if (clearFilters) clearFilters.addEventListener('click', resetAll);
    if (emptyReset) emptyReset.addEventListener('click', resetAll);

    // Toggle sidebar en móvil
    if (filterToggle && filterPanel) {
      filterToggle.addEventListener('click', () => {
        const isOpen = filterPanel.classList.toggle('is-open');
        filterToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // Inicialización
    applySort();
    applyFilters();
  }

});