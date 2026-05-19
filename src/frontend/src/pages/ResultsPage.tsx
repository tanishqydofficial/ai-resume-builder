/**
 * ResultsPage — displays AI/ML analysis output after form submission.
 * Triggers backend API calls on mount, shows:
 *   - ATS Score ring (green/yellow/red by threshold)
 *   - Skill category chips (Technical, Soft Skills, Tools)
 *   - Improvement suggestions list
 *   - Enhanced bullet points with accept/reject controls
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumeStore } from "@/context/ResumeContext";
import {
  useAnalyzeSkills,
  useCalculateAtsScore,
  useEnhanceBullets,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { EnhancedBullet } from "@/types/resume";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── ATS Score color helpers ───────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-500";
  return "text-destructive";
}

function getScoreStroke(score: number) {
  if (score >= 70) return "stroke-emerald-500";
  if (score >= 50) return "stroke-amber-400";
  return "stroke-destructive";
}

function getScoreLabel(score: number) {
  if (score >= 70) return "Strong Match";
  if (score >= 50) return "Moderate Match";
  return "Needs Improvement";
}

function getScoreBg(score: number) {
  if (score >= 70) return "bg-emerald-50 border-emerald-200";
  if (score >= 50) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

// ─── Circular ATS score ring ───────────────────────────────────────────────

function AtsRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="flex flex-col items-center gap-3"
      data-ocid="results_page.ats_ring"
    >
      <div className="relative w-36 h-36">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
          aria-label={`ATS score: ${score}%`}
          role="img"
        >
          {/* Track ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-border"
          />
          {/* Progress ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000 ease-out",
              getScoreStroke(score),
            )}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "text-4xl font-display font-bold leading-none",
              getScoreColor(score),
            )}
          >
            {score}
          </span>
          <span className="text-xs font-semibold text-muted-foreground mt-0.5">
            out of 100
          </span>
        </div>
      </div>
      <div
        className={cn(
          "text-center px-4 py-2 rounded-lg border",
          getScoreBg(score),
        )}
      >
        <p className={cn("text-sm font-bold", getScoreColor(score))}>
          {getScoreLabel(score)}
        </p>
        <p className="text-xs text-muted-foreground">
          Applicant Tracking System
        </p>
      </div>
    </div>
  );
}

// ─── Skill category column ─────────────────────────────────────────────────

function SkillCategory({
  icon,
  label,
  skills,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  skills: string[];
  color: "primary" | "accent" | "chart5";
}) {
  const colorMap: Record<typeof color, string> = {
    primary: "bg-primary/10 text-primary border-primary/25",
    accent: "bg-accent/10 text-accent border-accent/25",
    chart5: "bg-muted text-muted-foreground border-border",
  };
  const headerColor: Record<typeof color, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    chart5: "bg-muted text-muted-foreground",
  };
  return (
    <div className="space-y-3">
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold",
          headerColor[color],
        )}
      >
        {icon}
        {label}
        <span className="ml-1 text-[10px] opacity-70">({skills.length})</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.length === 0 ? (
          <span className="text-xs text-muted-foreground italic">
            None detected
          </span>
        ) : (
          skills.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className={cn("text-xs border font-medium", colorMap[color])}
            >
              {s}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Loading skeleton ──────────────────────────────────────────────────────

function ResultsSkeleton() {
  return (
    <div className="space-y-6" data-ocid="results_page.loading_state">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <div className="lg:col-span-2 space-y-5">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Enhanced bullet card with accept/reject ──────────────────────────────

function BulletCard({
  bullet,
  index,
  onAccept,
  accepted,
}: {
  bullet: EnhancedBullet;
  index: number;
  onAccept: (original: string, enhanced: string) => void;
  accepted: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={cn(
        "rounded-lg border p-4 space-y-2 transition-smooth",
        accepted ? "bg-accent/5 border-accent/30" : "bg-card border-border",
      )}
      data-ocid={`results_page.bullet.${index + 1}`}
    >
      {/* Original — muted strikethrough */}
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-muted-foreground text-xs shrink-0">
          Before
        </span>
        <p className="text-xs text-muted-foreground line-through leading-relaxed">
          {bullet.original}
        </p>
      </div>

      {/* Enhanced version */}
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-accent text-xs font-semibold shrink-0">
          After
        </span>
        <p className="text-sm text-foreground leading-relaxed font-medium">
          {bullet.enhanced}
        </p>
      </div>

      {/* Improvement label + accept button */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <Badge
          variant="outline"
          className="text-[10px] text-accent border-accent/30 bg-accent/5"
        >
          {bullet.improvement}
        </Badge>
        {accepted ? (
          <span className="flex items-center gap-1 text-xs text-accent font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2.5 border-accent/30 text-accent hover:bg-accent/10"
            onClick={() => onAccept(bullet.original, bullet.enhanced)}
            data-ocid={`results_page.accept_bullet.${index + 1}`}
          >
            <Check className="w-3 h-3 mr-1" /> Accept
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const navigate = useNavigate();
  const {
    resumeData,
    analysisResults,
    setAnalysisResults,
    setCurrentStep,
    setExperience,
  } = useResumeStore();
  const { skillAnalysis, atsResult, enhancedBullets, isLoading, error } =
    analysisResults;

  // Track which bullets the user has accepted
  const [acceptedBullets, setAcceptedBullets] = useState<Set<string>>(
    new Set(),
  );

  // Mutation hooks
  const analyzeSkills = useAnalyzeSkills();
  const calculateAtsScore = useCalculateAtsScore();
  const enhanceBulletsHook = useEnhanceBullets();

  // Guard: if user navigated directly with no resume data, redirect to form
  const hasData =
    resumeData.personalInfo.fullName.trim().length > 0 ||
    resumeData.skills.length > 0;

  // Prevent double-fire with a ref; retryCount increments on manual retry
  const hasFiredRef = useRef(false);
  const [retryCount, setRetryCount] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: hasFiredRef is a stable ref guard; retryCount drives re-runs
  useEffect(() => {
    if (!hasData) {
      navigate({ to: "/" });
      return;
    }

    // Only run analysis if we don't already have results (avoid re-running on back navigation)
    if (skillAnalysis || atsResult || hasFiredRef.current) return;
    hasFiredRef.current = true;

    const allBullets = [
      ...resumeData.experience.flatMap((e) => e.bullets),
      ...resumeData.projects.flatMap((p) => p.bullets),
    ].filter((b) => b.trim().length > 0);

    setAnalysisResults({ isLoading: true, error: null });

    Promise.all([
      analyzeSkills.mutateAsync(resumeData.skills),
      calculateAtsScore.mutateAsync({
        experience: resumeData.experience,
        projects: resumeData.projects,
      }),
      allBullets.length > 0
        ? enhanceBulletsHook.mutateAsync(allBullets)
        : Promise.resolve([]),
    ])
      .then(([skills, ats, bullets]) => {
        setAnalysisResults({
          skillAnalysis: skills,
          atsResult: ats,
          enhancedBullets: bullets,
          isLoading: false,
          error: null,
        });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Analysis failed";
        setAnalysisResults({ isLoading: false, error: message });
      });
    // retryCount dependency allows retry button to re-trigger this effect
  }, [hasData, retryCount]);

  /** Accept an enhanced bullet — update the experience entry bullets in context */
  function handleAcceptBullet(original: string, enhanced: string) {
    setAcceptedBullets((prev) => new Set([...prev, original]));
    // Update analysis enhanced bullets list
    setAnalysisResults({
      enhancedBullets: enhancedBullets.map((eb) =>
        eb.original === original ? { ...eb, original: enhanced } : eb,
      ),
    });
    // Immutably update experience bullets via context setter — avoids direct mutation
    const updatedExperience = resumeData.experience.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => (b === original ? enhanced : b)),
    }));
    setExperience(updatedExperience);
  }

  const atsScore = atsResult ? Number(atsResult.score) : 0;
  const hasResults = !!(
    skillAnalysis ||
    atsResult ||
    enhancedBullets.length > 0
  );

  if (isLoading) {
    return <ResultsSkeleton />;
  }

  return (
    <div className="space-y-6" data-ocid="results_page">
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            AI Analysis Results
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your resume has been analyzed — review the insights and enhance your
            content.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentStep("form");
              navigate({ to: "/" });
            }}
            data-ocid="results_page.back_button"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Edit Resume
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setCurrentStep("preview");
              navigate({ to: "/preview" });
            }}
            data-ocid="results_page.preview_button"
          >
            Generate Preview <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.div>

      {/* ── Error state ── */}
      {error && (
        <div
          className="bg-destructive/5 border border-destructive/30 rounded-xl p-5 flex items-start gap-3"
          data-ocid="results_page.error_state"
        >
          <span className="text-destructive mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-semibold text-destructive">
              Analysis failed
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => {
              hasFiredRef.current = false;
              setAnalysisResults({ error: null });
              setRetryCount((c) => c + 1);
            }}
            data-ocid="results_page.retry_button"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* ── Empty state (no analysis data and no error) ── */}
      {!hasResults && !error && (
        <div
          className="bg-card border border-border rounded-xl p-10 text-center space-y-3"
          data-ocid="results_page.empty_state"
        >
          <Brain className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="font-display font-semibold text-foreground">
            No analysis data yet
          </p>
          <p className="text-sm text-muted-foreground">
            Submit your resume form to run AI/ML analysis.
          </p>
          <Button
            onClick={() => {
              setCurrentStep("form");
              navigate({ to: "/" });
            }}
            data-ocid="results_page.go_to_form_button"
          >
            Go to Form
          </Button>
        </div>
      )}

      {/* ── Main analysis grid ── */}
      {hasResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ATS Score card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-5"
            data-ocid="results_page.ats_card"
          >
            <div className="flex items-center gap-2 self-start">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-base">
                ATS Score
              </h2>
            </div>

            {atsResult ? (
              <>
                <AtsRing score={atsScore} />

                {/* Matched keywords */}
                {atsResult.matchedKeywords.length > 0 && (
                  <div className="w-full space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Matched Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.matchedKeywords.map((kw) => (
                        <Badge
                          key={kw}
                          variant="secondary"
                          className="text-xs bg-accent/10 text-accent border-0 gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                No ATS data available.
              </p>
            )}
          </motion.div>

          {/* Right column: skills + suggestions + enhanced bullets */}
          <div className="lg:col-span-2 space-y-5">
            {/* Skill categories */}
            {skillAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-card border border-border rounded-xl p-6 space-y-4"
                data-ocid="results_page.skills_card"
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-semibold text-base">
                    Skill Categorization
                  </h2>
                </div>
                {skillAnalysis.categoryExplanation && (
                  <p className="text-xs text-muted-foreground">
                    {skillAnalysis.categoryExplanation}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <SkillCategory
                    icon={<Brain className="w-3.5 h-3.5" />}
                    label="Technical"
                    skills={skillAnalysis.technical}
                    color="primary"
                  />
                  <SkillCategory
                    icon={<Users className="w-3.5 h-3.5" />}
                    label="Soft Skills"
                    skills={skillAnalysis.softSkills}
                    color="accent"
                  />
                  <SkillCategory
                    icon={<Wrench className="w-3.5 h-3.5" />}
                    label="Tools"
                    skills={skillAnalysis.tools}
                    color="chart5"
                  />
                </div>
              </motion.div>
            )}

            {/* ATS Improvement suggestions */}
            {atsResult && atsResult.suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="bg-card border border-border rounded-xl p-6 space-y-3"
                data-ocid="results_page.suggestions_card"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h2 className="font-display font-semibold text-base">
                    Improvement Suggestions
                  </h2>
                </div>
                <ul className="space-y-2">
                  {atsResult.suggestions.map((s, i) => (
                    <li
                      key={s}
                      className="flex items-start gap-2.5 text-sm text-foreground py-1"
                      data-ocid={`results_page.suggestion.${i + 1}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Enhanced bullet points */}
            {enhancedBullets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.26 }}
                className="bg-card border border-border rounded-xl p-6 space-y-4"
                data-ocid="results_page.bullets_card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <h2 className="font-display font-semibold text-base">
                      Enhanced Bullet Points
                    </h2>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {acceptedBullets.size} / {enhancedBullets.length} accepted
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click <strong>Accept</strong> to apply the AI-improved version
                  to your resume.
                </p>
                <div className="space-y-3">
                  {enhancedBullets.map((b, i) => (
                    <BulletCard
                      key={`${b.original}-${i}`}
                      bullet={b}
                      index={i}
                      accepted={acceptedBullets.has(b.original)}
                      onAccept={handleAcceptBullet}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── Bottom navigation ── */}
      {hasResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex items-center justify-between pt-2 border-t border-border"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentStep("form");
              navigate({ to: "/" });
            }}
            data-ocid="results_page.bottom_back_button"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Form
          </Button>
          <Button
            onClick={() => {
              setCurrentStep("preview");
              navigate({ to: "/preview" });
            }}
            data-ocid="results_page.bottom_preview_button"
          >
            Generate Resume Preview <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
