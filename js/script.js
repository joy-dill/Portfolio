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

/* ── Form : envoi direct par Web3Forms (le message arrive dans la boîte Gmail) ── */
const CONTACT_EMAIL   = 'dillensegerjoey@gmail.com';
const WEB3FORMS_KEY   = '0ada8704-04c5-423e-a15a-f6083e0183e0';
const BTN_LABEL       = 'Envoyer le message 🚀';

async function sendMsg(e) {
  e.preventDefault();
  const form   = e.target;
  const btn    = form.querySelector('.btn-send');
  const status = document.getElementById('f-status');
  const nom    = document.getElementById('f-nom').value.trim();

  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';
  status.textContent = '';
  status.className = 'form-status';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject:    `Contact portfolio — ${nom}`,
        from_name:  'Portfolio Joey Dillenseger',
        name:       nom,
        email:      document.getElementById('f-email').value.trim(),
        message:    document.getElementById('f-msg').value.trim(),
        botcheck:   form.querySelector('[name="botcheck"]').checked
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || res.status);

    btn.textContent = '✅ Message envoyé !';
    btn.style.background = 'linear-gradient(135deg, #33FFB8, #3380FF)';
    status.textContent = 'Merci, votre message a bien été envoyé. Je vous répondrai rapidement.';
    status.classList.add('ok');
    form.reset();
  } catch (err) {
    btn.textContent = BTN_LABEL;
    status.innerHTML = `Le message n'a pas pu être envoyé. Vous pouvez m'écrire directement à <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`;
    status.classList.add('err');
  } finally {
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = BTN_LABEL;
      btn.style.background = '';
    }, 4000);
  }
}
