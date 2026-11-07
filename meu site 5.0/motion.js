/* HULO — motor de animações: títulos por palavra, cascata, tilt 3D, ripple, cursor, partículas, parallax, transição de página */
(function () {
  var d = document, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  function io(cb, th) { return new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { o.unobserve(e.target); cb(e.target); } }); }, { threshold: th || .15 }); }

  // Títulos revelados palavra por palavra
  var sObs = io(function (h) { h.classList.add("split-in"); }, .3);
  function split(node, k) {
    Array.prototype.slice.call(node.childNodes).forEach(function (c) {
      if (c.nodeType === 3) {
        var f = d.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return; if (/^\s+$/.test(p)) return f.appendChild(d.createTextNode(" "));
          var w = d.createElement("span"); w.className = "w"; var i = d.createElement("i"); i.style.setProperty("--k", k.n++); i.textContent = p; w.appendChild(i); f.appendChild(w);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && c.tagName !== "BR") { c.classList.add("split-fade"); }
    });
  }
  if (!reduce) $$("h1,.x-head h2,.section-heading h2,.benefits-intro h2,.contact-content h2").forEach(function (h) { split(h, { n: 0 }); sObs.observe(h); });

  // Cascata em grades
  var grids = ".service-grid,.benefit-list,.pricing-grid,.stats,.steps,.portfolio-grid,.values-row,.services-detail-grid,.compare-row,.timeline";
  var gObs = io(function (g) { g.classList.add("is-in"); }, .12);
  $$(grids).forEach(function (g) { g.classList.add("stagger"); Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty("--i", i); }); gObs.observe(g); });
  // Setas laterais alternadas nos blocos de duas colunas
  $$(".intro-content,.hero-copy").forEach(function (e) { e.classList.add("from-left"); gObs.observe(e); });
  $$(".hero-art,.contact-art,.benefits-intro+.benefit-list").forEach(function (e) { e.classList.add("from-right"); gObs.observe(e); });

  // Tilt 3D + spotlight
  if (fine && !reduce) $$(".service-card,.detail-service,.pricing-card,.benefit-item,.step,.stat,.tool-card:not(.quiz):not(.score-card)").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--rx", ((.5 - y) * 9).toFixed(2) + "deg"); c.style.setProperty("--ry", ((x - .5) * 11).toFixed(2) + "deg");
      c.style.setProperty("--mx", (x * 100) + "%"); c.style.setProperty("--my", (y * 100) + "%");
    });
    c.addEventListener("pointerleave", function () { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
  });

  // Ripple nos botões
  d.addEventListener("pointerdown", function (e) {
    var b = e.target.closest(".button,.chip,.filter-button,.dock button,.dock a"); if (!b || reduce) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, p = d.createElement("span");
    p.className = "rip"; p.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
    if (getComputedStyle(b).position === "static") b.style.position = "relative"; b.style.overflow = "hidden"; b.appendChild(p); setTimeout(function () { p.remove(); }, 750);
  });

  // Partículas conectadas no hero
  var hero = d.querySelector(".hero");
  if (hero && !reduce) {
    var cv = d.createElement("canvas"); cv.className = "hero-canvas"; hero.prepend(cv); var x = cv.getContext("2d"), pts = [], W, H;
    function size() { W = cv.width = hero.offsetWidth; H = cv.height = hero.offsetHeight; pts = []; for (var i = 0; i < Math.min(70, W / 18); i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }); }
    size(); addEventListener("resize", size);
    var vis = true; new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(hero);
    (function draw() {
      if (vis) {
        x.clearRect(0, 0, W, H);
        pts.forEach(function (p, i) {
          p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
          x.fillStyle = "rgba(14,165,233,.7)"; x.beginPath(); x.arc(p.x, p.y, 1.6, 0, 6.3); x.fill();
          for (var j = i + 1; j < pts.length; j++) { var q = pts[j], dd = Math.hypot(p.x - q.x, p.y - q.y); if (dd < 130) { x.strokeStyle = "rgba(255,46,147," + (.22 * (1 - dd / 130)) + ")"; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke(); } }
        });
      }
      requestAnimationFrame(draw);
    })();
  }

  // Parallax suave no scroll e no mouse
  if (!reduce) {
    var bl = $$(".aurora i"), art = d.querySelector(".hero-art"), tx = 0, ty = 0;
    addEventListener("pointermove", function (e) { tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); }, { passive: true });
    (function par() {
      var s = scrollY; bl.forEach(function (b, i) { b.style.transform = "translate(" + (tx * 40 * (i + 1)) + "px," + (s * (.05 + i * .03) + ty * 30 * (i + 1)) + "px)"; });
      if (art) art.style.transform = "translate(" + (tx * -14) + "px," + (ty * -10 - s * .04) + "px)";
      requestAnimationFrame(par);
    })();
  }

  // Menu Ferramentas (clique / teclado)
  $$(".nav-more").forEach(function (m) {
    var b = m.querySelector(".nav-more-btn");
    b.addEventListener("click", function (e) { e.stopPropagation(); var o = m.classList.toggle("open"); b.setAttribute("aria-expanded", String(o)); });
    d.addEventListener("click", function () { m.classList.remove("open"); b.setAttribute("aria-expanded", "false"); });
  });

  // Transição ao trocar de página
  d.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]"); if (!a || e.ctrlKey || e.metaKey || e.shiftKey || a.target === "_blank" || reduce) return;
    var u = a.getAttribute("href"); if (!u || u[0] === "#" || !/^[\w\-.\/]+(\?[\w=&\-]*)?(#[\w\-]*)?$/.test(u) || u.indexOf("//") === 0) return;
    e.preventDefault(); d.body.classList.add("leaving"); setTimeout(function () { location.href = u; }, 260);
  });
  addEventListener("pageshow", function (e) { if (e.persisted) d.body.classList.remove("leaving"); });
})();
