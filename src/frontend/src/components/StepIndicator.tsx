import { cn } from "@/lib/utils";
import type { ResumeStep } from "@/types/resume";
/**
 * StepIndicator — shows the 3-step wizard progress:
 * 1. Build Resume  2. AI Analysis  3. Preview & Download
 */
import { Check, Download, FileText, Sparkles } from "lucide-react";

const STEPS: { id: ResumeStep; label: string; icon: typeof FileText }[] = [
  { id: "form", label: "Build Resume", icon: FileText },
  { id: "results", label: "AI Analysis", icon: Sparkles },
  { id: "preview", label: "Preview & Download", icon: Download },
];

const STEP_ORDER: ResumeStep[] = ["form", "results", "preview"];

interface StepIndicatorProps {
  currentStep: ResumeStep;
  onStepClick?: (step: ResumeStep) => void;
  /** Steps that are allowed to navigate to (completed + current) */
  completedSteps?: ResumeStep[];
}

export function StepIndicator({
  currentStep,
  onStepClick,
  completedSteps = [],
}: StepIndicatorProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <nav
      aria-label="Resume builder progress"
      className="flex items-center justify-center gap-0"
      data-ocid="step_indicator"
    >
      {STEPS.map((step, index) => {
        const isCompleted =
          completedSteps.includes(step.id) ||
          STEP_ORDER.indexOf(step.id) < currentIndex;
        const isCurrent = step.id === currentStep;
        const isClickable = (isCompleted || isCurrent) && !!onStepClick;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            {/* Connector line between steps */}
            {index > 0 && (
              <div
                className={cn(
                  "h-px w-12 sm:w-20 transition-colors duration-300",
                  isCompleted ? "bg-primary" : "bg-border",
                )}
              />
            )}

            {/* Step circle + label */}
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              data-ocid={`step_indicator.step.${index + 1}`}
              className={cn(
                "flex flex-col items-center gap-1.5 group",
                isClickable ? "cursor-pointer" : "cursor-default",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCurrent &&
                    "border-primary bg-primary text-primary-foreground shadow-md",
                  isCompleted &&
                    !isCurrent &&
                    "border-primary bg-primary/10 text-primary",
                  !isCurrent &&
                    !isCompleted &&
                    "border-border bg-card text-muted-foreground",
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap hidden sm:block transition-colors duration-200",
                  isCurrent ? "text-primary" : "text-muted-foreground",
                  isCompleted && !isCurrent && "text-primary/70",
                )}
              >
                {step.label}
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
