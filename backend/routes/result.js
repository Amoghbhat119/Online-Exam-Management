import express from "express";
import Submission from "../models/Submission.js";
import Exam from "../models/Exam.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------------------
   👨‍🎓 Student: Get Their Results
---------------------------------- */
router.get("/my", protect, async (req, res) => {
  try {
    const results = await Submission.find({ student: req.user._id })
      .populate({
        path: "exam",
        select: "title duration",
      })
      .sort({ submittedAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results" });
  }
});

/* ---------------------------------
   👩‍🏫 Admin: View All Student Results
---------------------------------- */
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("student", "name email")
      .populate("exam", "title duration")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all results" });
  }
});

/* ---------------------------------
   📊 Analytics Data (Score Distribution)
---------------------------------- */
router.get("/analytics/:examId", protect, adminOnly, async (req, res) => {
  try {
    const examId = req.params.examId;
    const submissions = await Submission.find({ exam: examId });

    if (submissions.length === 0)
      return res.status(404).json({ message: "No submissions found" });

    const totalStudents = submissions.length;
    const averageScore =
      submissions.reduce((sum, s) => sum + s.totalScore, 0) / totalStudents;

    const topScore = Math.max(...submissions.map((s) => s.totalScore));
    const lowScore = Math.min(...submissions.map((s) => s.totalScore));

    res.json({
      totalStudents,
      averageScore: averageScore.toFixed(2),
      topScore,
      lowScore,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating analytics" });
  }
});

export default router;
