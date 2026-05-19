/**
 * PreviewPage — live HTML preview of the resume + PDF download.
 * Renders an A4-style preview card with all resume sections.
 * Supports PDF generation via jsPDF, browser print, and context-aware
 * skill categorization & enhanced bullet points.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useResumeStore } from "@/context/ResumeContext";
import type { EnhancedBullet } from "@/types/resume";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Printer,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function PreviewPage() {
  const navigate = useNavigate();
  const { resumeData, analysisResults, setCurrentStep, resetResume } =
    useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications,
  } = resumeData;
  const { skillAnalysis, enhancedBullets } = analysisResults;

  // Redirect to form if no resume data has been entered
  useEffect(() => {
    if (!personalInfo.fullName && !personalInfo.email) {
      navigate({ to: "/" });
    }
  }, [personalInfo.fullName, personalInfo.email, navigate]);

  /** Look up an enhanced bullet for a given original string, fall back to original */
  function getBullet(original: string): string {
    const match = enhancedBullets.find(
      (eb: EnhancedBullet) => eb.original.trim() === original.trim(),
    );
    return match ? match.enhanced : original;
  }

  async function handleDownloadPdf() {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 18;
      const col = pageW - margin * 2;
      let y = 18;

      // Color palette
      const indigo: [number, number, number] = [67, 56, 202];
      const dark: [number, number, number] = [17, 24, 39];
      const grey: [number, number, number] = [107, 114, 128];
      const lightGrey: [number, number, number] = [243, 244, 246];

      // Header bar
      doc.setFillColor(...indigo);
      doc.rect(0, 0, pageW, 40, "F");

      // Name
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(personalInfo.fullName || "Your Name", margin, y + 6);

      // Contact line
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const contactParts = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.location,
        personalInfo.linkedIn,
      ].filter(Boolean);
      doc.text(contactParts.join("  |  "), margin, y + 16);
      y = 50;

      function sectionHeader(title: string) {
        doc.setFillColor(...lightGrey);
        doc.rect(margin - 2, y - 4, col + 4, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...indigo);
        doc.text(title.toUpperCase(), margin, y + 1);
        doc.setDrawColor(...indigo);
        doc.setLineWidth(0.3);
        doc.line(margin, y + 3, margin + col, y + 3);
        y += 8;
      }

      function bodyText(text: string, x = margin, width = col, lineHeight = 5) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        const lines = doc.splitTextToSize(text, width);
        doc.text(lines, x, y);
        y += lines.length * lineHeight;
      }

      function checkNewPage(needed = 20) {
        if (y + needed > doc.internal.pageSize.getHeight() - 15) {
          doc.addPage();
          y = 18;
        }
      }

      // Summary
      if (personalInfo.summary) {
        sectionHeader("Professional Summary");
        bodyText(personalInfo.summary);
        y += 4;
      }

      // Experience
      if (experience.some((e) => e.jobTitle)) {
        checkNewPage();
        sectionHeader("Experience");
        for (const exp of experience) {
          if (!exp.jobTitle) continue;
          checkNewPage(16);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(...dark);
          doc.text(exp.jobTitle, margin, y);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(...grey);
          doc.text(`${exp.company}  •  ${exp.duration}`, margin, y + 4.5);
          y += 8;
          for (const bullet of exp.bullets.filter((b) => b.trim())) {
            bodyText(`•  ${bullet}`, margin + 3, col - 3);
          }
          y += 2;
        }
      }

      // Education
      if (education.some((e) => e.institution)) {
        checkNewPage();
        sectionHeader("Education");
        for (const edu of education) {
          if (!edu.institution) continue;
          checkNewPage(14);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(...dark);
          doc.text(
            `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`,
            margin,
            y,
          );
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(...grey);
          doc.text(
            `${edu.institution}  •  ${edu.graduationYear}${edu.gpa ? `  •  GPA: ${edu.gpa}` : ""}`,
            margin,
            y + 4.5,
          );
          y += 9;
        }
        y += 2;
      }

      // Skills
      if (skills.length > 0) {
        checkNewPage();
        sectionHeader("Skills");
        const skillGroups = skillAnalysis
          ? [
              { label: "Technical", items: skillAnalysis.technical },
              { label: "Soft Skills", items: skillAnalysis.softSkills },
              { label: "Tools", items: skillAnalysis.tools },
            ].filter((g) => g.items.length > 0)
          : [{ label: "Skills", items: skills }];
        for (const group of skillGroups) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(...indigo);
          doc.text(`${group.label}: `, margin, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...dark);
          doc.text(group.items.join(", "), margin + 22, y);
          y += 5;
        }
        y += 2;
      }

      // Projects
      if (projects.some((p) => p.title)) {
        checkNewPage();
        sectionHeader("Projects");
        for (const proj of projects) {
          if (!proj.title) continue;
          checkNewPage(16);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(...dark);
          doc.text(proj.title, margin, y);
          if (proj.technologies) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            doc.setTextColor(...grey);
            doc.text(proj.technologies, margin, y + 4.5);
            y += 5;
          }
          y += 4;
          if (proj.description) bodyText(proj.description);
          for (const bullet of proj.bullets.filter((b) => b.trim())) {
            bodyText(`•  ${bullet}`, margin + 3, col - 3);
          }
          y += 2;
        }
      }

      // Certifications
      if (certifications.length > 0) {
        checkNewPage();
        sectionHeader("Certifications");
        for (const cert of certifications) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(...dark);
          doc.text(cert.name, margin, y);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(...grey);
          doc.text(`${cert.issuer}  •  ${cert.year}`, margin, y + 4.5);
          y += 9;
        }
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...grey);
        doc.text(
          `Page ${p} of ${pageCount}`,
          pageW / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: "center" },
        );
      }

      const filename = `${(personalInfo.fullName || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
      doc.save(filename);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("PDF generation failed. Please try again.");
    }
  }

  return (
    <div className="space-y-6" data-ocid="preview_page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-semibold text-2xl text-foreground">
            Resume Preview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review your resume and download as PDF.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentStep("results");
              navigate({ to: "/results" });
            }}
            data-ocid="preview_page.back_button"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> AI Results
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetResume();
              navigate({ to: "/" });
            }}
            data-ocid="preview_page.reset_button"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Start Over
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            data-ocid="preview_page.print_button"
          >
            <Printer className="w-4 h-4 mr-1" /> Print
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadPdf}
            data-ocid="preview_page.download_button"
            className="gap-2 font-semibold"
          >
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Preview panel — A4-style white card */}
      <div
        ref={previewRef}
        className="bg-card border border-border rounded-xl overflow-hidden shadow-subtle"
        style={{ maxWidth: "794px", margin: "0 auto" }}
        data-ocid="preview_page.resume_panel"
      >
        {/* Resume Header */}
        <div className="bg-primary px-8 py-6 text-primary-foreground">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-2xl truncate">
                {personalInfo.fullName || "Your Name"}
              </h2>
              {personalInfo.summary && (
                <p className="text-primary-foreground/80 text-sm mt-2 line-clamp-3 max-w-xl">
                  {personalInfo.summary}
                </p>
              )}
            </div>
            {personalInfo.photoUrl && (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-foreground/30 flex-shrink-0"
              />
            )}
          </div>
          {/* Contact row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {personalInfo.email && (
              <ContactItem
                icon={<Mail className="w-3 h-3" />}
                value={personalInfo.email}
              />
            )}
            {personalInfo.phone && (
              <ContactItem
                icon={<Phone className="w-3 h-3" />}
                value={personalInfo.phone}
              />
            )}
            {personalInfo.location && (
              <ContactItem
                icon={<MapPin className="w-3 h-3" />}
                value={personalInfo.location}
              />
            )}
            {personalInfo.linkedIn && (
              <ContactItem
                icon={<Linkedin className="w-3 h-3" />}
                value={personalInfo.linkedIn}
              />
            )}
            {personalInfo.github && (
              <ContactItem
                icon={<Github className="w-3 h-3" />}
                value={personalInfo.github}
              />
            )}
          </div>
        </div>

        {/* Resume Body */}
        <div className="px-8 py-6 space-y-6 bg-card">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <ResumeSection title="Professional Summary">
              <p
                className="text-sm text-foreground/90 leading-relaxed"
                data-ocid="preview_page.summary"
              >
                {personalInfo.summary}
              </p>
            </ResumeSection>
          )}

          {/* Experience — uses enhanced bullets when available */}
          {experience.some((e) => e.jobTitle) && (
            <ResumeSection title="Experience">
              {experience
                .filter((e) => e.jobTitle)
                .map((exp, i) => (
                  <div
                    key={exp.id}
                    className="space-y-1"
                    data-ocid={`preview_page.experience.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {exp.jobTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exp.company}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {exp.duration}
                      </Badge>
                    </div>
                    <ul className="space-y-0.5">
                      {exp.bullets
                        .filter((b) => b.trim())
                        .map((b, bIdx) => {
                          const text = getBullet(b);
                          const isEnhanced = enhancedBullets.some(
                            (eb: EnhancedBullet) =>
                              eb.original.trim() === b.trim() &&
                              eb.enhanced !== b,
                          );
                          return (
                            <li
                              key={bIdx.toString()}
                              className="text-xs text-foreground/90 flex gap-2 items-start"
                            >
                              <span className="text-primary mt-0.5 shrink-0">
                                •
                              </span>
                              <span>
                                {text}
                                {isEnhanced && (
                                  <Badge
                                    variant="outline"
                                    className="ml-1.5 text-[10px] px-1 py-0 border-accent text-accent"
                                  >
                                    AI
                                  </Badge>
                                )}
                              </span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                ))}
            </ResumeSection>
          )}

          {/* Education */}
          {education.some((e) => e.institution) && (
            <ResumeSection title="Education">
              {education
                .filter((e) => e.institution)
                .map((edu, i) => (
                  <div
                    key={edu.id}
                    className="flex items-start justify-between gap-2"
                    data-ocid={`preview_page.education.${i + 1}`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {edu.degree}
                        {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {edu.institution}
                      </p>
                      {edu.gpa && (
                        <p className="text-xs text-muted-foreground">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {edu.graduationYear}
                    </Badge>
                  </div>
                ))}
            </ResumeSection>
          )}

          {/* Skills — categorized when skillAnalysis is available, raw list otherwise */}
          {skills.length > 0 && (
            <ResumeSection title="Skills">
              {skillAnalysis ? (
                <div
                  className="space-y-2"
                  data-ocid="preview_page.skills_categorized"
                >
                  {(
                    [
                      { label: "Technical", items: skillAnalysis.technical },
                      { label: "Soft Skills", items: skillAnalysis.softSkills },
                      { label: "Tools", items: skillAnalysis.tools },
                    ] as const
                  )
                    .filter((g) => g.items.length > 0)
                    .map((group) => (
                      <div
                        key={group.label}
                        className="flex flex-wrap items-center gap-1.5"
                      >
                        <span className="text-xs font-semibold text-primary shrink-0 mr-1">
                          {group.label}:
                        </span>
                        {group.items.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ))}
                </div>
              ) : (
                <div
                  className="flex flex-wrap gap-1.5"
                  data-ocid="preview_page.skills_raw"
                >
                  {skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </ResumeSection>
          )}

          {/* Projects */}
          {projects.some((p) => p.title) && (
            <ResumeSection title="Projects">
              {projects
                .filter((p) => p.title)
                .map((proj, i) => (
                  <div
                    key={proj.id}
                    className="space-y-1"
                    data-ocid={`preview_page.project.${i + 1}`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground">
                        {proj.title}
                      </p>
                      {proj.technologies && (
                        <Badge variant="secondary" className="text-xs">
                          {proj.technologies}
                        </Badge>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-muted-foreground">
                        {proj.description}
                      </p>
                    )}
                    <ul className="space-y-0.5">
                      {proj.bullets
                        .filter((b) => b.trim())
                        .map((b, bIdx) => (
                          <li
                            key={bIdx.toString()}
                            className="text-xs text-foreground/90 flex gap-2 items-start"
                          >
                            <span className="text-primary mt-0.5 shrink-0">
                              •
                            </span>
                            {b}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </ResumeSection>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <ResumeSection title="Certifications">
              {certifications.map((cert, i) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between gap-2"
                  data-ocid={`preview_page.cert.${i + 1}`}
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {cert.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {cert.year}
                  </Badge>
                </div>
              ))}
            </ResumeSection>
          )}
        </div>
      </div>
    </div>
  );
}

/** Shared resume section block */
function ResumeSection({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-primary">
          {title}
        </h3>
        <Separator className="flex-1" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ContactItem({
  icon,
  value,
}: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-primary-foreground/80">
      {icon}
      {value}
    </span>
  );
}
