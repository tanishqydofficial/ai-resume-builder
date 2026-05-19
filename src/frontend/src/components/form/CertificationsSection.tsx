import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
/**
 * CertificationsSection — optional list of certifications.
 */
import { useResumeStore } from "@/context/ResumeContext";
import type { Certification } from "@/types/resume";
import { Award, Plus, Trash2 } from "lucide-react";

function newCert(): Certification {
  return { id: `cert-${Date.now()}`, name: "", issuer: "", year: "" };
}

export function CertificationsSection() {
  const { resumeData, setCertifications } = useResumeStore();
  const { certifications } = resumeData;

  function update(
    index: number,
    field: keyof Omit<Certification, "id">,
    value: string,
  ) {
    setCertifications(
      certifications.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      ),
    );
  }

  return (
    <section
      className="bg-card border border-border rounded-xl p-6 space-y-5"
      data-ocid="certifications_section"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Award className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="section-heading">
            Certifications{" "}
            <span className="text-sm font-normal text-muted-foreground">
              (optional)
            </span>
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCertifications([...certifications, newCert()])}
          data-ocid="certifications_section.add_button"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div
          className="text-center py-8 text-sm text-muted-foreground rounded-lg border border-dashed border-border"
          data-ocid="certifications_section.empty_state"
        >
          No certifications added yet.
          <br />
          <button
            type="button"
            onClick={() => setCertifications([newCert()])}
            className="text-primary hover:underline mt-1 inline-block"
          >
            Add your first certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pb-4 border-b border-border/60 last:border-0 last:pb-0"
              data-ocid={`certifications_section.item.${index + 1}`}
            >
              <div className="space-y-1.5 sm:col-span-1">
                <Label>Certification Name</Label>
                <Input
                  placeholder="AWS Solutions Architect"
                  value={cert.name}
                  onChange={(e) => update(index, "name", e.target.value)}
                  data-ocid={`certifications_section.name_input.${index + 1}`}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Issuing Organization</Label>
                <Input
                  placeholder="Amazon / Google / Coursera"
                  value={cert.issuer}
                  onChange={(e) => update(index, "issuer", e.target.value)}
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label>Year</Label>
                  <Input
                    placeholder="2024"
                    value={cert.year}
                    onChange={(e) => update(index, "year", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setCertifications(
                      certifications.filter((_, i) => i !== index),
                    )
                  }
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 mb-0.5"
                  data-ocid={`certifications_section.delete_button.${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
