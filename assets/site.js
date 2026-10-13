(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* WhatsApp links */
  document.querySelectorAll('[data-wa]').forEach(function(a){
    a.href = 'https://wa.me/5521998908129?text=' + encodeURIComponent(a.getAttribute('data-wa'));
  });

  /* Nav, progress, floating button */
  var nav = document.getElementById('nav'), prog = document.getElementById('progress'), waF = document.getElementById('waFloat');
  var hero = document.getElementById('hero');
  function onScroll(){
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    var past = hero ? y > hero.offsetHeight - 90 : y > 10;
    nav.classList.toggle('scrolled', past);
    nav.classList.toggle('glass', !past && y > 8);
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (waF) waF.classList.toggle('show', y > innerHeight * .6);
    stepsProgress();
  }
  var burger = document.getElementById('burger');
  if (burger) burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('#menu a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow=''; }); });

  /* Headline split */
  var h1 = document.getElementById('headline');
  if (h1 && !reduce) {
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', h1.textContent.trim());
    h1.innerHTML = words.map(function(w, i){ return '<span class="w" aria-hidden="true"><span style="transition-delay:' + (0.08 + i * 0.055).toFixed(3) + 's">' + w + '</span></span>'; }).join(' ');
  }

  /* Hero build sequence */
  var stage = document.getElementById('stage'), typed = document.getElementById('typed');
  var URL_TXT = 'suaempresa.com.br';
  function finish(){ stage.classList.add('built','details','live'); stage.closest('.stage-holder').classList.add('live'); typed.textContent = URL_TXT; }
  function play(){
    if (hero) hero.classList.add('ready');
    if (!stage) return;
    if (reduce) { finish(); return; }
    setTimeout(function(){ stage.classList.add('built'); }, 1300);
    setTimeout(function(){ stage.classList.add('details'); }, 2300);
    setTimeout(function(){
      var i = 0; (function t(){ typed.textContent = URL_TXT.slice(0, ++i); if (i < URL_TXT.length) setTimeout(t, 55); else setTimeout(function(){ stage.classList.add('live'); stage.closest('.stage-holder').classList.add('live'); }, 250); })();
    }, 2700);
  }
  if (document.fonts && document.fonts.ready) { Promise.race([document.fonts.ready, new Promise(function(r){ setTimeout(r, 900); })]).then(function(){ requestAnimationFrame(play); }); }
  else { requestAnimationFrame(play); }

  /* Tilt */
  var sw = document.getElementById('stageWrap');
  if (sw && finePointer && !reduce) {
    sw.addEventListener('pointermove', function(e){
      var r = sw.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      stage.style.transform = 'rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg)';
    });
    sw.addEventListener('pointerleave', function(){ stage.style.transform = ''; });
  }

  /* Spotlight tiles */
  if (finePointer) document.querySelectorAll('.spot').forEach(function(el){
    el.addEventListener('pointermove', function(e){ var r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  /* Magnetic buttons */
  if (finePointer && !reduce) document.querySelectorAll('.magnetic').forEach(function(b){
    b.addEventListener('pointermove', function(e){ var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px)'; });
    b.addEventListener('pointerleave', function(){ b.style.transform = ''; });
  });

  /* Reveal */
  var rev = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -8% 0px', threshold:.12});
    rev.forEach(function(el){ io.observe(el); });
  } else rev.forEach(function(el){ el.classList.add('in'); });

  /* Steps progress */
  var stepsEl = document.getElementById('steps'), stepEls = stepsEl ? stepsEl.querySelectorAll('.step') : [], track = stepsEl ? stepsEl.querySelector('.track i') : null;
  function stepsProgress(){
    if (!stepsEl || !track) return;
    var r = stepsEl.getBoundingClientRect(), vh = innerHeight;
    var p = Math.min(1, Math.max(0, (vh * .75 - r.top) / (r.height + vh * .2)));
    if (reduce) p = 1;
    track.parentNode.style.setProperty('--p', p.toFixed(3));
    stepEls.forEach(function(s, i){ s.classList.toggle('on', p >= i / (stepEls.length - 1) - 0.02); });
  }

  /* Pricing tabs */
  var tabs = [document.getElementById('tab-lp'), document.getElementById('tab-wp')], ind = document.querySelector('.seg .ind');
  if (tabs[0] && tabs[1] && ind) {
  function placeInd(t){ ind.style.width = t.offsetWidth + 'px'; ind.style.transform = 'translateX(' + (t.offsetLeft - 6) + 'px)'; }
  function select(t){
    tabs.forEach(function(x){
      var on = x === t, panel = document.getElementById(x.getAttribute('aria-controls'));
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; panel.hidden = !on;
    });
    placeInd(t);
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ select(t); });
    t.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + 1) % 2]; select(n); n.focus(); } });
  });
  placeInd(tabs[0]);
  window.addEventListener('resize', function(){ placeInd(tabs.filter(function(t){ return t.getAttribute('aria-selected') === 'true'; })[0]); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ placeInd(tabs.filter(function(t){ return t.getAttribute('aria-selected') === 'true'; })[0]); });
  }

  /* FAQ */
  document.querySelectorAll('.qa button').forEach(function(b){
    b.addEventListener('click', function(){ var q = b.parentNode, open = q.classList.toggle('open'); b.setAttribute('aria-expanded', open); });
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

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
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
    if(res.br==='free'){var b=want(main); b.className='btn btn-leaf'; b.textContent='Quero este domínio'; card.appendChild(b);}
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
})();
