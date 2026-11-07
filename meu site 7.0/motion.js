/* HULO — animações discretas: entrada em cascata nas grades e menu Ferramentas. */
(function () {
  var d = document, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $$ = function (s) { return Array.prototype.slice.call(d.querySelectorAll(s)); };
  if (!reduce) {
    var io = new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); o.unobserve(e.target); } }); }, { threshold: .12 });
    $$(".service-grid,.benefit-list,.pricing-grid,.steps,.portfolio-grid,.values-row,.services-detail-grid,.compare-row,.timeline").forEach(function (g) {
      g.classList.add("stagger"); Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty("--i", i); }); io.observe(g);
    });
  }
  $$(".nav-more").forEach(function (m) {
    var b = m.querySelector(".nav-more-btn");
    b.addEventListener("click", function (e) { e.stopPropagation(); var o = m.classList.toggle("open"); b.setAttribute("aria-expanded", String(o)); });
    d.addEventListener("click", function () { m.classList.remove("open"); b.setAttribute("aria-expanded", "false"); });
  });
})();
