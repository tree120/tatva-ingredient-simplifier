import React, { useState } from "react";
import {
  Search,
  Leaf,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
} from "lucide-react";

export interface AnalysisData {
  productName: string;
  brand: string;
  batchNumber: string;
  scanDate: string;
  productType: string;
  imageUrl?: string;
  isSafe: boolean;
  verdictTitle: string;
  verdictSubtitle: string;
  ingredients: {
    name: string;
    status: "Safe" | "Moderate" | "High" | "Not Safe" | "Allergen";
  }[];
  harmfulIngredients?: {
    name: string;
    description: string;
  }[];
  allergenInfo?: {
    name: string;
    description: string;
  }[];
  additionalNotes?: string[];
  recommendations?: string;
  keyTakeaways?: string[];
}

interface AnalysisResultProps {
  data?: AnalysisData;
  onScanAnother: () => void;
}

// Sample Data 1: Lay's Spanish Tomato Tango (Unsafe / High Risk)
export const mockUnsafeData: AnalysisData = {
  productName: "Lay's Spanish Tomato Tango",
  brand: "Lay's",
  batchNumber: "C7X9A1",
  scanDate: "21 Sep 2026, 10:35 AM",
  productType: "Snack",
  imageUrl:
    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=60",
  isSafe: false,
  verdictTitle: "Not Safe for Regular Consumption",
  verdictSubtitle:
    "Potentially harmful ingredients detected. Please check the details below.",
  ingredients: [
    { name: "Potatoes", status: "Safe" },
    { name: "Vegetable Oil (Palm Oil)", status: "Moderate" },
    { name: "Salt", status: "Moderate" },
    { name: "Sugar", status: "High" },
    { name: "Monosodium Glutamate (INS 621)", status: "Not Safe" },
    { name: "Artificial Flavour", status: "Not Safe" },
    { name: "Acidity Regulator (INS 330)", status: "Safe" },
    { name: "Spices", status: "Safe" },
  ],
  harmfulIngredients: [
    {
      name: "Monosodium Glutamate (INS 621)",
      description:
        "May cause headaches or other reactions in sensitive individuals.",
    },
    {
      name: "Artificial Flavour",
      description:
        "Synthetic flavouring; not recommended for regular consumption.",
    },
  ],
  additionalNotes: [
    "Contains added sugar and high salt.",
    "Frequent consumption may not be suitable for a healthy diet.",
  ],
  recommendations:
    "Consume occasionally and in moderation. Consider choosing products with fewer additives.",
};

// Sample Data 2: Multigrain Chips (Safe to Consume)
export const mockSafeData: AnalysisData = {
  productName: "Multigrain Chips",
  brand: "HealthyBite",
  batchNumber: "B12345",
  scanDate: "21 Sep 2026, 10:35 AM",
  productType: "Snack",
  imageUrl:
    "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=300&auto=format&fit=crop&q=60",
  isSafe: true,
  verdictTitle: "Safe to Consume",
  verdictSubtitle:
    "No harmful or hazardous ingredients detected in the provided ingredient list.",
  ingredients: [
    { name: "Whole Grain Oats", status: "Safe" },
    { name: "Rice Flour", status: "Safe" },
    { name: "Palm Oil", status: "Moderate" },
    { name: "Onion Powder", status: "Safe" },
    { name: "Natural Flavour", status: "Safe" },
    { name: "Salt", status: "Moderate" },
    { name: "Milk Solids", status: "Allergen" },
  ],
  allergenInfo: [
    {
      name: "Milk Solids",
      description:
        "This product contains milk. It may not be suitable for individuals with milk allergy or lactose intolerance.",
    },
  ],
  keyTakeaways: [
    "No harmful ingredients detected.",
    "Contains palm oil and added salt (moderate consumption recommended).",
    "Made with natural flavours.",
  ],
};

