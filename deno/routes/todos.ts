import { Context, Router } from "https://deno.land/x/oak@v17.2.0/mod.ts";

interface Todo {
  id: string;
  text: string;
}

interface CreateTodoBody {
  text: string;
}

const router = new Router();

let todos: Todo[] = [];

router.get("/todos", (ctx: Context) => {
  ctx.response.body = { todos };
});

router.post("/todos", async (ctx: Context) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Request body required" };
    return;
  }
  let value: CreateTodoBody;
  try {
    value = await ctx.request.body.json();
  } catch {
    ctx.response.status = 415;
    ctx.response.body = { message: "Invalid JSON body" };
    return;
  }

  if (!value?.text) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Missing 'text' field" };
    return;
  }

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: value.text,
  };

  todos.push(newTodo);

  ctx.response.status = 201;
  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx: Context) => {
  const todoId = ctx.params.todoId;
  if (!todoId) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Todo ID missing" };
    return;
  }

  let value: CreateTodoBody;
  try {
    value = await ctx.request.body.json();
  } catch {
    ctx.response.status = 415;
    ctx.response.body = { message: "Invalid JSON body" };
    return;
  }

  if (!value?.text) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Missing 'text' field" };
    return;
  }

  const todoIndex = todos.findIndex((t) => t.id === todoId);
  if (todoIndex === -1) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Todo not found" };
    return;
  }

  todos[todoIndex].text = value.text;
  ctx.response.body = { message: "Updated todo" };
});

router.delete("/todos/:todoId", (ctx: Context) => {
  const todoId = ctx.params.todoId;
  if (!todoId) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Todo ID missing" };
    return;
  }

  todos = todos.filter((t) => t.id !== todoId);
  ctx.response.body = { message: "Deleted todo" };
});

export default router;
