import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  FileText,
  Sliders,
  Filter,
  Check,
  AlertCircle,
} from "lucide-react";
import { MissingKeywordItem, CandidateResponseItem } from "../types";

interface InterviewStepProps {
  missingKeywords: MissingKeywordItem[];
  candidateResponses: Record<string, CandidateResponseItem>;
  setCandidateResponses: React.Dispatch<React.SetStateAction<Record<string, CandidateResponseItem>>>;
  onGenerateOptimized: (tone: string) => void;
  isLoading: boolean;
}

export const InterviewStep: React.FC<InterviewStepProps> = ({
  missingKeywords,
  candidateResponses,
  setCandidateResponses,
  onGenerateOptimized,
  isLoading,
}) => {
  const [filterImportance, setFilterImportance] = useState<string>("all");
  const [selectedTone, setSelectedTone] = useState<string>("Results-Driven & ATS Direct (STAR Format)");

  const handleTogglePossession = (item: MissingKeywordItem, hasIt: boolean) => {
    setCandidateResponses((prev) => ({
      ...prev,
      [item.id]: {
        id: item.id,
        keyword: item.keyword,
        userHasIt: hasIt,
        proficiencyLevel: prev[item.id]?.proficiencyLevel || "intermediate",
        yearsOfExperience: prev[item.id]?.yearsOfExperience || "2+ years",
        userDescriptionNotes: prev[item.id]?.userDescriptionNotes || "",
      },
    }));
  };

  const handleUpdateField = (id: string, field: keyof CandidateResponseItem, value: any) => {
    setCandidateResponses((prev) => {
      const current = prev[id] || {
        id,
        keyword: missingKeywords.find((k) => k.id === id)?.keyword || "",
        userHasIt: true,
      };
      return {
        ...prev,
        [id]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const handleMarkAllPossessed = () => {
    const updated: Record<string, CandidateResponseItem> = { ...candidateResponses };
    missingKeywords.forEach((item) => {
      if (!updated[item.id]) {
        updated[item.id] = {
          id: item.id,
          keyword: item.keyword,
          userHasIt: true,
          proficiencyLevel: "intermediate",
          yearsOfExperience: "2+ years",
          userDescriptionNotes: "",
        };
      } else {
        updated[item.id].userHasIt = true;
      }
    });
    setCandidateResponses(updated);
  };

  const handleMarkAllOmitted = () => {
    const updated: Record<string, CandidateResponseItem> = { ...candidateResponses };
    missingKeywords.forEach((item) => {
      updated[item.id] = {
        id: item.id,
        keyword: item.keyword,
        userHasIt: false,
        proficiencyLevel: "basic",
        yearsOfExperience: "0",
        userDescriptionNotes: "",
      };
    });
    setCandidateResponses(updated);
  };

  const filteredItems = missingKeywords.filter((item) => {
    if (filterImportance === "all") return true;
    return item.importance.toLowerCase() === filterImportance.toLowerCase();
  });

  const confirmedCount = (Object.values(candidateResponses) as CandidateResponseItem[]).filter((r) => r.userHasIt).length;
  const answeredCount = Object.keys(candidateResponses).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Hiring Manager Interview Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              Step 4: Candidate Clarification Interview
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Uncover Your Unwritten Skills & Experience
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Applicant Tracking Systems (ATS) scan for exact keywords. Below are qualifications found in the job posting that weren't detected in your resume. Check off the ones you actually have so the Hiring Manager can optimize your resume truthfully without making anything up.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="shrink-0 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center min-w-[170px] shadow-xs">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
              Confirmed Skills
            </span>
            <span className="text-3xl font-black text-blue-700">
              {confirmedCount} <span className="text-sm font-normal text-slate-500">/ {missingKeywords.length}</span>
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {answeredCount} answered
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Batch Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl text-xs shadow-sm">
        {/* Filter by Importance */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-bold text-slate-700">Filter:</span>
          {["all", "critical", "high", "medium"].map((imp) => (
            <button
              key={imp}
              id={`filter-importance-${imp}`}
              type="button"
              onClick={() => setFilterImportance(imp)}
              className={`px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold transition cursor-pointer ${
                filterImportance === imp
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {imp}
            </button>
          ))}
        </div>

        {/* Batch Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="batch-mark-all-btn"
            onClick={handleMarkAllPossessed}
            className="px-3 py-1.5 rounded-lg font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
          >
            Mark All as "I Have This"
          </button>
          <button
            type="button"
            id="batch-clear-all-btn"
            onClick={handleMarkAllOmitted}
            className="px-3 py-1.5 rounded-lg font-semibold bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 transition cursor-pointer"
          >
            Mark All as "I Don't Have This"
          </button>
        </div>
      </div>

      {/* Missing Keywords Interview Cards Grid */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          const resp = candidateResponses[item.id];
          const hasIt = resp?.userHasIt === true;
          const isExplicitlyNo = resp?.userHasIt === false;

          return (
            <div
              key={item.id || index}
              className={`border rounded-xl p-5 transition-all shadow-xs ${
                hasIt
                  ? "bg-blue-50/40 border-blue-300"
                  : isExplicitlyNo
                  ? "bg-slate-50/70 border-slate-200 opacity-60"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Keyword Details & Hiring Manager Context */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base text-slate-900">
                      {item.keyword}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.importance === "critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : item.importance === "high"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.importance} Requirement
                    </span>
                    <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                      Category: {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-blue-700 font-semibold leading-relaxed">
                    💡 <span className="italic">"{item.suggestedQuestion}"</span>
                  </p>

                  <p className="text-[11px] text-slate-500">
                    <span className="font-bold text-slate-600">Job Context:</span> {item.contextFromJob}
                  </p>
                </div>

                {/* Response Actions (Yes vs No) */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    id={`have-skill-btn-${item.id}`}
                    onClick={() => handleTogglePossession(item, true)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      hasIt
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 border border-blue-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>I Have This</span>
                  </button>

                  <button
                    type="button"
                    id={`lack-skill-btn-${item.id}`}
                    onClick={() => handleTogglePossession(item, false)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      isExplicitlyNo
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>I Don't Have This (Skip)</span>
                  </button>
                </div>
              </div>

              {/* Sub-inputs when candidate confirms they possess this skill/experience */}
              {hasIt && (
                <div className="mt-4 pt-4 border-t border-blue-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  {/* Proficiency Level */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Award className="w-3 h-3 text-blue-600" />
                      Proficiency Level
                    </label>
                    <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                      {(["basic", "intermediate", "advanced"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          id={`prof-${item.id}-${lvl}`}
                          onClick={() => handleUpdateField(item.id, "proficiencyLevel", lvl)}
                          className={`flex-1 py-1 rounded text-[11px] font-bold capitalize transition cursor-pointer ${
                            (resp?.proficiencyLevel || "intermediate") === lvl
                              ? "bg-blue-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      id={`years-${item.id}`}
                      placeholder="e.g. 1 year, 3+ years"
                      value={resp?.yearsOfExperience || "2+ years"}
                      onChange={(e) => handleUpdateField(item.id, "yearsOfExperience", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>

                  {/* Work Experience / Project Anecdote (Optional) */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-600" />
                        Brief Project / Real-World Usage Example (Optional)
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Helps model write authentic bullets</span>
                    </label>
                    <input
                      type="text"
                      id={`notes-${item.id}`}
                      placeholder="e.g., Used Docker & GitHub Actions to automate CI/CD pipeline deployments across 3 staging environments"
                      value={resp?.userDescriptionNotes || ""}
                      onChange={(e) => handleUpdateField(item.id, "userDescriptionNotes", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Optimization Tone & Action Footer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Select Resume Optimization Tone
            </h4>
            <p className="text-xs text-slate-500">
              Choose how your 4 sections should be articulated for the hiring committee
            </p>
          </div>

          {/* Tone Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              "Results-Driven & ATS Direct (STAR Format)",
              "Executive & Strategic Leadership",
              "Technical & Systems Architecture Focused",
            ].map((tone) => (
              <button
                key={tone}
                type="button"
                id={`tone-${tone.slice(0, 10)}`}
                onClick={() => setSelectedTone(tone)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedTone === tone
                    ? "bg-[#30afff] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button & Truthfulness Assurance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#1a7434] shrink-0" />
            <span>
              <strong className="text-slate-800">Strict Accuracy Guarantee:</strong> Only verified skills and experiences you confirm will be incorporated. Zero fabricated credentials.
            </span>
          </div>

          <button
            id="generate-optimized-resume-btn"
            type="button"
            disabled={isLoading}
            onClick={() => onGenerateOptimized(selectedTone)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-[#30afff] hover:bg-[#1a88d6] text-white shadow-lg shadow-[#30afff]/30 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Optimizing 4 Resume Sections...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Review Your Improved Resume</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
