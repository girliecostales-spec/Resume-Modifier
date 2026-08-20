import React from "react";
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Link2,
  BarChart3,
  HelpCircle,
  FileCheck2,
  Briefcase,
  Layers,
  Search,
} from "lucide-react";
import { StepKey } from "../types";
import { SAMPLE_PRESETS } from "../data/sampleData";

interface LandingPageProps {
  onStart: () => void;
  onLoadSample: (sampleId: string) => void;
  onSelectStep: (step: StepKey) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onLoadSample,
  onSelectStep,
}) => {
  const steps = [
    {
      number: "1",
      title: "Add the job posting",
      description: "Paste the job advertisement or enter its URL.",
      icon: Link2,
      accentBg: "bg-[#30afff]/10",
      accentBorder: "border-[#30afff]/40",
      accentText: "text-[#0d5f99]",
      badgeBg: "bg-[#30afff]",
      badgeText: "text-white",
      details: "Extracts essential requirements, tech stack, and ATS keywords automatically.",
    },
    {
      number: "2",
      title: "Add your resume",
      description: "Upload your resume or paste the sections you want to improve.",
      icon: Upload,
      accentBg: "bg-[#92eeff]/20",
      accentBorder: "border-[#92eeff]/80",
      accentText: "text-[#0d5f99]",
      badgeBg: "bg-[#92eeff]",
      badgeText: "text-slate-900",
      details: "Parses Career Summary, Core Competencies, Projects, and Experience.",
    },
    {
      number: "3",
      title: "View your match results",
      description: "See how closely your resume matches the job requirements, skills, and keywords.",
      icon: BarChart3,
      accentBg: "bg-[#d8ffc5]/40",
      accentBorder: "border-[#d8ffc5]",
      accentText: "text-[#115725]",
      badgeBg: "bg-[#d8ffc5]",
      badgeText: "text-slate-900",
      details: "Get an initial ATS match rating & evidence citations from your resume.",
    },
    {
      number: "4",
      title: "Confirm your skills",
      description: "Tell us about relevant skills or experience that may be missing from your resume.",
      icon: HelpCircle,
      accentBg: "bg-[#c4f7ca]/40",
      accentBorder: "border-[#c4f7ca]",
      accentText: "text-[#115725]",
      badgeBg: "bg-[#c4f7ca]",
      badgeText: "text-slate-900",
      details: "Brief candidate interview to verify skills you actually possess.",
    },
    {
      number: "5",
      title: "Review your improved resume",
      description: "Receive tailored suggestions for your career summary, core competencies, projects, and professional experience.",
      icon: FileCheck2,
      accentBg: "bg-[#30afff]/10",
      accentBorder: "border-[#30afff]/40",
      accentText: "text-[#0d5f99]",
      badgeBg: "bg-[#30afff]",
      badgeText: "text-white",
      details: "Side-by-side comparison, instant ATS checklist audit, and PDF/TXT export.",
    },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-2">
      {/* Hero Welcome Banner */}
      <section
        id="landing-hero"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#f0fbff] to-[#f4ffed] border border-slate-200 p-8 sm:p-12 lg:p-14 shadow-sm"
      >
        {/* Subtle decorative color accents based on palette */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-[#92eeff]/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-[#d8ffc5]/35 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -ml-16 w-60 h-60 rounded-full bg-[#30afff]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#92eeff]/30 text-[#0d5f99] border border-[#92eeff] shadow-xs">
            <Sparkles className="w-4 h-4 text-[#30afff]" />
            <span>AI Hiring Manager & ATS Resume Optimizer</span>
          </div>

          {/* Main Title & Subtitle from user prompt */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Tailor Your Resume to the Job
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Resume Modifier compares your resume with a job posting. It finds important keywords, highlights your strongest matches, and suggests truthful ways to improve your resume.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-start-btn"
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-[#30afff] hover:bg-[#1a88d6] text-white shadow-lg shadow-[#30afff]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start Tailoring Your Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/80 backdrop-blur-xs px-4 py-3 rounded-xl border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#1a7434]" />
              <span>100% Truthful • Zero Hallucinations</span>
            </div>
          </div>

          {/* Preset Quick Starters */}
          <div className="pt-2 border-t border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Or explore with a sample role:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`hero-preset-${preset.id}`}
                  type="button"
                  onClick={() => onLoadSample(preset.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-[#d8ffc5]/40 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-[#c4f7ca] transition cursor-pointer shadow-2xs"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#30afff]" />
                  <span>{preset.roleName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d5f99] uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5 text-[#30afff]" />
              Step-by-Step Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How It Works
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Follow these 5 simple steps to align your resume with recruiter expectations and ATS screening filters.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`relative rounded-2xl bg-white border ${step.accentBorder} p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${step.badgeBg} ${step.badgeText} shadow-xs`}
                    >
                      {step.number}
                    </div>
                    <div className={`p-2 rounded-xl ${step.accentBg} ${step.accentText}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                <div className={`pt-3 border-t border-slate-100 text-[11px] ${step.accentText} font-medium flex items-center gap-1.5`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{step.details}</span>
                </div>
              </div>
            );
          })}

          {/* Quick Start Card as 6th block in grid */}
          <div className="rounded-2xl bg-gradient-to-br from-[#30afff] to-[#1a88d6] text-white p-6 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#d8ffc5] block">
                Ready in 2 Minutes
              </span>
              <h3 className="font-bold text-lg text-white">
                Start Tailoring Today
              </h3>
              <p className="text-xs text-blue-50 leading-relaxed">
                Paste any job advertisement, upload your resume, and let our hiring manager intelligence guide your improvements.
              </p>
            </div>

            <button
              type="button"
              id="how-it-works-start-btn"
              onClick={onStart}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-white hover:bg-[#d8ffc5] text-slate-900 transition shadow-sm cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0d5f99]" />
            </button>
          </div>
        </div>
      </section>

      {/* IMPORTANT CAVEAT HIGHLIGHT BANNER */}
      <section
        id="accuracy-caveat-banner"
        className="rounded-2xl bg-[#f4ffed] border-2 border-[#c4f7ca] p-6 sm:p-8 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Visual Shield / Alert icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#c4f7ca] border border-[#a2e8ac] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-7 h-7 text-[#115725]" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#d8ffc5] text-[#115725] border border-[#bbf0a7]">
                Essential Notice
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Keep It Accurate
              </h3>
            </div>

            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              Resume Modifier only uses information that you provide. It will not invent skills, qualifications, or experience.
            </p>

            <p className="text-xs text-slate-600 leading-relaxed">
              Match scores are estimates and do not guarantee an interview or job offer.
            </p>
          </div>

          <button
            type="button"
            id="caveat-proceed-btn"
            onClick={onStart}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-[#30afff] hover:bg-[#1a88d6] text-white shadow-xs transition cursor-pointer"
          >
            <span>Proceed to Step 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Target Sections Highlight: What gets modified */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="max-w-2xl space-y-1">
          <span className="text-[11px] font-bold text-[#0d5f99] uppercase tracking-wider block">
            Comprehensive Resume Architecture
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            4 Core Sections Tailored for ATS & Hiring Committees
          </h3>
          <p className="text-xs text-slate-600">
            Every section is formatted to showcase your authentic qualifications clearly and concisely.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#f0fbff] border border-[#92eeff]/60 rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#30afff] text-white inline-block">Section 1</span>
            <h4 className="font-bold text-sm text-slate-900">Career Summary</h4>
            <p className="text-xs text-slate-600">High-impact 3–4 sentence executive summary highlighting role alignment.</p>
          </div>

          <div className="bg-[#f0fbff] border border-[#92eeff]/60 rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#92eeff] text-slate-900 inline-block">Section 2</span>
            <h4 className="font-bold text-sm text-slate-900">Core Competencies</h4>
            <p className="text-xs text-slate-600">Categorized keyword grid optimized for ATS scanners and human skimming.</p>
          </div>

          <div className="bg-[#f2ffed] border border-[#d8ffc5] rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d8ffc5] text-slate-900 inline-block">Section 3</span>
            <h4 className="font-bold text-sm text-slate-900">Hands-on Projects</h4>
            <p className="text-xs text-slate-600">STAR-method project stories articulating challenges, stack, and measurable impact.</p>
          </div>

          <div className="bg-[#f2ffed] border border-[#c4f7ca] rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#c4f7ca] text-slate-900 inline-block">Section 4</span>
            <h4 className="font-bold text-sm text-slate-900">Professional Experience</h4>
            <p className="text-xs text-slate-600">Action-verb achievement bullets enriched with verified tools and scope.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
