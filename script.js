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
form.addEventListener('submit', e => {
  e.preventDefault();
  feedback.className = 'form-feedback';
  feedback.textContent = '';

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  let valid = true;

  [name, email].forEach(input => {
    const field = input.closest('.field');
    const ok = input.value.trim() !== '' &&
      (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
    field.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    feedback.classList.add('err');
    feedback.textContent = 'Merci de renseigner un nom et un email valide.';
    return;
  }

  // Récap des données (démo front — à brancher sur un backend/email service)
  const data = {
    name: name.value.trim(),
    email: email.value.trim(),
    discipline: document.getElementById('discipline').value,
    offre: document.getElementById('offre').value,
    message: document.getElementById('message').value.trim(),
  };

  // Ouvre le client mail pré-rempli (solution sans backend)
  const subject = encodeURIComponent(`Demande de coaching — ${data.offre} (${data.discipline})`);
  const body = encodeURIComponent(
    `Bonjour Richard,\n\nJe souhaite démarrer un suivi.\n\n` +
    `Nom : ${data.name}\nEmail : ${data.email}\n` +
    `Discipline : ${data.discipline}\nOffre : ${data.offre}\n\n` +
    `Objectif :\n${data.message || '(non précisé)'}\n`
  );
  window.location.href = `mailto:contact@legacy-coaching.fr?subject=${subject}&body=${body}`;

  feedback.classList.add('ok');
  feedback.textContent = 'Demande prête ! Ton client mail s\'ouvre — il ne reste qu\'à envoyer.';
  form.reset();
});
