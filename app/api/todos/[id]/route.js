import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Todo from "@/models/Todo";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: todo._id.toString(),
      text: todo.text,
      completed: todo.completed
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Prevent ID modification attempts
    if (body.id) {
       return NextResponse.json({ error: "Changing ID is not allowed." }, { status: 403 });
    }

    // Find by ID and update. { new: true } returns the updated document.
    const updatedTodo = await Todo.findByIdAndUpdate(id, body, { new: true });

    if (!updatedTodo) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedTodo._id.toString(),
      text: updatedTodo.text,
      completed: updatedTodo.completed
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}