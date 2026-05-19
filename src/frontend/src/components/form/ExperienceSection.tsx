import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
/**
 * ExperienceSection — add/remove experience entries with dynamic bullet points.
 * Accepts optional `errors` array for per-entry inline validation.
 */
import { useResumeStore } from "@/context/ResumeContext";
import type { ExperienceErrors } from "@/types/formErrors";
import type { ExperienceEntry } from "@/types/resume";
import { Briefcase, Plus, Trash2 } from "lucide-react";

function newExp(): ExperienceEntry {
  return {
    id: `exp-${Date.now()}`,
    jobTitle: "",
    company: "",
    duration: "",
    bullets: ["", "", ""],
  };
}

interface Props {
  errors?: ExperienceErrors[];
}

export function ExperienceSection({ errors = [] }: Props) {
  const { resumeData, setExperience } = useResumeStore();
  const { experience } = resumeData;

  function updateField(
    index: number,
    field: keyof Omit<ExperienceEntry, "bullets" | "id">,
    value: string,
  ) {
    setExperience(
      experience.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
    );
  }

  function updateBullet(expIndex: number, bulletIndex: number, value: string) {
    setExperience(
      experience.map((e, i) =>
        i === expIndex
          ? {
              ...e,
              bullets: e.bullets.map((b, bi) =>
                bi === bulletIndex ? value : b,
              ),
            }
          : e,
      ),
    );
  }

  function addBullet(expIndex: number) {
    setExperience(
      experience.map((e, i) =>
        i === expIndex ? { ...e, bullets: [...e.bullets, ""] } : e,
      ),
    );
  }

  function removeBullet(expIndex: number, bulletIndex: number) {
    setExperience(
      experience.map((e, i) =>
        i === expIndex
          ? { ...e, bullets: e.bullets.filter((_, bi) => bi !== bulletIndex) }
          : e,
      ),
    );
  }

  return (
    <section
      className="bg-card border border-border rounded-xl p-6 space-y-5"
      data-ocid="experience_section"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="section-heading">Work Experience</h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setExperience([...experience, newExp()])}
          data-ocid="experience_section.add_button"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div
            key={exp.id}
            className="space-y-4 pb-6 border-b border-border/60 last:border-0 last:pb-0"
            data-ocid={`experience_section.item.${index + 1}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">
                Position {index + 1}
              </p>
              {experience.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExperience(experience.filter((_, i) => i !== index))
                  }
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7"
                  data-ocid={`experience_section.delete_button.${index + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Software Engineer"
                  value={exp.jobTitle}
                  onChange={(e) =>
                    updateField(index, "jobTitle", e.target.value)
                  }
                  data-ocid={`experience_section.jobtitle_input.${index + 1}`}
                  className={
                    errors[index]?.jobTitle
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors[index]?.jobTitle && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid={`experience_section.jobtitle_field_error.${index + 1}`}
                  >
                    {errors[index]?.jobTitle}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>
                  Company <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Infosys / Wipro / Startup"
                  value={exp.company}
                  onChange={(e) =>
                    updateField(index, "company", e.target.value)
                  }
                  className={
                    errors[index]?.company
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors[index]?.company && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid={`experience_section.company_field_error.${index + 1}`}
                  >
                    {errors[index]?.company}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label>
                  Duration <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Jan 2023 – Present"
                  value={exp.duration}
                  onChange={(e) =>
                    updateField(index, "duration", e.target.value)
                  }
                  className={
                    errors[index]?.duration
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors[index]?.duration && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid={`experience_section.duration_field_error.${index + 1}`}
                  >
                    {errors[index]?.duration}
                  </p>
                )}
              </div>
            </div>
            {/* Bullet points */}
            <div className="space-y-2">
              <Label>Key Responsibilities / Achievements</Label>
              {exp.bullets.map((bullet, bi) => (
                <div
                  key={`${exp.id}-bullet-${bullet.slice(0, 12)}-${bi}`}
                  className="flex gap-2 items-start"
                >
                  <span className="text-primary mt-2.5 text-sm font-bold">
                    •
                  </span>
                  <Textarea
                    rows={2}
                    placeholder={`Achievement or responsibility ${bi + 1} — use action verbs`}
                    value={bullet}
                    onChange={(e) => updateBullet(index, bi, e.target.value)}
                    className="resize-none flex-1"
                    data-ocid={`experience_section.bullet.${index + 1}.${bi + 1}`}
                  />
                  {exp.bullets.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBullet(index, bi)}
                      className="text-muted-foreground hover:text-destructive mt-1 h-8 w-8"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addBullet(index)}
                className="text-primary hover:text-primary h-8"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add bullet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
