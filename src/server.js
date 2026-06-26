import { createApp } from "./app.js";
import { resetDatabase } from "./database.js";

const port = Number(process.env.PORT) || 3000;

await resetDatabase();

const app = createApp();

app.listen(port, () => {
  console.log(`Poções e Soluções em http://localhost:${port}`);
});
