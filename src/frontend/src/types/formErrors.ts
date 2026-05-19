/**
 * FormErrors — per-field validation error shapes used by form sections.
 * Each field holds an error string or undefined (no error).
 */

export interface PersonalErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface EducationErrors {
  degree?: string;
  institution?: string;
}

export interface ExperienceErrors {
  jobTitle?: string;
  company?: string;
  duration?: string;
}

export interface ProjectErrors {
  title?: string;
}

/** Aggregated errors for all form sections */
export interface FormErrors {
  personal?: PersonalErrors;
  education?: EducationErrors[];
  experience?: ExperienceErrors[];
  skills?: string;
  projects?: ProjectErrors[];
}
