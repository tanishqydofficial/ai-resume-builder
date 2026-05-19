import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
/**
 * PersonalInfoSection — form card for name, contact, summary, and photo.
 * Accepts optional `errors` prop for inline field-level validation messages.
 */
import { useResumeStore } from "@/context/ResumeContext";
import type { PersonalErrors } from "@/types/formErrors";
import { Camera, User, X } from "lucide-react";
import { useRef } from "react";

interface Props {
  errors?: PersonalErrors;
}

// ─── Photo upload sub-component ───────────────────────────────────────────────

function PhotoUpload({
  photoUrl,
  onPhotoChange,
}: {
  photoUrl?: string;
  onPhotoChange: (url: string | undefined) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") onPhotoChange(result);
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  }

  function handleRemove() {
    onPhotoChange(undefined);
  }

  return (
    <div className="flex items-center gap-4">
      {/* Preview thumbnail or placeholder */}
      <div
        className="w-16 h-16 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0"
        data-ocid="personal_info_section.photo_preview"
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <Camera className="w-6 h-6 text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          data-ocid="personal_info_section.photo_input"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          data-ocid="personal_info_section.photo_upload_button"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
          {photoUrl ? "Change Photo" : "Upload Photo"}
        </button>
        {photoUrl && (
          <button
            type="button"
            onClick={handleRemove}
            data-ocid="personal_info_section.photo_remove_button"
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors"
            aria-label="Remove photo"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>
    </div>
  );
}

export function PersonalInfoSection({ errors = {} }: Props) {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const p = resumeData.personalInfo;

  return (
    <section
      className="bg-card border border-border rounded-xl p-6 space-y-5"
      data-ocid="personal_info_section"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="section-heading">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="e.g. Priya Sharma"
            value={p.fullName}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            data-ocid="personal_info_section.fullname_input"
            className={
              errors.fullName
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.fullName && (
            <p
              className="text-xs text-destructive"
              data-ocid="personal_info_section.fullname_field_error"
            >
              {errors.fullName}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={p.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            data-ocid="personal_info_section.email_input"
            className={
              errors.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.email && (
            <p
              className="text-xs text-destructive"
              data-ocid="personal_info_section.email_field_error"
            >
              {errors.email}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 9876543210"
            value={p.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            data-ocid="personal_info_section.phone_input"
            className={
              errors.phone
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.phone && (
            <p
              className="text-xs text-destructive"
              data-ocid="personal_info_section.phone_field_error"
            >
              {errors.phone}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Bangalore, India"
            value={p.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            data-ocid="personal_info_section.location_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/yourprofile"
            value={p.linkedIn}
            onChange={(e) => updatePersonalInfo({ linkedIn: e.target.value })}
            data-ocid="personal_info_section.linkedin_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            placeholder="github.com/yourusername"
            value={p.github}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            data-ocid="personal_info_section.github_input"
          />
        </div>
        {/* Profile Photo upload */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label>Profile Photo (optional)</Label>
          <PhotoUpload
            photoUrl={p.photoUrl}
            onPhotoChange={(url) => updatePersonalInfo({ photoUrl: url })}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            rows={3}
            placeholder="A concise overview of your skills, experience, and career goals..."
            value={p.summary}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            data-ocid="personal_info_section.summary_textarea"
            className="resize-none"
          />
        </div>
      </div>
    </section>
  );
}
