const heroArt = document.querySelector(".hero-art");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroArt && !reduceMotion) {
  heroArt.addEventListener("pointermove", (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroArt.style.setProperty("--glow-x", `${x * 12}px`);
    heroArt.style.setProperty("--glow-y", `${y * 12}px`);
  });

  heroArt.addEventListener("pointerleave", () => {
    heroArt.style.setProperty("--glow-x", "0px");
    heroArt.style.setProperty("--glow-y", "0px");
  });
}
