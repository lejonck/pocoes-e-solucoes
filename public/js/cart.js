import {
  formatCoins,
  getCartCount,
  getCartItems,
  getCartTotal,
  loadCart,
  removeFromCartState,
  saveCart,
} from "./cartStore.js";

const statusBox = document.querySelector("#cart-page-status");
const cartPageList = document.querySelector("#cart-page-list");
const cartPageEmpty = document.querySelector("#cart-page-empty");
const cartPageCount = document.querySelector("#cart-page-count");
const cartPageTotal = document.querySelector("#cart-page-total");
const headerCartCount = document.querySelector("#header-cart-count");

let potionsState = [];
let cartState = loadCart();

function updateHeaderCartCount() {
  headerCartCount.textContent = String(getCartCount(cartState));
}

function removeFromCart(potionId) {
  cartState = removeFromCartState(cartState, potionId);
  saveCart(cartState);
  renderCartPage();
}

function createCartItem({ potion, quantity }) {
  const item = document.createElement("article");
  item.className = "cart-item cart-item-large";

  const image = document.createElement("img");
  image.src = potion.image;
  image.alt = `Imagem de ${potion.name}`;
  image.loading = "lazy";

  const content = document.createElement("div");
  content.className = "cart-item-content";

  const title = document.createElement("h4");
  title.textContent = potion.name;

  const description = document.createElement("p");
  description.textContent = potion.description;

  const meta = document.createElement("p");
  meta.textContent = `${quantity} unidade${quantity > 1 ? "s" : ""}`;

  const subtotal = document.createElement("strong");
  subtotal.textContent = formatCoins(potion.price * quantity);

  const removeButton = document.createElement("button");
  removeButton.className = "button button-secondary button-small";
  removeButton.type = "button";
  removeButton.textContent = "Remover";
  removeButton.addEventListener("click", () => removeFromCart(potion.id));

  content.append(title, description, meta, subtotal, removeButton);
  item.append(image, content);

  return item;
}

function renderCartPage() {
  const items = getCartItems(cartState, potionsState);
  cartPageList.replaceChildren(...items.map(createCartItem));
  cartPageEmpty.hidden = items.length > 0;
  cartPageCount.textContent = String(getCartCount(cartState));
  cartPageTotal.textContent = formatCoins(getCartTotal(cartState, potionsState));
  updateHeaderCartCount();

  statusBox.textContent =
    items.length > 0
      ? `${items.length} tipo${items.length > 1 ? "s" : ""} de poção no carrinho.`
      : "Seu carrinho está vazio no momento.";
  statusBox.classList.add(items.length > 0 ? "status-success" : "status-error");
}

async function loadPotions() {
  statusBox.textContent = "Carregando carrinho...";
  statusBox.classList.remove("status-error", "status-success");

  try {
    const response = await fetch("/api/potions");
    if (!response.ok) {
      throw new Error("Falha ao carregar o carrinho.");
    }

    potionsState = await response.json();
    renderCartPage();
  } catch (error) {
    statusBox.textContent = "Não foi possível carregar o carrinho.";
    statusBox.classList.add("status-error");
  }
}

updateHeaderCartCount();
loadPotions();
