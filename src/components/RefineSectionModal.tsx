import React, { useState } from "react";
import { X, Sparkles, Check, RefreshCw } from "lucide-react";

interface RefineSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: string;
  currentText: string;
  jobTitle: string;
  jobDescription: string;
  onApply: (sectionKey: string, newText: string) => void;
}

export const RefineSectionModal: React.FC<RefineSectionModalProps> = ({
  isOpen,
  onClose,
  sectionKey,
  currentText,
  jobTitle,
  jobDescription,
  onApply,
}) => {
  const [instructions, setInstructions] = useState("");
  const [updatedText, setUpdatedText] = useState(currentText);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRefine = async () => {
    setIsLoading(true);
    setExplanation(null);
    try {
      const res = await fetch("/api/regenerate-single-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey,
          currentText: updatedText || currentText,
          jobTitle,
          jobDescription,
          instructions,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to refine section");
      }

      const data = await res.json();
      if (data.updatedText) {
        setUpdatedText(data.updatedText);
      }
      if (data.explanation) {
        setExplanation(data.explanation);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to refine");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAndClose = () => {
    onApply(sectionKey, updatedText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Refine {sectionKey} with AI
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Quick Instruction Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Make it more quantifiable with metrics",
              "Make it shorter and punchier",
              "Strengthen action verbs (STAR format)",
              "Focus more on leadership & system scale",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setInstructions(chip)}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Instructions Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Specific Instructions for the Hiring Manager:
          </label>
          <input
            type="text"
            placeholder="e.g. emphasize PostgreSQL database query indexing and reduce sentence length..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600"
          />
        </div>

        {/* Section Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Section Content (Editable):
          </label>
          <textarea
            rows={7}
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 leading-relaxed font-mono outline-none focus:bg-white focus:border-blue-600 resize-y"
          />
        </div>

        {explanation && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
            <strong>Hiring Manager Note:</strong> {explanation}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleRefine}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Rewriting..." : "Run AI Rewrite"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyAndClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#30afff] hover:bg-[#1a88d6] text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
