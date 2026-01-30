import express, { json } from "express";
import todoRoutes from "./routes/todos";

const app = express();

app.use(json());

app.use((req, res, next) => {
  console.log("Some middleware!");
  next();
});

app.use(todoRoutes);

app.listen(3000, () => {
  console.log("Listening to 3000");
});
