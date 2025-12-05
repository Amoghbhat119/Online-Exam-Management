import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
