import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  analyzeSkills: async (skills: string[]) => ({
    technical: skills.filter((_, i) => i % 3 === 0).length > 0
      ? ["Python", "SQL", "TensorFlow", "React", "TypeScript"]
      : ["Python", "SQL"],
    softSkills: ["Leadership", "Communication", "Teamwork", "Problem Solving"],
    tools: ["Git", "Docker", "AWS", "VS Code"],
    categoryExplanation:
      "Skills categorized using TF-IDF vectorization across 3 domains: technical competencies, soft skills, and development tools.",
  }),

  calculateAtsScore: async () => ({
    score: BigInt(85),
    matchedKeywords: [
      "machine learning",
      "data analysis",
      "Python",
      "TensorFlow",
      "scikit-learn",
      "neural networks",
      "NLP",
      "deep learning",
    ],
    suggestions: [
      "Add quantifiable achievements (e.g., 'improved model accuracy by 15%')",
      "Include more action verbs like 'developed', 'implemented', 'optimized'",
      "Mention specific datasets or project scale to show impact",
    ],
  }),

  enhanceBullets: async (bullets: string[]) =>
    bullets.map((bullet) => ({
      original: bullet,
      enhanced: `Developed and implemented ${bullet.toLowerCase()} achieving measurable business outcomes`,
      improvement:
        "Added action verb, quantifiable outcome, and business impact framing for ATS optimization",
    })),
};
