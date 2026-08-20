import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { StepIndicator } from "./components/StepIndicator";
import { LandingPage } from "./components/LandingPage";
import { InputStep } from "./components/InputStep";
import { AnalysisStep } from "./components/AnalysisStep";
import { InterviewStep } from "./components/InterviewStep";
import { OptimizedOutputStep } from "./components/OptimizedOutputStep";
import { RefineSectionModal } from "./components/RefineSectionModal";
import { SAMPLE_PRESETS } from "./data/sampleData";
import {
  JobPostingInput,
  ResumeSectionsInput,
  StepKey,
  AnalysisResult,
  OptimizationResult,
  CandidateResponseItem,
} from "./types";
import { AlertCircle } from "lucide-react";

export default function App() {
  const [job, setJob] = useState<JobPostingInput>({
    jobTitle: "",
    jobDescription: "",
    jobRequirements: "",
  });

  const [resume, setResume] = useState<ResumeSectionsInput>({
    careerSummary: "",
    coreCompetencies: "",
    handsOnProjects: "",
    professionalExperience: "",
  });

  const [currentStep, setCurrentStep] = useState<StepKey>("landing");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [candidateResponses, setCandidateResponses] = useState<Record<string, CandidateResponseItem>>({});
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refine Modal State
  const [refineModal, setRefineModal] = useState<{
    isOpen: boolean;
    sectionKey: string;
    currentText: string;
  }>({
    isOpen: false,
    sectionKey: "",
    currentText: "",
  });

  // Step navigation helper
  const canNavigateTo = (step: StepKey): boolean => {
    if (step === "landing") return true;
    if (step === "input") return true;
    if (step === "analysis") return Boolean(analysis);
    if (step === "interview") return Boolean(analysis);
    if (step === "optimized") return Boolean(optimization);
    return false;
  };

  // Load sample dataset
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PRESETS.find((s) => s.id === sampleId);
    if (!sample) return;

    setJob(sample.job);
    setResume(sample.resume);
    setAnalysis(null);
    setOptimization(null);
    setCandidateResponses({});
    setCurrentStep("input");
    setErrorMessage(null);
  };

  // Reset entire application
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all inputs and resume analysis?")) {
      setJob({ jobTitle: "", jobDescription: "", jobRequirements: "" });
      setResume({
        careerSummary: "",
        coreCompetencies: "",
        handsOnProjects: "",
        professionalExperience: "",
      });
      setAnalysis(null);
      setOptimization(null);
      setCandidateResponses({});
      setCurrentStep("landing");
      setErrorMessage(null);
    }
  };

  // Step 1 -> Step 2: Trigger ATS Keyword Analysis & Initial Score
  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/analyze-job-and-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.jobTitle,
          jobDescription: job.jobDescription,
          jobRequirements: job.jobRequirements,
          careerSummary: resume.careerSummary,
          coreCompetencies: resume.coreCompetencies,
          handsOnProjects: resume.handsOnProjects,
          professionalExperience: resume.professionalExperience,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to analyze resume.");
      }

      const data: AnalysisResult = await response.json();
      setAnalysis(data);

      // If backend parsed sections from raw text, update state
      if (data.parsedResumeSections) {
        if (!resume.careerSummary && data.parsedResumeSections.careerSummary) {
          setResume((prev) => ({ ...prev, careerSummary: data.parsedResumeSections?.careerSummary || prev.careerSummary }));
        }
        if (!resume.coreCompetencies && data.parsedResumeSections.coreCompetencies) {
          setResume((prev) => ({ ...prev, coreCompetencies: data.parsedResumeSections?.coreCompetencies || prev.coreCompetencies }));
        }
        if (!resume.handsOnProjects && data.parsedResumeSections.handsOnProjects) {
          setResume((prev) => ({ ...prev, handsOnProjects: data.parsedResumeSections?.handsOnProjects || prev.handsOnProjects }));
        }
        if (!resume.professionalExperience && data.parsedResumeSections.professionalExperience) {
          setResume((prev) => ({ ...prev, professionalExperience: data.parsedResumeSections?.professionalExperience || prev.professionalExperience }));
        }
      }

      // Initialize default candidate responses for missing items
      const initialResponses: Record<string, CandidateResponseItem> = {};
      data.missingKeywords.forEach((k) => {
        initialResponses[k.id] = {
          id: k.id,
          keyword: k.keyword,
          userHasIt: true,
          proficiencyLevel: "intermediate",
          yearsOfExperience: "2+ years",
          userDescriptionNotes: "",
        };
      });
      setCandidateResponses(initialResponses);

      setCurrentStep("analysis");
    } catch (err: any) {
      console.error("Analysis error:", err);
      setErrorMessage(err.message || "Failed to analyze job and resume.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4 -> Step 5: Generate Truthfully Optimized Resume
  const handleGenerateOptimized = async (toneStyle: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/generate-optimized-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.jobTitle,
          jobDescription: job.jobDescription,
          jobRequirements: job.jobRequirements,
          originalSections: resume,
          candidateResponses: Object.values(candidateResponses),
          toneStyle,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to generate optimized resume.");
      }

      const optData: OptimizationResult = await response.json();
      setOptimization(optData);
      setCurrentStep("optimized");
    } catch (err: any) {
      console.error("Optimization error:", err);
      setErrorMessage(err.message || "Failed to optimize resume sections.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRefineModal = (sectionKey: string, currentText: string) => {
    setRefineModal({
      isOpen: true,
      sectionKey,
      currentText,
    });
  };

  const handleApplyRefinedSection = (sectionKey: string, newText: string) => {
    if (!optimization) return;

    if (sectionKey === "Career Summary") {
      setOptimization({
        ...optimization,
        optimizedSections: {
          ...optimization.optimizedSections,
          careerSummary: {
            ...optimization.optimizedSections.careerSummary,
            text: newText,
          },
        },
      });
    } else if (sectionKey === "Core Competencies") {
      setOptimization({
        ...optimization,
        optimizedSections: {
          ...optimization.optimizedSections,
          coreCompetencies: {
            ...optimization.optimizedSections.coreCompetencies,
            formattedText: newText,
          },
        },
      });
    } else if (sectionKey === "Hands-on Projects") {
      setOptimization({
        ...optimization,
        optimizedSections: {
          ...optimization.optimizedSections,
          handsOnProjects: {
            ...optimization.optimizedSections.handsOnProjects,
            formattedText: newText,
          },
        },
      });
    } else if (sectionKey === "Professional Experience") {
      setOptimization({
        ...optimization,
        optimizedSections: {
          ...optimization.optimizedSections,
          professionalExperience: {
            ...optimization.optimizedSections.professionalExperience,
            formattedText: newText,
          },
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <Navbar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        canNavigateTo={canNavigateTo}
      />

      {/* Progress Flow Tabs */}
      <StepIndicator
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        canNavigateTo={canNavigateTo}
        hasAnalysis={Boolean(analysis)}
        hasOptimization={Boolean(optimization)}
        missingSkillsCount={analysis?.missingKeywords.length || 0}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Step View Container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-16">
        {currentStep === "landing" && (
          <LandingPage
            onStart={() => setCurrentStep("input")}
            onLoadSample={handleLoadSample}
            onSelectStep={(step) => setCurrentStep(step)}
          />
        )}

        {currentStep === "input" && (
          <InputStep
            job={job}
            setJob={setJob}
            resume={resume}
            setResume={setResume}
            onAnalyze={handleRunAnalysis}
            isLoading={isLoading}
          />
        )}

        {currentStep === "analysis" && analysis && (
          <AnalysisStep
            analysis={analysis}
            onProceedToInterview={() => setCurrentStep("interview")}
          />
        )}

        {currentStep === "interview" && analysis && (
          <InterviewStep
            missingKeywords={analysis.missingKeywords}
            candidateResponses={candidateResponses}
            setCandidateResponses={setCandidateResponses}
            onGenerateOptimized={handleGenerateOptimized}
            isLoading={isLoading}
          />
        )}

        {currentStep === "optimized" && optimization && (
          <OptimizedOutputStep
            optimization={optimization}
            originalSections={resume}
            initialRating={analysis?.initialRating || 0}
            jobTitle={job.jobTitle || "Target Role"}
            onBackToInterview={() => setCurrentStep("interview")}
            onRefineSection={handleOpenRefineModal}
          />
        )}
      </main>

      {/* Refine Modal */}
      <RefineSectionModal
        isOpen={refineModal.isOpen}
        onClose={() => setRefineModal({ ...refineModal, isOpen: false })}
        sectionKey={refineModal.sectionKey}
        currentText={refineModal.currentText}
        jobTitle={job.jobTitle}
        jobDescription={job.jobDescription}
        onApply={handleApplyRefinedSection}
      />
    </div>
  );
}
