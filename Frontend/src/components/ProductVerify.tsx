import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ScanHistoryModal from "./ScanHistoryModal";
import {
  UploadCloud,
  Search,
  ArrowRight,
  Leaf,
  ShieldCheck,
  FileText,
  X,
  LogOut,
  ImageIcon,
} from "lucide-react";
import AnalysisResult, {
  mockUnsafeData,
  type AnalysisData,
} from "./AnalysisResult";

import { History } from "lucide-react";



const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
};

export default function ProductVerify() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("User");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Result display state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [resultData, setResultData] = useState<AnalysisData>(mockUnsafeData);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("tatva_jwt_token");
    if (!token) {
      navigate("/login");
      return;
    }
    const decoded = parseJwt(token);
    if (!decoded || decoded.exp * 1000 <= Date.now()) {
      localStorage.removeItem("tatva_jwt_token");
      navigate("/login");
    } else {
      setUsername(decoded.username || "User");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("tatva_jwt_token");
    navigate("/login");
  };

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, JPEG)");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit image to backend API
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image of the ingredients list.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("tatva_jwt_token");

      const response = await fetch("http://localhost:5000/api/products/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to verify ingredients");
      }

      const data: AnalysisData = await response.json();
      setResultData(data);
      setShowResult(true);
    } catch (error) {
      console.error("Verification error:", error);
      // Fallback preview if backend is not running yet
      const fallback = { ...mockUnsafeData };
      if (previewUrl) fallback.imageUrl = previewUrl;
      setResultData(fallback);
      setShowResult(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (showResult) {
    return (
      <AnalysisResult
        data={resultData}
        onScanAnother={() => {
          setShowResult(false);
          handleRemoveFile();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-[#2D6A4F]">
            <Leaf className="w-6 h-6 fill-[#2D6A4F] -rotate-12" />
            <Leaf className="w-5 h-5 fill-[#52B788] text-[#52B788] rotate-45 -ml-2 mb-1" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#1B4332]">
            Tatva
          </span>
        </div>
        <div className="flex items-center gap-3">
  <span className="text-xs text-slate-500 font-medium">
    Welcome, <strong className="text-slate-800">{username}</strong>
  </span>

    {/* History Button */}
    <button
    onClick={() => setIsHistoryOpen(true)}
    className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#2D6A4F] bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer border border-slate-200"
    >
    <History className="w-3.5 h-3.5 text-[#2D6A4F]" /> History
    </button>

    <button
    onClick={handleLogout}
    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
    >
    <LogOut className="w-3.5 h-3.5" /> Logout
    </button>
    </div>

      </header>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#E9F5ED] via-[#F2FAF5] to-[#E3F2E7] border-b border-emerald-100/70 overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B4332] tracking-tight leading-tight">
              Verify Your Food
              <br />
              for a Safer Tomorrow
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
              Upload the ingredient list photo to detect hazardous additives,
              hidden allergens, and safety risks in seconds.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white shadow-2xs border border-emerald-200 flex items-center justify-center text-[#2D6A4F]">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Check Ingredients
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white shadow-2xs border border-emerald-200 flex items-center justify-center text-[#2D6A4F]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Detect Risks
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white shadow-2xs border border-emerald-200 flex items-center justify-center text-[#2D6A4F]">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Get Trusted Information
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative mr-4 text-center">
              <span
                style={{ fontFamily: "'Caveat', 'Segoe Script', cursive" }}
                className="text-2xl text-[#2D6A4F] -rotate-6 block leading-tight font-bold select-none"
              >
                Scan
                <br />
                Inspect
                <br />
                Be Sure
              </span>
              <svg
                className="w-12 h-10 text-[#2D6A4F] mx-auto mt-1"
                viewBox="0 0 50 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 10 5 Q 35 10 38 28" />
                <polyline points="30 25 38 28 42 20" />
              </svg>
            </div>

            <div className="w-52 bg-white/95 backdrop-blur-xs rounded-xl shadow-lg border border-emerald-100 p-3.5 text-left transform rotate-2 hover:rotate-0 transition">
              <h5 className="text-[11px] font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1.5">
                Ingredients:
              </h5>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                Whole Grain Oats, Almonds, Honey, Brown Sugar, Natural Flavour, Salt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form: Focused Single Card */}
      <main className="max-w-2xl mx-auto w-full px-6 py-10 flex-1">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-slate-900">Verify a Product</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload a clear photo of the ingredients list from the back of the packaging.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="text-[#2D6A4F] mt-0.5">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Upload Ingredient List Image
                </h3>
                <p className="text-[11px] text-slate-500">
                  Make sure text, additive numbers (INS/E codes), and warnings are legible.
                </p>
              </div>
            </div>

            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={`mt-4 border-2 border-dashed rounded-xl p-10 text-center transition flex flex-col items-center justify-center min-h-[220px] ${
                  isDragging
                    ? "border-[#2D6A4F] bg-emerald-50/50"
                    : "border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#2D6A4F] mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <p className="text-sm font-medium text-slate-700 mb-1">
                  Drag & drop your packaging image here
                </p>
                <span className="text-xs text-slate-400 mb-3">or browse from your device</span>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2 bg-white border border-[#2D6A4F] text-[#2D6A4F] hover:bg-emerald-50 text-xs font-semibold rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" /> Choose File
                </button>
              </div>
            ) : (
              <div className="mt-4 relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {file?.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {(file!.size / 1024).toFixed(1)} KB • Ready for analysis
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 rounded-full hover:bg-rose-100 text-rose-600 transition"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <span className="text-[10px] text-slate-400 mt-4 block text-center">
              Supported formats: JPG, PNG, JPEG (Max 5MB)
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <button
              type="submit"
              disabled={isAnalyzing || !file}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-10 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                "Scanning & Analyzing Ingredients..."
              ) : (
                <>
                  <Search className="w-4 h-4" /> Analyze Ingredients{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400 mt-2.5">
              Powered by AI vision to detect harmful preservatives and allergens.
            </span>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        Together for a safer food future • Tatva Authenticity Engine
      </footer>
      <ScanHistoryModal
  isOpen={isHistoryOpen}
  onClose={() => setIsHistoryOpen(false)}
  onSelectScan={(selectedScan) => {
    setResultData(selectedScan);
    setShowResult(true);
  }}
/>
    </div>
  );
}