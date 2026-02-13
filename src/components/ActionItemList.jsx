import { useState } from "react";
import { api } from "../api";

export default function ActionItemList({ items, setItems, transcriptId, filter, setFilter }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newItem, setNewItem] = useState({ task: "", owner: "", due_date: "", tags: "" });
  const [adding, setAdding] = useState(false);

  const toggle = async (item) => {
    const res = await api.patch(`/items/${item.id}`, { done: !item.done });
    setItems(items.map((i) => (i.id === item.id ? res.data : i)));
  };

  const del = async (id) => {
    await api.delete(`/items/${id}`);
    setItems(items.filter((i) => i.id !== id));
  };

  const saveEdit = async (id) => {
    const res = await api.patch(`/items/${id}`, editData);
    setItems(items.map((i) => (i.id === id ? res.data : i)));
    setEditId(null);
    setEditData({});
  };

  const addItem = async () => {
    if (!newItem.task.trim()) return;
    const res = await api.post("/items", { ...newItem, transcript_id: transcriptId });
    setItems([...items, res.data]);
    setNewItem({ task: "", owner: "", due_date: "", tags: "" });
    setAdding(false);
  };

  const filtered = items.filter((i) =>
    filter === "all" ? true : filter === "done" ? i.done : !i.done
  );

  const doneCount = items.filter((i) => i.done).length;
  const openCount = items.filter((i) => !i.done).length;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-white text-sm">Action Items</h2>
          <span className="bg-violet-500/20 text-violet-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-violet-500/20">
            {items.length} total
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {doneCount} done
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            {openCount} open
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="h-0.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${(doneCount / items.length) * 100}%` }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="px-6 py-3 flex items-center gap-2 border-b border-white/5">
        {[
          { key: "all", label: "All", count: items.length },
          { key: "open", label: "Open", count: openCount },
          { key: "done", label: "Done", count: doneCount },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              filter === f.key
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {f.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === f.key ? "bg-white/20" : "bg-white/5"
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="divide-y divide-white/5">
        {filtered.length === 0 && (
          <div className="px-6 py-10 text-center text-gray-600 text-sm">
            No {filter !== "all" ? filter : ""} items found
          </div>
        )}

        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className={`px-6 py-4 transition-all duration-200 hover:bg-white/3 group ${
              item.done ? "opacity-50" : ""
            }`}
          >
            {editId === item.id ? (
              /* Edit mode */
              <div className="space-y-3">
                <input
                  className="w-full bg-black/40 border border-violet-500/40 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-400"
                  value={editData.task !== undefined ? editData.task : item.task}
                  onChange={(e) => setEditData({ ...editData, task: e.target.value })}
                  placeholder="Task description"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                    value={editData.owner !== undefined ? editData.owner : item.owner || ""}
                    onChange={(e) => setEditData({ ...editData, owner: e.target.value })}
                    placeholder="👤 Owner"
                  />
                  <input
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                    value={editData.due_date !== undefined ? editData.due_date : item.due_date || ""}
                    onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                    placeholder="📅 Due date"
                  />
                  <input
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                    value={editData.tags !== undefined ? editData.tags : item.tags || ""}
                    onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                    placeholder="🏷 Tags"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Save changes
                  </button>
                  <button
                    onClick={() => { setEditId(null); setEditData({}); }}
                    className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggle(item)}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    item.done
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-white/20 hover:border-violet-400"
                  }`}
                >
                  {item.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                 <p className={`text-sm font-medium leading-snug ${item.done ? "line-through text-gray-500" : "text-white"}`}>
  {item.task || item.title || item.description || JSON.stringify(item)}
</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {item.owner && (
                      <span className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        <span>👤</span> {item.owner}
                      </span>
                    )}
                    {item.due_date && (
                      <span className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        <span>📅</span> {item.due_date}
                      </span>
                    )}
                    {item.tags && item.tags.split(",").filter(Boolean).map((t) => (
                      <span key={t} className="text-xs text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => { setEditId(item.id); setEditData({}); }}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all text-xs"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => del(item.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add item */}
      <div className="px-6 py-4 border-t border-white/5">
        {adding ? (
          <div className="space-y-3 bg-white/3 rounded-xl p-4 border border-white/5">
            <input
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
              value={newItem.task}
              onChange={(e) => setNewItem({ ...newItem, task: e.target.value })}
              placeholder="Task description *"
              autoFocus
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                value={newItem.owner}
                onChange={(e) => setNewItem({ ...newItem, owner: e.target.value })}
                placeholder="👤 Owner"
              />
              <input
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                value={newItem.due_date}
                onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })}
                placeholder="📅 Due date"
              />
              <input
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40"
                value={newItem.tags}
                onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                placeholder="🏷 Tags"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addItem}
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                Add Item
              </button>
              <button
                onClick={() => { setAdding(false); setNewItem({ task: "", owner: "", due_date: "", tags: "" }); }}
                className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-1.5 rounded-lg text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors group"
          >
            <span className="w-5 h-5 rounded-md border border-dashed border-gray-600 group-hover:border-violet-500 flex items-center justify-center text-xs transition-colors">
              +
            </span>
            Add item manually
          </button>
        )}
      </div>
    </div>
  );
}