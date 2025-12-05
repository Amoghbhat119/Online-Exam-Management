import express from "express";
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import Submission from "../models/Submission.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------------------
   👩‍🏫 ADMIN: Create Exam
---------------------------------- */
router.post("/create", protect, adminOnly, async (req, res) => {
  try {
    const { title, duration, questions } = req.body;

    // Create question documents
    const questionDocs = await Question.insertMany(questions);

    const exam = await Exam.create({
      title,
      duration,
      questions: questionDocs.map((q) => q._id),
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create exam" });
  }
});

/* ---------------------------------
   📋 STUDENT: Fetch All Exams
---------------------------------- */
router.get("/", protect, async (req, res) => {
  try {
    const exams = await Exam.find().populate("questions");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams" });
  }
});

/* ---------------------------------
   📄 STUDENT: Get Exam by ID
---------------------------------- */
router.get("/:id", protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("questions");
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam details" });
  }
});

/* ---------------------------------
   ⚡ STUDENT: Submit Exam (Auto-submit or Manual)
---------------------------------- */
router.post("/:id/submit", protect, async (req, res) => {
  try {
    const { answers } = req.body;
    const exam = await Exam.findById(req.params.id).populate("questions");

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    let score = 0;
    const formattedAnswers = [];

    exam.questions.forEach((q) => {
      const userAnswer = answers.find((a) => a.questionId === q._id.toString());
      const isCorrect = userAnswer && userAnswer.selectedOption === q.correctAnswer;

      if (isCorrect) score += q.marks;
      formattedAnswers.push({
        questionId: q._id,
        selectedOption: userAnswer ? userAnswer.selectedOption : null,
        isCorrect,
      });
    });

    const submission = await Submission.create({
      student: req.user._id,
      exam: exam._id,
      answers: formattedAnswers,
      totalScore: score,
    });

    res.json({
      message: "Exam submitted successfully",
      totalScore: score,
      submissionId: submission._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting exam" });
  }
});

/* ---------------------------------
   ⏱ TIMER LOGIC - Auto-submit (Handled Client-side)
---------------------------------- */
// The frontend timer triggers POST /exam/:id/submit when time runs out.

export default router;
