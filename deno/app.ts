import { Application, Context } from "https://deno.land/x/oak@v17.2.0/mod.ts";
import todosRoutes from "./routes/todos.ts";
import { connect } from "./helpers/db_client.ts";

await connect();

const app = new Application();

app.use(async (ctx: Context, next: () => Promise<unknown>) => {
  console.log("Middleware!");
  await next();
});

app.use(async (ctx: Context, next: () => Promise<unknown>) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

console.log("🚀 Server running on http://localhost:8000");
await app.listen({ port: 8000 });
