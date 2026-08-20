export interface JobPostingInput {
  jobTitle: string;
  jobDescription: string;
  jobRequirements: string;
}

export interface ResumeSectionsInput {
  careerSummary: string;
  coreCompetencies: string;
  handsOnProjects: string;
  professionalExperience: string;
}

export interface JobAnalysis {
  atsKeywords: string[];
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  technicalTools: string[];
  softSkills: string[];
  experienceRequirements: string[];
  roleSummary: string;
}

export interface MatchedKeywordItem {
  keyword: string;
  category: 'Skill' | 'Tool' | 'Experience' | 'Requirement' | 'Soft Skill';
  resumeEvidence: string;
  matchStrength: 'High' | 'Medium' | 'Partial';
}

export interface MissingKeywordItem {
  id: string;
  keyword: string;
  category: 'skill' | 'experience' | 'tool' | 'qualification' | 'domain';
  importance: 'critical' | 'high' | 'medium';
  contextFromJob: string;
  suggestedQuestion: string;
  allowRanking?: boolean;
  allowYears?: boolean;
  askProjectDescription?: boolean;
}

export interface CandidateResponseItem {
  id: string;
  keyword: string;
  userHasIt: boolean;
  proficiencyLevel?: 'basic' | 'intermediate' | 'advanced';
  yearsOfExperience?: string;
  userDescriptionNotes?: string;
}

export interface AnalysisResult {
  jobAnalysis: JobAnalysis;
  initialRating: number;
  overallSummary: string;
  matchedKeywords: MatchedKeywordItem[];
  missingKeywords: MissingKeywordItem[];
  parsedResumeSections?: ResumeSectionsInput;
}

export interface OptimizedSectionSummary {
  text: string;
  changesMade: string[];
  keywordsIncluded: string[];
}

export interface OptimizedCompetencies {
  items: string[];
  formattedText: string;
  changesMade: string[];
  keywordsIncluded: string[];
}

export interface OptimizedProjectItem {
  title: string;
  contextOrRole: string;
  bullets: string[];
  keywordsUsed: string[];
}

export interface OptimizedProjects {
  projects: OptimizedProjectItem[];
  formattedText: string;
  changesMade: string[];
}

export interface OptimizedExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  keywordsUsed: string[];
}

export interface OptimizedExperience {
  experiences: OptimizedExperienceItem[];
  formattedText: string;
  changesMade: string[];
}

export interface AtsChecklistItem {
  keyword: string;
  status: 'matched_original' | 'added_from_interview' | 'omitted_truthfully';
  locationFound?: string;
  note?: string;
}

export interface OptimizationResult {
  projectedRating: number;
  scoreImprovement: number;
  hiringManagerNote: string;
  truthfulnessAudit: string;
  optimizedSections: {
    careerSummary: OptimizedSectionSummary;
    coreCompetencies: OptimizedCompetencies;
    handsOnProjects: OptimizedProjects;
    professionalExperience: OptimizedExperience;
  };
  atsChecklist: AtsChecklistItem[];
}

export type StepKey = 'landing' | 'input' | 'analysis' | 'interview' | 'optimized';
