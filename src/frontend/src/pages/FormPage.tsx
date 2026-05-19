/**
 * FormPage — multi-section resume form with tab-pill navigation.
 * Tabs: Personal Info → Education → Experience → Skills → Projects → Certifications
 * Inline validation fires on tab advance or final submit.
 */
import { CertificationsSection } from "@/components/form/CertificationsSection";
import { EducationSection } from "@/components/form/EducationSection";
import { ExperienceSection } from "@/components/form/ExperienceSection";
import { PersonalInfoSection } from "@/components/form/PersonalInfoSection";
import { ProjectsSection } from "@/components/form/ProjectsSection";
import { SkillsSection } from "@/components/form/SkillsSection";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/context/ResumeContext";
import {
  useAnalyzeSkills,
  useCalculateAtsScore,
  useEnhanceBullets,
} from "@/hooks/useQueries";
import type {
  EducationErrors,
  ExperienceErrors,
  PersonalErrors,
  ProjectErrors,
} from "@/types/formErrors";
import type { FormErrors } from "@/types/formErrors";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  FolderKanban,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Tab configuration ─────────────────────────────────────────────────────────

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certifications", label: "Certifications", icon: Award },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Validation helpers ─────────────────────────────────────────────────────────

import type { ResumeData } from "@/types/resume";

function validatePersonal(resumeData: ResumeData): PersonalErrors {
  const p = resumeData.personalInfo;
  return {
    fullName: !p.fullName.trim() ? "Full name is required." : undefined,
    email: !p.email.trim()
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)
        ? "Enter a valid email address."
        : undefined,
    phone: !p.phone.trim() ? "Phone number is required." : undefined,
  };
}

function validateEducation(resumeData: ResumeData): EducationErrors[] {
  return resumeData.education.map((edu) => ({
    degree: !edu.degree.trim() ? "Degree is required." : undefined,
    institution: !edu.institution.trim()
      ? "Institution is required."
      : undefined,
  }));
}

function validateExperience(resumeData: ResumeData): ExperienceErrors[] {
  return resumeData.experience.map((exp) => ({
    jobTitle: !exp.jobTitle.trim() ? "Job title is required." : undefined,
    company: !exp.company.trim() ? "Company is required." : undefined,
    duration: !exp.duration.trim() ? "Duration is required." : undefined,
  }));
}

function validateSkills(resumeData: ResumeData): FormErrors["skills"] {
  return resumeData.skills.length < 3 ? "Add at least 3 skills." : undefined;
}

function validateProjects(resumeData: ResumeData): ProjectErrors[] {
  return resumeData.projects.map((proj) => ({
    title: !proj.title.trim() ? "Project name is required." : undefined,
  }));
}

function hasErrors(errors: FormErrors): boolean {
  const p = errors.personal;
  if (p && (p.fullName || p.email || p.phone)) return true;
  if (errors.education?.some((e) => e.degree || e.institution)) return true;
  if (errors.experience?.some((e) => e.jobTitle || e.company || e.duration))
    return true;
  if (errors.skills) return true;
  if (errors.projects?.some((e) => e.title)) return true;
  return false;
}

// ─── FormPage component ─────────────────────────────────────────────────────────

