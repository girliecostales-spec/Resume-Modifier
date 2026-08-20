import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Step 1 to 4 Analysis Endpoint: Analyze Job & Candidate Resume
  app.post("/api/analyze-job-and-resume", async (req, res) => {
    try {
      const { jobTitle, jobDescription, jobRequirements, careerSummary, coreCompetencies, handsOnProjects, professionalExperience, fullRawResume } = req.body;

      if (!jobTitle && !jobDescription && !jobRequirements) {
        return res.status(400).json({ error: "Job posting details (Title, Description, or Requirements) are required." });
      }

      const ai = getGenAI();

      const prompt = `You are an elite corporate Hiring Manager and Executive Talent Partner at a top company, specializing in ATS (Applicant Tracking Systems) algorithms, resume screening, and hiring assessments.

Your task is to analyze the provided Job Posting and the Candidate's Resume sections according to this exact workflow:
1. Identify ATS keywords as well as important key skills, knowledge, and experience in the job posting.
2. Review the candidate's posted sections of their resume. Give an honest, objective initial percentage rating (0-100%) of how well it matches the ATS keywords, key skills, knowledge, and experience identified in the job posting.
3. Identify parts that matched well with ATS keywords, key skills, knowledge, and experience found in the job description (with clear evidence from their resume).
4. Identify critical or important ATS keywords, key skills, knowledge, or experience that cannot be found or are weak in the candidate's resume, and format targeted clarification interview questions for the candidate to ask if they possess them (with level / years / project details).
5. If the user provided full raw text instead of cleanly split sections, intelligently parse it into the 4 target sections: Career Summary, Core Competencies, Hands-on Projects, and Professional Experience.

--- JOB POSTING ---
Job Title: ${jobTitle || "Not specified"}
Job Description:
${jobDescription || "Not provided"}

Job Requirements & Responsibilities:
${jobRequirements || "Not provided"}

--- CANDIDATE RESUME SECTIONS ---
Career Summary:
${careerSummary || "(Empty / To be parsed from full text)"}

Core Competencies / Key Skills:
${coreCompetencies || "(Empty / To be parsed from full text)"}

Hands-on Projects:
${handsOnProjects || "(Empty / To be parsed from full text)"}

Professional Experience:
${professionalExperience || "(Empty / To be parsed from full text)"}

${fullRawResume ? `Full Raw Resume Text:\n${fullRawResume}` : ""}

Return valid JSON adhering strictly to the requested schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              jobAnalysis: {
                type: Type.OBJECT,
                properties: {
                  atsKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "High-priority ATS keywords extracted from the job posting (technologies, methodologies, industry jargon, titles).",
                  },
                  mustHaveSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Essential must-have skills from the posting.",
                  },
                  niceToHaveSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Preferred or nice-to-have qualifications.",
                  },
                  technicalTools: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Specific tools, platforms, languages, or software mentioned.",
                  },
                  softSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Leadership, communication, collaboration, and interpersonal traits required.",
                  },
                  experienceRequirements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Years of experience or specific domain scope requirements.",
                  },
                  roleSummary: {
                    type: Type.STRING,
                    description: "A 2-3 sentence executive summary of what this role specifically demands and what the hiring committee values most.",
                  },
                },
                required: ["atsKeywords", "mustHaveSkills", "technicalTools", "experienceRequirements", "roleSummary"],
              },
              initialRating: {
                type: Type.INTEGER,
                description: "Initial percentage score from 0 to 100 representing how well the current resume matches the job posting ATS and hiring requirements.",
              },
              overallSummary: {
                type: Type.STRING,
                description: "Constructive feedback from the hiring manager explaining the initial rating and major gaps or strong alignments.",
              },
              matchedKeywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    keyword: { type: Type.STRING },
                    category: { type: Type.STRING, description: "e.g. Skill, Tool, Experience, Requirement, Soft Skill" },
                    resumeEvidence: { type: Type.STRING, description: "Exact or closely paraphrased quote/bullet from candidate's resume where this was detected." },
                    matchStrength: { type: Type.STRING, description: "High, Medium, or Partial" },
                  },
                  required: ["keyword", "category", "resumeEvidence", "matchStrength"],
                },
                description: "List of keywords and requirements found successfully in the resume.",
              },
              missingKeywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    keyword: { type: Type.STRING },
                    category: { type: Type.STRING, description: "skill, experience, tool, qualification, or domain" },
                    importance: { type: Type.STRING, description: "critical, high, or medium" },
                    contextFromJob: { type: Type.STRING, description: "Why the job asks for this" },
                    suggestedQuestion: { type: Type.STRING, description: "Friendly interview question from hiring manager to ask candidate if they have this unlisted skill/experience." },
                    allowRanking: { type: Type.BOOLEAN, description: "Whether candidate should rank proficiency (basic, intermediate, advanced)" },
                    allowYears: { type: Type.BOOLEAN, description: "Whether candidate should specify years of experience" },
                    askProjectDescription: { type: Type.BOOLEAN, description: "Whether to ask for a brief example or project description" },
                  },
                  required: ["id", "keyword", "category", "importance", "contextFromJob", "suggestedQuestion"],
                },
                description: "Keywords or skills missing from the resume that the candidate should be interviewed about.",
              },
              parsedResumeSections: {
                type: Type.OBJECT,
                properties: {
                  careerSummary: { type: Type.STRING },
                  coreCompetencies: { type: Type.STRING },
                  handsOnProjects: { type: Type.STRING },
                  professionalExperience: { type: Type.STRING },
                },
                description: "Cleanly separated 4 resume sections extracted from inputs.",
              },
            },
            required: ["jobAnalysis", "initialRating", "overallSummary", "matchedKeywords", "missingKeywords"],
          },
        },
      });

      const rawJson = response.text || "{}";
      const parsedData = JSON.parse(rawJson);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Error in /api/analyze-job-and-resume:", error);
      res.status(500).json({
        error: error.message || "Failed to analyze job and resume.",
      });
    }
  });

  // Step 5 Optimization Endpoint: Generate Truthful ATS-Optimized Resume Sections
  app.post("/api/generate-optimized-resume", async (req, res) => {
    try {
      const {
        jobTitle,
        jobDescription,
        jobRequirements,
        originalSections,
        candidateResponses,
        toneStyle,
      } = req.body;

      if (!originalSections) {
        return res.status(400).json({ error: "Original resume sections are required." });
      }

      const ai = getGenAI();

      const prompt = `You are an expert Hiring Manager and ATS Optimization Strategist.
Your mandate is to rewrite and optimize the candidate's resume sections:
1. Career Summary
2. Core Competencies
3. Hands-on Projects
4. Professional Experience

CRITICAL RULES:
- STRICT TRUTHFULNESS MANDATE: You MUST NOT invent, falsify, or fabricate experiences, degrees, companies, metrics, or achievements.
- You MAY ONLY incorporate the skills, tools, and experiences that were ALREADY in the candidate's resume OR were EXPLICITLY confirmed by the candidate in their interview responses below.
- If the candidate stated they DO NOT have a skill ("userHasIt": false), DO NOT include it as something they possess.
- For confirmed skills: integrate them naturally with the candidate's stated proficiency level (basic, intermediate, advanced), stated years of experience, and any project notes they provided.
- Frame bullets using high-impact action verbs and the STAR / CAR formula (Challenge, Action, Result) with strong technical and business context matching the Job Description.
- Format Core Competencies as a comprehensive ATS-friendly taxonomy grouped logically.
- Format Career Summary as a punchy 3-4 sentence value proposition targeted directly at this role.
- Format Hands-on Projects and Professional Experience with clear headings, technologies utilized, and measurable impact.

--- TARGET JOB ---
Job Title: ${jobTitle || "Target Role"}
Job Description:
${jobDescription || ""}
Job Requirements:
${jobRequirements || ""}

--- ORIGINAL RESUME SECTIONS ---
Career Summary:
${originalSections.careerSummary || "N/A"}

Core Competencies:
${originalSections.coreCompetencies || "N/A"}

Hands-on Projects:
${originalSections.handsOnProjects || "N/A"}

Professional Experience:
${originalSections.professionalExperience || "N/A"}

--- CANDIDATE INTERVIEW RESPONSES ON MISSING SKILLS ---
${JSON.stringify(candidateResponses || [], null, 2)}

Desired Style / Tone: ${toneStyle || "Results-Driven & ATS Direct"}

Generate the optimized sections and audit report in valid JSON conforming to the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectedRating: {
                type: Type.INTEGER,
                description: "New projected ATS match percentage (0-100) after optimization.",
              },
              scoreImprovement: {
                type: Type.INTEGER,
                description: "Point increase in ATS match (e.g., +32).",
              },
              hiringManagerNote: {
                type: Type.STRING,
                description: "Hiring Manager perspective on why this optimized resume will pass recruiter screening and ATS parsing.",
              },
              truthfulnessAudit: {
                type: Type.STRING,
                description: "Formal statement verifying that all modifications adhere strictly to candidate-verified claims with zero hallucinations.",
              },
              optimizedSections: {
                type: Type.OBJECT,
                properties: {
                  careerSummary: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING, description: "The revised 3-4 sentence ATS-optimized career summary." },
                      changesMade: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific improvements made." },
                      keywordsIncluded: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Job keywords woven in." },
                    },
                    required: ["text", "changesMade", "keywordsIncluded"],
                  },
                  coreCompetencies: {
                    type: Type.OBJECT,
                    properties: {
                      items: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of distinct skill tags / competencies." },
                      formattedText: { type: Type.STRING, description: "Clean bulleted / categorical text representation." },
                      changesMade: { type: Type.ARRAY, items: { type: Type.STRING } },
                      keywordsIncluded: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["items", "formattedText", "changesMade", "keywordsIncluded"],
                  },
                  handsOnProjects: {
                    type: Type.OBJECT,
                    properties: {
                      projects: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            contextOrRole: { type: Type.STRING },
                            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                            keywordsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                          },
                          required: ["title", "bullets", "keywordsUsed"],
                        },
                      },
                      formattedText: { type: Type.STRING, description: "Complete formatted text for the Hands-on Projects section." },
                      changesMade: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["projects", "formattedText", "changesMade"],
                  },
                  professionalExperience: {
                    type: Type.OBJECT,
                    properties: {
                      experiences: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            role: { type: Type.STRING },
                            company: { type: Type.STRING },
                            period: { type: Type.STRING },
                            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                            keywordsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                          },
                          required: ["role", "company", "period", "bullets", "keywordsUsed"],
                        },
                      },
                      formattedText: { type: Type.STRING, description: "Complete formatted text for the Professional Experience section." },
                      changesMade: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["experiences", "formattedText", "changesMade"],
                  },
                },
                required: ["careerSummary", "coreCompetencies", "handsOnProjects", "professionalExperience"],
              },
              atsChecklist: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    keyword: { type: Type.STRING },
                    status: { type: Type.STRING, description: "matched_original, added_from_interview, or omitted_truthfully" },
                    locationFound: { type: Type.STRING, description: "Which section contains this keyword now" },
                    note: { type: Type.STRING, description: "Brief contextual note" },
                  },
                  required: ["keyword", "status"],
                },
              },
            },
            required: ["projectedRating", "scoreImprovement", "hiringManagerNote", "truthfulnessAudit", "optimizedSections", "atsChecklist"],
          },
        },
      });

      const rawJson = response.text || "{}";
      const resultData = JSON.parse(rawJson);
      res.json(resultData);
    } catch (error: any) {
      console.error("Error in /api/generate-optimized-resume:", error);
      res.status(500).json({
        error: error.message || "Failed to generate optimized resume.",
      });
    }
  });

  // Fine-tuning or regenerating a single section
  app.post("/api/regenerate-single-section", async (req, res) => {
    try {
      const { sectionKey, currentText, jobTitle, jobDescription, instructions } = req.body;

      const ai = getGenAI();
      const prompt = `You are an expert Resume Modifier and Hiring Manager.
Rewrite and refine this single section: "${sectionKey}" for the job "${jobTitle || "Target Role"}".

Context from job:
${jobDescription || ""}

Current Section Text:
${currentText || ""}

Specific Instructions for refinement:
${instructions || "Make it more concise, impactful, and ATS friendly without fabricating false claims."}

Provide a response formatted as JSON:
{
  "updatedText": "...",
  "explanation": "..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawJson = response.text || "{}";
      res.json(JSON.parse(rawJson));
    } catch (error: any) {
      console.error("Error in /api/regenerate-single-section:", error);
      res.status(500).json({
        error: error.message || "Failed to regenerate section.",
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Resume Modifier server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
