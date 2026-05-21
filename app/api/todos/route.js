import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Todo from "@/models/Todo";

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find({});
    
    const formattedTodos = todos.map(todo => ({
      id: todo._id.toString(),
      // This line protects against the old 'title' data you had in Compass
      text: todo.text || todo.title || "Untitled Task", 
      completed: todo.completed || false
    }));

    return NextResponse.json(formattedTodos);
  } catch (error) {
    // WE CHANGED THIS LINE: It now sends the EXACT error to your browser
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { text } = await req.json();
    
    const newTodo = await Todo.create({ text });
    
    return NextResponse.json({
      id: newTodo._id.toString(),
      text: newTodo.text,
      completed: newTodo.completed
    }, { status: 201 });
  } catch (error) {
    // WE CHANGED THIS LINE TOO
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}