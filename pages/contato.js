const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const whatsappNumber = "5511941878821";

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const lines = [
      "Olá! Quero conversar sobre um site para o meu negócio.",
      `Meu nome: ${formData.get("name")}`,
      `Negócio: ${formData.get("business")}`,
      `Tipo de projeto: ${formData.get("service")}`,
    ];
    const projectMessage = String(formData.get("message") || "").trim();
    if (projectMessage) lines.push(`Minha ideia: ${projectMessage}`);

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (formNote) formNote.textContent = "Sua mensagem está pronta no WhatsApp. Revise e envie quando quiser.";
  });
}
