import { Potion } from "./database.js";

export function validatePotionPayload(body) {
  const name = String(body?.name ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const image = String(body?.image ?? "").trim();
  const price = Number(body?.price);

  const errors = [];

  if (name.length < 2) {
    errors.push("O nome deve ter pelo menos 2 caracteres.");
  }

  if (description.length < 10) {
    errors.push("A descrição deve ter pelo menos 10 caracteres.");
  }

  if (image.length < 3) {
    errors.push("A imagem deve ser uma URL ou caminho válido.");
  }

  if (!Number.isInteger(price) || price < 1) {
    errors.push("O preço deve ser um número inteiro maior que zero.");
  }

  return {
    data: {
      name,
      description,
      image,
      price,
    },
    errors,
  };
}

export async function listPotions(req, res, next) {
  try {
    const potions = await Potion.findAll({
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
    });

    res.json(potions);
  } catch (error) {
    next(error);
  }
}

export async function createPotion(req, res, next) {
  try {
    const { data, errors } = validatePotionPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const potion = await Potion.create(data);
    return res.status(201).json(potion);
  } catch (error) {
    next(error);
  }
}

export async function deletePotion(req, res, next) {
  try {
    const potion = await Potion.findByPk(req.params.id);

    if (!potion) {
      return res.status(404).json({ message: "Poção não encontrada." });
    }

    await potion.destroy();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
