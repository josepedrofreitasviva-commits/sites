/* HULO — lógica das páginas de ferramentas (orçamento, diagnóstico, agenda, processo, FAQ) */
(function () {
  var d = document, page = d.body.dataset.page, $ = function (s, r) { return (r || d).querySelector(s); };
  var wa = (typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "5511941878821").replace(/\D/g, "");
  function el(t, c, h) { var e = d.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; }
  var HELLO = "Olá! Quero conversar sobre um site para o meu negócio.";
  function clean(v, max) { return String(v || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069<>]/g, "").trim().slice(0, max); }
  function zap(msg) { open("https://wa.me/" + wa + "?text=" + encodeURIComponent(clean(HELLO + "\n" + msg.replace(/^Olá![^\n]*\n?/, ""), 1200)), "_blank", "noopener,noreferrer"); }
  function list(ul, items, base) { ul.textContent = ""; items.forEach(function (t, k) { var li = d.createElement("li"); li.textContent = t; li.style.animationDelay = (base || 0) + k * 100 + "ms"; ul.appendChild(li); }); }
  function chips(box, list, multi, cb) {
    var sel = [];
    list.forEach(function (o) {
      var b = el("button", "chip", o); b.type = "button"; b.setAttribute("aria-pressed", "false");
      b.onclick = function () {
        if (!multi) Array.prototype.forEach.call(box.children, function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", multi ? String(b.getAttribute("aria-pressed") !== "true") : "true");
        sel = Array.prototype.filter.call(box.children, function (c) { return c.getAttribute("aria-pressed") === "true"; }).map(function (c) { return c.textContent; });
        cb(sel);
      }; box.append(b);
    }); return function () { return sel; };
  }
  function tick(el0, from, to, ms, fmt) { var t0 = performance.now(); (function f(t) { var p = Math.min((t - t0) / ms, 1); el0.textContent = (fmt || Math.round)(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0); }

  /* ORÇAMENTO */
  if (page === "orcamento") {
    var plans = [
      { id: "basico", n: "Básico", p: 500, d: "Presença objetiva para colocar sua empresa na internet.", items: ["Página enxuta e profissional", "Layout para celular e computador", "Botão direto para o WhatsApp"] },
      { id: "profissional", n: "Profissional", p: 800, d: "Mais espaço para apresentar empresa, serviços e diferenciais.", items: ["Várias seções e páginas", "Galeria e formulário de contato", "Estrutura pensada para ser achado no Google"] },
      { id: "completo", n: "Site completo", p: 1000, d: "Presença ampla, pensada para as necessidades do seu negócio.", items: ["Projeto amplo e personalizado", "Funções avançadas sob medida", "Acompanhamento próximo do início ao fim"] }
    ];
    var funcs = ["WhatsApp", "Formulário", "Galeria", "Mapa e horários", "catálogo", "Blog", "Instagram", "Google (SEO)"], cur = plans[0], shown = 500, tipoSel = [], fnSel = [];
    var pg = $("#o-pg"), pgv = $("#o-pg-val");
    var getT = chips($("#o-tipo"), ["Institucional", "Loja / comércio", "Restaurante", "Pet shop", "Divulgação"], false, function (s) { tipoSel = s; calc(); });
    var getF = chips($("#o-func"), funcs, true, function (s) { fnSel = s; calc(); });
    function calc() {
      var pages = +pg.value; pgv.textContent = pages;
      var score = pages + fnSel.length * 1.4 + (tipoSel[0] === "Loja / comércio" ? 2 : 0) + (tipoSel[0] === "Divulgação" ? -2 : 0);
      cur = score <= 5 ? plans[0] : score <= 10 ? plans[1] : plans[2];
      $("#o-plano").textContent = cur.n; $("#o-desc").textContent = cur.d;
      tick($("#o-preco"), shown, cur.p, 700); shown = cur.p;
      $("#o-meter").style.width = Math.min(100, score * 6.5) + "%";
      list($("#o-lista"), cur.items, 0);
      $("#o-ped").href = "contato.html?plano=" + cur.id;
      Array.prototype.forEach.call($("#o-cmp").children, function (c, i) { c.classList.toggle("rec", plans[i] === cur); });
    }
    $("#o-cmp").innerHTML = plans.map(function (p) { return '<div class="cmp tool-card"><small>' + p.n.toUpperCase() + "</small><b>R$ " + p.p + "</b><small>" + p.d + "</small></div>"; }).join("");
    pg.addEventListener("input", calc); calc();
    $("#o-wa").onclick = function () { zap("Usei a calculadora do site.\n• Negócio: " + (tipoSel[0] || "a definir") + "\n• Páginas: " + pg.value + "\n• Funções: " + (fnSel.join(", ") || "a definir") + "\n• Plano indicado: " + cur.n + " (R$ " + cur.p + ")"); };
  }

  /* DIAGNÓSTICO */
  if (page === "diagnostico") {
    var qs = [
      ["Seu negócio tem um site hoje?", "Ter um endereço próprio passa confiança e centraliza tudo.", "Criar um site simples e profissional."],
      ["Os clientes conseguem achar seu endereço e horários online?", "Quem pesquisa quer a informação na hora.", "Mostrar mapa, endereço e horários em destaque."],
      ["Você tem um botão ou link direto de WhatsApp?", "Quanto menos cliques até a conversa, mais contatos.", "Colocar WhatsApp visível em todas as páginas."],
      ["Seus serviços ou produtos estão bem apresentados com fotos?", "Imagens boas vendem sozinhas.", "Montar uma galeria ou catálogo organizado."],
      ["Seu negócio aparece quando alguém pesquisa no Google?", "Ser encontrado é o primeiro passo para vender.", "Estruturar o site para busca e criar o perfil no Google."],
      ["Sua identidade visual (logo e cores) é consistente?", "Padrão visual transmite profissionalismo.", "Definir cores, logo e estilo para usar em tudo."],
      ["Seu atendimento online responde rápido?", "Resposta rápida costuma decidir a compra.", "Criar respostas prontas e formulário de contato."],
      ["Você tem um lugar só para mostrar seus melhores trabalhos?", "Provas de qualidade geram confiança.", "Criar uma área de portfólio ou depoimentos."]
    ], qi = 0, yes = 0, miss = [];
    function ask() {
      var b = $("#q-body"); b.style.animation = "none"; void b.offsetWidth; b.style.animation = "";
      $("#q-step").textContent = "Pergunta " + (qi + 1) + " de " + qs.length; $("#q-bar").style.width = (qi / qs.length * 100) + "%";
      b.innerHTML = "<h2>" + qs[qi][0] + '</h2><p class="muted">' + qs[qi][1] + '</p><div class="answers"><button class="chip" type="button" data-a="1">Sim</button><button class="chip" type="button" data-a="0">Ainda não</button></div>';
      Array.prototype.forEach.call(b.querySelectorAll(".chip"), function (c) { c.onclick = function () { if (c.dataset.a === "1") yes++; else miss.push(qs[qi][2]); setTimeout(function () { qi++; qi < qs.length ? ask() : finish(); }, 180); }; });
    }
    function finish() {
      $("#q-bar").style.width = "100%"; $("#quiz").hidden = true; var r = $("#q-result"); r.hidden = false; r.style.animation = "pgIn .6s both";
      var s = Math.round(yes / qs.length * 100), fg = $("#q-ring");
      setTimeout(function () { fg.style.strokeDashoffset = 327 - 327 * s / 100; fg.style.stroke = s >= 75 ? "#bfe7f8" : s >= 40 ? "#8fc9e6" : "#9aa3ae"; }, 80);
      tick($("#q-score"), 0, s, 1500);
      $("#q-title").textContent = s >= 75 ? "Você já está bem posicionado!" : s >= 40 ? "Bom começo, dá para crescer bastante" : "Há muito espaço para crescer online";
      $("#q-text").textContent = s >= 75 ? "Faltam só alguns ajustes para destacar o negócio." : "Veja por onde começar para atrair mais clientes:";
      list($("#q-tips"), (miss.length ? miss : ["Manter tudo atualizado e acompanhar os resultados."]).slice(0, 5), 400);
      $("#q-wa").onclick = function () { zap("Fiz o diagnóstico do site e tirei " + s + "/100.\nPontos a melhorar:\n- " + (miss.slice(0, 5).join("\n- ") || "nenhum, quero evoluir") + "\nPodemos conversar?"); };
    }
    $("#q-again").onclick = function () { qi = 0; yes = 0; miss = []; $("#q-result").hidden = true; $("#quiz").hidden = false; $("#q-ring").style.strokeDashoffset = 327; ask(); };
    ask();
  }

  /* AGENDAMENTO */
  if (page === "agendar") {
    var dn = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"], mn = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"], dias = [], now = new Date(), i0 = 0;
    while (dias.length < 12) { var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (++i0)); if (dt.getDay() !== 0) dias.push(dt); }
    var dSel = null, hSel = "", cSel = "";
    function upd() {
      var ok = dSel && hSel && cSel; $("#a-send").disabled = $("#a-ics").disabled = !ok;
      if (ok) { $("#a-resumo").textContent = dn[dSel.getDay()] + ", " + dSel.getDate() + "/" + (dSel.getMonth() + 1) + " às " + hSel; $("#a-sub").textContent = cSel + " · horário de Brasília"; }
    }
    var dBox = $("#a-dias"); dias.forEach(function (dt) {
      var b = el("button", "chip", dn[dt.getDay()] + " " + dt.getDate() + "/" + mn[dt.getMonth()]); b.type = "button"; b.setAttribute("aria-pressed", "false");
      b.onclick = function () { Array.prototype.forEach.call(dBox.children, function (c) { c.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); dSel = dt; upd(); }; dBox.append(b);
    });
    chips($("#a-horas"), ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"], false, function (s) { hSel = s[0]; upd(); });
    chips($("#a-canal"), ["WhatsApp", "Ligação", "Videochamada"], false, function (s) { cSel = s[0]; upd(); });
    ["#a-nome", "#a-neg"].forEach(function (q) { $(q).maxLength = 80; });
    $("#a-send").onclick = function () { zap("Quero agendar uma conversa.\n• Nome: " + (clean($("#a-nome").value, 80) || "-") + "\n• Negócio: " + (clean($("#a-neg").value, 80) || "-") + "\n• Data: " + $("#a-resumo").textContent + "\n• Canal: " + cSel); };
    $("#a-ics").onclick = function () {
      var p = hSel.split(":"), s = new Date(dSel.getFullYear(), dSel.getMonth(), dSel.getDate(), +p[0], +p[1]), e = new Date(s.getTime() + 30 * 60000);
      var f = function (x) { return x.getFullYear() + ("0" + (x.getMonth() + 1)).slice(-2) + ("0" + x.getDate()).slice(-2) + "T" + ("0" + x.getHours()).slice(-2) + ("0" + x.getMinutes()).slice(-2) + "00"; };
      var ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//HULO//PT\r\nBEGIN:VEVENT\r\nUID:" + Date.now() + "@hulo\r\nDTSTAMP:" + f(new Date()) + "\r\nDTSTART:" + f(s) + "\r\nDTEND:" + f(e) + "\r\nSUMMARY:Conversa sobre o site - HULO\r\nDESCRIPTION:Canal: " + cSel + "\r\nEND:VEVENT\r\nEND:VCALENDAR";
      var a = el("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "conversa-hulo.ics"; a.click();
    };
  }

  /* PROCESSO */
  if (page === "processo") {
    var etapas = [
      ["ETAPA 1", "Conversa inicial", "Entendo seu negócio, seu público e seus objetivos.", ["Bate-papo sem compromisso", "Definição do tipo de site", "Combinamos prazo e plano"]],
      ["ETAPA 2", "Planejamento", "Organizo páginas, textos e funções antes de desenhar.", ["Estrutura das páginas", "Lista de funções", "Referências visuais"]],
      ["ETAPA 3", "Design", "Crio o visual com a identidade da sua marca.", ["Paleta e tipografia", "Layout para celular e computador", "Você aprova antes de seguir"]],
      ["ETAPA 4", "Desenvolvimento", "Transformo o design em um site rápido e funcional.", ["Código personalizado", "Testes em vários aparelhos", "Contato e WhatsApp configurados"]],
      ["ETAPA 5", "Revisão", "Ajustamos juntos os detalhes finais.", ["Correção de textos e imagens", "Verificação de links", "Aprovação final"]],
      ["ETAPA 6", "Publicação", "O site vai ao ar e você recebe orientações.", ["Publicação do site", "Orientação de uso", "Suporte para dúvidas"]]
    ], tl = $("#tl");
    etapas.forEach(function (e, i) {
      var c = el("div", "tl-card tool-card", '<em>' + (i + 1) + '</em><span class="tl-tag">' + e[0] + "</span><h3>" + e[1] + "</h3><p>" + e[2] + '</p><div class="tl-more"><ul>' + e[3].map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>");
      c.onclick = function () { c.classList.toggle("open"); }; tl.append(c);
    });
    function fill() { var r = tl.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height)); $("#tl-fill").style.height = p * 100 + "%"; }
    addEventListener("scroll", fill, { passive: true }); fill();
    var itens = ["Nome e logo da empresa (se tiver)", "Textos sobre o negócio e os serviços", "Fotos dos produtos, do espaço ou do trabalho", "Endereço, horários e contatos", "Redes sociais que deseja ligar ao site", "Exemplos de sites que você gosta", "Cores preferidas (ou as que já usa)"], ck = {};
    try { ck = JSON.parse(localStorage.getItem("hulo-check") || "{}"); } catch (e) {}
    var ul = $("#c-list");
    function prog() { var n = Object.keys(ck).filter(function (k) { return ck[k]; }).length; $("#c-bar").style.width = n / itens.length * 100 + "%"; $("#c-text").textContent = n + " de " + itens.length + " itens prontos" + (n === itens.length ? " — pode me chamar!" : ""); try { localStorage.setItem("hulo-check", JSON.stringify(ck)); } catch (e) {} }
    itens.forEach(function (t, i) { var li = el("li", ck[i] ? "on" : "", "<i>✓</i><span>" + t + "</span>"); li.onclick = function () { ck[i] = !ck[i]; li.classList.toggle("on", ck[i]); prog(); }; ul.append(li); }); prog();
  }

  /* FAQ */
  if (page === "faq") {
    var perg = [
      ["Prazo", "Quanto tempo leva para ficar pronto?", "Depende do tamanho do projeto e das funções. Na primeira conversa eu passo um prazo realista."],
      ["Prazo", "O que preciso enviar para começar?", "Textos, fotos e informações do negócio. Veja o checklist na página Como funciona."],
      ["Valores", "Quanto custa um site?", "Os planos partem de R$ 500 (Básico), R$ 800 (Profissional) e R$ 1000 (Site completo). Use a calculadora para ver o ideal."],
      ["Valores", "Posso começar pelo plano básico e evoluir depois?", "Pode. Dá para começar enxuto e ampliar conforme o negócio cresce."],
      ["Técnico", "Preciso ter domínio e hospedagem?", "Não precisa chegar com nada pronto. Eu te oriento na escolha e na configuração."],
      ["Técnico", "O site funciona bem no celular?", "Sim. Todos os projetos são pensados para telas pequenas e grandes."],
      ["Técnico", "O site vai aparecer no Google?", "Eu estruturo o site seguindo boas práticas de busca, mas o posicionamento depende de vários fatores e do tempo."],
      ["Suporte", "Posso pedir ajustes depois de publicado?", "Pode. Ajustes e manutenção podem ser combinados conforme a necessidade."],
      ["Suporte", "Como falo com você?", "Pelo WhatsApp, e-mail, formulário ou agendando uma conversa na página Agendar."],
      ["Processo", "Eu participo das decisões?", "Sim. Você aprova o design antes do desenvolvimento e revisa o resultado antes de publicar."],
      ["Processo", "Vocês criam logo e textos?", "Posso orientar o básico. Conversamos no primeiro contato sobre o que você já tem."]
    ], cats = ["Todas"].concat(perg.map(function (p) { return p[0]; }).filter(function (v, i, a) { return a.indexOf(v) === i; })), cat = "Todas", box = $("#f-list");
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    function mark(node, text, q) {
      if (!q) { node.textContent = text; return; }
      var i = text.toLowerCase().indexOf(q), at = 0;
      while (i > -1) { node.append(d.createTextNode(text.slice(at, i))); var m = d.createElement("mark"); m.textContent = text.slice(i, i + q.length); node.append(m); at = i + q.length; i = text.toLowerCase().indexOf(q, at); }
      node.append(d.createTextNode(text.slice(at)));
    }
    function render() {
      var q = $("#f-busca").value.trim().slice(0, 60).toLowerCase(), n = 0; box.innerHTML = "";
      perg.forEach(function (p) {
        if ((cat !== "Todas" && p[0] !== cat) || (q && (p[1] + p[2]).toLowerCase().indexOf(q) < 0)) return; n++;
        var it = el("div", "faq-item"), bt = el("button"), dv = el("div"), pp = el("p");
        bt.type = "button"; bt.setAttribute("aria-expanded", "false"); mark(bt, p[1], q); mark(pp, p[2], q); dv.append(pp); it.append(bt, dv);
        it.style.animation = "slideUp .4s " + n * 40 + "ms both"; if (q) it.classList.add("open");
        bt.onclick = function () { var o = it.classList.toggle("open"); bt.setAttribute("aria-expanded", String(o)); }; box.append(it);
      });
      $("#f-count").textContent = n + " resultado" + (n === 1 ? "" : "s"); $("#f-empty").hidden = n > 0;
    }
    chips($("#f-cats"), cats, false, function (s) { cat = s[0]; render(); });
    $("#f-busca").maxLength = 60; $("#f-cats").firstChild.click(); $("#f-busca").addEventListener("input", render);
    var wl = $(".whatsapp-link"); if (wl) wl.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent("Olá! Tenho uma dúvida sobre o site.");
  }
})();
