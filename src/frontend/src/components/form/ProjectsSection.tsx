import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
/**
 * ProjectsSection — add/remove project entries with technology tags and bullets.
 * Accepts optional `errors` array for per-entry inline validation.
 */
import { useResumeStore } from "@/context/ResumeContext";
import type { ProjectErrors } from "@/types/formErrors";
import type { ProjectEntry } from "@/types/resume";
import { FolderKanban, Plus, Trash2 } from "lucide-react";

function newProject(): ProjectEntry {
  return {
    id: `proj-${Date.now()}`,
    title: "",
    description: "",
    bullets: [""],
    technologies: "",
  };
}

interface Props {
  errors?: ProjectErrors[];
}

export function ProjectsSection({ errors = [] }: Props) {
  const { resumeData, setProjects } = useResumeStore();
  const { projects } = resumeData;

  function updateField(
    index: number,
    field: keyof Omit<ProjectEntry, "bullets" | "id">,
    value: string,
  ) {
    setProjects(
      projects.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  }

  function updateBullet(projIndex: number, bulletIndex: number, value: string) {
    setProjects(
      projects.map((p, i) =>
        i === projIndex
          ? {
              ...p,
              bullets: p.bullets.map((b, bi) =>
                bi === bulletIndex ? value : b,
              ),
            }
          : p,
      ),
    );
  }

  function addBullet(projIndex: number) {
    setProjects(
      projects.map((p, i) =>
        i === projIndex ? { ...p, bullets: [...p.bullets, ""] } : p,
      ),
    );
  }

  return (
    <section
      className="bg-card border border-border rounded-xl p-6 space-y-5"
      data-ocid="projects_section"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderKanban className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="section-heading">Projects</h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setProjects([...projects, newProject()])}
          data-ocid="projects_section.add_button"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-6">
        {projects.map((proj, index) => (
          <div
            key={proj.id}
            className="space-y-4 pb-6 border-b border-border/60 last:border-0 last:pb-0"
            data-ocid={`projects_section.item.${index + 1}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">
                Project {index + 1}
              </p>
              {projects.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setProjects(projects.filter((_, i) => i !== index))
                  }
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7"
                  data-ocid={`projects_section.delete_button.${index + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="AI Chatbot / Portfolio Website"
                  value={proj.title}
                  onChange={(e) => updateField(index, "title", e.target.value)}
                  data-ocid={`projects_section.title_input.${index + 1}`}
                  className={
                    errors[index]?.title
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors[index]?.title && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid={`projects_section.title_field_error.${index + 1}`}
                  >
                    {errors[index]?.title}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Technologies Used</Label>
                <Input
                  placeholder="Python, FastAPI, React"
                  value={proj.technologies}
                  onChange={(e) =>
                    updateField(index, "technologies", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  placeholder="Brief description of what the project does and its impact..."
                  value={proj.description}
                  onChange={(e) =>
                    updateField(index, "description", e.target.value)
                  }
                  className="resize-none"
                />
              </div>
            </div>
            {/* Bullets */}
            <div className="space-y-2">
              <Label>Key Highlights</Label>
              {proj.bullets.map((bullet, bi) => (
                <div
                  key={`${proj.id}-bullet-${bullet.slice(0, 12)}-${bi}`}
                  className="flex gap-2 items-start"
                >
                  <span className="text-primary mt-2.5 text-sm font-bold">
                    •
                  </span>
                  <Textarea
                    rows={2}
                    placeholder={`Project highlight ${bi + 1}`}
                    value={bullet}
                    onChange={(e) => updateBullet(index, bi, e.target.value)}
                    className="resize-none flex-1"
                    data-ocid={`projects_section.bullet.${index + 1}.${bi + 1}`}
                  />
                  {proj.bullets.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setProjects(
                          projects.map((p, i) =>
                            i === index
                              ? {
                                  ...p,
                                  bullets: p.bullets.filter(
                                    (_, bii) => bii !== bi,
                                  ),
                                }
                              : p,
                          ),
                        )
                      }
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
                <Plus className="w-3.5 h-3.5 mr-1" /> Add highlight
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
