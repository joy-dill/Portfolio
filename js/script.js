/* ── Scroll Reveal ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Active nav link ── */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-link');
const navIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navIO.observe(s));

/* ── Mobile nav ── */
function toggleNav() {
  document.getElementById('sidebar').classList.toggle('open');
}
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });
});

/* ── Form : ouvre la messagerie du visiteur avec le message pré-rempli ── */
const CONTACT_EMAIL = 'dillensegerjoey@gmail.com';

function sendMsg(e) {
  e.preventDefault();
  const nom   = document.getElementById('f-nom').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg   = document.getElementById('f-msg').value.trim();
  const sujet = `Contact portfolio — ${nom}`;
  const corps = `${msg}\n\n${nom} (${email})`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

  const btn = e.target.querySelector('.btn-send');
  btn.textContent = '✅ Messagerie ouverte !';
  btn.style.background = 'linear-gradient(135deg, #33FFB8, #3380FF)';
  setTimeout(() => {
    btn.textContent = 'Envoyer le message 🚀';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}
