import { useEffect, useState } from "react";
import { api } from "../api";

export default function HistoryPanel({ refresh, onLoad }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/transcripts")
      .then((r) => setHistory(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refresh]);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden h-fit sticky top-24">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🕐</span>
          <h2 className="font-semibold text-white text-sm">Recent Transcripts</h2>
        </div>
        <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
          last 5
        </span>
      </div>

      {/* Content */}
      <div className="divide-y divide-white/5">
        {loading ? (
          <div className="px-5 py-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3 bg-white/5 rounded-full w-3/4" />
                <div className="h-2 bg-white/5 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="text-3xl mb-2">📂</div>
            <p className="text-gray-600 text-xs">No transcripts yet</p>
            <p className="text-gray-700 text-xs mt-1">Process your first transcript to see history</p>
          </div>
        ) : (
          history.map((t, idx) => {
            const doneCount = t.action_items.filter((i) => i.done).length;
            const total = t.action_items.length;
            const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

            return (
              <div
                key={t.id}
                onClick={() => onLoad(t.action_items, t.id)}
                className="px-5 py-4 cursor-pointer hover:bg-white/5 transition-all duration-150 group"
              >
                {/* Time */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">{timeAgo(t.created_at)}</span>
                  <span className="text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Load →
                  </span>
                </div>

                {/* Transcript preview */}
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                  {t.content}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {total} item{total !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer tip */}
      {history.length > 0 && (
        <div className="px-5 py-3 border-t border-white/5">
          <p className="text-xs text-gray-700 text-center">Click any transcript to reload it</p>
        </div>
      )}
    </div>
  );
}