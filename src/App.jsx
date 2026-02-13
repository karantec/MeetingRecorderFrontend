import { useState } from "react";
import TranscriptInput from "./components/TranscriptInput";
import ActionItemList from "./components/ActionItemList";
import HistoryPanel from "./components/HistoryPanel";
import StatusPage from "./components/StatusPage";

export default function App() {
  const [page, setPage] = useState("home");
  const [items, setItems] = useState([]);
  const [transcriptId, setTranscriptId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [historyRefresh, setHistoryRefresh] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-fuchsia-500/5 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/25">
              M
            </div>
            <span className="font-semibold text-white tracking-tight">
              Meeting<span className="text-violet-400">Tracker</span>
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
            {["home", "status"].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  page === p
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {p === "home" ? "🏠 Home" : "⚡ Status"}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {page === "status" ? (
        <StatusPage />
      ) : (
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {/* Hero header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Extract Action Items
              <span className="ml-3 text-sm font-normal text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                AI Powered
              </span>
            </h1>
            <p className="text-gray-400 mt-1.5 text-sm">
              Paste any meeting transcript and instantly get structured action items
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Main content */}
            <div className="col-span-2 space-y-6">
              <TranscriptInput
                onResult={(data) => {
                  setItems(data.action_items);
                  setTranscriptId(data.transcript_id);
                  setHistoryRefresh((h) => h + 1);
                }}
              />
              {items.length > 0 && (
                <ActionItemList
                  items={items}
                  setItems={setItems}
                  transcriptId={transcriptId}
                  filter={filter}
                  setFilter={setFilter}
                />
              )}
              {items.length === 0 && (
                <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-gray-500 text-sm">
                    Action items will appear here after processing a transcript
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <HistoryPanel
                refresh={historyRefresh}
                onLoad={(items, tid) => {
                  setItems(items);
                  setTranscriptId(tid);
                  setPage("home");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}