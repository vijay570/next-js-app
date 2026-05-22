import connectDB from "@/lib/connectDB";
import Todo from "@/models/todoModel";
import { getLoggedInUser } from "@/lib/auth";

export async function GET(_, { params }) {
  try {
    await connectDB();
    const result = await getLoggedInUser();
    if (result instanceof Response) return result;

    const { id } = await params;
    const todo = await Todo.findOne({ _id: id, userId: result._id });

    if (!todo) return Response.json({ error: "Todo not found" }, { status: 404 });
    return Response.json(todo);
  } catch (err) {
    console.error("GET /api/todos/[id] ERROR:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const result = await getLoggedInUser();
    if (result instanceof Response) return result;

    const { id } = await params;
    const editTodoData = await request.json();
    const editedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId: result._id },
      editTodoData,
      { new: true }
    );

    if (!editedTodo) return Response.json({ error: "Todo not found" }, { status: 404 });
    return Response.json(editedTodo);
  } catch (err) {
    console.error("PUT /api/todos/[id] ERROR:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const result = await getLoggedInUser();
    if (result instanceof Response) return result;

    const { id } = await params;
    await Todo.findOneAndDelete({ _id: id, userId: result._id });

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/todos/[id] ERROR:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}