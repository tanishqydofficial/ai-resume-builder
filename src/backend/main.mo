// main.mo — composition root for the Resume Builder backend canister.
// Owns no business logic; delegates entirely to domain mixins.
import ResumeApi "mixins/resume-api";

actor {
  // Resume ML/AI domain: skill categorisation, ATS scoring, bullet enhancement
  include ResumeApi();
}
