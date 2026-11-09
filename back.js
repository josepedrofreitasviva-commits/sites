// Segurança: impede que o site seja carregado dentro de iframe de terceiros (clickjacking).
if (window.top !== window.self) {
  document.documentElement.hidden = true;
  try { window.top.location = window.self.location; } catch (e) {}
}
// Personalize estes campos antes de publicar o site.
const WHATSAPP_NUMBER = "5511916563119"; 
const CONTACT_EMAIL = ["hulosites", "gmail.com"].join("@"); // Exemplo: contato@seudominio.com.br

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

const pageRoutes = {
  "#sobre": "sobre.html",
  "#servicos": "servicos.html",
  "#portfolio": "portfolio.html",
  "#vantagens": "vantagens.html",
  "#contato": "contato.html",
  "#topo": "index.html",
};

document.querySelectorAll("a").forEach((link) => {
  const raw = link.getAttribute("href");
  if (raw && Object.prototype.hasOwnProperty.call(pageRoutes, raw)) {
    link.href = pageRoutes[raw];
  }
  if (/^https?:/.test(link.getAttribute("href") || "")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      siteNav.classList.remove("is-open");
    });
  });
}

const whatsappMessage = "Olá! Quero conversar sobre um site para o meu negócio.";
const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
  : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.href = whatsappHref;
});

const emailLink = document.querySelector(".email-link-js");
if (emailLink) {
  const subject = encodeURIComponent("Projeto de site");
  emailLink.href = `mailto:${CONTACT_EMAIL}?subject=${subject}`;
  if (CONTACT_EMAIL) {
    const emailLabel = emailLink.querySelector(".email-address");
    if (emailLabel) emailLabel.textContent = `${CONTACT_EMAIL} ↗`;
  }
}

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
  window.setTimeout(() => {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
      observer.unobserve(element);
    });
  }, 900);
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

