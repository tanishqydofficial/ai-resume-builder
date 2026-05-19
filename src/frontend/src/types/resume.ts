/**
 * Shared TypeScript types for all resume data structures.
 * These types align with the backend Motoko interface definitions.
 */

/** Personal contact and profile information */
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  github: string;
  summary: string;
  photoUrl?: string; // Object-storage URL after upload
}

/** A single education entry */
export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  gpa: string;
}

/** A single work experience entry */
export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  bullets: string[];
}

/** A single project entry */
export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  technologies: string;
}

/** A single certification entry */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

/** Complete resume data — aggregates all sections */
export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: ExperienceEntry[];
  skills: string[];
  projects: ProjectEntry[];
  certifications: Certification[];
}

/** The three wizard steps */
export type ResumeStep = "form" | "results" | "preview";

// ─── Backend-aligned result types ─────────────────────────────────────────────

/** ML skill categorization result from backend */
export interface SkillAnalysis {
  technical: string[];
  softSkills: string[];
  tools: string[];
  categoryExplanation: string;
}

/** ATS (Applicant Tracking System) score result from backend */
export interface AtsResult {
  score: bigint;
  matchedKeywords: string[];
  suggestions: string[];
}

/** A single enhanced bullet point from backend NLP */
export interface EnhancedBullet {
  original: string;
  enhanced: string;
  improvement: string;
}

/** Aggregated analysis results stored after backend calls */
export interface AnalysisResults {
  skillAnalysis: SkillAnalysis | null;
  atsResult: AtsResult | null;
  enhancedBullets: EnhancedBullet[];
  isLoading: boolean;
  error: string | null;
}
