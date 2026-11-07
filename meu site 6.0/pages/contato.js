const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const whatsappNumber = "5511941878821";
const planSelect = document.querySelector("#project-plan");
const planFromUrl = new URLSearchParams(window.location.search).get("plano");
let lastSend = 0;

// Remove caracteres de controle, setas de direção invisíveis e < > ; limita o tamanho.
const clean = (value, max) =>
  String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069<>]/g, "")
    .trim()
    .slice(0, max);

if (planSelect && ["basico", "profissional", "completo"].includes(planFromUrl)) {
  planSelect.value = planFromUrl;
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    if (Date.now() - lastSend < 4000) return; // evita cliques repetidos
    lastSend = Date.now();

    const formData = new FormData(contactForm);
    const lines = [
      "Olá! Quero conversar sobre um site para o meu negócio.",
      `Meu nome: ${clean(formData.get("name"), 80)}`,
      `Negócio: ${clean(formData.get("business"), 100)}`,
      `Tipo de projeto: ${clean(formData.get("service"), 60)}`,
    ];
    const selectedPlan = planSelect?.selectedOptions[0];
    if (selectedPlan?.value) lines.push(`Plano de interesse: ${clean(selectedPlan.textContent, 40)}`);

    const projectMessage = clean(formData.get("message"), 800);
    if (projectMessage) lines.push(`Minha ideia: ${projectMessage}`);

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (formNote) formNote.textContent = "Sua mensagem está pronta no WhatsApp. Revise e envie quando quiser.";
  });
}
