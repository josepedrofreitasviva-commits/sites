const filterButtons = document.querySelectorAll(".filter-button");
const serviceCards = document.querySelectorAll(".detail-service");
const filterStatus = document.querySelector(".filter-status");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    serviceCards.forEach((card) => {
      const shouldShow = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.hidden = !shouldShow;
      if (shouldShow) {
        visibleCount += 1;
        card.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 360, easing: "ease-out" });
      }
    });

    if (filterStatus) filterStatus.textContent = `Exibindo ${visibleCount} ${visibleCount === 1 ? "serviço" : "serviços"}`;
  });
});
