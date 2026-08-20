import React from "react";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Tag,
  Briefcase,
  Wrench,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layers,
  Award,
} from "lucide-react";
import { AnalysisResult } from "../types";

interface AnalysisStepProps {
  analysis: AnalysisResult;
  onProceedToInterview: () => void;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({
  analysis,
  onProceedToInterview,
}) => {
  const { jobAnalysis, initialRating, overallSummary, matchedKeywords, missingKeywords } = analysis;

  // Score tier
  const getScoreTier = (score: number) => {
    if (score >= 80) return { label: "High ATS Match", color: "text-emerald-700", border: "border-emerald-200", bg: "bg-emerald-50" };
    if (score >= 60) return { label: "Moderate Match (ATS Risky)", color: "text-amber-700", border: "border-amber-200", bg: "bg-amber-50" };
    return { label: "Low ATS Match (Likely Screened Out)", color: "text-rose-700", border: "border-rose-200", bg: "bg-rose-50" };
  };

  const tier = getScoreTier(initialRating);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Top Banner: Initial Rating & Executive Hiring Manager Verdict */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative color accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-[#92eeff]/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 w-60 h-60 rounded-full bg-[#d8ffc5]/25 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Hiring Manager Summary */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#92eeff]/30 text-[#0d5f99] border border-[#92eeff]">
              <Sparkles className="w-3.5 h-3.5 text-[#30afff]" />
              Step 3: Match Results & Keywords Diagnosis
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Initial Resume Match Assessment
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              {overallSummary}
            </p>
          </div>

          {/* Right: Circular / Big Percentage Match Rating */}
          <div className="shrink-0 flex items-center justify-center">
            <div
              className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center min-w-[200px] shadow-xs ${tier.bg} ${tier.border}`}
            >
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">
                Estimated Match Score
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className={`text-5xl font-black tracking-tight ${tier.color}`}>
                  {initialRating}%
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 border ${tier.border} ${tier.color}`}>
                {tier.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Job Keywords (Step 1) vs Matched Evidence (Step 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Step 1: Extracted Job Requirements & ATS Keywords */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Step 1: Job ATS Keywords & Skills</h3>
                <p className="text-[11px] text-slate-500">Identified from the job posting</p>
              </div>
            </div>

            {/* Role Summary Insight */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                Target Role Profile
              </span>
              <p className="leading-relaxed">{jobAnalysis.roleSummary}</p>
            </div>

            {/* Core ATS Keywords */}
            <div>
              <span className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                Key ATS Keywords ({jobAnalysis.atsKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {jobAnalysis.atsKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Tools & Platforms */}
            {jobAnalysis.technicalTools.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3 h-3 text-slate-400" />
                  Technical Tools & Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {jobAnalysis.technicalTools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Must-Have vs Nice-to-Have Skills */}
            <div>
              <span className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                Must-Have Requirements
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {jobAnalysis.mustHaveSkills.map((req, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold shrink-0">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Step 3: Matched Well in Resume (Evidence Citations) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Step 3: Well-Matched Resume Content</h3>
                  <p className="text-xs text-slate-500">
                    Parts of your resume that aligned strongly with job requirements
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {matchedKeywords.length} Found
              </span>
            </div>

            {matchedKeywords.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-200">
                No direct keyword matches were detected in your current resume text. Let's interview you to discover your unwritten skills!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
                {matchedKeywords.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-emerald-300 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {item.keyword}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.matchStrength === "High"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {item.matchStrength} Alignment
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                        Evidence in your resume:
                      </span>
                      <p className="italic text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed text-[11px]">
                        "{item.resumeEvidence}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing Keywords Transition Banner (Step 4 Preview) */}
          <div className="bg-white border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h4 className="font-bold text-slate-900 text-base">
                  Step 4: {missingKeywords.length} Unlisted Skills & Requirements Found
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The hiring manager identified keywords and experiences in the job posting that are missing from your resume. Next, you will clarify which ones you actually have so we can optimize your resume truthfully.
              </p>
            </div>

            <button
              id="proceed-to-interview-btn"
              type="button"
              onClick={onProceedToInterview}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-[#30afff] hover:bg-[#1a88d6] text-white shadow-md shadow-[#30afff]/30 transition cursor-pointer"
            >
              <span>Begin Skill Confirmation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
