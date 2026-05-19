import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
/**
 * EducationSection — add / remove education entries.
 * Accepts optional `errors` array for per-entry inline validation.
 */
import { useResumeStore } from "@/context/ResumeContext";
import type { EducationErrors } from "@/types/formErrors";
import type { Education } from "@/types/resume";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

function newEdu(): Education {
  return {
    id: `edu-${Date.now()}`,
    degree: "",
    fieldOfStudy: "",
    institution: "",
    graduationYear: "",
    gpa: "",
  };
}

interface Props {
  errors?: EducationErrors[];
}

export function EducationSection({ errors = [] }: Props) {
  const { resumeData, setEducation } = useResumeStore();
  const { education } = resumeData;

  function update(index: number, field: keyof Education, value: string) {
    const updated = education.map((e, i) =>
      i === index ? { ...e, [field]: value } : e,
    );
    setEducation(updated);
  }

  return (
    <section
      className="bg-card border border-border rounded-xl p-6 space-y-5"
      data-ocid="education_section"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="section-heading">Education</h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEducation([...education, newEdu()])}
          data-ocid="education_section.add_button"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-5">
        {education.map((edu, index) => (
          <div
            key={edu.id}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-border/60 last:border-0 last:pb-0"
            data-ocid={`education_section.item.${index + 1}`}
          >
            <div className="space-y-1.5">
              <Label>
                Degree <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="B.Tech / B.Sc / MBA"
                value={edu.degree}
                onChange={(e) => update(index, "degree", e.target.value)}
                data-ocid={`education_section.degree_input.${index + 1}`}
                className={
                  errors[index]?.degree
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors[index]?.degree && (
                <p
                  className="text-xs text-destructive"
                  data-ocid={`education_section.degree_field_error.${index + 1}`}
                >
                  {errors[index]?.degree}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Field of Study</Label>
              <Input
                placeholder="Computer Science"
                value={edu.fieldOfStudy}
                onChange={(e) => update(index, "fieldOfStudy", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>
                Institution <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="IIT Delhi / VIT Vellore"
                value={edu.institution}
                onChange={(e) => update(index, "institution", e.target.value)}
                className={
                  errors[index]?.institution
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors[index]?.institution && (
                <p
                  className="text-xs text-destructive"
                  data-ocid={`education_section.institution_field_error.${index + 1}`}
                >
                  {errors[index]?.institution}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Graduation Year</Label>
              <Input
                placeholder="2025"
                value={edu.graduationYear}
                onChange={(e) =>
                  update(index, "graduationYear", e.target.value)
                }
              />
            </div>
            <div className="space-y-1.5 flex items-end gap-3">
              <div className="flex-1 space-y-1.5">
                <Label>GPA / Percentage</Label>
                <Input
                  placeholder="8.5 / 85%"
                  value={edu.gpa}
                  onChange={(e) => update(index, "gpa", e.target.value)}
                />
              </div>
              {education.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setEducation(education.filter((_, i) => i !== index))
                  }
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 mb-0.5"
                  data-ocid={`education_section.delete_button.${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
