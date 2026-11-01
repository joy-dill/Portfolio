/* ── Scroll Reveal ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── Active nav link : la section qui traverse le milieu de l'écran (marche aussi pour les sections très longues) ── */
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
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navIO.observe(s));

/* ── Codes de compétences du BTS SIO : couleur par bloc + intitulé au survol ── */
const COMPETENCES = {
  'B1.1': 'Gérer le patrimoine informatique',
  'B1.2': "Répondre aux incidents et aux demandes d'assistance et d'évolution",
  'B1.3': "Développer la présence en ligne de l'organisation",
  'B1.4': 'Travailler en mode projet',
  'B1.5': 'Mettre à disposition des utilisateurs un service informatique',
  'B1.6': 'Organiser son développement professionnel',
  'B2.1': "Concevoir une solution d'infrastructure réseau",
  'B2.2': "Installer, tester et déployer une solution d'infrastructure réseau",
  'B2.3': "Exploiter, dépanner et superviser une solution d'infrastructure réseau",
  'B3.1': 'Protéger les données à caractère personnel',
  'B3.2': "Préserver l'identité numérique de l'organisation",
  'B3.3': 'Sécuriser les équipements et les usages des utilisateurs',
  'B3.4': 'Garantir la disponibilité, l\'intégrité et la confidentialité des services et des données',
  'B3.5': "Assurer la cybersécurité d'une infrastructure réseau, d'un système et d'un service"
};
document.querySelectorAll('.code').forEach(c => {
  const k = c.textContent.trim();
  if (COMPETENCES[k]) { c.title = `${k} — ${COMPETENCES[k]}`; c.classList.add('b' + k[1]); }
});

/* ── Fenêtre de détail des projets ── */
const modal = document.getElementById('proj-modal');
const pm    = id => document.getElementById(id);

document.querySelectorAll('.btn-detail').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.proj-card');
    const txt  = sel => card.querySelector(sel).textContent;
    pm('pm-num').textContent   = txt('.proj-num');
    pm('pm-cat').textContent   = txt('.proj-cat');
    pm('pm-ctx').textContent   = txt('.proj-ctx');
    pm('pm-title').textContent = txt('h3');
    pm('pm-desc').textContent  = txt('.proj-desc');
    pm('pm-detail').innerHTML  = card.querySelector('.proj-detail').innerHTML;
    pm('pm-tools').innerHTML   = card.querySelector('.tags').innerHTML;
    pm('pm-codes').innerHTML   = [...card.querySelectorAll('.proj-codes .code')].map(c => {
      const k = c.textContent.trim();
      return `<li><span class="code b${k[1]}">${k}</span><span>${COMPETENCES[k] || ''}</span></li>`;
    }).join('');
    modal.showModal();
    document.body.classList.add('modal-open');
    modal.scrollTop = 0;
  });
});
modal.querySelector('.pm-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => {   // clic à côté de la fenêtre (sur le fond assombri)
  const r = modal.getBoundingClientRect();
  const dehors = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (e.target === modal && dehors) modal.close();
});
modal.addEventListener('close', () => document.body.classList.remove('modal-open'));

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
    status.textContent = 'Merci, votre message a bien été envoyé. Je vous répondrai dans les plus brefs délais.';
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
