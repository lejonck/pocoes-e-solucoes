import { Sequelize } from "sequelize";
import { definePotionModel } from "./models/Potion.js";
import { initialPotions } from "./seed/potions.js";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

export const Potion = definePotionModel(sequelize);

export async function resetDatabase() {
  await sequelize.sync({ force: true });
  await Potion.bulkCreate(initialPotions);
}

export async function closeDatabase() {
  await sequelize.close();
}
