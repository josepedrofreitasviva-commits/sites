const placeholders = document.querySelectorAll(".portfolio-placeholder, .portfolio-empty-card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

placeholders.forEach((card, index) => {
  card.style.setProperty("--card-order", String(index));
  if (reduceMotion) return;

  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--pointer-x", `${x * 8}px`);
    card.style.setProperty("--pointer-y", `${y * 8}px`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--pointer-x", "0px");
    card.style.setProperty("--pointer-y", "0px");
  });
});
