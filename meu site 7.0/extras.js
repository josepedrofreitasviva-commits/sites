/* HULO — novas funções: progresso, aurora, preloader, dock, paleta Ctrl+K, contadores,
   rotador de frases, processo, FAQ, rascunho do formulário. */
(function () {
  var d = document, $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var wa = (typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "5511941878821").replace(/\D/g, "");
  var mail = typeof CONTACT_EMAIL !== "undefined" ? CONTACT_EMAIL : "";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); v === null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) {} }

  // Fundo aurora + brilho do cursor + barra de progresso
  var bar = el("div", "progress"); d.body.append(bar);
  
  // Toast
  var toast = el("div", "toast"); d.body.append(toast); var tt;
  function say(msg) { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 2600); }

  // Dock flutuante: WhatsApp, busca (Ctrl+K), topo
  var up = el("button", "up", "Topo"); up.setAttribute("aria-label", "Voltar ao topo");
  up.onclick = function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); };
  var sb = el("button", "", "Buscar"); sb.setAttribute("aria-label", "Buscar páginas (Ctrl+K)"); sb.title = "Buscar (Ctrl+K)";
  var MSG = "Olá! Quero conversar sobre um site para o meu negócio.";
  var wb = el("a", "button button-light whatsapp-link wa-pill", '<span class="whatsapp-icon" aria-hidden="true">◉</span> Conversar pelo WhatsApp <span aria-hidden="true">↗</span>');
  wb.href = typeof whatsappHref !== "undefined" ? whatsappHref : "https://wa.me/" + wa + "?text=" + encodeURIComponent(MSG);
  wb.target = "_blank"; wb.rel = "noopener noreferrer";
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
    // Como funciona
    section(head("COMO FUNCIONA", 'Do primeiro contato <span class="text-gradient">ao site no ar.</span>', "Um caminho claro, sem burocracia e com você participando de cada etapa.") +
      '<div class="steps">' +
      '<div class="step"><em>1</em><h3>Conversa</h3><p>Entendo seu negócio, seu público e o que você quer alcançar.</p></div>' +
      '<div class="step"><em>2</em><h3>Planejamento</h3><p>Organizo páginas, textos e estrutura antes de desenhar.</p></div>' +
      '<div class="step"><em>3</em><h3>Criação</h3><p>Design e desenvolvimento com a identidade da sua marca.</p></div>' +
      '<div class="step"><em>4</em><h3>Publicação</h3><p>Site revisado, publicado e pronto para receber clientes.</p></div></div>', $("#portfolio"));
  }

  // Formulário de contato: contador, rascunho automático, e-mail copiável
  var form = $("#contact-form");
  if (form) {
    var fields = $$("input,textarea,select", form).filter(function (f) { return f.name; });
    try { var saved = JSON.parse(store("hulo-draft") || "{}"); fields.forEach(function (f) { if (saved[f.name] && !f.value) f.value = saved[f.name]; }); } catch (e) {}
    form.addEventListener("input", function () { var o = {}; fields.forEach(function (f) { o[f.name] = f.value; }); store("hulo-draft", JSON.stringify(o).slice(0, 2500)); });
    form.addEventListener("submit", function () { store("hulo-draft", null); });
  }
  $$(".email-link-js").forEach(function (a) {
    a.addEventListener("contextmenu", function () { if (mail) navigator.clipboard && navigator.clipboard.writeText(mail).then(function () { say("E-mail copiado ✓"); }); });
  });
})();
