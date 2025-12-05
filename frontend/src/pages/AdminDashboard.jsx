import { useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(10);
  const [qs, setQs] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "", marks: 1 },
  ]);
  const [msg, setMsg] = useState("");

  const addQ = () =>
    setQs([...qs, { questionText: "", options: ["", "", "", ""], correctAnswer: "", marks: 1 }]);

  const setQ = (i, patch) => {
    const clone = [...qs];
    clone[i] = { ...clone[i], ...patch };
    setQs(clone);
  };

  const setOpt = (i, j, val) => {
    const clone = [...qs];
    clone[i].options[j] = val;
    setQs(clone);
  };

  const save = async () => {
    setMsg("");
    if (!title.trim() || !duration || !qs.length) return setMsg("Fill all fields.");
    for (const [i, q] of qs.entries()) {
      if (!q.questionText.trim()) return setMsg(`Question ${i + 1} is empty`);
      if (q.options.some((o) => !o.trim())) return setMsg(`All options in Q${i + 1} required`);
      if (!q.correctAnswer.trim() || !q.options.includes(q.correctAnswer))
        return setMsg(`Correct answer in Q${i + 1} must match an option`);
    }

    try {
      const { data } = await api.post("/exam/create", {
        title: title.trim(),
        duration: Number(duration),
        questions: qs,
      });
      setMsg(data.message || "Exam created!");
      setTitle("");
      setDuration(10);
      setQs([{ questionText: "", options: ["", "", "", ""], correctAnswer: "", marks: 1 }]);
    } catch (e) {
      setMsg(e.response?.data?.message || "Failed to create exam");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">Admin Dashboard</h1>

      {msg && (
        <div
          className={`p-3 rounded-lg border ${
            msg.toLowerCase().includes("fail") ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"
          }`}
        >
          {msg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <input
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Exam title (e.g., JavaScript Fundamentals)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-400"
          type="number"
          min="1"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(+e.target.value)}
        />

        <div className="space-y-4">
          {qs.map((q, i) => (
            <div key={i} className="border rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-indigo-700">Question {i + 1}</p>
              </div>

              <input
                className="w-full border rounded-lg p-2 mb-3"
                placeholder="Question text"
                value={q.questionText}
                onChange={(e) => setQ(i, { questionText: e.target.value })}
              />

              {q.options.map((opt, j) => (
                <input
                  key={j}
                  className="w-full border rounded-lg p-2 mb-2"
                  placeholder={`Option ${j + 1}`}
                  value={opt}
                  onChange={(e) => setOpt(i, j, e.target.value)}
                />
              ))}

              <input
                className="w-full border rounded-lg p-2 mb-2"
                placeholder="Correct answer (must match an option)"
                value={q.correctAnswer}
                onChange={(e) => setQ(i, { correctAnswer: e.target.value })}
              />
              <input
                className="w-full border rounded-lg p-2 mb-2"
                type="number"
                min="1"
                value={q.marks}
                onChange={(e) => setQ(i, { marks: +e.target.value })}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={addQ} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
            + Question
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Create Exam
          </button>
        </div>
      </div>

      {/* tiny preview */}
      {qs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-4">
          <p className="font-semibold mb-2 text-gray-700">Live Preview</p>
          <ul className="list-disc pl-6 text-gray-700">
            {qs.map((q, i) => (
              <li key={i}>
                {q.questionText || <em className="text-gray-400">Untitled question</em>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
