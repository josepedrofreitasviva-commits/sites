// Personalize estes campos antes de publicar o site.
const WHATSAPP_NUMBER = "5511941878821"; // Exemplo: 5511999999999 (código do país + DDD + número, sem símbolos)
const CONTACT_EMAIL = "josepedrofreitasviva@gmail.com"; // Exemplo: contato@seudominio.com.br

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
  if (pageRoutes[link.getAttribute("href")]) {
    link.href = pageRoutes[link.getAttribute("href")];
  }
  link.target = "_blank";
  link.rel = "noopener noreferrer";
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

