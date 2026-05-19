import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EnhancedBullet {
    improvement: string;
    enhanced: string;
    original: string;
}
export interface SkillAnalysis {
    tools: Array<string>;
    technical: Array<string>;
    categoryExplanation: string;
    softSkills: Array<string>;
}
export interface ExperienceEntry {
    duration: string;
    bullets: Array<string>;
    company: string;
    jobTitle: string;
}
export interface ProjectEntry {
    title: string;
    bullets: Array<string>;
    description: string;
}
export interface AtsResult {
    suggestions: Array<string>;
    matchedKeywords: Array<string>;
    score: bigint;
}
export interface backendInterface {
    analyzeSkills(skills: Array<string>): Promise<SkillAnalysis>;
    calculateAtsScore(experience: Array<ExperienceEntry>, projects: Array<ProjectEntry>): Promise<AtsResult>;
    enhanceBullets(bullets: Array<string>): Promise<Array<EnhancedBullet>>;
}
