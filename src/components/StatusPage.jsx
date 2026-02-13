import { useEffect, useState } from "react";
import { api } from "../api";

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [checking, setChecking] = useState(false);

  const check = () => {
    setChecking(true);
    api.get("/status")
      .then((r) => {
        setStatus(r.data);
        setLastChecked(new Date());
      })
      .catch(() =>
        setStatus({ backend: "error", database: "error", llm: "error" })
      )
      .finally(() => setChecking(false));
  };

  useEffect(() => {
    check();
  }, []);

  const services = [
    {
      key: "backend",
      label: "Backend API",
      desc: "FastAPI server health",
      icon: "⚡",
    },
    {
      key: "database",
      label: "Database",
      desc: "SQLite connection status",
      icon: "🗄️",
    },
    {
      key: "llm",
      label: "LLM Connection",
      desc: "OpenRouter / GPT-4o-mini",
      icon: "🤖",
    },
  ];

  const allOk = status && Object.values(status).every((v) => v === "ok");

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-3xl mb-4">
          ⚡
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Status</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time health check of all services</p>
      </div>

      {/* Overall status banner */}
      {status && (
        <div
          className={`mb-6 rounded-2xl p-4 border flex items-center gap-3 ${
            allOk
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <span className="text-2xl">{allOk ? "✅" : "❌"}</span>
          <div>
            <p className={`font-semibold text-sm ${allOk ? "text-emerald-400" : "text-red-400"}`}>
              {allOk ? "All systems operational" : "Some services are down"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {allOk ? "Everything is running smoothly" : "Check individual services below"}
            </p>
          </div>
          {lastChecked && (
            <span className="ml-auto text-xs text-gray-600">
              {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {/* Services */}
      <div className="space-y-3">
        {services.map((svc) => {
          const isOk = status?.[svc.key] === "ok";
          const isLoading = !status || checking;

          return (
            <div
              key={svc.key}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/7 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xl flex-shrink-0">
                {svc.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{svc.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{svc.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span className="text-xs">Checking...</span>
                  </div>
                ) : (
                  <>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isOk ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-red-400 shadow-lg shadow-red-400/50"
                      } ${isOk ? "animate-pulse" : ""}`}
                    />
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isOk
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-red-400 bg-red-500/10 border-red-500/20"
                      }`}
                    >
                      {isOk ? "Operational" : "Error"}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Refresh button */}
      <div className="mt-6 text-center">
        <button
          onClick={check}
          disabled={checking}
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${checking ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {checking ? "Checking..." : "Refresh Status"}
        </button>
      </div>
    </div>
  );
}