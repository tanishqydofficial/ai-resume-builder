// types/resume.mo — domain-specific type definitions for Resume Builder ML/AI analysis
module {

  /// A single work-experience entry with job title, company, duration, and bullet points
  public type ExperienceEntry = {
    jobTitle   : Text;
    company    : Text;
    duration   : Text;
    bullets    : [Text];
  };

  /// A single project entry with title, description, and bullet points
  public type ProjectEntry = {
    title       : Text;
    description : Text;
    bullets     : [Text];
  };

  /// Result of TF-IDF skill categorization into Technical / Soft Skills / Tools buckets.
  /// categoryExplanation is a brief human-readable summary of how the categorisation was done.
  public type SkillAnalysis = {
    technical           : [Text];
    softSkills          : [Text];
    tools               : [Text];
    categoryExplanation : Text;
  };

  /// ATS score (0-100) with matched keywords and actionable suggestions
  public type AtsResult = {
    score           : Nat;
    matchedKeywords : [Text];
    suggestions     : [Text];
  };

  /// Enhanced version of a single bullet point with an improvement note
  public type EnhancedBullet = {
    original    : Text;
    enhanced    : Text;
    improvement : Text;
  };
}
