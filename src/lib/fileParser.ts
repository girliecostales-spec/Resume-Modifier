import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Set worker source for pdfjs-dist
if (typeof window !== "undefined") {
  // Use unpkg or cdn fallback or worker setup
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "4.10.38"}/pdf.worker.min.mjs`;
}

export async function parseUploadedFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".txt") || fileName.endsWith(".md") || fileName.endsWith(".rtf")) {
    return await file.text();
  }

  if (fileName.endsWith(".docx")) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "";
  }

  if (fileName.endsWith(".pdf")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      let fullText = "";

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .filter(Boolean);
        fullText += pageStrings.join(" ") + "\n\n";
      }
      return fullText.trim();
    } catch (err) {
      console.warn("PDF parsing fallback:", err);
      // Fallback text read if binary
      const text = await file.text();
      return text.replace(/[^\x20-\x7E\n\r\t]/g, " ");
    }
  }

  // Generic fallback
  return await file.text();
}

export interface SplitResumeSections {
  careerSummary: string;
  coreCompetencies: string;
  handsOnProjects: string;
  professionalExperience: string;
}

export function autoSplitResumeText(rawText: string): SplitResumeSections {
  const lines = rawText.split("\n");
  const sections: SplitResumeSections = {
    careerSummary: "",
    coreCompetencies: "",
    handsOnProjects: "",
    professionalExperience: "",
  };

  type CurrentSec = "none" | "summary" | "skills" | "projects" | "experience";
  let currentSec: CurrentSec = "none";

  const summaryHeaders = /^(career\s+summary|professional\s+summary|summary|profile|executive\s+summary|about\s+me)/i;
  const skillsHeaders = /^(core\s+competencies|competencies|skills|key\s+skills|technical\s+skills|areas\s+of\s+expertise|expertise|technologies)/i;
  const projectsHeaders = /^(hands-on\s+projects|projects|key\s+projects|technical\s+projects|selected\s+projects|academic\s+projects)/i;
  const experienceHeaders = /^(professional\s+experience|work\s+experience|experience|employment\s+history|career\s+history|work\s+history)/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line is a header
    const cleanHeader = trimmed.replace(/^[\W_]+|[\W_]+$/g, "").trim();

    if (summaryHeaders.test(cleanHeader) && cleanHeader.length < 40) {
      currentSec = "summary";
      continue;
    } else if (skillsHeaders.test(cleanHeader) && cleanHeader.length < 45) {
      currentSec = "skills";
      continue;
    } else if (projectsHeaders.test(cleanHeader) && cleanHeader.length < 40) {
      currentSec = "projects";
      continue;
    } else if (experienceHeaders.test(cleanHeader) && cleanHeader.length < 45) {
      currentSec = "experience";
      continue;
    }

    if (currentSec === "summary") {
      sections.careerSummary += line + "\n";
    } else if (currentSec === "skills") {
      sections.coreCompetencies += line + "\n";
    } else if (currentSec === "projects") {
      sections.handsOnProjects += line + "\n";
    } else if (currentSec === "experience") {
      sections.professionalExperience += line + "\n";
    } else if (currentSec === "none") {
      // If at top before any header, append to summary if short
      if (!sections.careerSummary && lines.indexOf(line) < 6) {
        sections.careerSummary += line + "\n";
      }
    }
  }

  // Trim outputs
  sections.careerSummary = sections.careerSummary.trim();
  sections.coreCompetencies = sections.coreCompetencies.trim();
  sections.handsOnProjects = sections.handsOnProjects.trim();
  sections.professionalExperience = sections.professionalExperience.trim();

  // If auto-split found nothing specific, provide the raw text in experience or summary
  if (!sections.careerSummary && !sections.coreCompetencies && !sections.handsOnProjects && !sections.professionalExperience) {
    sections.careerSummary = rawText.slice(0, 400).trim();
    sections.professionalExperience = rawText.slice(400).trim();
  }

  return sections;
}
