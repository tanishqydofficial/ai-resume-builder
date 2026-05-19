import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeStore } from "@/context/ResumeContext";
import { Code2, X } from "lucide-react";
/**
 * SkillsSection — tag-style skill input with keyboard-driven entry.
 * Press Enter or comma to add a skill; click × to remove.
 * Accepts optional `error` string for section-level validation.
 */
import { type KeyboardEvent, useState } from "react";

interface Props {
  error?: string;
}

export function SkillsSection({ error }: Props) {
  const { resumeData, setSkills } = useResumeStore();
  const { skills } = resumeData;
  const [inputValue, setInputValue] = useState("");

  function addSkill(raw: string) {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const unique = parts.filter((s) => !skills.includes(s));
    if (unique.length > 0) setSkills([...skills, ...unique]);
    setInputValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      skills.length > 0
    ) {
      setSkills(skills.slice(0, -1));
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  const SUGGESTIONS = [
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "SQL",
    "Machine Learning",
    "TensorFlow",
    "Docker",
    "Git",
    "AWS",
  ];
  const unusedSuggestions = SUGGESTIONS.filter((s) => !skills.includes(s));

  return (
    <section
      className="bg-card border border-border rounded-xl p-6 space-y-5"
      data-ocid="skills_section"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Code2 className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="section-heading">
          Skills <span className="text-destructive">*</span>
        </h2>
      </div>

      {/* Skill tag input container */}

      <div
        className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 rounded-lg border border-input bg-background cursor-text"
        data-ocid="skills_section.skill_tags"
      >
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="flex items-center gap-1 pr-1 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20"
            data-ocid={`skills_section.skill.${skill.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {skill}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </Badge>
        ))}
        <Input
          id="skill-input"
          className="border-0 shadow-none h-6 px-0 text-sm min-w-32 flex-1 focus-visible:ring-0"
          placeholder={
            skills.length === 0
              ? "Type a skill and press Enter..."
              : "Add more..."
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addSkill(inputValue);
          }}
          aria-label="Add skill"
          data-ocid="skills_section.skill_input"
        />
      </div>
      <p className="text-xs text-muted-foreground -mt-3">
        Separate skills with Enter or comma.
      </p>

      {/* Section-level error */}
      {error && (
        <p
          className="text-xs text-destructive flex items-center gap-1"
          data-ocid="skills_section.error_state"
        >
          <span>⚠</span> {error}
        </p>
      )}

      {/* Quick suggestions */}
      {unusedSuggestions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick add:</Label>
          <div className="flex flex-wrap gap-1.5">
            {unusedSuggestions.slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSkills([...skills, s])}
                className="text-xs border border-dashed border-border px-2 py-0.5 rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                data-ocid={`skills_section.suggest.${s.toLowerCase().replace(/\s+/g, "-")}`}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
