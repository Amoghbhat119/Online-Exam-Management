import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // fetch exam & shuffle questions + options
  useEffect(() => {
    api.get(`/exam/${id}`).then(({ data }) => {
      const shuffledQuestions = shuffle(
        data.questions.map(q => ({
          ...q,
          options: shuffle(q.options),
        }))
      );
      setExam({ ...data, questions: shuffledQuestions });
      setAnswers(shuffledQuestions.map(q => ({ questionId: q._id, selectedOption: "" })));
      setSecondsLeft(data.duration * 60);
    });
  }, [id]);

  // countdown + auto-submit
  useEffect(() => {
    if (!secondsLeft) return;
    const t = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { handleSubmit(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  // guard: block accidental back/refresh
  useEffect(() => {
    const beforeUnload = (e) => { e.preventDefault(); e.returnValue = ""; };
    const blockBack = () => { window.history.pushState(null, "", window.location.href); };
    window.addEventListener("beforeunload", beforeUnload);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("popstate", blockBack);
    };
  }, []);

  const progress = useMemo(() => {
    if (!exam) return 0;
    const total = exam.duration * 60;
    return Math.max(0, Math.round(((total - secondsLeft) / total) * 100));
  }, [exam, secondsLeft]);

  const setAns = (qid, val) => {
    setAnswers(prev => prev.map(a => (a.questionId === qid ? { ...a, selectedOption: val } : a)));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/exam/${id}/submit`, { answers });
      navigate("/results", { state: { justSubmitted: true, score: data.totalScore } });
    } catch {
      navigate("/results");
    }
  };

  if (!exam) return <div className="text-gray-600 dark:text-gray-300">Loading...</div>;
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  return (
    <div className="space-y-4">
      <div className="sticky top-2 z-10">
        <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 shadow p-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{exam.title}</h1>
          <div className={`px-3 py-1 rounded-lg font-mono ${secondsLeft < 20 ? "bg-red-600 text-white" : "bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"}`}>
            ⏱ {mm.toString().padStart(2, "0")}:{ss.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded mt-2 overflow-hidden">
          <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {exam.questions.map((q, idx) => (
          <div key={q._id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow border border-indigo-50 dark:border-slate-700">
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              {idx + 1}. {q.questionText}
            </p>
            <div className="grid gap-2">
              {q.options.map(opt => {
                const checked = answers.find(a => a.questionId === q._id)?.selectedOption === opt;
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 border rounded-lg p-2 cursor-pointer dark:text-gray-200 dark:border-slate-700 ${
                      checked ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40" : "hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={checked}
                      onChange={() => setAns(q._id, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
