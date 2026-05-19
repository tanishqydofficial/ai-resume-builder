// mixins/resume-api.mo — public query API for the Resume Builder ML/AI domain.
// All computation is delegated to lib/resume.mo; this mixin is state-less.
import Types     "../types/resume";
import ResumeLib "../lib/resume";

mixin () {

  // ---------------------------------------------------------------------------
  // Public query: analyse skills via TF-IDF categorization
  // ---------------------------------------------------------------------------

  /// Categorise the provided skills into Technical, Soft Skills, and Tools buckets.
  ///
  /// ML approach: each skill string is scored against three seeded keyword
  /// vocabularies using substring token matching (TF-IDF-inspired).  The
  /// vocabulary with the highest hit count wins.  Ties default to Technical.
  ///
  /// Returns a SkillAnalysis with three categorised lists and a brief
  /// human-readable explanation suitable for an internship/academic report.
  public query func analyzeSkills(skills : [Text]) : async Types.SkillAnalysis {
    ResumeLib.analyzeSkills(skills);
  };

  // ---------------------------------------------------------------------------
  // Public query: calculate ATS compatibility score
  // ---------------------------------------------------------------------------

  /// Score the supplied experience and project bullet points for ATS compatibility.
  ///
  /// ML approach: concatenate all content into one corpus, then compute
  /// weighted keyword density across curated action-verb and impact-phrase lists.
  /// The normalized 0-100 score reflects how strongly the content aligns with
  /// what Applicant Tracking Systems prioritise when ranking candidates.
  ///
  /// Returns a score, the matched keywords found, and actionable suggestions.
  public query func calculateAtsScore(
    experience : [Types.ExperienceEntry],
    projects   : [Types.ProjectEntry],
  ) : async Types.AtsResult {
    ResumeLib.calculateAtsScore(experience, projects);
  };

  // ---------------------------------------------------------------------------
  // Public query: enhance bullet points for ATS readability
  // ---------------------------------------------------------------------------

  /// Return an ATS-enhanced version for each supplied bullet point together
  /// with the original and a concise improvement note.
  ///
  /// Enhancement pipeline (applied per bullet, highest priority first):
  ///   1. Passive/first-person opener → strip and inject action verb.
  ///   2. No action verb              → prepend action verb.
  ///   3. No quantifiable metric      → append metric placeholder guidance.
  ///   4. Already strong              → returned unchanged with confirmation.
  public query func enhanceBullets(bullets : [Text]) : async [Types.EnhancedBullet] {
    ResumeLib.enhanceBullets(bullets);
  };
}
