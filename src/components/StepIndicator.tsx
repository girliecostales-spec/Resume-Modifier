import React from "react";
import { Check, ClipboardList, BarChart3, HelpCircle, FileCheck2, Info } from "lucide-react";
import { StepKey } from "../types";

interface StepIndicatorProps {
  currentStep: StepKey;
  onSelectStep: (step: StepKey) => void;
  canNavigateTo: (step: StepKey) => boolean;
  hasAnalysis: boolean;
  hasOptimization: boolean;
  missingSkillsCount: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  canNavigateTo,
  hasAnalysis,
  hasOptimization,
  missingSkillsCount,
}) => {
  const steps: Array<{
    key: StepKey;
    stepNumber: number;
    label: string;
    description: string;
    icon: React.ElementType;
    isCompleted: boolean;
  }> = [
    {
      key: "input",
      stepNumber: 1,
      label: "1. Add Job & Resume",
      description: "Paste posting & upload resume",
      icon: ClipboardList,
      isCompleted: hasAnalysis,
    },
    {
      key: "analysis",
      stepNumber: 2,
      label: "2. View Match Results",
      description: "ATS keywords & initial rating",
      icon: BarChart3,
      isCompleted: hasAnalysis && (currentStep === "interview" || currentStep === "optimized"),
    },
    {
      key: "interview",
      stepNumber: 3,
      label: "3. Confirm Your Skills",
      description: missingSkillsCount > 0 ? `${missingSkillsCount} unlisted skills to verify` : "Confirm unlisted background",
      icon: HelpCircle,
      isCompleted: hasOptimization,
    },
    {
      key: "optimized",
      stepNumber: 4,
      label: "4. Review Improved Resume",
      description: "Tailored 4 core sections",
      icon: FileCheck2,
      isCompleted: hasOptimization,
    },
  ];

  return (
    <nav aria-label="Progress" className="w-full bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Welcome / How It Works Button */}
        <button
          type="button"
          id="tab-welcome-instructions"
          onClick={() => onSelectStep("landing")}
          className={`shrink-0 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
            currentStep === "landing"
              ? "bg-[#30afff] text-white border-[#30afff] shadow-xs"
              : "bg-slate-50 hover:bg-[#92eeff]/20 text-slate-700 border-slate-200 hover:border-[#92eeff]"
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>How It Works</span>
        </button>

        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        {/* Steps Grid */}
        <ol className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1">
          {steps.map((step) => {
            const isCurrent = currentStep === step.key;
            const isClickable = canNavigateTo(step.key);
            const Icon = step.icon;

            return (
              <li key={step.key} className="relative">
                <button
                  type="button"
                  id={`step-tab-${step.key}`}
                  disabled={!isClickable}
                  onClick={() => isClickable && onSelectStep(step.key)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                    isCurrent
                      ? "bg-[#f0fbff] border-[#30afff] shadow-xs ring-1 ring-[#30afff]/30"
                      : isClickable
                      ? "bg-slate-50 hover:bg-[#d8ffc5]/20 border-slate-200 hover:border-[#c4f7ca] cursor-pointer"
                      : "bg-slate-50/40 border-slate-100 opacity-40 cursor-not-allowed"
                  }`}
                >
                  {/* Step Icon / Status Badge with palette */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                      isCurrent
                        ? "bg-[#30afff] text-white shadow-xs"
                        : step.isCompleted
                        ? "bg-[#c4f7ca] text-[#115725] border border-[#a2e8ac]"
                        : isClickable
                        ? "bg-[#92eeff]/40 text-[#0d5f99]"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step.isCompleted && !isCurrent ? (
                      <Check className="w-4 h-4 text-[#115725] stroke-[2.5]" />
                    ) : (
                      <span>{step.stepNumber}</span>
                    )}
                  </div>

                  {/* Step Text */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold truncate ${
                        isCurrent ? "text-[#0d5f99]" : step.isCompleted ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {step.description}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

