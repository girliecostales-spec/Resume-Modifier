import React, { useState, useRef } from "react";
import {
  Briefcase,
  FileText,
  Upload,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Zap,
  ArrowRight,
  ListOrdered,
  BookOpen,
} from "lucide-react";
import { JobPostingInput, ResumeSectionsInput } from "../types";
import { parseUploadedFile, autoSplitResumeText } from "../lib/fileParser";

interface InputStepProps {
  job: JobPostingInput;
  setJob: React.Dispatch<React.SetStateAction<JobPostingInput>>;
  resume: ResumeSectionsInput;
  setResume: React.Dispatch<React.SetStateAction<ResumeSectionsInput>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const InputStep: React.FC<InputStepProps> = ({
  job,
  setJob,
  resume,
  setResume,
  onAnalyze,
  isLoading,
}) => {
  const [activeResumeTab, setActiveResumeTab] = useState<"sections" | "allInOne">("sections");
  const [allInOneText, setAllInOneText] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Character counters
  const jobLength = (job.jobTitle + job.jobDescription + job.jobRequirements).trim().length;
  const resumeLength = (
    resume.careerSummary +
    resume.coreCompetencies +
    resume.handsOnProjects +
    resume.professionalExperience
  ).trim().length;

  const isReady = jobLength > 30 && (resumeLength > 30 || allInOneText.trim().length > 30);

  const handleFileUpload = async (file: File) => {
    try {
      setUploadStatus(`Parsing ${file.name}...`);
      const extractedText = await parseUploadedFile(file);
      if (!extractedText.trim()) {
        setUploadStatus("No readable text found in uploaded file.");
        return;
      }

      setAllInOneText(extractedText);
      const splitResult = autoSplitResumeText(extractedText);
      setResume(splitResult);
      setUploadStatus(`Extracted ${file.name} successfully into 4 sections!`);
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err: any) {
      console.error("File upload error:", err);
      setUploadStatus(`Upload failed: ${err.message || "Unknown error"}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAutoSplit = () => {
    if (!allInOneText.trim()) return;
    const splitResult = autoSplitResumeText(allInOneText);
    setResume(splitResult);
    setActiveResumeTab("sections");
    setUploadStatus("Auto-split full resume into 4 sections.");
    setTimeout(() => setUploadStatus(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-white via-[#f0fbff] to-[#f4ffed] border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#92eeff]/30 text-[#0d5f99] border border-[#92eeff] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#30afff]" />
            Step 1 & 2: Target Job & Resume Inputs
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Add Your Target Job & Current Resume
          </h2>
          <p className="text-slate-700 text-sm sm:text-base mt-2 leading-relaxed font-normal">
            Paste the job advertisement details and upload or paste your resume. The AI evaluates critical ATS keywords and requirements without fabricating any experience.
          </p>
        </div>
      </div>

      {/* Main Grid: Job Posting (Left) vs Candidate Resume (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* LEFT COLUMN: Target Job Posting */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">1. Target Job Posting</h3>
                  <p className="text-xs text-slate-500">Paste the job details you are applying for</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                Required
              </span>
            </div>

            {/* Job Title */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="job-title-input"
                  className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider"
                >
                  Job Title
                </label>
                <input
                  id="job-title-input"
                  type="text"
                  placeholder="e.g. Senior Full-Stack Engineer, Lead Product Manager..."
                  value={job.jobTitle}
                  onChange={(e) => setJob({ ...job, jobTitle: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition outline-none"
                />
              </div>

              {/* Job Description */}
              <div>
                <label
                  htmlFor="job-description-input"
                  className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider"
                >
                  Job Description
                </label>
                <textarea
                  id="job-description-input"
                  rows={4}
                  placeholder="Paste the role summary, day-to-day context, team details..."
                  value={job.jobDescription}
                  onChange={(e) => setJob({ ...job, jobDescription: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 transition outline-none resize-y"
                />
              </div>

              {/* Job Requirements */}
              <div>
                <label
                  htmlFor="job-requirements-input"
                  className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center justify-between"
                >
                  <span>Job Requirements</span>
                  <span className="text-[11px] text-blue-600 font-semibold lowercase">crucial for ats</span>
                </label>
                <textarea
                  id="job-requirements-input"
                  rows={6}
                  placeholder="Paste required skills, years of experience, responsibilities, technical requirements..."
                  value={job.jobRequirements}
                  onChange={(e) => setJob({ ...job, jobRequirements: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 transition outline-none resize-y"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Job Details Loaded: {jobLength} characters</span>
            {jobLength > 30 ? (
              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for ATS Analysis
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Please add job details
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Candidate Resume */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">2. Your Current Resume</h3>
                  <p className="text-xs text-slate-500">Upload document or paste the 4 sections</p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  id="tab-sections-btn"
                  onClick={() => setActiveResumeTab("sections")}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    activeResumeTab === "sections"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  4 Sections
                </button>
                <button
                  type="button"
                  id="tab-allinone-btn"
                  onClick={() => setActiveResumeTab("allInOne")}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    activeResumeTab === "allInOne"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Full Resume / Upload
                </button>
              </div>
            </div>

            {/* Document Upload Drag & Drop Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition mb-4 ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.rtf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">
                    Upload Resume Document (PDF, DOCX, TXT)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Drag & drop or click to auto-populate the 4 sections
                  </p>
                </div>
              </div>
            </div>

            {uploadStatus && (
              <div className="mb-4 px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 flex items-center gap-2 font-medium">
                <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}

            {/* Resume Content Views */}
            {activeResumeTab === "sections" ? (
              <div className="space-y-3.5">
                {/* 1. Career Summary */}
                <div>
                  <label
                    htmlFor="career-summary-input"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">1</span>
                      Career Summary / Professional Profile
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">3-4 sentences</span>
                  </label>
                  <textarea
                    id="career-summary-input"
                    rows={2}
                    placeholder="e.g. Experienced software engineer with 5 years in full-stack cloud applications..."
                    value={resume.careerSummary}
                    onChange={(e) => setResume({ ...resume, careerSummary: e.target.value })}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 transition outline-none resize-y"
                  />
                </div>

                {/* 2. Core Competencies */}
                <div>
                  <label
                    htmlFor="core-competencies-input"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">2</span>
                      Core Competencies & Key Skills
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">Comma-separated or bullet list</span>
                  </label>
                  <textarea
                    id="core-competencies-input"
                    rows={2}
                    placeholder="e.g. React.js, TypeScript, Node.js, AWS ECS, Docker, PostgreSQL, REST APIs..."
                    value={resume.coreCompetencies}
                    onChange={(e) => setResume({ ...resume, coreCompetencies: e.target.value })}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 transition outline-none resize-y"
                  />
                </div>

                {/* 3. Hands-on Projects */}
                <div>
                  <label
                    htmlFor="hands-on-projects-input"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">3</span>
                      Hands-on Projects
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">Project titles & bullets</span>
                  </label>
                  <textarea
                    id="hands-on-projects-input"
                    rows={3}
                    placeholder="e.g. Cloud Migration Platform: Built automated container orchestration pipeline reducing deployment lag by 40%..."
                    value={resume.handsOnProjects}
                    onChange={(e) => setResume({ ...resume, handsOnProjects: e.target.value })}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 transition outline-none resize-y"
                  />
                </div>

                {/* 4. Professional Experience */}
                <div>
                  <label
                    htmlFor="professional-experience-input"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">4</span>
                      Professional Experience
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">Roles, companies & bullets</span>
                  </label>
                  <textarea
                    id="professional-experience-input"
                    rows={4}
                    placeholder="e.g. Senior Developer | CloudCorp (2022 - Present)&#10;- Led engineering of microservices architecture...&#10;- Optimized database queries..."
                    value={resume.professionalExperience}
                    onChange={(e) => setResume({ ...resume, professionalExperience: e.target.value })}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 transition outline-none resize-y"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="full-resume-paste"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Paste Full Resume Text
                  </label>
                  <button
                    type="button"
                    id="auto-split-btn"
                    onClick={handleAutoSplit}
                    disabled={!allInOneText.trim()}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Split into 4 Sections
                  </button>
                </div>
                <textarea
                  id="full-resume-paste"
                  rows={13}
                  placeholder="Paste your entire resume here. You can click 'Auto-Split into 4 Sections' or let the AI parse it directly..."
                  value={allInOneText}
                  onChange={(e) => setAllInOneText(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 transition outline-none font-mono resize-y"
                />
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Resume Content Loaded: {resumeLength || allInOneText.length} chars</span>
            {resumeLength > 30 || allInOneText.length > 30 ? (
              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 4 Sections Detected
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Add resume content
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Next: Step 1 & 2 Hiring Manager ATS Review
            </h4>
            <p className="text-xs text-slate-500">
              The AI will extract keywords, evaluate your current match %, and highlight strengths & gaps.
            </p>
          </div>
        </div>

        <button
          id="start-ats-analysis-btn"
          type="button"
          disabled={!isReady || isLoading}
          onClick={onAnalyze}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-[#30afff] hover:bg-[#1a88d6] text-white shadow-lg shadow-[#30afff]/30 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing ATS Keywords & Match...</span>
            </>
          ) : (
            <>
              <span>Review Resume & Calculate Match Score</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
