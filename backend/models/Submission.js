import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: String,
      isCorrect: Boolean,
    },
  ],
  totalScore: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
