import React, { useEffect, useState } from "react";
import {
  X,
  History,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronRight,
  Package,
  Trash2,
} from "lucide-react";
import type { AnalysisData } from "./AnalysisResult";

// Extend AnalysisData to include MongoDB _id
interface ScanHistoryItem extends AnalysisData {
  _id?: string;
}

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScan: (item: AnalysisData) => void;
}

export default function ScanHistoryModal({
  isOpen,
  onClose,
  onSelectScan,
}: ScanHistoryModalProps) {
  const [historyList, setHistoryList] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("tatva_jwt_token");
      const res = await fetch("http://localhost:5000/api/products/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error("Failed to load scan history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a single item
  const handleDeleteItem = async (e: React.MouseEvent, id?: string) => {
    e.stopPropagation(); // Prevents opening the result page
    if (!id) return;

    if (!window.confirm("Are you sure you want to delete this scan record?")) {
      return;
    }

    setDeletingId(id);
    try {
      const token = localStorage.getItem("tatva_jwt_token");
      const res = await fetch(`http://localhost:5000/api/products/history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Optimistically remove from state
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error("Delete item error:", err);
      alert("Network error while deleting item.");
    } finally {
      setDeletingId(null);
    }
  };

  // Clear entire history
  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL your scan history? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("tatva_jwt_token");
      const res = await fetch("http://localhost:5000/api/products/history", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setHistoryList([]);
      } else {
        alert("Failed to clear history.");
      }
    } catch (err) {
      console.error("Clear history error:", err);
      alert("Network error while clearing history.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#2D6A4F] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Scan History</h3>
              <p className="text-xs text-slate-400">All previously verified food items</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {historyList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer"
                title="Clear all history"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Loading past inspections...
            </div>
          ) : historyList.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">No scan history found</p>
              <p className="text-xs text-slate-400 mt-1">
                Upload your first food packaging to see results saved here.
              </p>
            </div>
          ) : (
            historyList.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  onSelectScan(item);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border border-slate-200 hover:border-[#2D6A4F] hover:shadow-xs transition bg-white flex items-center justify-between cursor-pointer group relative ${
                  deletingId === item._id ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#2D6A4F] transition">
                      {item.productName}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.scanDate}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-1">
                      {item.isSafe ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Safe
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/50">
                          <XCircle className="w-2.5 h-2.5" /> High Risk
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 pl-2 shrink-0">
                  {/* Delete Item Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(e, item._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition opacity-80 group-hover:opacity-100 cursor-pointer"
                    title="Delete this scan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2D6A4F] transition" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
          Saved securely in MongoDB
        </div>
      </div>
    </div>
  );
}