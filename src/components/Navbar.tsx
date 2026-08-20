import React from "react";
import { FileText, Sparkles, RefreshCw, Briefcase, Info } from "lucide-react";
import { SAMPLE_PRESETS } from "../data/sampleData";
import { StepKey } from "../types";

interface NavbarProps {
  currentStep: StepKey;
  onSelectStep: (step: StepKey) => void;
  onLoadSample: (sampleId: string) => void;
  onReset: () => void;
  canNavigateTo: (step: StepKey) => boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onSelectStep,
  onLoadSample,
  onReset,
  canNavigateTo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          type="button"
          onClick={() => onSelectStep("landing")}
          className="flex items-center gap-3 text-left group cursor-pointer"
          title="Return to Welcome & Instructions"
        >
          <div className="w-9 h-9 bg-[#30afff] group-hover:bg-[#1a88d6] rounded-xl flex items-center justify-center shadow-md shadow-[#30afff]/25 text-white transition">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-[#0d5f99] transition">
                ResumeModifier
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#92eeff]/30 text-[#0d5f99] border border-[#92eeff]">
                <Sparkles className="w-3 h-3 text-[#30afff]" />
                Hiring Manager ATS AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Tailor Career Summary, Competencies, Projects & Experience
            </p>
          </div>
        </button>

        {/* Action Controls & Sample Presets */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Welcome / How It Works button */}
          <button
            type="button"
            id="nav-how-it-works-btn"
            onClick={() => onSelectStep("landing")}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
              currentStep === "landing"
                ? "bg-[#30afff] text-white border-[#30afff]"
                : "bg-slate-50 hover:bg-[#92eeff]/20 text-slate-700 border-slate-200"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Instructions</span>
          </button>

          {/* Sample Presets Dropdown */}
          <div className="relative group">
            <button
              id="preset-dropdown-btn"
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#f2ffed] hover:bg-[#d8ffc5] text-[#115725] border border-[#c4f7ca] transition cursor-pointer shadow-2xs"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#1a7434]" />
              <span>Load Sample</span>
            </button>
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Select a Test Role
              </div>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  onClick={() => onLoadSample(preset.id)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-[#f0fbff] hover:text-[#0d5f99] transition flex flex-col gap-0.5 cursor-pointer"
                >
                  <span className="font-bold text-slate-800">{preset.roleName}</span>
                  <span className="text-[10px] text-slate-500">{preset.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            id="reset-all-btn"
            type="button"
            onClick={onReset}
            title="Clear all inputs and start over"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};

