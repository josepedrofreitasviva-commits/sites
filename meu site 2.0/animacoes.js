/* HULO — interações extras: brilho que segue o mouse nos cards e botões "magnéticos". */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  // Brilho dourado acompanhando o cursor dentro dos cards
  var cards = document.querySelectorAll('.service-card, .detail-service, .process-step');
  cards.forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Botões levemente atraídos pelo cursor (usa a propriedade "translate", sem brigar com o hover em CSS)
  var magnets = document.querySelectorAll('.button, .nav-contact, .pricing-cta');
  magnets.forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) * 0.18;
      var y = (e.clientY - (r.top + r.height / 2)) * 0.28;
      el.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
    });
    el.addEventListener('pointerleave', function () {
      el.style.translate = '';
    });
  });
})();
