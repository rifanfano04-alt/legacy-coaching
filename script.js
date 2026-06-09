// ===== Toujours démarrer en haut (sauf lien avec ancre #) =====
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
function legacyScrollTop() { if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
legacyScrollTop();
window.addEventListener('DOMContentLoaded', legacyScrollTop);
window.addEventListener('load', legacyScrollTop);

// ===== Année footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Menu mobile =====
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
// Ferme le menu après clic sur un lien
menu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  })
);

// ===== Compteurs animés du hero =====
const counters = document.querySelectorAll('.stat-num');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animate = el => {
  const target = +el.dataset.count;
  if (prefersReducedMotion) { el.textContent = target; return; }
  const dur = 1400;
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
counters.forEach(c => io.observe(c));

// ===== Révélation au scroll =====
const revealEls = document.querySelectorAll('.card, .step, .about-media, .about-text, .tool-form');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const revealIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => revealIO.observe(el));
}

// ===== Effets au scroll : header collant + parallax du hero (1 seul handler, rAF) =====
(() => {
  const header = document.querySelector('.header');
  const heroBg = document.querySelector('.hero-bg');
  const fab = document.querySelector('.fab');
  const canParallax = !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches;
  let ticking = false, scrolled = false, contactInView = false;

  // Masquer le bouton flottant quand le formulaire de contact est visible
  const contactSection = document.getElementById('contact');
  if (fab && contactSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      contactInView = entries[0].isIntersecting;
      update();
    }, { threshold: 0.06 }).observe(contactSection);
  }

  const update = () => {
    const y = window.scrollY;
    const isScrolled = y > 12;
    if (header && isScrolled !== scrolled) { header.classList.toggle('scrolled', isScrolled); scrolled = isScrolled; }
    if (canParallax && heroBg && y < window.innerHeight) {
      heroBg.style.setProperty('--py', (y * 0.16).toFixed(1) + 'px');
    }
    if (fab) {
      const pastHero = y > window.innerHeight * 0.55;
      fab.classList.toggle('show', pastHero && !contactInView);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// ===== Calculateur 1RM (Epley) =====
const rmForm = document.getElementById('rmForm');
const rmResult = document.getElementById('rmResult');
rmForm.addEventListener('submit', e => {
  e.preventDefault();
  const w = parseFloat(document.getElementById('weight').value);
  const r = parseInt(document.getElementById('reps').value, 10);
  if (!w || !r || w <= 0 || r <= 0) return;

  // Epley : 1RM = poids * (1 + reps/30)
  const oneRm = w * (1 + r / 30);
  document.getElementById('oneRm').textContent = oneRm.toFixed(1);

  const rows = [
    [95, 'Force max (1-3 reps)'],
    [85, 'Force (3-5 reps)'],
    [75, 'Hypertrophie lourde (6-8)'],
    [65, 'Volume / technique (10-12)'],
    [50, 'Échauffement / récup'],
  ];
  const tbody = document.getElementById('rmRows');
  tbody.innerHTML = rows.map(([pct, goal]) =>
    `<tr><td>${pct}%</td><td>${(oneRm * pct / 100).toFixed(1)} kg</td><td>${goal}</td></tr>`
  ).join('');
  rmResult.hidden = false;
});

// ===== Pré-remplissage offre depuis les boutons pricing =====
document.querySelectorAll('[data-offre]').forEach(btn => {
  btn.addEventListener('click', () => {
    const sel = document.getElementById('offre');
    if (sel) sel.value = btn.dataset.offre;
  });
});

// ===== Validation + envoi formulaire de contact =====
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
// Endpoint Formspree : colle ici l'URL du type https://formspree.io/f/xxxxxxx
// Tant que c'est vide, le formulaire ouvre le client mail (repli).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkoarvdg';

form.addEventListener('submit', async e => {
  e.preventDefault();
  feedback.className = 'form-feedback';
  feedback.textContent = '';

  const name = document.getElementById('name');
  const contact = document.getElementById('joindre');
  let valid = true;

  // Nom + moyen de contact (Instagram ou téléphone) obligatoires
  [name, contact].forEach(input => {
    const field = input.closest('.field');
    const ok = input.value.trim() !== '';
    field.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    feedback.classList.add('err');
    feedback.textContent = 'Indique ton nom et un moyen de te contacter (Instagram ou téléphone).';
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');

  // 1) Envoi direct dans la boîte mail (Formspree, sans ouvrir le client mail)
  if (FORMSPREE_ENDPOINT) {
    const label = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi…';
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        feedback.classList.add('ok');
        feedback.textContent = 'Merci ! Ta demande est envoyée, je te recontacte sous 48h.';
        form.reset();
      } else {
        const d = await res.json().catch(() => ({}));
        feedback.classList.add('err');
        feedback.textContent = (d.errors && d.errors[0] && d.errors[0].message) || 'Envoi impossible pour le moment. Réessaie ou écris-moi en DM Instagram.';
      }
    } catch {
      feedback.classList.add('err');
      feedback.textContent = 'Connexion impossible. Réessaie ou écris-moi en DM Instagram.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    }
    return;
  }

  // 2) Repli sans backend : ouvre le client mail pré-rempli
  const data = {
    name: name.value.trim(),
    contact: contact.value.trim(),
    discipline: document.getElementById('discipline').value,
    offre: document.getElementById('offre').value,
    message: document.getElementById('message').value.trim(),
  };
  const subject = encodeURIComponent(`Demande d'appel découverte : ${data.offre} (${data.discipline})`);
  const body = encodeURIComponent(
    `Bonjour Richard,\n\nJe souhaite réserver un appel découverte.\n\n` +
    `Nom : ${data.name}\nMe contacter (Instagram ou téléphone) : ${data.contact}\n` +
    `Discipline : ${data.discipline}\nFormule : ${data.offre}\n\n` +
    `Mon objectif :\n${data.message || '(non précisé)'}\n`
  );
  window.location.href = `mailto:rifanfano04@gmail.com?subject=${subject}&body=${body}`;
  feedback.classList.add('ok');
  feedback.textContent = 'Demande prête ! Ton client mail s\'ouvre, il ne reste qu\'à envoyer.';
  form.reset();
});
