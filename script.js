(() => {
  const CONFIG = {
    business: 'CityVille Laundromat',
    contactName: 'Alexandria K. Guma',
    phone: '+256764002097',
    phone2: '+256709706031',
    direct: '+256702723070',
    email: 'akg@cityvillelaundromat.com',
    website: 'https://cityvillelaundromat.com/',
    address: 'Mutungo Hill Junction / Church Road, Kitintale, Kampala, Uganda'
  };

  const BRANCHES = {
    kitintale: {
      name: 'CityVille Laundromat — Kitintale',
      address: 'Mutungo Hill Junction / Church Road, Kitintale, Kampala',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.757802248595!2d32.633898374964716!3d0.3155761996813276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbf3f3435494b%3A0xf1de012e125fe2d!2sCityVille+Laundromat!5e0!3m2!1sen!2ske!4v1700149034921!5m2!1sen!2ske',
      directions: 'https://www.google.com/maps/dir/?api=1&destination=0.3155761996813276%2C32.633898374964716&destination_place_id=ChIJS0k1ND-_fRcRLf4l4RLgHQ8'
    },
    naalya: {
      name: 'CityVille Laundromat — Naalya',
      address: 'Metroplex Shopping Centre, Naalya, Kampala',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.736249091345!2d32.6330556!3d0.36749999999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177db9f40f689413%3A0xae7ffd566351f185!2sMetroplex+Shopping+Centre!5e0!3m2!1sen!2ske!4v1776762363431!5m2!1sen!2ske',
      directions: 'https://www.google.com/maps/dir/?api=1&destination=Metroplex+Shopping+Centre%2C+Naalya%2C+Kampala%2C+Uganda'
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  window.addEventListener('load', () => {
    window.setTimeout(() => $('#loader')?.classList.add('done'), 2850);
  });

  window.addEventListener('scroll', () => {
    $('.topbar')?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('visible'));
  }

  const map = $('#branch-map');
  const branchName = $('#branch-name');
  const branchAddress = $('#branch-address');
  const directionsLink = $('#directions-link');

  function setBranch(key) {
    const branch = BRANCHES[key] || BRANCHES.kitintale;
    if (map) map.src = branch.map;
    if (branchName) branchName.textContent = branch.name;
    if (branchAddress) branchAddress.textContent = branch.address;
    if (directionsLink) directionsLink.href = branch.directions;
    $$('.branch-tab').forEach((tab) => {
      const active = tab.dataset.branch === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  $$('.branch-tab').forEach((tab) => tab.addEventListener('click', () => setBranch(tab.dataset.branch)));
  setBranch('kitintale');

  let toastTimer;
  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 2400);
  }

  function saveContact() {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Guma;Alexandria K.;;;',
      `FN:${CONFIG.business}`,
      `ORG:${CONFIG.business}`,
      'TITLE:Managing Director',
      `TEL;TYPE=CELL:${CONFIG.direct}`,
      `TEL;TYPE=WORK:${CONFIG.phone}`,
      `TEL;TYPE=WORK:${CONFIG.phone2}`,
      `EMAIL;TYPE=WORK:${CONFIG.email}`,
      `URL:${CONFIG.website}`,
      `ADR;TYPE=WORK:;;${CONFIG.address};;;;`,
      'NOTE:Delivering Freshness! Same-day wash, dry and fold services in Kampala.',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CityVille-Laundromat.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('Contact card ready to save');
  }

  function profileUrl() {
    return window.location.href.split('#')[0];
  }

  function renderQr(target, size) {
    if (!target || target.dataset.ready === 'true') return;
    if (typeof QRCode === 'undefined') {
      setTimeout(() => renderQr(target, size), 120);
      return;
    }
    target.innerHTML = '';
    new QRCode(target, {
      text: profileUrl(),
      width: size,
      height: size,
      colorDark: '#071924',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    target.dataset.ready = 'true';
  }

  function openQr() {
    const modal = $('#qr-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderQr($('#qr-large'), 228);
  }

  function closeQr() {
    const modal = $('#qr-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  async function shareProfile() {
    const data = {
      title: 'CityVille Laundromat',
      text: 'CityVille Laundromat — Delivering Freshness! View contacts, prices, branches and directions.',
      url: profileUrl()
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(data.url);
        toast('Profile link copied');
      } else {
        window.prompt('Copy this profile link:', data.url);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') toast('Unable to share right now');
    }
  }

  $$('[data-action]').forEach((el) => {
    el.addEventListener('click', () => {
      const action = el.dataset.action;
      if (action === 'save-contact') saveContact();
      if (action === 'show-qr') openQr();
      if (action === 'close-qr') closeQr();
      if (action === 'share') shareProfile();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeQr();
  });

  const startQr = () => renderQr($('#qr-inline'), 176);
  if (document.readyState === 'complete') startQr(); else window.addEventListener('load', startQr);
  if ($('#year')) $('#year').textContent = new Date().getFullYear();
})();
