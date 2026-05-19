const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-CaXIs03Q.js","assets/index-CZkR6vSu.js","assets/index-DLCq__8q.css"])))=>i.map(i=>d[i]);
import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a as cn, b as useNavigate, u as useResumeStore, aa as Download, ab as __vitePreload, d as ue } from "./index-CZkR6vSu.js";
import { B as Button, C as ChevronLeft, a as Badge } from "./badge-Cg3yWkFE.js";
import { P as Primitive } from "./index-BSSGWuL5.js";
import { R as RotateCcw } from "./rotate-ccw-DQWi3VmU.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef"
    }
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }]
];
const Github = createLucideIcon("github", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f"
    }
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }]
];
const Linkedin = createLucideIcon("linkedin", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function PreviewPage() {
  const navigate = useNavigate();
  const { resumeData, analysisResults, setCurrentStep, resetResume } = useResumeStore();
  const previewRef = reactExports.useRef(null);
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications
  } = resumeData;
  const { skillAnalysis, enhancedBullets } = analysisResults;
  reactExports.useEffect(() => {
    if (!personalInfo.fullName && !personalInfo.email) {
      navigate({ to: "/" });
    }
  }, [personalInfo.fullName, personalInfo.email, navigate]);
  function getBullet(original) {
    const match = enhancedBullets.find(
      (eb) => eb.original.trim() === original.trim()
    );
    return match ? match.enhanced : original;
  }
  async function handleDownloadPdf() {
    try {
      let sectionHeader = function(title) {
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
      }, bodyText = function(text, x = margin, width = col, lineHeight = 5) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        const lines = doc.splitTextToSize(text, width);
        doc.text(lines, x, y);
        y += lines.length * lineHeight;
      }, checkNewPage = function(needed = 20) {
        if (y + needed > doc.internal.pageSize.getHeight() - 15) {
          doc.addPage();
          y = 18;
        }
      };
      const { jsPDF } = await __vitePreload(async () => {
        const { jsPDF: jsPDF2 } = await import("./jspdf.es.min-CaXIs03Q.js").then((n) => n.j);
        return { jsPDF: jsPDF2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 18;
      const col = pageW - margin * 2;
      let y = 18;
      const indigo = [67, 56, 202];
      const dark = [17, 24, 39];
      const grey = [107, 114, 128];
      const lightGrey = [243, 244, 246];
      doc.setFillColor(...indigo);
      doc.rect(0, 0, pageW, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(personalInfo.fullName || "Your Name", margin, y + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const contactParts = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.location,
        personalInfo.linkedIn
      ].filter(Boolean);
      doc.text(contactParts.join("  |  "), margin, y + 16);
      y = 50;
      if (personalInfo.summary) {
        sectionHeader("Professional Summary");
        bodyText(personalInfo.summary);
        y += 4;
      }
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
            y
          );
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(...grey);
          doc.text(
            `${edu.institution}  •  ${edu.graduationYear}${edu.gpa ? `  •  GPA: ${edu.gpa}` : ""}`,
            margin,
            y + 4.5
          );
          y += 9;
        }
        y += 2;
      }
      if (skills.length > 0) {
        checkNewPage();
        sectionHeader("Skills");
        const skillGroups = skillAnalysis ? [
          { label: "Technical", items: skillAnalysis.technical },
          { label: "Soft Skills", items: skillAnalysis.softSkills },
          { label: "Tools", items: skillAnalysis.tools }
        ].filter((g) => g.items.length > 0) : [{ label: "Skills", items: skills }];
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
          { align: "center" }
        );
      }
      const filename = `${(personalInfo.fullName || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
      doc.save(filename);
      ue.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      ue.error("PDF generation failed. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "preview_page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-2xl text-foreground", children: "Resume Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Review your resume and download as PDF." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              setCurrentStep("results");
              navigate({ to: "/results" });
            },
            "data-ocid": "preview_page.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
              " AI Results"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              resetResume();
              navigate({ to: "/" });
            },
            "data-ocid": "preview_page.reset_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5 mr-1" }),
              " Start Over"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => window.print(),
            "data-ocid": "preview_page.print_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4 mr-1" }),
              " Print"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleDownloadPdf,
            "data-ocid": "preview_page.download_button",
            className: "gap-2 font-semibold",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
              " Download PDF"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: previewRef,
        className: "bg-card border border-border rounded-xl overflow-hidden shadow-subtle",
        style: { maxWidth: "794px", margin: "0 auto" },
        "data-ocid": "preview_page.resume_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary px-8 py-6 text-primary-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl truncate", children: personalInfo.fullName || "Your Name" }),
                personalInfo.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 text-sm mt-2 line-clamp-3 max-w-xl", children: personalInfo.summary })
              ] }),
              personalInfo.photoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: personalInfo.photoUrl,
                  alt: personalInfo.fullName,
                  className: "w-16 h-16 rounded-full object-cover border-2 border-primary-foreground/30 flex-shrink-0"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 mt-3", children: [
              personalInfo.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ContactItem,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3" }),
                  value: personalInfo.email
                }
              ),
              personalInfo.phone && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ContactItem,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3" }),
                  value: personalInfo.phone
                }
              ),
              personalInfo.location && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ContactItem,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                  value: personalInfo.location
                }
              ),
              personalInfo.linkedIn && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ContactItem,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "w-3 h-3" }),
                  value: personalInfo.linkedIn
                }
              ),
              personalInfo.github && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ContactItem,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "w-3 h-3" }),
                  value: personalInfo.github
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-6 space-y-6 bg-card", children: [
            personalInfo.summary && /* @__PURE__ */ jsxRuntimeExports.jsx(ResumeSection, { title: "Professional Summary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-sm text-foreground/90 leading-relaxed",
                "data-ocid": "preview_page.summary",
                children: personalInfo.summary
              }
            ) }),
            experience.some((e) => e.jobTitle) && /* @__PURE__ */ jsxRuntimeExports.jsx(ResumeSection, { title: "Experience", children: experience.filter((e) => e.jobTitle).map((exp, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "space-y-1",
                "data-ocid": `preview_page.experience.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: exp.jobTitle }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: exp.company })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs shrink-0", children: exp.duration })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: exp.bullets.filter((b) => b.trim()).map((b, bIdx) => {
                    const text = getBullet(b);
                    const isEnhanced = enhancedBullets.some(
                      (eb) => eb.original.trim() === b.trim() && eb.enhanced !== b
                    );
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        className: "text-xs text-foreground/90 flex gap-2 items-start",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5 shrink-0", children: "•" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            text,
                            isEnhanced && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Badge,
                              {
                                variant: "outline",
                                className: "ml-1.5 text-[10px] px-1 py-0 border-accent text-accent",
                                children: "AI"
                              }
                            )
                          ] })
                        ]
                      },
                      bIdx.toString()
                    );
                  }) })
                ]
              },
              exp.id
            )) }),
            education.some((e) => e.institution) && /* @__PURE__ */ jsxRuntimeExports.jsx(ResumeSection, { title: "Education", children: education.filter((e) => e.institution).map((edu, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start justify-between gap-2",
                "data-ocid": `preview_page.education.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-foreground", children: [
                      edu.degree,
                      edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: edu.institution }),
                    edu.gpa && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "GPA: ",
                      edu.gpa
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs shrink-0", children: edu.graduationYear })
                ]
              },
              edu.id
            )) }),
            skills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ResumeSection, { title: "Skills", children: skillAnalysis ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-2",
                "data-ocid": "preview_page.skills_categorized",
                children: [
                  { label: "Technical", items: skillAnalysis.technical },
                  { label: "Soft Skills", items: skillAnalysis.softSkills },
                  { label: "Tools", items: skillAnalysis.tools }
                ].filter((g) => g.items.length > 0).map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-wrap items-center gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-primary shrink-0 mr-1", children: [
                        group.label,
                        ":"
                      ] }),
                      group.items.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-xs",
                          children: skill
                        },
                        skill
                      ))
                    ]
                  },
                  group.label
                ))
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-wrap gap-1.5",
                "data-ocid": "preview_page.skills_raw",
                children: skills.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: skill }, skill))
              }
            ) }),
            projects.some((p) => p.title) && /* @__PURE__ */ jsxRuntimeExports.jsx(ResumeSection, { title: "Projects", children: projects.filter((p) => p.title).map((proj, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "space-y-1",
                "data-ocid": `preview_page.project.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: proj.title }),
                    proj.technologies && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: proj.technologies })
                  ] }),
                  proj.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: proj.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: proj.bullets.filter((b) => b.trim()).map((b, bIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "text-xs text-foreground/90 flex gap-2 items-start",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5 shrink-0", children: "•" }),
                        b
                      ]
                    },
                    bIdx.toString()
                  )) })
                ]
              },
              proj.id
            )) }),
            certifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ResumeSection, { title: "Certifications", children: certifications.map((cert, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between gap-2",
                "data-ocid": `preview_page.cert.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: cert.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: cert.issuer })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs shrink-0", children: cert.year })
                ]
              },
              cert.id
            )) })
          ] })
        ]
      }
    )
  ] });
}
function ResumeSection({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm uppercase tracking-widest text-primary", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "flex-1" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children })
  ] });
}
function ContactItem({
  icon,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-primary-foreground/80", children: [
    icon,
    value
  ] });
}
export {
  PreviewPage as default
};
