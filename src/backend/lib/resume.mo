// lib/resume.mo — domain logic for Resume Builder ML/AI analysis
// Implements TF-IDF-inspired skill categorization, ATS keyword scoring,
// and rule-based bullet-point enhancement — all in pure Motoko.
import Array "mo:core/Array";
import Text  "mo:core/Text";
import Nat   "mo:core/Nat";
import List  "mo:core/List";
import Types "../types/resume";
import Char "mo:core/Char";

module {

  // ===========================================================================
  // PRIVATE HELPERS — lowercase normalization and substring containment
  // ===========================================================================

  /// Return true when `haystack` contains `needle` (case-insensitive).
  private func containsToken(haystack : Text, needle : Text) : Bool {
    let h = haystack.toLower();
    let n = needle.toLower();
    h.contains(#text n);
  };

  /// Count how many strings in `keywords` appear as substrings inside `text`.
  private func countMatches(text : Text, keywords : [Text]) : Nat {
    keywords.foldLeft<Text, Nat>(0, func(acc : Nat, kw : Text) : Nat {
      if (containsToken(text, kw)) { acc + 1 } else { acc };
    });
  };

  // ===========================================================================
  // VOCABULARY SEEDS
  // These are the ground-truth keyword lists for each category.
  // They mirror a curated skills-categories dataset (skills_categories.csv).
  // ===========================================================================

  /// Technical skills vocabulary — programming languages, frameworks,
  /// algorithms, data structures, ML/AI, databases, cloud, devops.
  private let technicalKeywords : [Text] = [
    // Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "c ",
    "go", "rust", "kotlin", "swift", "scala", "r ", "matlab",
    "php", "ruby", "dart", "bash", "shell", "sql",
    // Web & frameworks
    "react", "angular", "vue", "node", "django", "flask",
    "spring", "express", "next.js", "fastapi", "rails",
    "html", "css", "rest", "graphql", "api",
    // ML / AI / Data
    "machine learning", "deep learning", "neural network", "tensorflow",
    "pytorch", "keras", "scikit", "sklearn", "nlp", "computer vision",
    "data science", "statistics", "regression", "classification",
    "clustering", "reinforcement", "transformer", "llm", "embedding",
    "pandas", "numpy", "matplotlib", "seaborn", "jupyter",
    // Algorithms & DS
    "algorithm", "data structure", "dynamic programming", "graph",
    "tree", "sorting", "recursion", "big o", "complexity",
    // Databases
    "mysql", "postgresql", "mongodb", "redis", "cassandra",
    "sqlite", "oracle", "dynamodb", "firebase", "elasticsearch",
    // Cloud / DevOps
    "aws", "azure", "gcp", "kubernetes", "docker", "terraform",
    "ci/cd", "devops", "microservices", "linux", "unix", "networking",
    "blockchain", "canister", "motoko", "internet computer",
  ];

  /// Soft-skills vocabulary — interpersonal and cognitive competencies.
  private let softSkillKeywords : [Text] = [
    "communication", "leadership", "teamwork", "team player",
    "problem solving", "problem-solving", "adaptability", "adaptable",
    "time management", "critical thinking", "creativity", "creative",
    "collaboration", "collaborative", "decision making", "decision-making",
    "emotional intelligence", "empathy", "negotiation", "persuasion",
    "presentation", "public speaking", "listening", "mentoring",
    "coaching", "conflict resolution", "motivation", "self-motivated",
    "organised", "organized", "detail oriented", "detail-oriented",
    "multitasking", "prioritisation", "prioritization", "interpersonal",
    "cross-functional", "initiative", "proactive", "accountability",
    "work ethic", "growth mindset", "resilience", "flexibility",
  ];

  /// Tools vocabulary — specific software, IDEs, version control,
  /// CI/CD pipelines, project management, and design tools.
  private let toolKeywords : [Text] = [
    // Version control
    "git", "github", "gitlab", "bitbucket", "svn",
    // IDEs
    "vscode", "vs code", "visual studio", "intellij", "pycharm",
    "eclipse", "xcode", "android studio",
    // CI/CD & build
    "jenkins", "travis", "circleci", "github actions", "gitlab ci",
    "maven", "gradle", "webpack", "vite", "babel",
    // Project management
    "jira", "trello", "asana", "confluence", "notion",
    "slack", "microsoft teams", "zoom",
    // Design
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",
    "canva", "invision", "zeplin",
    // Testing
    "jest", "junit", "pytest", "selenium", "cypress", "postman",
    "insomnia", "swagger",
    // Data & BI
    "tableau", "power bi", "excel", "google sheets",
    "looker", "metabase", "airflow",
    // Containers / infra
    "docker compose", "helm", "ansible", "puppet", "chef",
    "vagrant", "nginx", "apache",
  ];

  // ===========================================================================
  // ATS KEYWORD CORPUS
  // Strong action verbs and impact phrases favoured by ATS scanners.
  // ===========================================================================

  private let atsActionVerbs : [Text] = [
    "achieved", "built", "created", "designed", "developed",
    "implemented", "improved", "increased", "led", "managed",
    "optimized", "reduced", "solved", "streamlined", "launched",
    "automated", "deployed", "scaled", "delivered", "established",
    "enhanced", "integrated", "migrated", "refactored", "architected",
    "collaborated", "mentored", "trained", "spearheaded", "coordinated",
    "analyzed", "researched", "evaluated", "proposed", "presented",
    "documented", "tested", "monitored", "maintained", "supported",
  ];

  private let atsImpactPhrases : [Text] = [
    "by ", "% ", "percent", "increased", "reduced", "saved",
    "generated", "team", "project", "system", "performance",
    "efficiency", "revenue", "cost", "time", "user", "customer",
    "stakeholder", "deadline", "budget", "million", "thousand",
    "cross-functional", "agile", "scrum", "sprint",
  ];

  // Leading words that indicate non-action-verb openers (passive / first-person).
  private let weakOpeners : [Text] = [
    "i ", "i was", "i am", "was responsible", "responsible for",
    "helped", "assisted", "worked on", "involved in",
    "participated", "part of",
  ];

  // Strong action verbs to suggest when a bullet lacks one.
  private let replacementVerbs : [Text] = [
    "Developed", "Implemented", "Designed", "Built", "Optimized",
    "Delivered", "Streamlined", "Managed",
  ];

  // ===========================================================================
  // SECTION 1 — TF-IDF-INSPIRED SKILL CATEGORIZATION
  // ===========================================================================

  /// Categorise each skill string by scoring it against three predefined keyword
  /// vocabularies (Technical, Soft Skills, Tools).  A skill earns one point for
  /// each vocabulary token that appears as a substring of its lowercase form.
  /// The category with the highest score wins; ties go to Technical.  Skills that
  /// score zero in all categories are placed in Technical as a safe default.
  ///
  /// This mirrors TF-IDF category assignment: the "document" is the skill string
  /// and the "corpus" is each category's seeded vocabulary.
  public func analyzeSkills(skills : [Text]) : Types.SkillAnalysis {
    let technical = List.empty<Text>();
    let softSkills = List.empty<Text>();
    let tools     = List.empty<Text>();

    for (skill in skills.values()) {
      let techScore = countMatches(skill, technicalKeywords);
      let softScore = countMatches(skill, softSkillKeywords);
      let toolScore = countMatches(skill, toolKeywords);

      // Assign to highest-scoring bucket; ties favour Technical > Tools > Soft
      if (techScore >= softScore and techScore >= toolScore) {
        technical.add(skill);
      } else if (toolScore > techScore and toolScore >= softScore) {
        tools.add(skill);
      } else if (softScore > techScore and softScore > toolScore) {
        softSkills.add(skill);
      } else {
        // Catch-all fallback: default to Technical
        technical.add(skill);
      };
    };

    {
      technical           = technical.toArray();
      softSkills          = softSkills.toArray();
      tools               = tools.toArray();
      categoryExplanation = "Skills are categorised using TF-IDF-inspired " #
        "keyword matching against three predefined vocabulary sets. " #
        "Each skill string is scored by counting how many seed keywords " #
        "from each category appear as sub-tokens; the category with the " #
        "highest match count is assigned. Technical is the default for " #
        "ties or zero-score skills, ensuring every skill is placed.";
    };
  };

  // ===========================================================================
  // SECTION 2 — ATS SCORE CALCULATION
  // ===========================================================================

  /// Collect all bullet-point text from experience and project entries.
  private func collectAllText(
    experience : [Types.ExperienceEntry],
    projects   : [Types.ProjectEntry],
  ) : Text {
    // Concatenate all bullet text into one long string for batch scanning.
    let expText = experience.foldLeft("", func(acc : Text, e : Types.ExperienceEntry) : Text {
      let bullets = e.bullets.foldLeft("", func(a : Text, b : Text) : Text { a # " " # b });
      acc # " " # e.jobTitle # " " # bullets;
    });
    let projText = projects.foldLeft("", func(acc : Text, p : Types.ProjectEntry) : Text {
      let bullets = p.bullets.foldLeft("", func(a : Text, b : Text) : Text { a # " " # b });
      acc # " " # p.title # " " # p.description # " " # bullets;
    });
    expText # " " # projText;
  };

  /// Score experience and project content for ATS compatibility (0-100).
  ///
  /// Algorithm:
  ///   1. Concatenate all bullet points and descriptions into one corpus.
  ///   2. Count unique keyword hits from the action-verb list.
  ///   3. Count unique phrase hits from the impact-phrase list.
  ///   4. Raw score = action hits * 3 + impact hits * 2  (action verbs are
  ///      weighted more heavily as ATS filters prize strong verbs).
  ///   5. Normalize: clamp raw score to [0, 100] by dividing by a maximum
  ///      achievable raw of (|verbs|*3 + |impacts|*2) and scaling to 100.
  ///   6. Return matched keywords and targeted suggestions.
  public func calculateAtsScore(
    experience : [Types.ExperienceEntry],
    projects   : [Types.ProjectEntry],
  ) : Types.AtsResult {
    let corpus = collectAllText(experience, projects);

    // Collect matched action verbs
    let matchedVerbs = atsActionVerbs.filter(func(v) {
      containsToken(corpus, v);
    });

    // Collect matched impact phrases
    let matchedImpact = atsImpactPhrases.filter(func(p) {
      containsToken(corpus, p);
    });

    let verbHits   = matchedVerbs.size();
    let impactHits = matchedImpact.size();

    // Weighted raw score: verbs worth 3 pts, impact phrases worth 2 pts
    let rawScore   = verbHits * 3 + impactHits * 2;
    let maxRaw     = atsActionVerbs.size() * 3 + atsImpactPhrases.size() * 2;

    // Normalize to 0-100 (guard division by zero)
    let score : Nat = if (maxRaw == 0) { 0 } else {
      let pct = (rawScore * 100) / maxRaw;
      if (pct > 100) { 100 } else { pct };
    };

    // Merge matched keywords into a single deduplicated list
    let allMatched = List.fromArray(matchedVerbs);
    for (kw in matchedImpact.values()) {
      allMatched.add(kw);
    };

    // Build actionable suggestions based on gaps
    let suggestions = List.empty<Text>();

    if (verbHits < 5) {
      suggestions.add(
        "Use more strong action verbs (e.g., 'achieved', 'optimized', " #
        "'deployed') at the start of each bullet point."
      );
    };
    if (impactHits < 4) {
      suggestions.add(
        "Add quantifiable metrics to your bullets — include percentages, " #
        "dollar amounts, or team sizes (e.g., 'reduced latency by 30%')."
      );
    };
    if (experience.size() == 0) {
      suggestions.add(
        "Add at least one work experience entry with detailed bullet points."
      );
    };
    if (projects.size() == 0) {
      suggestions.add(
        "Include 2-3 projects with specific technical contributions."
      );
    };
    if (score < 40) {
      suggestions.add(
        "Your ATS score is low. Align your bullet points with the target " #
        "job description keywords and industry-standard terminology."
      );
    } else if (score < 70) {
      suggestions.add(
        "Good foundation! Adding more impact metrics and action verbs " #
        "will push your score above 70."
      );
    };

    {
      score           = score;
      matchedKeywords = allMatched.toArray();
      suggestions     = suggestions.toArray();
    };
  };

  // ===========================================================================
  // SECTION 3 — BULLET POINT ENHANCEMENT
  // ===========================================================================

  /// Check whether a bullet already starts with a strong action verb.
  private func startsWithActionVerb(bullet : Text) : Bool {
    let lower = bullet.toLower();
    atsActionVerbs.any(func(v) {
      lower.startsWith(#text (v.toLower()));
    });
  };

  /// Check whether a bullet opens with a weak phrase (passive / first-person).
  private func startsWithWeakOpener(bullet : Text) : Bool {
    let lower = bullet.toLower();
    weakOpeners.any(func(w) {
      lower.startsWith(#text w);
    });
  };

  /// Check whether a bullet contains any quantified metric.
  private func hasMetric(bullet : Text) : Bool {
    let lower = bullet.toLower();
    // A metric is any digit or known impact keyword
    let hasDigit = lower.foldLeft(false, func(found : Bool, c : Char) : Bool {
      found or (c.toNat32() >= (48 : Nat32) and c.toNat32() <= (57 : Nat32))
    });
    hasDigit or containsToken(lower, "%") or containsToken(lower, "million") or
    containsToken(lower, "thousand") or containsToken(lower, "billion");
  };

  /// Pick a replacement verb round-robin by index mod list length.
  private func pickVerb(index : Nat) : Text {
    let size = replacementVerbs.size();
    if (size == 0) { "Developed" } else {
      replacementVerbs[index % size];
    };
  };

  /// Produce an ATS-enhanced version of a single bullet point together with
  /// an explanation of what was changed.
  ///
  /// Enhancement rules (applied in priority order):
  ///   1. Passive/first-person opener  → strip opener, inject action verb.
  ///   2. No action verb at all         → prepend action verb.
  ///   3. No metric                     → append metric suggestion suffix.
  ///   4. All rules pass                → bullet is already strong; return as-is.
  private func enhanceSingle(bullet : Text, index : Nat) : Types.EnhancedBullet {
    let trimmed = bullet.trim(#predicate (func(c) { c == ' ' }));
    let lower   = trimmed.toLower();

    // Rule 1 — passive / first-person opener
    if (startsWithWeakOpener(trimmed)) {
      let verb   = pickVerb(index);
      // Remove up to the first meaningful word after the weak opener.
      // Strategy: split on spaces, drop tokens while they match weak words.
      let tokens : [Text] = trimmed.tokens(#char ' ').toArray();
      let meaningful = tokens.filter(func(t : Text) : Bool {
        let lt = t.toLower();
        lt != "i" and lt != "was" and lt != "am" and lt != "is" and
        lt != "are" and lt != "were" and lt != "been" and lt != "being" and
        lt != "responsible" and lt != "for" and lt != "helped" and
        lt != "assisted" and lt != "worked" and lt != "on" and
        lt != "involved" and lt != "in" and lt != "participated" and
        lt != "part" and lt != "of"
      });
      let rest = meaningful.foldLeft("", func(acc : Text, t : Text) : Text {
        if (acc.size() == 0) { t } else { acc # " " # t }
      });
      let enhanced = if (rest.size() > 0) {
        verb # " " # rest;
      } else {
        verb # " " # trimmed;
      };
      return {
        original    = bullet;
        enhanced    = enhanced;
        improvement = "Replaced weak/passive opener with strong action verb '" #
                      verb # "' for ATS compliance.";
      };
    };

    // Rule 2 — no action verb
    if (not startsWithActionVerb(trimmed)) {
      let verb     = pickVerb(index);
      let enhanced = verb # " " # trimmed;
      return {
        original    = bullet;
        enhanced    = enhanced;
        improvement = "Prepended action verb '" # verb #
                      "' — ATS parsers prioritise bullet points that open " #
                      "with a strong action verb.";
      };
    };

    // Rule 3 — no metric
    if (not hasMetric(trimmed)) {
      let enhanced = trimmed # ", resulting in measurable improvement " #
                     "(add a specific metric, e.g., 'by 25%' or '" #
                     "saving 10 hours/week').";
      return {
        original    = bullet;
        enhanced    = enhanced;
        improvement = "Appended a metric placeholder — ATS algorithms rank " #
                      "bullets with quantifiable outcomes (%, $, time) higher.";
      };
    };

    // Rule 4 — bullet is already strong
    {
      original    = bullet;
      enhanced    = trimmed;
      improvement = "Bullet already starts with an action verb and contains " #
                    "measurable impact. No changes needed — excellent ATS fit!";
    };
  };

  /// Enhance a list of plain bullet point strings with ATS-friendly language.
  /// Each result pairs the original with an enhanced suggestion and a short
  /// note describing what was improved.
  public func enhanceBullets(bullets : [Text]) : [Types.EnhancedBullet] {
    bullets.mapEntries<Text, Types.EnhancedBullet>(
      func(b, i) { enhanceSingle(b, i) }
    );
  };
}
