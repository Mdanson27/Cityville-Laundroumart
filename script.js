(() => {
  const CONFIG = {
    business: 'CityVille Laundromat',
    contactName: 'Alexandria K. Guma',
    phone: '+256764002097',
    phone2: '+256709706031',
    direct: '+256702723070',
    email: 'akg@cityvillelaundromat.com',
    website: 'https://cityvillelaundromat.com/',
    kitintale: 'Mutungo Hill Junction / Church Road, Kitintale, Kampala, Uganda',
    naalya: 'Metroplex Shopping Centre, Naalya, Kampala, Uganda'
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  let toastTimer;

  window.addEventListener('load', () => setTimeout(() => $('#loader')?.classList.add('done'), 3000));
  setTimeout(() => $('#loader')?.classList.add('done'), 4500);

  function toast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function saveContact() {
    const lines = [
      'BEGIN:VCARD','VERSION:3.0','N:Guma;Alexandria K.;;;',
      `FN:${CONFIG.business}`,`ORG:${CONFIG.business}`,
      `TEL;TYPE=CELL:${CONFIG.direct}`,`TEL;TYPE=WORK,VOICE:${CONFIG.phone}`,`TEL;TYPE=WORK,VOICE:${CONFIG.phone2}`,
      `EMAIL;TYPE=WORK:${CONFIG.email}`,`URL:${CONFIG.website}`,
      `ADR;TYPE=WORK:;;${CONFIG.kitintale};;;;`,
      `ADR;TYPE=WORK:;;${CONFIG.naalya};;;;`,
      'NOTE:Delivering Freshness! CityVille Laundromat — professional wash, dry and fold services in Kampala. Branches: Kitintale and Naalya.',
      'END:VCARD'
    ];
    const blob = new Blob([lines.join('\r\n')], {type:'text/vcard;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CityVille-Laundromat.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
    const modal = $(id);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    if (id === '#qr-modal') renderQr($('#qr-large'), 230);
  }

  function closeModals() {
    $$('.modal').forEach(m => {m.classList.remove('open');m.setAttribute('aria-hidden','true');});
    document.body.style.overflow='';
  }

  async function shareProfile() {
    const data = {title:'CityVille Laundromat',text:'CityVille Laundromat — Delivering Freshness! View contacts, prices, services and both Kampala locations.',url:profileUrl()};
    try {
      if (navigator.share) { await navigator.share(data); return; }
      if (navigator.clipboard) { await navigator.clipboard.writeText(data.url); toast('Profile link copied'); return; }
      window.prompt('Copy this profile link:', data.url);
    } catch (e) {
      if (e?.name !== 'AbortError') toast('Could not share right now');
    }
  }

  $$('[data-action]').forEach(el => el.addEventListener('click', () => {
    const action = el.dataset.action;
    if (action === 'save-contact') saveContact();
    if (action === 'share') shareProfile();
    if (action === 'show-qr') openModal('#qr-modal');
    if (action === 'show-prices') openModal('#price-modal');
    if (action === 'close-modal') closeModals();
  }));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });
  window.addEventListener('load', () => renderQr($('#qr-inline'), 126));
})();