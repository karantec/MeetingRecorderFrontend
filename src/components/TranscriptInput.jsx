import { useState } from "react";
import { api } from "../api";

export default function TranscriptInput({ onResult }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    setError("");
    if (!text.trim()) return setError("Please paste a transcript first.");
    if (text.trim().length < 20) return setError("Transcript is too short to process.");
    setLoading(true);
    try {
      const res = await api.post("/transcripts", { content: text });
      onResult(res.data);
      setText("");
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-violet-500/30 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <h2 className="font-semibold text-white text-sm">Meeting Transcript</h2>
        </div>
        {wordCount > 0 && (
          <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {wordCount} words
          </span>
        )}
      </div>

      <textarea
        className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 h-44 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 font-mono leading-relaxed"
        placeholder="Paste your meeting notes or transcript here...&#10;&#10;Example: 'John will complete the API integration by Friday. Sarah needs to review the designs before Monday...'"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <span className="text-sm">⚠</span>
          <p className="text-xs">{error}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-600">
          Supports any meeting format — Zoom, Teams, Google Meet notes
        </p>
        <button
          onClick={handle}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Extracting...
            </>
          ) : (
            <>
              <span>✨</span>
              Extract Action Items
            </>
          )}
        </button>
      </div>
    </div>
  );
}