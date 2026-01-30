import { Context, Router } from "https://deno.land/x/oak@v17.2.0/mod.ts";
import { ObjectId } from "npm:mongodb";
import { getDb } from "../helpers/db_client.ts";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

interface TodoDoc {
  _id: ObjectId;
  text: string;
}

/**
 * GET /todos
 * Same logic as old file, updated for new Mongo cursor API
 */
router.get("/todos", async (ctx: Context) => {
  const todos = await getDb().collection<TodoDoc>("todos").find().toArray();

  const transformedTodos = todos.map((todo: TodoDoc) => ({
    id: todo._id.toString(),
    text: todo.text,
  }));

  ctx.response.body = { todos: transformedTodos };
});

/**
 * POST /todos
 * Equivalent to old ctx.request.body().value usage
 */
router.post("/todos", async (ctx: Context) => {
  const data = await ctx.request.body.json();

  const newTodo: Todo = {
    text: data.text,
  };

  const insertId = await getDb()
    .collection("todos")
    .insertOne({ text: newTodo.text });

  newTodo.id = insertId.toString();

  ctx.response.body = {
    message: "Created todo!",
    todo: newTodo,
  };
});

/**
 * PUT /todos/:todoId
 * Direct Mongo update (same as old file)
 */
router.put("/todos/:todoId", async (ctx: Context) => {
  const tid = ctx.params.todoId!;

  const data = await ctx.request.body.json();

  await getDb()
    .collection("todos")
    .updateOne({ _id: new ObjectId(tid) }, { $set: { text: data.text } });

  ctx.response.body = { message: "Updated todo" };
});

/**
 * DELETE /todos/:todoId
 * Direct Mongo delete (same as old file)
 */
router.delete("/todos/:todoId", async (ctx: Context) => {
  const tid = ctx.params.todoId!;

  await getDb()
    .collection("todos")
    .deleteOne({ _id: new ObjectId(tid) });

  ctx.response.body = { message: "Deleted todo" };
});

export default router;
