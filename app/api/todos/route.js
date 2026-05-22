// app/api/todos/route.js
import connectDB from "@/lib/connectDB";
import Todo from "@/models/todoModel";
import { getLoggedInUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const result = await getLoggedInUser();
    if (result instanceof Response) return result;

    const allTodos = await Todo.find({ userId: result._id });
    return Response.json(
      allTodos.map(({ id, text, completed }) => ({ id, text, completed }))
    );
  } catch (err) {
    console.error("GET /api/todos ERROR:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const result = await getLoggedInUser();
    if (result instanceof Response) return result;

    const { text } = await request.json();
    const { id, completed } = await Todo.create({ text, userId: result._id });

    return Response.json({ id, text, completed }, { status: 201 });
  } catch (err) {
    console.error("POST /api/todos ERROR:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}