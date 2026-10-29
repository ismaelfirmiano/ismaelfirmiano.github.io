/* Firmiano — Google Analytics 4 com consentimento (LGPD / Consent Mode v2)
   ID de medição: G-TPC74F3VVP
   Sem aceite, o GA não grava cookies nem identificadores; só pings anônimos sem cookies. */
(function () {
  var GA_ID = 'G-TPC74F3VVP';
  var KEY = 'firmiano_cookie_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var saved = read();
  var granted = saved === 'granted';

  /* Padrão: tudo negado até o visitante aceitar */
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    wait_for_update: 500
  });
  if (granted) {
    gtag('consent', 'update', { analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied' });
  }

  gtag('js', new Date());
  gtag('config', GA_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  function apply(choice) {
    write(choice);
    if (choice === 'granted') {
      /* ad_user_data liberado para o Google Signals (idade, sexo, interesses); anúncios personalizados seguem negados */
      gtag('consent', 'update', { analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied' });
    } else {
      gtag('consent', 'update', { analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    }
  }

  /* Eventos úteis: clique no WhatsApp e envio do formulário de contato */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (a.hasAttribute('data-wa') || href.indexOf('wa.me') !== -1) {
      gtag('event', 'whatsapp_click', { link_text: (a.textContent || '').trim().slice(0, 80), page_path: location.pathname });
    } else if (href.indexOf('mailto:') === 0) {
      gtag('event', 'email_click', { page_path: location.pathname });
    }
  }, true);
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.tagName === 'FORM') {
      gtag('event', 'generate_lead', { form_id: e.target.id || 'contato', page_path: location.pathname });
    }
  }, true);

  /* Banner */
  function showBanner() {
    if (document.getElementById('fm-cookie')) return;
    var css = document.createElement('style');
    css.textContent =
      '#fm-cookie{position:fixed;left:16px;bottom:16px;z-index:2147483000;max-width:400px;' +
      'background:#072A20;color:#EFEFEA;border-radius:0;box-shadow:0 12px 40px rgba(7,42,32,.3);' +
      'padding:18px 20px;font:14px/1.5 "Stack Sans Text",system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '#fm-cookie p{margin:0 0 14px}#fm-cookie a{color:inherit;text-underline-offset:3px}' +
      '#fm-cookie .fm-row{display:flex;gap:8px;flex-wrap:wrap}' +
      '#fm-cookie button{font:inherit;font-weight:500;cursor:pointer;border-radius:0;padding:10px 18px;border:0;min-height:44px}' +
      '#fm-cookie .fm-yes{background:#27805F;color:#fff}#fm-cookie .fm-yes:hover{background:#2E9470}' +
      '#fm-cookie .fm-no{background:rgba(239,239,234,.12);color:#EFEFEA}#fm-cookie .fm-no:hover{background:rgba(239,239,234,.2)}' +
      '#fm-cookie button:focus-visible{outline:3px solid #A9D9C2;outline-offset:3px}' +
      '@media (max-width:480px){#fm-cookie{right:16px;max-width:none}}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'fm-cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Preferências de cookies');
    box.innerHTML =
      '<p>Usamos cookies de estatística (Google Analytics) para melhorar o site. ' +
      'Você pode recusar sem perder nada. <a href="/privacidade.html">Política de privacidade</a>.</p>' +
      '<div class="fm-row"><button type="button" class="fm-yes">Aceitar</button>' +
      '<button type="button" class="fm-no">Recusar</button></div>';
    document.body.appendChild(box);
    box.querySelector('.fm-yes').addEventListener('click', function () { apply('granted'); box.remove(); });
    box.querySelector('.fm-no').addEventListener('click', function () { apply('denied'); box.remove(); });
  }

  /* Permite reabrir o banner (link "Gerenciar cookies" na política de privacidade) */
  window.firmianoCookies = function () { showBanner(); };

  function init() {
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (ev) { ev.preventDefault(); showBanner(); });
    });
    if (!saved) showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