export default function AnalysisResult({
  data = mockUnsafeData,
  onScanAnother,
}: AnalysisResultProps) {
  // Toggle between Safe and Unsafe preview for quick testing
  const [currentData, setCurrentData] = useState<AnalysisData>(data);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Safe":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Safe
          </span>
        );
      case "Moderate":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
            Moderate
          </span>
        );
      case "High":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-600 border border-rose-200/60">
            High
          </span>
        );
      case "Not Safe":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-700 border border-red-200">
            Not Safe
          </span>
        );
      case "Allergen":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-pink-100 text-pink-700 border border-pink-200">
            Allergen
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Analysis Result
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Here is the safety analysis of your product.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Demo Toggle */}
            {/* <button
              onClick={() =>
                setCurrentData(
                  currentData.isSafe ? mockUnsafeData : mockSafeData
                )
              }
              className="text-xs px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition font-medium cursor-pointer"
            >
              Toggle Result Preview ({currentData.isSafe ? "Safe" : "Unsafe"})
            </button> */}

            {/* Scan Another Product Button */}
            <button
              onClick={onScanAnother}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl shadow-2xs transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-700" />
              Scan Another Product
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Product Meta Information */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center gap-5">
            <div className="w-24 h-28 sm:w-28 sm:h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
              {currentData.imageUrl ? (
                <img
                  src={currentData.imageUrl}
                  alt={currentData.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Leaf className="w-10 h-10 text-emerald-600" />
              )}
            </div>

            <div className="space-y-1 text-sm">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {currentData.productName}
              </h2>
              <p className="text-slate-500 font-medium">{currentData.brand}</p>

              <div className="pt-2 text-xs space-y-1 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Batch Number
                  </span>
                  <span className="font-semibold text-slate-800">
                    {currentData.batchNumber}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Scan Date
                  </span>
                  <span className="text-slate-700">{currentData.scanDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Product Type
                  </span>
                  <span className="text-slate-700">
                    {currentData.productType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Verdict Status Card */}
          <div
            className={`lg:col-span-5 rounded-2xl border p-6 shadow-2xs flex flex-col items-center justify-center text-center ${
              currentData.isSafe
                ? "bg-emerald-50/40 border-emerald-200/70"
                : "bg-rose-50/40 border-rose-200/70"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-xs ${
                currentData.isSafe
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
              }`}
            >
              {currentData.isSafe ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>

            <h3
              className={`text-lg font-bold ${
                currentData.isSafe ? "text-emerald-800" : "text-rose-700"
              }`}
            >
              {currentData.verdictTitle}
            </h3>

            <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
              {currentData.verdictSubtitle}
            </p>
          </div>
        </div>

        {/* Detailed Grid: Table on Left, Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table: Ingredients & Analysis */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Leaf className="w-5 h-5 text-[#2D6A4F]" />
              <h3 className="text-sm font-bold text-slate-900">
                Ingredients & Analysis
              </h3>
            </div>

            <div className="overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100 pb-2">
                    <th className="py-2.5 font-medium">Ingredient</th>
                    <th className="py-2.5 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.ingredients.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 text-slate-700 font-medium">
                        {item.name}
                      </td>
                      <td className="py-3 text-right">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Insights Cards */}
          <div className="lg:col-span-6 space-y-4">
            {/* 1. Harmful / High Risk Card (if any) */}
            {currentData.harmfulIngredients && (
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h4>Harmful / High-Risk Ingredients</h4>
                </div>

                <div className="space-y-3 pl-1">
                  {currentData.harmfulIngredients.map((item, index) => (
                    <div key={index} className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                        <span className="font-bold text-slate-900">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-slate-600 pl-4 mt-0.5 leading-relaxed text-[11px]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Allergen Information Card (if any) */}
            {currentData.allergenInfo && (
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h4>Allergen Information</h4>
                </div>

                <div className="space-y-2 pl-1">
                  {currentData.allergenInfo.map((item, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        {item.name}
                      </span>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Additional Notes Card (if any) */}
            {currentData.additionalNotes && (
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Info className="w-4 h-4 text-amber-600" />
                  <h4>Additional Notes</h4>
                </div>

                <ul className="space-y-1.5 pl-1 text-xs text-slate-600">
                  {currentData.additionalNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                      <span className="leading-relaxed text-[11px]">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Recommendation Card (if any) */}
            {currentData.recommendations && (
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Leaf className="w-4 h-4 text-[#2D6A4F]" />
                  <h4>Recommendation</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1 text-[11px]">
                  {currentData.recommendations}
                </p>
              </div>
            )}

            {/* 5. Key Takeaways Card (if any) */}
            {currentData.keyTakeaways && (
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Lightbulb className="w-4 h-4 text-[#2D6A4F]" />
                  <h4>Key Takeaways</h4>
                </div>

                <ul className="space-y-2 pl-1 text-xs text-slate-700">
                  {currentData.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug text-[11px]">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}