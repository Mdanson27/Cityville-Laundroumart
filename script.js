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
      label: 'Kitintale',
      address: 'Mutungo Hill Junction / Church Road, Kampala',
      map: 'https://www.google.com/maps?q=0.3155762,32.6338984&z=17&output=embed',
      directions: 'https://www.google.com/maps/dir/?api=1&destination=0.3155762%2C32.6338984'
    },
    naalya: {
      label: 'Naalya',
      address: 'Metroplex Shopping Centre, Naalya, Kampala',
      map: 'https://www.google.com/maps?q=CityVille+Laundromat+Metroplex+Naalya+Kampala&z=17&output=embed',
      directions: 'https://www.google.com/maps/dir/?api=1&destination=CityVille+Laundromat%2C+Metroplex+Shopping+Centre%2C+Naalya%2C+Kampala%2C+Uganda'
    }
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  let currentBranch = 'kitintale';
  let toastTimer;

  window.addEventListener('load', () => setTimeout(() => $('#loader')?.classList.add('done'), 3100));
  setTimeout(() => $('#loader')?.classList.add('done'), 4600);

  function toast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function setBranch(key) {
    currentBranch = BRANCHES[key] ? key : 'kitintale';
    const b = BRANCHES[currentBranch];
    $('#branch-name').textContent = b.label;
    $('#branch-address').textContent = b.address;
    $('#branch-map').src = b.map;
    $('#directions-link').href = b.directions;
    $$('.branch-toggle button').forEach(btn => btn.classList.toggle('active', btn.dataset.branch === currentBranch));
  }

  function saveContact() {
    const lines = [
      'BEGIN:VCARD','VERSION:3.0','N:Guma;Alexandria K.;;;',
      `FN:${CONFIG.business}`,`ORG:${CONFIG.business}`,
      `TEL;TYPE=CELL:${CONFIG.direct}`,`TEL;TYPE=WORK:${CONFIG.phone}`,`TEL;TYPE=WORK:${CONFIG.phone2}`,
      `EMAIL;TYPE=WORK:${CONFIG.email}`,`URL:${CONFIG.website}`,
      `ADR;TYPE=WORK:;;${CONFIG.address};;;;`,
      'NOTE:Delivering Freshness! CityVille Laundromat — wash, dry and fold services in Kampala.','END:VCARD'
    ];
    const blob = new Blob([lines.join('\r\n')], {type:'text/vcard;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'CityVille-Laundromat.vcf';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    toast('CityVille contact ready to save');
  }

  const profileUrl = () => location.href.split('#')[0].split('?')[0];

  function renderQr(target, size) {
    if (!target || target.dataset.ready === '1') return;
    if (typeof QRCode === 'undefined') return setTimeout(() => renderQr(target, size), 120);
    target.innerHTML = '';
    new QRCode(target,{text:profileUrl(),width:size,height:size,colorDark:'#071923',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H});
    target.dataset.ready = '1';
  }

  function openModal(id) {
    $$('.modal').forEach(m => { m.classList.remove('open'); m.setAttribute('aria-hidden','true'); });
    const modal = $(id); if (!modal) return;
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
    if (id === '#qr-modal') renderQr($('#qr-large'), 230);
  }
  function closeModals() { $$('.modal').forEach(m => {m.classList.remove('open');m.setAttribute('aria-hidden','true');}); document.body.style.overflow=''; }

  async function shareProfile() {
    const data = {title:'CityVille Laundromat',text:'CityVille Laundromat — Delivering Freshness! Call, WhatsApp, prices and directions.',url:profileUrl()};
    try {
      if (navigator.share) return await navigator.share(data);
      if (navigator.clipboard) { await navigator.clipboard.writeText(data.url); return toast('Profile link copied'); }
      window.prompt('Copy this profile link:', data.url);
    } catch (e) { if (e?.name !== 'AbortError') toast('Could not share right now'); }
  }

  $$('[data-branch]').forEach(btn => btn.addEventListener('click', () => setBranch(btn.dataset.branch)));
  $$('[data-action]').forEach(el => el.addEventListener('click', () => {
    const action = el.dataset.action;
    if (action === 'save-contact') saveContact();
    if (action === 'share') shareProfile();
    if (action === 'show-qr') openModal('#qr-modal');
    if (action === 'show-prices') openModal('#price-modal');
    if (action === 'close-modal') closeModals();
    if (action === 'directions') window.open(BRANCHES[currentBranch].directions, '_blank', 'noopener');
  }));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });
  setBranch('kitintale');
  window.addEventListener('load', () => renderQr($('#qr-inline'), 128));
})();
