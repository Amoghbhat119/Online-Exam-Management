import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    api.get("/exam").then(({ data }) => setExams(data)).catch(() => setExams([]));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-indigo-700">Available Exams</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {exams.map((e) => (
          <div
            key={e._id}
            className="p-6 rounded-2xl bg-white shadow hover:shadow-xl transition border border-indigo-50"
          >
            <h3 className="text-lg font-semibold text-gray-800">{e.title}</h3>
            <p className="text-gray-500">Duration: {e.duration} min</p>
            <Link
              to={`/exam/${e._id}`}
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Start Exam
            </Link>
          </div>
        ))}
        {exams.length === 0 && (
          <p className="text-gray-500">No exams yet. Check back later.</p>
        )}
      </div>
    </div>
  );
}
