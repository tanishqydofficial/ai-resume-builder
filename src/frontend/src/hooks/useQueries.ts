/**
 * useQueries.ts — React Query hooks wiring the frontend to the backend actor.
 * Every backend method call goes through here.
 */
import { createActor } from "@/backend";
import type {
  AtsResult,
  EnhancedBullet,
  ExperienceEntry,
  ProjectEntry,
  SkillAnalysis,
} from "@/types/resume";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";

// ─── Helper: unwrap backend ExperienceEntry to match backend.d.ts shape ────────────────
// The local ExperienceEntry has an extra `id` field; strip it before sending.
function toBackendExperience(entry: ExperienceEntry) {
  return {
    jobTitle: entry.jobTitle,
    company: entry.company,
    duration: entry.duration,
    bullets: entry.bullets.filter((b) => b.trim().length > 0),
  };
}

function toBackendProject(project: ProjectEntry) {
  return {
    title: project.title,
    description: project.description,
    bullets: project.bullets.filter((b) => b.trim().length > 0),
  };
}

// ─── Analyze skills using TF-IDF / ML categorization ─────────────────────────────

export function useAnalyzeSkills() {
  const { actor } = useActor(createActor);

  return useMutation<SkillAnalysis, Error, string[]>({
    mutationFn: async (skills: string[]) => {
      if (!actor) throw new Error("Backend not connected");
      return actor.analyzeSkills(skills);
    },
  });
}

// ─── Calculate ATS score for experience + project content ─────────────────────────

interface AtsScoreInput {
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
}

export function useCalculateAtsScore() {
  const { actor } = useActor(createActor);

  return useMutation<AtsResult, Error, AtsScoreInput>({
    mutationFn: async ({ experience, projects }: AtsScoreInput) => {
      if (!actor) throw new Error("Backend not connected");
      return actor.calculateAtsScore(
        experience.map(toBackendExperience),
        projects.map(toBackendProject),
      );
    },
  });
}

// ─── Enhance bullet points using NLP ────────────────────────────────────────

export function useEnhanceBullets() {
  const { actor } = useActor(createActor);

  return useMutation<EnhancedBullet[], Error, string[]>({
    mutationFn: async (bullets: string[]) => {
      if (!actor) throw new Error("Backend not connected");
      return actor.enhanceBullets(bullets);
    },
  });
}
