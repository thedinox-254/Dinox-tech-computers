const config = window.DYNOX_CONFIG;
const grid = document.getElementById("serviceGrid");
const search = document.getElementById("serviceSearch");
const noResults = document.getElementById("noResults");
let activeFilter = "all";

function waLink(message) {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
function renderServices() {
  const query = search.value.trim().toLowerCase();
  const matches = window.DYNOX_SERVICES.filter(service => {
    const inCategory = activeFilter === "all" || service.category === activeFilter;
    const searchable = `${service.name} ${service.description} ${service.category} ${service.price}`.toLowerCase();
    return inCategory && searchable.includes(query);
  });
  grid.innerHTML = matches.map((s, i) => `
    <article class="service-card">
      <div class="card-top"><span class="card-icon ${s.tone}">${s.icon}</span><span class="card-category">${s.category}</span></div>
      <h3>${s.name}</h3><p>${s.description}</p>
      <div class="card-bottom"><span class="price">${s.price} <small>service fee</small></span>
      <button class="book-btn" data-service="${encodeURIComponent(s.name)}" data-price="${encodeURIComponent(s.price)}">Book now ↗</button></div>
    </article>`).join("");
  noResults.hidden = matches.length !== 0;
}
document.getElementById("categoryFilters").addEventListener("click", e => {
  const button = e.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
  renderServices();
});
search.addEventListener("input", renderServices);
grid.addEventListener("click", e => {
  const button = e.target.closest("[data-service]");
  if (!button) return;
  const service = decodeURIComponent(button.dataset.service);
  const price = decodeURIComponent(button.dataset.price);
  const message = `Hello Dynox Tech Computers. I would like to book: ${service}. Listed service fee: ${price}. Please guide me on the requirements, any separate official charges and the next steps.`;
  window.open(waLink(message), "_blank", "noopener");
});
document.getElementById("mainWhatsApp").href = waLink("Hello Dynox Tech Computers. I would like to make an enquiry about your services.");
document.getElementById("floatingWhatsApp").href = waLink("Hello Dynox Tech Computers. I need help with a digital service.");
document.getElementById("year").textContent = new Date().getFullYear();
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));
renderServices();
