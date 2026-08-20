import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Printer,
  ShieldCheck,
  TrendingUp,
  FileText,
  Layers,
  ArrowLeft,
  Edit3,
  RefreshCw,
  Eye,
  Columns,
  ListCheck,
  Share2,
} from "lucide-react";
import { OptimizationResult, ResumeSectionsInput, AnalysisResult } from "../types";

interface OptimizedOutputStepProps {
  optimization: OptimizationResult;
  originalSections: ResumeSectionsInput;
  initialRating: number;
  jobTitle: string;
  onBackToInterview: () => void;
  onRefineSection: (sectionKey: string, currentText: string) => void;
}

export const OptimizedOutputStep: React.FC<OptimizedOutputStepProps> = ({
  optimization,
  originalSections,
  initialRating,
  jobTitle,
  onBackToInterview,
  onRefineSection,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"sideBySide" | "fullResume" | "checklist">("sideBySide");
  const [editableSections, setEditableSections] = useState({
    careerSummary: optimization.optimizedSections.careerSummary.text,
    coreCompetencies: optimization.optimizedSections.coreCompetencies.formattedText,
    handsOnProjects: optimization.optimizedSections.handsOnProjects.formattedText,
    professionalExperience: optimization.optimizedSections.professionalExperience.formattedText,
  });

  // Confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#6366f1", "#10b981", "#ec4899"],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getFullResumeText = () => {
    return `=== CAREER SUMMARY ===\n${editableSections.careerSummary}\n\n=== CORE COMPETENCIES ===\n${editableSections.coreCompetencies}\n\n=== HANDS-ON PROJECTS ===\n${editableSections.handsOnProjects}\n\n=== PROFESSIONAL EXPERIENCE ===\n${editableSections.professionalExperience}`;
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([getFullResumeText()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${jobTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_ats_optimized_resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadMd = () => {
    const mdContent = `# ATS-Optimized Resume for ${jobTitle}\n\n## Career Summary\n${editableSections.careerSummary}\n\n## Core Competencies\n${editableSections.coreCompetencies}\n\n## Hands-on Projects\n${editableSections.handsOnProjects}\n\n## Professional Experience\n${editableSections.professionalExperience}`;
    const element = document.createElement("a");
    const file = new Blob([mdContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${jobTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_ats_optimized_resume.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Top Banner: Score Jump & Truthfulness Seal */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative soft gradients */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-[#92eeff]/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -mb-10 w-64 h-64 rounded-full bg-[#d8ffc5]/25 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#92eeff]/30 text-[#0d5f99] border border-[#92eeff]">
              <Sparkles className="w-3.5 h-3.5 text-[#30afff]" />
              Tailored Suggestions Ready
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Truthfully Optimized for ATS & Hiring Committees
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              {optimization.hiringManagerNote}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#115725] font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#1a7434]" />
              <span>{optimization.truthfulnessAudit}</span>
            </div>
          </div>

          {/* Score Jump Card */}
          <div className="shrink-0 bg-gradient-to-br from-slate-50 to-[#f2ffed] border border-[#c4f7ca] p-5 rounded-2xl flex items-center gap-6 shadow-xs">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Original Match
              </span>
              <span className="text-2xl font-black text-slate-600">{initialRating}%</span>
            </div>

            <div className="flex flex-col items-center">
              <TrendingUp className="w-5 h-5 text-[#1a7434] animate-bounce" />
              <span className="text-xs font-bold text-[#115725]">
                +{optimization.scoreImprovement}%
              </span>
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-[#115725] block mb-1">
                Optimized ATS Score
              </span>
              <span className="text-3xl font-black text-[#115725]">
                {optimization.projectedRating}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* IMPORTANT CAVEAT HIGHLIGHT (Requested by user) */}
      <div
        id="output-caveat-notice"
        className="rounded-2xl bg-[#f4ffed] border-2 border-[#c4f7ca] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-[#c4f7ca] border border-[#a2e8ac] flex items-center justify-center shrink-0 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-[#115725]" />
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#d8ffc5] text-[#115725] border border-[#bbf0a7]">
              Notice
            </span>
            <h4 className="text-sm font-black text-slate-900">
              Keep It Accurate
            </h4>
          </div>
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            Resume Modifier only uses information that you provide. It will not invent skills, qualifications, or experience.
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Match scores are estimates and do not guarantee an interview or job offer.
          </p>
        </div>
      </div>

      {/* Toolbar: Views & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            id="view-side-by-side-btn"
            onClick={() => setViewMode("sideBySide")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === "sideBySide"
                ? "bg-[#30afff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side Comparison</span>
          </button>
          <button
            type="button"
            id="view-full-resume-btn"
            onClick={() => setViewMode("fullResume")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === "fullResume"
                ? "bg-[#30afff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Full Formatted Resume</span>
          </button>
          <button
            type="button"
            id="view-checklist-btn"
            onClick={() => setViewMode("checklist")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === "checklist"
                ? "bg-[#30afff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListCheck className="w-3.5 h-3.5" />
            <span>ATS Keywords Checklist ({optimization.atsChecklist.length})</span>
          </button>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="copy-all-resume-btn"
            onClick={() => handleCopyText(getFullResumeText(), "all")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-[#92eeff]/20 text-slate-700 hover:text-[#0d5f99] border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedKey === "all" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1a7434]" />
                <span className="text-[#115725]">Copied Full Resume!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Full Resume</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="download-txt-btn"
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>.TXT</span>
          </button>

          <button
            type="button"
            id="download-md-btn"
            onClick={handleDownloadMd}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>.MD</span>
          </button>

          <button
            type="button"
            id="print-resume-btn"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#30afff] hover:bg-[#1a88d6] text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      {viewMode === "sideBySide" && (
        <div className="space-y-8">
          {/* SECTION 1: Career Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-base font-bold text-slate-900">Career Summary</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="refine-summary-btn"
                  onClick={() => onRefineSection("Career Summary", editableSections.careerSummary)}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Refine with AI
                </button>
                <button
                  type="button"
                  id="copy-summary-btn"
                  onClick={() => handleCopyText(editableSections.careerSummary, "summary")}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "summary" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "summary" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Side-by-side grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Original Career Summary
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic whitespace-pre-line">
                  {originalSections.careerSummary || "(Empty in initial resume)"}
                </p>
              </div>

              {/* Optimized */}
              <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                    ATS-Optimized Career Summary
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Editable</span>
                </div>
                <textarea
                  rows={4}
                  value={editableSections.careerSummary}
                  onChange={(e) => setEditableSections({ ...editableSections, careerSummary: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed outline-none resize-y shadow-xs"
                />

                {/* Changes summary */}
                <div className="text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-700">Key Enhancements:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {optimization.optimizedSections.careerSummary.changesMade.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Core Competencies */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-base font-bold text-slate-900">Core Competencies & Key Skills</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="refine-competencies-btn"
                  onClick={() => onRefineSection("Core Competencies", editableSections.coreCompetencies)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Refine with AI
                </button>
                <button
                  type="button"
                  id="copy-competencies-btn"
                  onClick={() => handleCopyText(editableSections.coreCompetencies, "competencies")}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "competencies" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "competencies" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Original Competencies
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic whitespace-pre-line">
                  {originalSections.coreCompetencies || "(Empty in initial resume)"}
                </p>
              </div>

              <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl p-4 space-y-3">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  ATS-Optimized Competencies Grid
                </span>
                <textarea
                  rows={4}
                  value={editableSections.coreCompetencies}
                  onChange={(e) => setEditableSections({ ...editableSections, coreCompetencies: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed outline-none resize-y shadow-xs"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {optimization.optimizedSections.coreCompetencies.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-white text-indigo-700 border border-indigo-200 font-bold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Hands-on Projects */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-base font-bold text-slate-900">Hands-on Projects</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="refine-projects-btn"
                  onClick={() => onRefineSection("Hands-on Projects", editableSections.handsOnProjects)}
                  className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Refine with AI
                </button>
                <button
                  type="button"
                  id="copy-projects-btn"
                  onClick={() => handleCopyText(editableSections.handsOnProjects, "projects")}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "projects" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "projects" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Original Projects
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic whitespace-pre-line">
                  {originalSections.handsOnProjects || "(Empty in initial resume)"}
                </p>
              </div>

              <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 space-y-3">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                  STAR-Enhanced Projects
                </span>
                <textarea
                  rows={6}
                  value={editableSections.handsOnProjects}
                  onChange={(e) => setEditableSections({ ...editableSections, handsOnProjects: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-amber-600 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed outline-none font-mono resize-y shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Professional Experience */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="text-base font-bold text-slate-900">Professional Experience</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="refine-experience-btn"
                  onClick={() => onRefineSection("Professional Experience", editableSections.professionalExperience)}
                  className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Refine with AI
                </button>
                <button
                  type="button"
                  id="copy-experience-btn"
                  onClick={() => handleCopyText(editableSections.professionalExperience, "experience")}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "experience" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "experience" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Original Experience
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic whitespace-pre-line">
                  {originalSections.professionalExperience || "(Empty in initial resume)"}
                </p>
              </div>

              <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 space-y-3">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  ATS-Optimized Impact Bullets
                </span>
                <textarea
                  rows={8}
                  value={editableSections.professionalExperience}
                  onChange={(e) => setEditableSections({ ...editableSections, professionalExperience: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-lg p-2.5 text-xs text-slate-900 leading-relaxed outline-none font-mono resize-y shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Resume Clean Preview */}
      {viewMode === "fullResume" && (
        <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-8 font-sans print:p-0 print:border-none print:shadow-none">
          <div className="border-b-2 border-slate-900 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              Candidate Resume
            </h1>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">
              Target Position: {jobTitle}
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Career Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line">
              {editableSections.careerSummary}
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Core Competencies
            </h2>
            <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line">
              {editableSections.coreCompetencies}
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Hands-on Projects
            </h2>
            <div className="text-xs leading-relaxed text-slate-800 whitespace-pre-line font-mono">
              {editableSections.handsOnProjects}
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Professional Experience
            </h2>
            <div className="text-xs leading-relaxed text-slate-800 whitespace-pre-line font-mono">
              {editableSections.professionalExperience}
            </div>
          </div>
        </div>
      )}

      {/* ATS Checklist Table View */}
      {viewMode === "checklist" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">ATS Keyword Integration Audit</h3>
              <p className="text-xs text-slate-500">
                Detailed breakdown of how every job requirement was handled
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {optimization.atsChecklist.length} Monitored Keywords
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">ATS Keyword / Requirement</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Location Found</th>
                  <th className="p-3">Hiring Manager Audit Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {optimization.atsChecklist.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{item.keyword}</td>
                    <td className="p-3">
                      {item.status === "matched_original" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3" /> In Original Resume
                        </span>
                      ) : item.status === "added_from_interview" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Sparkles className="w-3 h-3" /> Added from Interview
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Truthfully Omitted
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700">{item.locationFound || "Career Summary / Experience"}</td>
                    <td className="p-3 text-slate-500 italic text-[11px]">{item.note || "Verified alignment"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Back to Interview Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          id="back-to-interview-btn"
          onClick={onBackToInterview}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Adjust Interview Answers / Skills</span>
        </button>

        <button
          type="button"
          id="copy-full-resume-bottom-btn"
          onClick={() => handleCopyText(getFullResumeText(), "all-bottom")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#30afff] hover:bg-[#1a88d6] text-white shadow-md shadow-[#30afff]/30 transition cursor-pointer"
        >
          {copiedKey === "all-bottom" ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          <span>{copiedKey === "all-bottom" ? "Resume Copied!" : "Copy Full Optimized Resume"}</span>
        </button>
      </div>
    </div>
  );
};
