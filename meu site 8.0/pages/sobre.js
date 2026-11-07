const principles = document.querySelectorAll(".principle");

principles.forEach((principle, index) => {
  principle.style.setProperty("--principle-order", String(index));
  principle.addEventListener("pointerenter", () => principle.classList.add("is-emphasized"));
  principle.addEventListener("pointerleave", () => principle.classList.remove("is-emphasized"));
});
