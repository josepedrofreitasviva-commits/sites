const processSteps = document.querySelectorAll(".process-step");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!motionPreference.matches && "IntersectionObserver" in window) {
  const stepObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("step-arrived");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  processSteps.forEach((step, index) => {
    step.style.setProperty("--step-order", String(index));
    stepObserver.observe(step);
  });
}
