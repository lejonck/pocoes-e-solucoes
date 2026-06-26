import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createPotion, deletePotion, listPotions } from "./potionController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/potions", listPotions);
  app.post("/api/potions", createPotion);
  app.delete("/api/potions/:id", deletePotion);

  app.use(express.static(publicDir));

  app.get("/carrinho", (req, res) => {
    res.sendFile(path.join(publicDir, "cart.html"));
  });

  app.get("/admin", (req, res) => {
    res.sendFile(path.join(publicDir, "admin.html"));
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
      message: "Erro interno do servidor.",
    });
  });

  return app;
}
