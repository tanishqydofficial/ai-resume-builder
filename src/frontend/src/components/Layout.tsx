import { StepIndicator } from "@/components/StepIndicator";
import { useResumeStore } from "@/context/ResumeContext";
import { cn } from "@/lib/utils";
/**
 * Layout — shared shell for all pages.
 * Header: branding + step indicator.
 * Main: page content slot.
 * Footer: branding attribution.
 */
import { Link } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  /** Optionally hide the step indicator (e.g. landing page) */
  showSteps?: boolean;
}

export function Layout({ children, showSteps = true }: LayoutProps) {
  const { currentStep, setCurrentStep } = useResumeStore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 bg-card border-b border-border shadow-xs"
        data-ocid="header"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2.5 text-foreground hover:opacity-80 transition-smooth group"
              data-ocid="header.brand_link"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-xs">
                <BrainCircuit className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <p className="font-display font-semibold text-sm text-foreground tracking-tight">
                  AI Resume Builder
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  Craft your career story with AI
                </p>
              </div>
            </Link>

            {/* Step progress */}
            {showSteps && (
              <div className="flex-1 flex justify-center px-4">
                <StepIndicator
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
            )}

            {/* Right placeholder for symmetry */}
            <div className="w-32 hidden sm:block" />
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main
        className={cn(
          "flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8",
          // Give the form step a lighter tinted background for visual distinction
          currentStep === "form" && "bg-background",
          currentStep === "results" && "bg-background",
          currentStep === "preview" && "bg-background",
        )}
        data-ocid="main_content"
      >
        {children}
      </main>

      {/* ── Footer ── */}
      <footer
        className="bg-card border-t border-border py-4"
        data-ocid="footer"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
