document.documentElement.classList.add('js-enabled');

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !isOpen);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

const revealItems = document.querySelectorAll('.service-card, .step, .value-strip > div');
if ('IntersectionObserver' in window) {
  revealItems.forEach((item) => item.classList.add('reveal'));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
if (contactForm && feedback) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    feedback.classList.remove('error');

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailIsValid || !service || !message) {
      feedback.textContent = !name ? 'Please add your name.' : !emailIsValid ? 'Please enter a valid work email address.' : !service ? 'Please choose a service so we can direct your enquiry.' : 'Please tell us a little about your requirements.';
      feedback.classList.add('error');
      const firstInvalid = !name ? document.getElementById('name') : !emailIsValid ? document.getElementById('email') : !service ? document.getElementById('service') : document.getElementById('message');
      firstInvalid.focus();
      return;
    }

    const company = String(formData.get('company') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const subject = `ACF website enquiry — ${service}`;
    const body = [
      `Hello ACF Solutions,`,
      ``,
      `I would like to enquire about: ${service}`,
      ``,
      `Name: ${name}`,
      `Company: ${company || 'Not provided'}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      ``,
      `Requirements:`,
      message
    ].join('\n');

    feedback.textContent = 'Opening your email app with a prepared enquiry… If it does not open, write to support.helpdesk@acf-solutions.in.';
    window.location.href = `mailto:support.helpdesk@acf-solutions.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
