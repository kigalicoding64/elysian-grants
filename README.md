# ElScholarship Hub

Act as a Senior Lead Architect and Full-Stack SaaS Developer. Build a complete, production-ready web platform for "ElScholarship"—a global scholarship platform that provides verified scholarship listings and managed application (concierge) services. 

Build the frontend with React, Tailwind CSS, TypeScript, and Lucide React icons, and integrate Supabase as the backend for Authentication, Database, and File Storage.

---

### 1. PLATFORM ARCHITECTURE & DESIGN SYSTEM

- Theme & Palette: Professional, trustworthy global education aesthetic. Primary Emerald Green (`#059669`), Deep Navy Slate (`#0f172a`), Light Gray background (`#f8fafc`).

- Navigation Header: Logo ("ElScholarship"), Nav Links (Find Scholarships, Managed Concierge, How It Works), User Auth Buttons (Log In / Register), and a prominent "Admin Portal" view toggle button.

- User Roles:

  1. Student / Public User: Browse directory, save opportunities, apply directly via official links, or submit internal managed applications.

  2. Platform Admin / Officer: Publish/manage scholarship listings and review/submit applicant files in the concierge pipeline.

---

### 2. PUBLIC USER INTERFACE

#### A. Homepage & Dynamic Directory (`/`)

- Hero Banner: Headline: "Find & Apply for Fully Funded Scholarships Worldwide". Subtitle: "Explore 100% verified grants, tuition waivers, and managed application services."

- Live Search & Filter Bar:

  - Search Input (keyword search title/university).

  - Degree Level Filter: Undergraduate, Master's, PhD.

  - Funding Type Filter: Fully Funded, Partially Funded / Government Sponsored.

  - Region Filter: Global, Rwanda, Europe, UK, Canada.

- Scholarship Card Grid: Each card displays Title, University/Host, Country, Degree Badge, Deadline Countdown Badge, Coverage Tags, and two action buttons:

  - "Apply Officially" (Opens external URL in new tab).

  - "Apply via ElScholarship" (Opens Internal Concierge Modal).

#### B. Managed Application Modal (`/apply/[id]`)

- Multi-step application submission for students paying for or using ElScholarship's managed concierge service:

  - Step 1: Applicant Profile & Contact (Name, Email, Phone/WhatsApp).

  - Step 2: Document Vault Uploads (Transcripts, SOP, Passport/ID, English Test Scores).

  - Step 3: Confirmation. Generates a new application record in the DB set to state `DOC_REVIEW`.

#### C. Student Dashboard (`/dashboard`)

- My Applications Tracker: Table/Card view listing active applications, scholarship name, application type (Direct vs. Managed), submission target deadline, and real-time state badge (`DOC_REVIEW`, `PREP_IN_PROGRESS`, `SUBMITTED`, `ACCEPTED`).

- My Documents Vault: View and update reusable document assets.

---

### 3. ADMIN PORTAL (`/admin`)

#### A. Executive Dashboard (`/admin`)

- KPI Summary Cards: Total Active Scholarships, Pending Managed Apps Queue, Deadlines Ending Soon (< 7 Days), Total Submitted Apps.

- Quick Actions: "+ Add New Scholarship".

#### B. Scholarship CMS (`/admin/scholarships`)

- Listing Table: Manage all published and draft scholarships with search, filter, and delete actions.

- Add/Edit Scholarship Drawer/Modal: Form fields for Title, Host Institution, Country, Degree Levels (multi-select), Funding Type ('Full' or 'Partial'), Coverage Details (Tuition, Stipend, Airfare, Laptop), Official External Link, Deadline Date, and Status ('published' or 'draft').

#### C. Concierge Pipeline Workspace (`/admin/applications`)

- Kanban Board View with 5 Columns:

  1. New Received (`DOC_REVIEW`)

  2. Documents Approved (`DOC_APPROVED`)

  3. Submission Prep (`PREP_IN_PROGRESS`)

  4. Submitted to University (`SUBMITTED`)

  5. Final Decision (`ACCEPTED` / `REJECTED`)

