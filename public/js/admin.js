const form = document.querySelector("#potion-form");
const feedback = document.querySelector("#admin-feedback");
const statusBox = document.querySelector("#admin-status");
const adminList = document.querySelector("#admin-list");
const refreshButton = document.querySelector("#refresh-button");

function formatCoins(value) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} moedas`;
}

function setMessage(element, message, type = "") {
  element.textContent = message;
  element.classList.remove("status-error", "status-success");

  if (type) {
    element.classList.add(type);
  }
}

function createAdminItem(potion) {
  const item = document.createElement("article");
  item.className = "admin-item";

  const media = document.createElement("div");
  media.className = "admin-media";

  const image = document.createElement("img");
  image.src = potion.image;
  image.alt = `Imagem de ${potion.name}`;
  image.loading = "lazy";

  const content = document.createElement("div");
  content.className = "admin-item-content";

  const title = document.createElement("h3");
  title.textContent = potion.name;

  const description = document.createElement("p");
  description.textContent = potion.description;

  const price = document.createElement("strong");
  price.textContent = formatCoins(potion.price);

  const removeButton = document.createElement("button");
  removeButton.className = "button button-danger";
  removeButton.type = "button";
  removeButton.textContent = "Remover";
  removeButton.addEventListener("click", async () => {
    await deletePotion(potion.id);
  });

  media.append(image);
  content.append(title, description, price, removeButton);
  item.append(media, content);

  return item;
}

async function fetchPotions() {
  setMessage(statusBox, "Carregando estoque...");

  const response = await fetch("/api/potions");
  if (!response.ok) {
    throw new Error("Falha ao carregar o estoque.");
  }

  const potions = await response.json();
  adminList.replaceChildren(...potions.map(createAdminItem));
  setMessage(
    statusBox,
    potions.length > 0
      ? `${potions.length} poções cadastradas.`
      : "Nenhuma poção cadastrada.",
    "status-success"
  );
}

async function submitPotion(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    price: Number(formData.get("price")),
  };

  setMessage(feedback, "Salvando poção...");

  try {
    const response = await fetch("/api/potions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.errors?.join(" ") || "Falha ao cadastrar poção.";
      throw new Error(message);
    }

    form.reset();
    setMessage(feedback, "Poção cadastrada com sucesso.", "status-success");
    await fetchPotions();
  } catch (error) {
    setMessage(feedback, error.message, "status-error");
  }
}

async function deletePotion(id) {
  setMessage(feedback, "Removendo poção...");

  try {
    const response = await fetch(`/api/potions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Falha ao remover poção.");
    }

    setMessage(feedback, "Poção removida com sucesso.", "status-success");
    await fetchPotions();
  } catch (error) {
    setMessage(feedback, error.message, "status-error");
  }
}

form.addEventListener("submit", submitPotion);
refreshButton.addEventListener("click", () => {
  fetchPotions().catch((error) => {
    setMessage(statusBox, error.message, "status-error");
  });
});

fetchPotions().catch((error) => {
  setMessage(statusBox, error.message, "status-error");
});