export default function FormPage() {
  const navigate = useNavigate();
  const { resumeData, setCurrentStep, setAnalysisResults } = useResumeStore();
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const analyzeSkills = useAnalyzeSkills();
  const calculateAts = useCalculateAtsScore();
  const enhanceBullets = useEnhanceBullets();

  const isAnalyzing =
    analyzeSkills.isPending ||
    calculateAts.isPending ||
    enhanceBullets.isPending;

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const isLastTab = activeIndex === TABS.length - 1;

  /** Validate current tab before advancing */
  function validateCurrentTab(): boolean {
    let nextErrors: FormErrors = { ...errors };
    let valid = true;

    if (activeTab === "personal") {
      const pErrors = validatePersonal(resumeData);
      nextErrors = { ...nextErrors, personal: pErrors };
      if (pErrors.fullName || pErrors.email || pErrors.phone) valid = false;
    } else if (activeTab === "education") {
      const eErrors = validateEducation(resumeData);
      nextErrors = { ...nextErrors, education: eErrors };
      if (eErrors.some((e) => e.degree || e.institution)) valid = false;
    } else if (activeTab === "experience") {
      const xErrors = validateExperience(resumeData);
      nextErrors = { ...nextErrors, experience: xErrors };
      if (xErrors.some((e) => e.jobTitle || e.company || e.duration))
        valid = false;
    } else if (activeTab === "skills") {
      const sError = validateSkills(resumeData);
      nextErrors = { ...nextErrors, skills: sError };
      if (sError) valid = false;
    } else if (activeTab === "projects") {
      const prErrors = validateProjects(resumeData);
      nextErrors = { ...nextErrors, projects: prErrors };
      if (prErrors.some((e) => e.title)) valid = false;
    }

    setErrors(nextErrors);
    return valid;
  }

  function handleTabClick(tabId: TabId) {
    // Allow navigating backwards freely; validate when going forward
    const targetIndex = TABS.findIndex((t) => t.id === tabId);
    if (targetIndex > activeIndex) {
      if (!validateCurrentTab()) return;
    }
    setActiveTab(tabId);
  }

  function handleNext() {
    if (!validateCurrentTab()) return;
    if (!isLastTab) {
      setActiveTab(TABS[activeIndex + 1].id);
    }
  }

  function handleBack() {
    if (activeIndex > 0) {
      setActiveTab(TABS[activeIndex - 1].id);
    }
  }

  async function handleAnalyze() {
    setSubmitted(true);

    // Validate all sections
    const allErrors: FormErrors = {
      personal: validatePersonal(resumeData),
      education: validateEducation(resumeData),
      experience: validateExperience(resumeData),
      skills: validateSkills(resumeData),
      projects: validateProjects(resumeData),
    };
    setErrors(allErrors);

    if (hasErrors(allErrors)) {
      // Jump to first tab with errors
      const p = allErrors.personal;
      if (p && (p.fullName || p.email || p.phone)) {
        setActiveTab("personal");
        return;
      }
      if (allErrors.education?.some((e) => e.degree || e.institution)) {
        setActiveTab("education");
        return;
      }
      if (
        allErrors.experience?.some((e) => e.jobTitle || e.company || e.duration)
      ) {
        setActiveTab("experience");
        return;
      }
      if (allErrors.skills) {
        setActiveTab("skills");
        return;
      }
      if (allErrors.projects?.some((e) => e.title)) {
        setActiveTab("projects");
        return;
      }
      return;
    }

    setAnalysisResults({ isLoading: true, error: null });

    try {
      const allBullets = [
        ...resumeData.experience.flatMap((e) => e.bullets),
        ...resumeData.projects.flatMap((p) => p.bullets),
      ].filter((b) => b.trim().length > 0);

      const [skillAnalysis, atsResult, enhancedBullets] = await Promise.all([
        analyzeSkills.mutateAsync(resumeData.skills),
        calculateAts.mutateAsync({
          experience: resumeData.experience,
          projects: resumeData.projects,
        }),
        allBullets.length > 0
          ? enhanceBullets.mutateAsync(allBullets)
          : Promise.resolve([]),
      ]);

      setAnalysisResults({
        skillAnalysis,
        atsResult,
        enhancedBullets,
        isLoading: false,
        error: null,
      });

      setCurrentStep("results");
      navigate({ to: "/results" });
      toast.success("AI analysis complete!");
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Analysis failed. Please try again.";
      setAnalysisResults({ isLoading: false, error: msg });
      toast.error(msg);
    }
  }

  // Determine completion status per tab for tab pill indicator
  function tabCompleted(tabId: TabId): boolean {
    if (!submitted) return false;
    if (tabId === "personal") {
      const p = errors.personal;
      return !p || (!p.fullName && !p.email && !p.phone);
    }
    if (tabId === "education")
      return !errors.education?.some((e) => e.degree || e.institution);
    if (tabId === "experience")
      return !errors.experience?.some(
        (e) => e.jobTitle || e.company || e.duration,
      );
    if (tabId === "skills") return !errors.skills;
    if (tabId === "projects") return !errors.projects?.some((e) => e.title);
    return true;
  }

  function tabHasError(tabId: TabId): boolean {
    if (!submitted) return false;
    if (tabId === "personal") {
      const p = errors.personal;
      return !!(p && (p.fullName || p.email || p.phone));
    }
    if (tabId === "education")
      return !!errors.education?.some((e) => e.degree || e.institution);
    if (tabId === "experience")
      return !!errors.experience?.some(
        (e) => e.jobTitle || e.company || e.duration,
      );
    if (tabId === "skills") return !!errors.skills;
    if (tabId === "projects") return !!errors.projects?.some((e) => e.title);
    return false;
  }

  return (
    <div className="space-y-6" data-ocid="form_page">
      {/* ── Header intro ── */}
      <div className="rounded-xl bg-primary/5 border border-primary/15 px-6 py-5">
        <h1 className="font-display font-semibold text-xl text-foreground">
          Build your AI-optimized resume
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in each section, then click{" "}
          <strong className="text-foreground">Analyze with AI</strong> to get
          your ATS score, skill categorization, and enhanced bullet points.
        </p>
      </div>

      {/* ── Tab pill navigation ── */}
      <div
        className="bg-card border border-border rounded-xl p-1.5 overflow-x-auto"
        data-ocid="form_page.tab_nav"
      >
        <div className="flex items-center gap-1 min-w-max sm:min-w-0">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasErr = tabHasError(tab.id);
            const done = tabCompleted(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                data-ocid={`form_page.tab.${tab.id}`}
                aria-selected={isActive}
                className={[
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : hasErr
                      ? "text-destructive hover:bg-destructive/8 hover:text-destructive"
                      : done
                        ? "text-accent-foreground bg-accent/15 hover:bg-accent/25"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                {/* Step number badge */}
                <span
                  className={[
                    "w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold flex-shrink-0",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : hasErr
                        ? "bg-destructive/15 text-destructive"
                        : done
                          ? "bg-accent/30 text-accent-foreground"
                          : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {hasErr ? "!" : i + 1}
                </span>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section progress indicator ── */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {TABS.map((tab, i) => (
            <div
              key={tab.id}
              className={[
                "h-1 flex-1 rounded-full transition-all duration-300",
                i < activeIndex
                  ? "bg-accent"
                  : i === activeIndex
                    ? "bg-primary"
                    : "bg-border",
              ].join(" ")}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {activeIndex + 1} / {TABS.length}
        </span>
      </div>

      {/* ── Active section ── */}
      {activeTab === "personal" && (
        <PersonalInfoSection errors={errors.personal} />
      )}
      {activeTab === "education" && (
        <EducationSection errors={errors.education} />
      )}
      {activeTab === "experience" && (
        <ExperienceSection errors={errors.experience} />
      )}
      {activeTab === "skills" && <SkillsSection error={errors.skills} />}
      {activeTab === "projects" && <ProjectsSection errors={errors.projects} />}
      {activeTab === "certifications" && <CertificationsSection />}

      {/* ── Navigation bar ── */}
      <div className="flex items-center justify-between pt-1">
        {/* Back */}
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={activeIndex === 0}
          data-ocid="form_page.back_button"
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>

        <div className="flex items-center gap-3">
          {/* Next or Analyze */}
          {!isLastTab ? (
            <Button
              type="button"
              onClick={handleNext}
              data-ocid="form_page.next_button"
              className="gap-1 font-semibold"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              data-ocid="form_page.analyze_button"
              className="gap-2 font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze with AI
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
