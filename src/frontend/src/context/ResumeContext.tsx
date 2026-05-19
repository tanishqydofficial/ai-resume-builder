import type {
  AnalysisResults,
  Certification,
  Education,
  ExperienceEntry,
  PersonalInfo,
  ProjectEntry,
  ResumeData,
  ResumeStep,
} from "@/types/resume";
/**
 * ResumeContext — in-memory state management for the resume builder.
 * Provides the full ResumeData, step navigation, and analysis results
 * to all pages without prop-drilling.
 */
import { type ReactNode, createContext, useContext, useState } from "react";

// ─── Default / empty state ─────────────────────────────────────────────────────

const defaultPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  github: "",
  summary: "",
  photoUrl: undefined,
};

const defaultResumeData: ResumeData = {
  personalInfo: defaultPersonalInfo,
  education: [
    {
      id: "edu-1",
      degree: "",
      fieldOfStudy: "",
      institution: "",
      graduationYear: "",
      gpa: "",
    },
  ],
  experience: [
    { id: "exp-1", jobTitle: "", company: "", duration: "", bullets: [""] },
  ],
  skills: [],
  projects: [
    {
      id: "proj-1",
      title: "",
      description: "",
      bullets: [""],
      technologies: "",
    },
  ],
  certifications: [],
};

const defaultAnalysis: AnalysisResults = {
  skillAnalysis: null,
  atsResult: null,
  enhancedBullets: [],
  isLoading: false,
  error: null,
};

// ─── Context shape ─────────────────────────────────────────────────────────────

interface ResumeContextValue {
  /** Current wizard step */
  currentStep: ResumeStep;
  setCurrentStep: (step: ResumeStep) => void;

  /** The live resume data being edited */
  resumeData: ResumeData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  setEducation: (edu: Education[]) => void;
  setExperience: (exp: ExperienceEntry[]) => void;
  setSkills: (skills: string[]) => void;
  setProjects: (projects: ProjectEntry[]) => void;
  setCertifications: (certs: Certification[]) => void;

  /** AI/ML analysis results */
  analysisResults: AnalysisResults;
  setAnalysisResults: (results: Partial<AnalysisResults>) => void;

  /** Reset everything to defaults */
  resetResume: () => void;
}

// ─── Context + hook ────────────────────────────────────────────────────────────

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function useResumeStore(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx)
    throw new Error("useResumeStore must be used inside <ResumeProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<ResumeStep>("form");
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [analysisResults, setAnalysisResultsState] =
    useState<AnalysisResults>(defaultAnalysis);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) =>
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));

  const setEducation = (education: Education[]) =>
    setResumeData((prev) => ({ ...prev, education }));

  const setExperience = (experience: ExperienceEntry[]) =>
    setResumeData((prev) => ({ ...prev, experience }));

  const setSkills = (skills: string[]) =>
    setResumeData((prev) => ({ ...prev, skills }));

  const setProjects = (projects: ProjectEntry[]) =>
    setResumeData((prev) => ({ ...prev, projects }));

  const setCertifications = (certifications: Certification[]) =>
    setResumeData((prev) => ({ ...prev, certifications }));

  const setAnalysisResults = (results: Partial<AnalysisResults>) =>
    setAnalysisResultsState((prev) => ({ ...prev, ...results }));

  const resetResume = () => {
    setResumeData(defaultResumeData);
    setAnalysisResultsState(defaultAnalysis);
    setCurrentStep("form");
  };

  return (
    <ResumeContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        resumeData,
        updatePersonalInfo,
        setEducation,
        setExperience,
        setSkills,
        setProjects,
        setCertifications,
        analysisResults,
        setAnalysisResults,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}
