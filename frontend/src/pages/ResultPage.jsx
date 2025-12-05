import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";

export default function ResultPage() {
  const [results, setResults] = useState([]);
  const loc = useLocation();

  useEffect(() => {
    api.get("/result/my").then(({ data }) => setResults(data)).catch(() => setResults([]));
  }, []);

  const recent = results[0];
  const correct = recent ? recent.answers.filter((a) => a.isCorrect).length : 0;
  const incorrect = recent ? recent.answers.length - correct : 0;
  const pieData = [
    { name: "Correct", value: correct },
    { name: "Incorrect", value: incorrect },
  ];
  const COLORS = ["#22c55e", "#ef4444"];
  const history = results
    .map((r, i) => ({ name: `#${results.length - i}`, score: r.totalScore }))
    .reverse();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">My Results</h1>

      {loc.state?.justSubmitted && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
          Submitted! Your score: <b>{loc.state.score}</b>
        </div>
      )}

      {recent ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 border border-indigo-50">
            <h3 className="font-semibold mb-2 text-gray-700">{recent.exam?.title || "Latest Exam"}</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-gray-600 mt-2">
              Total Score: <b>{recent.totalScore}</b> • Attempted: {recent.answers.length}
            </p>
            <p className="text-gray-500">
              Submitted at: {new Date(recent.submittedAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border border-indigo-50">
            <h3 className="font-semibold mb-2 text-gray-700">Score History</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No results yet.</p>
      )}

      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r._id} className="bg-white rounded-xl p-3 shadow border border-indigo-50 flex justify-between">
            <span className="text-gray-700">{r.exam?.title || "Exam"}</span>
            <span className="text-gray-500">{new Date(r.submittedAt).toLocaleString()}</span>
            <b className="text-indigo-700">{r.totalScore}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
