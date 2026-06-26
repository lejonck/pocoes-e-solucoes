const cartStorageKey = "pocoes-e-solucoes-cart";

export function formatCoins(value) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} moedas`;
}

export function loadCart() {
  try {
    const raw = window.localStorage.getItem(cartStorageKey);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, quantity]) => Number.isInteger(quantity) && quantity > 0
      )
    );
  } catch {
    return {};
  }
}

export function saveCart(cartState) {
  try {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartState));
  } catch {
    // Ignora falhas de persistencia e mantem o estado em memoria.
  }
}

export function getCartQuantity(cartState, potionId) {
  return cartState[potionId] ?? 0;
}

export function addToCartState(cartState, potionId) {
  return {
    ...cartState,
    [potionId]: getCartQuantity(cartState, potionId) + 1,
  };
}

export function removeFromCartState(cartState, potionId) {
  const quantity = getCartQuantity(cartState, potionId);
  if (quantity <= 1) {
    const nextState = { ...cartState };
    delete nextState[potionId];
    return nextState;
  }

  return {
    ...cartState,
    [potionId]: quantity - 1,
  };
}

export function getCartItems(cartState, potionsState) {
  return Object.entries(cartState)
    .map(([id, quantity]) => {
      const potion = potionsState.find((item) => item.id === Number(id));
      if (!potion) {
        return null;
      }

      return {
        potion,
        quantity,
      };
    })
    .filter(Boolean);
}

export function getCartCount(cartState) {
  return Object.values(cartState).reduce((sum, quantity) => sum + quantity, 0);
}

export function getCartTotal(cartState, potionsState) {
  return getCartItems(cartState, potionsState).reduce(
    (sum, item) => sum + item.quantity * item.potion.price,
    0
  );
}
