import {
  addToCartState,
  formatCoins,
  getCartCount,
  getCartQuantity,
  loadCart,
  removeFromCartState,
  saveCart,
} from "./cartStore.js";

const productGrid = document.querySelector("#product-grid");
const statusBox = document.querySelector("#store-status");
const headerCartCount = document.querySelector("#header-cart-count");

let potionsState = [];
let cartState = loadCart();

function updateHeaderCartCount() {
  headerCartCount.textContent = String(getCartCount(cartState));
}

function addToCart(potionId) {
  cartState = addToCartState(cartState, potionId);
  saveCart(cartState);
  renderCatalog();
  updateHeaderCartCount();
}

function removeFromCart(potionId) {
  cartState = removeFromCartState(cartState, potionId);
  saveCart(cartState);
  renderCatalog();
  updateHeaderCartCount();
}

function createPotionCard(potion) {
  const card = document.createElement("article");
  card.className = "product-card";

  const media = document.createElement("div");
  media.className = "product-media";

  const image = document.createElement("img");
  image.src = potion.image;
  image.alt = `Imagem de ${potion.name}`;
  image.loading = "lazy";

  const title = document.createElement("h3");
  title.textContent = potion.name;

  const description = document.createElement("p");
  description.textContent = potion.description;

  const footer = document.createElement("div");
  footer.className = "product-footer";

  const priceRow = document.createElement("div");
  priceRow.className = "product-price-row";

  const price = document.createElement("strong");
  price.textContent = formatCoins(potion.price);

  const quantity = getCartQuantity(cartState, potion.id);
  const cartInfo = document.createElement("span");
  cartInfo.className = "product-cart-info";
  cartInfo.textContent =
    quantity > 0 ? `${quantity} no carrinho` : "Ainda não adicionada";

  const actions = document.createElement("div");
  actions.className = "product-actions";

  const addButton = document.createElement("button");
  addButton.className = "button button-primary";
  addButton.type = "button";
  addButton.textContent = "Adicionar";
  addButton.addEventListener("click", () => addToCart(potion.id));

  actions.append(addButton);

  if (quantity > 0) {
    const removeButton = document.createElement("button");
    removeButton.className = "button button-secondary button-small";
    removeButton.type = "button";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", () => removeFromCart(potion.id));
    actions.append(removeButton);
  }

  priceRow.append(price, cartInfo);
  media.append(image);
  footer.append(priceRow, actions);
  card.append(media, title, description, footer);

  return card;
}

function renderCatalog() {
  productGrid.replaceChildren(...potionsState.map(createPotionCard));
}

async function loadPotions() {
  statusBox.textContent = "Carregando poções...";
  statusBox.classList.remove("status-error", "status-success");

  try {
    const response = await fetch("/api/potions");

    if (!response.ok) {
      throw new Error("Falha ao buscar o catálogo.");
    }

    potionsState = await response.json();
    renderCatalog();
    updateHeaderCartCount();

    statusBox.textContent =
      potionsState.length > 0
        ? `${potionsState.length} poções disponíveis no momento.`
        : "Nenhuma poção cadastrada.";
    statusBox.classList.add("status-success");
  } catch (error) {
    statusBox.textContent =
      "Não foi possível carregar as poções. Tente novamente em instantes.";
    statusBox.classList.add("status-error");
  }
}

function initHistoryCarousel() {
  const carousel = document.querySelector("[data-history-carousel]");
  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");

  if (slides.length === 0) {
    return;
  }

  let currentIndex = slides.findIndex((slide) =>
    slide.classList.contains("is-active")
  );

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  let intervalId = null;

  function renderSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = window.setInterval(() => {
      renderSlide(currentIndex + 1);
    }, 6000);
  }

  function stopAutoplay() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  prevButton?.addEventListener("click", () => {
    renderSlide(currentIndex - 1);
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    renderSlide(currentIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      renderSlide(dotIndex);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  renderSlide(currentIndex);
  startAutoplay();
}

initHistoryCarousel();
updateHeaderCartCount();
loadPotions();
