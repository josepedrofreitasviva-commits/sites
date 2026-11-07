/* HULO — novas funções: progresso, aurora, preloader, dock, paleta Ctrl+K, contadores,
   rotador de frases, processo, configurador de projeto -> WhatsApp, FAQ, rascunho do formulário. */
(function () {
  var d = document, $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var wa = (typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "5511941878821").replace(/\D/g, "");
  var mail = typeof CONTACT_EMAIL !== "undefined" ? CONTACT_EMAIL : "";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }

  // Fundo aurora + brilho do cursor + barra de progresso
  var aurora = el("div", "aurora", "<i></i><i></i><i></i>"); d.body.prepend(aurora);
  var bar = el("div", "progress"); d.body.append(bar);
  var glow = el("div", "cursor-glow"); d.body.append(glow);
  if (matchMedia("(hover:hover)").matches && !reduce)
    addEventListener("pointermove", function (e) { glow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)"; }, { passive: true });

  // Preloader (uma vez por sessão)
  if (!sessionStorage.getItem("hulo-loaded") && !reduce) {
    var ld = el("div", "loader", "<b>H</b>"); d.body.append(ld);
    var hide = function () { ld.classList.add("done"); setTimeout(function () { ld.remove(); }, 700); };
    addEventListener("load", function () { setTimeout(hide, 350); }); setTimeout(hide, 2500);
    try { sessionStorage.setItem("hulo-loaded", "1"); } catch (e) {}
  }

  // Toast
  var toast = el("div", "toast"); d.body.append(toast); var tt;
  function say(msg) { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 2600); }

  // Dock flutuante: WhatsApp, busca (Ctrl+K), topo
  var up = el("button", "up", "↑"); up.setAttribute("aria-label", "Voltar ao topo");
  up.onclick = function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); };
  var sb = el("button", "", "⌕"); sb.setAttribute("aria-label", "Buscar páginas (Ctrl+K)"); sb.title = "Buscar (Ctrl+K)";
  var wb = el("a", "wa", "✆"); wb.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent("Olá! Vim pelo site e quero conversar."); wb.target = "_blank"; wb.rel = "noopener noreferrer"; wb.setAttribute("aria-label", "Chamar no WhatsApp");
  var dock = el("div", "dock"); dock.append(up, sb, wb); d.body.append(dock);

  // Scroll: progresso, header compacto, botão de topo
  var header = $(".site-header");
  function onScroll() {
    var h = d.documentElement, max = h.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    if (header) header.classList.toggle("is-scrolled", scrollY > 30);
    up.classList.toggle("show", scrollY > 500);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Link da página atual no menu
  var here = location.pathname.split("/").pop() || "index.html";
  $$(".site-nav > a").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("is-current"); });

  // Paleta de comandos
  var cmds = [
    ["Início", "página", function () { location.href = "index.html"; }],
    ["Sobre", "página", function () { location.href = "sobre.html"; }],
    ["Serviços e planos", "página", function () { location.href = "servicos.html"; }],
    ["Portfólio", "página", function () { location.href = "portfolio.html"; }],
    ["Vantagens", "página", function () { location.href = "vantagens.html"; }],
    ["Contato", "página", function () { location.href = "contato.html"; }],
    ["Abrir WhatsApp", "ação", function () { open(wb.href, "_blank"); }],
    ["Copiar e-mail", "ação", function () { if (!mail) return say("E-mail não configurado"); navigator.clipboard.writeText(mail).then(function () { say("E-mail copiado ✓"); }, function () { say(mail); }); }],
    ["Voltar ao topo", "ação", function () { up.click(); }]
  ];
  var pal = el("div", "palette", '<div class="palette-box"><input type="text" placeholder="Para onde você quer ir?" aria-label="Buscar"><ul></ul><p class="hint">↑ ↓ navegar · Enter abrir · Esc fechar</p></div>');
  d.body.append(pal);
  var pin = $("input", pal), pul = $("ul", pal), sel = 0, shown = cmds;
  function draw() {
    pul.innerHTML = ""; shown.forEach(function (c, i) {
      var li = el("li", i === sel ? "sel" : "", c[0] + "<small>" + c[1] + "</small>");
      li.onclick = function () { closeP(); c[2](); }; pul.append(li);
    });
  }
  function openP() { pal.classList.add("open"); pin.value = ""; shown = cmds; sel = 0; draw(); pin.focus(); }
  function closeP() { pal.classList.remove("open"); }
  sb.onclick = openP; pal.onclick = function (e) { if (e.target === pal) closeP(); };
  pin.oninput = function () { var q = pin.value.toLowerCase(); shown = cmds.filter(function (c) { return c[0].toLowerCase().indexOf(q) > -1; }); sel = 0; draw(); };
  addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.classList.contains("open") ? closeP() : openP(); return; }
    if (!pal.classList.contains("open")) return;
    if (e.key === "Escape") closeP();
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); draw(); }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
    if (e.key === "Enter" && shown[sel]) { closeP(); shown[sel][2](); }
  });

  // Helpers de seção
  var footer = $(".site-footer");
  function section(html, before) { var s = el("section", "x-sec reveal", '<div class="container">' + html + "</div>"); (before || footer).before(s); setTimeout(function () { s.classList.add("is-visible"); }, 50); return s; }
  function head(label, title, text) { return '<div class="x-head"><div class="section-label"><span>' + label + "</span></div><h2>" + title + "</h2><p>" + text + "</p></div>"; }

  var isHome = !!$(".hero");
  var contactSec = $("#contato");

  if (isHome) {
    // Rotador de frases no hero
    var lead = $(".hero-lead");
    if (lead) {
      var rot = el("div", "rotator", 'Sites para <b></b>'); lead.before(rot);
      var words = ["restaurantes", "pet shops", "lojas e comércios", "clínicas e consultórios", "prestadores de serviço", "o seu negócio"], wi = 0, ci = 0, del = false, tgt = $("b", rot);
      (function type() {
        var w = words[wi]; ci += del ? -1 : 1; tgt.textContent = w.slice(0, ci); var t = del ? 40 : 85;
        if (!del && ci === w.length) { del = true; t = 1400; } else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; t = 300; }
        if (reduce) { tgt.textContent = words[0]; return; } setTimeout(type, t);
      })();
    }
    // Faixa de nichos + contadores
    var heroSec = $(".hero"), items = ["Restaurantes", "Pet shops", "Lojas", "Clínicas", "Salões de beleza", "Academias", "Oficinas", "Consultórios", "Cafeterias", "Prestadores de serviço"];
    var mq = el("div", "marquee", "<div>" + items.concat(items).map(function (t) { return "<span>✦ " + t + "</span>"; }).join("") + "</div>");
    heroSec.after(mq);
    var st = section('<div class="stats">' +
      '<div class="stat"><strong data-n="100" data-s="%">0</strong><span>sob medida</span></div>' +
      '<div class="stat"><strong data-n="5">0</strong><span>tipos de solução</span></div>' +
      '<div class="stat"><strong data-n="4">0</strong><span>etapas simples</span></div>' +
      '<div class="stat"><strong data-n="1">0</strong><span>contato direto, sem intermediários</span></div></div>', $("#sobre"));
    new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; o.unobserve(e.target);
        $$("[data-n]", e.target).forEach(function (n) {
          var end = +n.dataset.n, s = n.dataset.s || "", t0 = performance.now();
          (function f(t) { var p = Math.min((t - t0) / 1400, 1); n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + s; if (p < 1) requestAnimationFrame(f); })(t0);
        });
      });
    }, { threshold: .4 }).observe(st);

    // Como funciona
    section(head("COMO FUNCIONA", 'Do primeiro contato <span class="text-gradient">ao site no ar.</span>', "Um caminho claro, sem burocracia e com você participando de cada etapa.") +
      '<div class="steps">' +
      '<div class="step"><em>1</em><h3>Conversa</h3><p>Entendo seu negócio, seu público e o que você quer alcançar.</p></div>' +
      '<div class="step"><em>2</em><h3>Planejamento</h3><p>Organizo páginas, textos e estrutura antes de desenhar.</p></div>' +
      '<div class="step"><em>3</em><h3>Criação</h3><p>Design e desenvolvimento com a identidade da sua marca.</p></div>' +
      '<div class="step"><em>4</em><h3>Publicação</h3><p>Site revisado, publicado e pronto para receber clientes.</p></div></div>', $("#portfolio"));

    // Configurador de projeto -> WhatsApp
    var cfg = section(head("MONTE SEU PROJETO", 'Escolha o que precisa e <span class="text-gradient">envie pronto.</span>', "Selecione as opções e sua mensagem vai preenchida direto para o meu WhatsApp.") +
      '<div class="cfg"><h3>Tipo de site</h3><div class="chips" data-g="tipo"></div><h3>Funções desejadas</h3><div class="chips" data-g="func" data-multi="1"></div><h3>Prazo</h3><div class="chips" data-g="prazo"></div>' +
      '<div class="cfg-foot"><div class="cfg-sum"><span class="cfg-text">Selecione ao menos o tipo de site.</span><div class="meter"><i></i></div></div><button class="button button-primary cfg-send" type="button" disabled>Enviar pelo WhatsApp <span aria-hidden="true">↗</span></button></div></div>', $("#vantagens"));
    var opts = { tipo: ["Institucional", "Loja / comércio", "Restaurante", "Pet shop", "Página de divulgação"],
      func: ["Botão de WhatsApp", "Formulário de contato", "Galeria de fotos", "Mapa e horários", "Cardápio / catálogo", "Blog", "Integração com Instagram", "SEO (Google)"],
      prazo: ["Com urgência", "Em 1 mês", "Sem pressa"] };
    var pick = { tipo: [], func: [], prazo: [] };
    Object.keys(opts).forEach(function (g) {
      var box = $('[data-g="' + g + '"]', cfg);
      opts[g].forEach(function (o) {
        var b = el("button", "chip", o); b.type = "button"; b.setAttribute("aria-pressed", "false");
        b.onclick = function () {
          var on = b.getAttribute("aria-pressed") === "true";
          if (!box.dataset.multi) $$(".chip", box).forEach(function (c) { c.setAttribute("aria-pressed", "false"); }), pick[g] = [];
          b.setAttribute("aria-pressed", String(box.dataset.multi ? !on : true));
          pick[g] = $$(".chip", box).filter(function (c) { return c.getAttribute("aria-pressed") === "true"; }).map(function (c) { return c.textContent; });
          upd();
        };
        box.append(b);
      });
    });
    var send = $(".cfg-send", cfg);
    function upd() {
      var ok = pick.tipo.length > 0, pct = (pick.tipo.length ? 40 : 0) + Math.min(pick.func.length, 4) * 10 + (pick.prazo.length ? 20 : 0);
      $(".meter i", cfg).style.width = pct + "%"; send.disabled = !ok;
      $(".cfg-text", cfg).innerHTML = ok ? "<b>" + pick.tipo[0] + "</b> · " + pick.func.length + " função(ões)" + (pick.prazo[0] ? " · " + pick.prazo[0] : "") : "Selecione ao menos o tipo de site.";
    }
    send.onclick = function () {
      var m = "Olá! Montei meu projeto no site:\n• Tipo: " + pick.tipo[0] + "\n• Funções: " + (pick.func.join(", ") || "a definir") + "\n• Prazo: " + (pick.prazo[0] || "a combinar");
      open("https://wa.me/" + wa + "?text=" + encodeURIComponent(m), "_blank", "noopener,noreferrer"); say("Abrindo o WhatsApp…");
    };
  }

  // FAQ (home, serviços e contato)
  if (isHome || /servicos|contato/.test(here)) {
    var qa = [
      ["Quanto tempo leva para ficar pronto?", "Depende do tamanho e das funções do projeto. Na primeira conversa eu já passo um prazo realista."],
      ["Preciso ter domínio e hospedagem?", "Não precisa chegar com nada pronto. Eu te oriento na escolha e na configuração."],
      ["O site vai funcionar no celular?", "Sim. Todos os projetos são pensados para telas pequenas e grandes."],
      ["Posso pedir ajustes depois?", "Pode. Ajustes e manutenção podem ser combinados conforme a sua necessidade."],
      ["Como faço o pedido?", "Use o configurador, o formulário ou chame direto no WhatsApp. Sem compromisso."]
    ];
    var fq = section(head("DÚVIDAS FREQUENTES", 'Perguntas que <span class="text-gradient">sempre aparecem.</span>', "Se a sua não estiver aqui, é só chamar.") + '<div class="faq"></div>', isHome ? contactSec : null);
    qa.forEach(function (x) {
      var it = el("div", "faq-item", '<button type="button" aria-expanded="false">' + x[0] + "</button><div><p>" + x[1] + "</p></div>");
      $("button", it).onclick = function () {
        var o = !it.classList.contains("open"); $$(".faq-item", fq).forEach(function (i) { i.classList.remove("open"); $("button", i).setAttribute("aria-expanded", "false"); });
        if (o) { it.classList.add("open"); $("button", it).setAttribute("aria-expanded", "true"); }
      };
      $(".faq", fq).append(it);
    });
  }

  // Formulário de contato: contador, rascunho automático, e-mail copiável
  var form = $("#contact-form");
  if (form) {
    var fields = $$("input,textarea,select", form).filter(function (f) { return f.name; });
    try { var saved = JSON.parse(store("hulo-draft") || "{}"); fields.forEach(function (f) { if (saved[f.name] && !f.value) f.value = saved[f.name]; }); } catch (e) {}
    form.addEventListener("input", function () { var o = {}; fields.forEach(function (f) { o[f.name] = f.value; }); store("hulo-draft", JSON.stringify(o)); });
    form.addEventListener("submit", function () { store("hulo-draft", null); });
    var ta = $("textarea", form);
    if (ta) { var cc = el("span", "char-count"); ta.after(cc); var cnt = function () { cc.textContent = ta.value.length + " caracteres"; }; ta.addEventListener("input", cnt); cnt(); }
  }
  $$(".email-link-js").forEach(function (a) {
    a.addEventListener("contextmenu", function () { if (mail) navigator.clipboard && navigator.clipboard.writeText(mail).then(function () { say("E-mail copiado ✓"); }); });
  });
})();
