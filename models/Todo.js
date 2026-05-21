import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// This line is crucial for Next.js. It prevents the app from crashing 
// by trying to redefine the model every time you save a file.
export default mongoose.models.Todo || mongoose.model("Todo", todoSchema);