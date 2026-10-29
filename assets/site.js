(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/5521998908129';

  /* WhatsApp links */
  document.querySelectorAll('[data-wa]').forEach(function(a){
    a.href = WA + '?text=' + encodeURIComponent(a.getAttribute('data-wa'));
  });

  /* Menu */
  var nav = document.getElementById('nav'), burger = document.getElementById('burger');
  function closeMenu(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); burger.setAttribute('aria-label', 'Abrir menu'); burger.textContent = 'Menu'; document.body.style.overflow = ''; }
  if (burger) {
    burger.addEventListener('click', function(){
      if (nav.classList.contains('open')) { closeMenu(); return; }
      nav.classList.add('open'); burger.setAttribute('aria-expanded', true); burger.setAttribute('aria-label', 'Fechar menu'); burger.textContent = 'Fechar';
      document.body.style.overflow = 'hidden';
    });
    document.querySelectorAll('#menu a').forEach(function(a){ a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); burger.focus(); } });
  }

  /* Hero: as linhas sobem depois que a fonte carrega */
  var hero = document.querySelector('.wl');
  function play(){ if (hero) hero.classList.add('ready'); }
  if (hero) {
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(function(r){ setTimeout(r, 900); })]).then(function(){ requestAnimationFrame(play); });
    else play();
  }

  /* Entradas: cada parte de uma seção entra uma vez, em sequência */
  var rev = document.querySelectorAll('[data-reveal]');
  rev.forEach(function(el){
    if (el.style.getPropertyValue('--d')) return;
    var sib = Array.prototype.filter.call(el.parentNode.children, function(c){ return c.hasAttribute('data-reveal'); });
    var i = sib.indexOf(el); if (i > 0) el.style.setProperty('--d', Math.min(i * 0.07, 0.42).toFixed(2) + 's');
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -6% 0px', threshold:.08});
    rev.forEach(function(el){ io.observe(el); });
  } else rev.forEach(function(el){ el.classList.add('in'); });

  /* Formulário curto da página inicial: abre o WhatsApp com a mensagem pronta */
  var wf = document.getElementById('wa-form');
  if (wf) wf.addEventListener('submit', function(e){
    e.preventDefault();
    var n = document.getElementById('wa-name').value.trim(), b = document.getElementById('wa-biz').value.trim();
    var msg = 'Olá! ' + (n ? 'Sou ' + n + '. ' : '') + (b ? 'Tenho um negócio: ' + b + '. ' : '') + 'Vim pelo site e quero um orçamento.';
    window.open(WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* Contact form: envio direto (FormSubmit) */
  var cf = document.getElementById('contact-form'), cBtn = document.getElementById('c-btn'), cSt = document.getElementById('c-status'), t0 = Date.now();
  if (cf) {
  function status(type, html){ cSt.className = 'form-status ' + type; cSt.innerHTML = html; }
  var FALLBACK = ' Se preferir, chame no <a href="https://wa.me/5521998908129" target="_blank" rel="noopener">WhatsApp</a> ou escreva para <a href="mailto:contato@firmiano.com.br">contato@firmiano.com.br</a>.';
  cf.addEventListener('submit', function(e){
    e.preventDefault();
    var fN = document.getElementById('c-name'), fE = document.getElementById('c-email'), fM = document.getElementById('c-msg');
    var n = fN.value.trim(), em = fE.value.trim(), m = fM.value.trim(), bad = null;
    [fN, fE, fM].forEach(function(f){ f.removeAttribute('aria-invalid'); });
    if (!n) bad = [fN, 'Escreva o seu nome.'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) bad = [fE, 'Escreva um e-mail válido, como voce@empresa.com.br.'];
    else if (m.length < 5) bad = [fM, 'Escreva a sua mensagem.'];
    if (bad) { bad[0].setAttribute('aria-invalid', 'true'); bad[0].focus(); status('err', bad[1]); return; }
    if (document.getElementById('c-site').value || Date.now() - t0 < 3000) { status('ok', 'Mensagem enviada. Respondemos em até 1 dia útil.'); cf.reset(); return; }
    cBtn.disabled = true; cBtn.textContent = 'Enviando…'; status('', '');
    fetch('https://formsubmit.co/ajax/contato@firmiano.com.br', {
      method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({nome: n, email: em, mensagem: m, _subject: 'Contato pelo site: ' + n, _replyto: em, _template: 'table', _captcha: 'false'})
    }).then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return {ok: r.ok, j: j}; }); })
      .then(function(res){
        if (res.ok && String(res.j.success) === 'true') { status('ok', 'Mensagem enviada. Respondemos no e-mail ' + em.replace(/[<>&"]/g, '') + ' em até 1 dia útil.'); cf.reset(); }
        else status('err', 'A mensagem não foi enviada.' + FALLBACK);
      })
      .catch(function(){ status('err', 'A mensagem não foi enviada porque a conexão falhou.' + FALLBACK); })
      .finally(function(){ cBtn.disabled = false; cBtn.textContent = 'Enviar mensagem'; });
  });
  }

})();

(function(){
  var form=document.getElementById('dom-form'), input=document.getElementById('dom-input'),
      btn=document.getElementById('dom-btn'), out=document.getElementById('dom-out');
  if(!form) return;
  var SUF=['oficial','digital','online','web','site','br','brasil'];
  function names(raw){
    var v=String(raw||'').trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\.(com\.br|net\.br|com|net|org|br)$/,'');
    v=v.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/&/g,' e ');
    var words=v.replace(/[^a-z0-9\s-]/g,'').split(/[\s-]+/).filter(Boolean);
    var joined=words.join('');
    if(joined.length<2||joined.length>50) return null;
    return {joined:joined, hyphen:words.length>1?words.join('-'):null};
  }
  function tfetch(url,opts){
    var c=new AbortController(), t=setTimeout(function(){c.abort();},8000);
    opts=opts||{}; opts.signal=c.signal;
    return fetch(url,opts).finally(function(){clearTimeout(t);});
  }
  function doh(host){
    return tfetch('https://dns.google/resolve?name='+encodeURIComponent(host)+'&type=NS')
      .then(function(r){if(!r.ok)throw 0;return r.json();})
      .catch(function(){return tfetch('https://cloudflare-dns.com/dns-query?name='+encodeURIComponent(host)+'&type=NS',{headers:{Accept:'application/dns-json'}}).then(function(r){if(!r.ok)throw 0;return r.json();});})
      .then(function(j){return j.Status===3?'free':(j.Status===0?'taken':'unk');})
      .catch(function(){return 'unk';});
  }
  function rdap(url){
    return tfetch(url,{headers:{Accept:'application/rdap+json, application/json'}})
      .then(function(r){return r.status===404?'free':(r.status===200?'taken':'unk');})
      .catch(function(){return 'unk';});
  }
  function el(tag,cls,text){var e=document.createElement(tag); if(cls)e.className=cls; if(text!=null)e.textContent=text; return e;}
  function pill(st,free){ return el('span','pill '+st,{free:free||'Disponível',taken:'Já registrado',unk:'Não foi possível verificar'}[st]); }
  function want(domain){
    var a=el('a','dom-want','Quero este domínio');
    a.href='https://wa.me/5521998908129?text='+encodeURIComponent('Olá! Quero registrar o domínio '+domain+' e fazer o meu site.');
    a.target='_blank'; a.rel='noopener'; return a;
  }
  function row(domain,st,freeLabel,i){
    var li=el('li'); li.style.animationDelay=(i||0)*0.05+'s'; li.appendChild(el('span','n',domain));
    var r=el('span','r'); r.appendChild(pill(st,freeLabel)); if(st==='free') r.appendChild(want(domain));
    li.appendChild(r); return li;
  }
  function render(base,res,vars){
    out.textContent='';
    var main=base+'.com.br', card=el('div','dom-main');
    card.appendChild(el('div','dom-name',main)); card.appendChild(pill(res.br,'Parece disponível'));
    card.appendChild(el('p','dom-sub',{
      free:'Esse endereço parece livre. Antes de registrar para você, confirmamos a disponibilidade no Registro.br.',
      taken:'Esse .com.br já tem dono. Veja as alternativas abaixo.',
      unk:'Não foi possível consultar agora. Tente de novo em instantes ou fale com a gente.'}[res.br]));
    if(res.br==='free'){var b=want(main); b.className='btn'; b.textContent='Quero este domínio'; card.appendChild(b);}
    out.appendChild(card);
    out.appendChild(el('h3','dom-h','Mesmo nome em outras terminações'));
    var ul=el('ul','dom-list');
    ul.appendChild(row(base+'.com',res.com,null,0)); ul.appendChild(row(base+'.net',res.net,null,1)); ul.appendChild(row(base+'.org',res.org,null,2));
    out.appendChild(ul);
    if(vars){
      out.appendChild(el('h3','dom-h','Variações disponíveis com .com.br'));
      if(vars.length){ var vl=el('ul','dom-list'); vars.forEach(function(d,i){vl.appendChild(row(d,'free','Parece disponível',i));}); out.appendChild(vl); }
      else out.appendChild(el('p','dom-sub','Não encontramos variações livres automaticamente. Fale com a gente que ajudamos a achar um bom nome.'));
    }
  }
  function run(raw){
    var n=names(raw);
    if(!n){ out.textContent=''; out.appendChild(el('p','dom-sub','Digite o nome da sua empresa, com 2 a 50 letras ou números.')); input.focus(); return; }
    btn.disabled=true; btn.textContent='Consultando…';
    var base=n.joined;
    Promise.all([
      doh(base+'.com.br'),
      rdap('https://rdap.verisign.com/com/v1/domain/'+encodeURIComponent(base)+'.com'),
      rdap('https://rdap.verisign.com/net/v1/domain/'+encodeURIComponent(base)+'.net'),
      rdap('https://rdap.publicinterestregistry.org/rdap/domain/'+encodeURIComponent(base)+'.org')
    ]).then(function(r){
      var res={br:r[0],com:r[1],net:r[2],org:r[3]};
      if(res.br==='free'){render(base,res,null);return;}
      var cands=[]; if(n.hyphen) cands.push(n.hyphen);
      SUF.forEach(function(s){cands.push(base+s);});
      cands=cands.filter(function(c){return c.length<=63;});
      return Promise.all(cands.map(function(c){return doh(c+'.com.br').then(function(st){return st==='free'?c+'.com.br':null;});}))
        .then(function(list){render(base,res,list.filter(Boolean).slice(0,6));});
    }).catch(function(){
      out.textContent=''; out.appendChild(el('p','dom-sub','Não foi possível consultar agora. Tente de novo em instantes.'));
    }).finally(function(){btn.disabled=false; btn.textContent='Consultar';});
  }
  form.addEventListener('submit',function(e){e.preventDefault(); run(input.value);});
  var q=new URLSearchParams(location.search).get('q');
  if(q && !form.hasAttribute('action')){ input.value=q; run(q); }
})();