- Interactive Application Detail Slide-Over (Opens when clicking any applicant card):

  - View applicant contact details & uploaded PDF files side-by-side with document approval buttons (`Approve`, `Flag Revision`).

  - Pipeline Status Selector: Upgrade application stage.

  - Official Verification Form: Input `Official Application ID / Portal Reference Number` and upload `Submission Receipt PDF` to send proof to the student's dashboard.

---

### 4. SUPABASE DATABASE SCHEMA SETUP

Automatically configure Supabase tables and client with appropriate RLS policies:

1. `profiles`: `id` (auth.users UUID), `full_name`, `email`, `role` ('student' or 'admin'), `created_at`.

2. `scholarships`: `id`, `title`, `university`, `country`, `degree_levels` (text array), `funding_type` ('full' or 'partial'), `coverage_details` (text), `official_link` (text), `deadline` (date), `status` ('published' or 'draft'), `created_at`.

3. `applications`: `id`, `user_id` (fk), `scholarship_id` (fk), `status` ('DOC_REVIEW', 'PREP_IN_PROGRESS', 'SUBMITTED', 'ACCEPTED', 'REJECTED'), `official_app_id` (text), `proof_url` (text), `created_at`.

4. `documents`: `id`, `user_id` (fk), `application_id` (fk), `file_name` (text), `file_type` (text), `file_url` (text), `status` ('pending', 'approved', 'revision_required').

---

### 5. SEED DATA (INITIAL PUBLISHED SCHOLARSHIPS)

Populate the database with the following 4 complete, realistic scholarship entries so the platform is ready for use immediately:

1. Title: "Erasmus Mundus MARIHE Master Scholarship 2027"

   - Host Institution: Consortium of 7 Universities (Austria, Finland, Germany, Hungary, Portugal, China, India)

   - Country: Global / Multi-Country Europe & Asia

   - Degree Levels: ["Master's"]

   - Funding Type: "full"

   - Coverage Details: "100% Tuition waiver, €1,400 monthly living stipend, full airfare travel allowance, and comprehensive health insurance."

   - Official Link: "https://www.marihe.eu/"

   - Deadline: "2026-12-01"

   - Status: "published"

2. Title: "Ministry of Health (MoH) Nursing & Midwifery Scholarships"

   - Host Institution: Kibogora Polytechnic (KP)

   - Country: Rwanda

   - Degree Levels: ["Undergraduate"]

   - Funding Type: "partial"

   - Coverage Details: "Government-sponsored tuition funding under the Rwanda Ministry of Health 4x4 Healthcare Workforce Development Strategy."

   - Official Link: "https://kp.ac.rw/"

   - Deadline: "2026-09-15"

   - Status: "published"

3. Title: "Ministry of Health 54 Sponsored Health Scholarships"

   - Host Institution: Adventist University of Central Africa (AUCA)

   - Country: Rwanda

   - Degree Levels: ["Undergraduate"]

   - Funding Type: "full"

   - Coverage Details: "54 Full tuition scholarships (36 for Midwifery, 18 for Nursing) funded directly by the Ministry of Health."

   - Official Link: "https://auca.ac.rw/"

   - Deadline: "2026-09-15"

   - Status: "published"

4. Title: "ALU Full Mastercard Foundation & Mandela Scholarships 2027"

   - Host Institution: African Leadership University (ALU)

   - Country: Rwanda

   - Degree Levels: ["Undergraduate"]

   - Funding Type: "full"

   - Coverage Details: "Full tuition coverage, monthly living stipend, laptop computer, flight tickets, and leadership mentorship (Mastercard Track) OR $3,000-$4,000/yr tuition grant (Mandela Track)."

   - Official Link: "https://www.alueducation.com/apply-now/"

   - Deadline: "2026-11-30"

   - Status: "published"

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f120fd10-df2b-4aca-a538-26115508500c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
