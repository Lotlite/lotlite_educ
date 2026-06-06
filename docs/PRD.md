# Lotlite ATS — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-05-28  
**Status:** Living Document — append new features as sections at the bottom  

---

## 1. Product Overview

Lotlite is an AI-powered Applicant Tracking System (ATS) built for lean hiring teams. It eliminates manual resume screening by using GPT-4o-mini to score and rank candidates against a job description automatically, so recruiters spend time on people, not paperwork.

**Core promise:** Upload resumes → get a ranked shortlist → move top candidates forward — in minutes, not days.

---

## 2. Users

| Persona | Role | Primary Goal |
|---|---|---|
| Recruiter / HR | Screens resumes, manages pipeline | Fast shortlist with confidence |
| Hiring Manager | Reviews shortlisted candidates | See fit reasoning, not raw resumes |
| Candidate | Applies for a role | Seamless, respectful application experience |

---

## 3. Current Feature Set (v1.0 — Shipped)

### 3.1 Job Configuration
- Set job title, full job description, required skills, preferred skills
- Configure ATS score threshold (default 70%, range 30–95%)
- Adjust scoring weights across five dimensions: Skills, Experience, Projects, Education, Certifications (each 20% default, must sum to 100%)

### 3.2 Resume Ingestion
- Drag-and-drop or file-select upload (PDF, DOCX, max 10 MB per file)
- Bulk upload with parallel processing
- Resume stored in Supabase Storage; text extracted server-side

### 3.3 AI Screening
- GPT-4o-mini scores each resume 0–100 against the active job config
- Extracts: candidate name, email, phone, ATS score, match %, missing skills, recommendation tier, pros/cons summary
- Recommendation tiers: Strong Match / Good Match / Potential Match / Not Recommended

### 3.4 Candidate View
- Ranked table of all screened candidates with sort and filter
- Per-candidate drawer: full analysis summary, fit reasons, missing skills, resume link

### 3.5 Analytics
- Recruitment funnel: applied → screened → shortlisted → next round
- Missing skills frequency chart (identifies hiring bar mismatches)

### 3.6 Public Apply Page
- Candidates submit name, email, and resume via a shareable URL
- Submission triggers automatic AI screening

---

## 4. Planned Feature Set (v2.0 — Roadmap)

> Each section below represents a discrete, shippable feature. Add new features as new subsections under this chapter.

---

### 4.1 Shortlist Email Notifications

**Problem:** After scoring, recruiters must manually email shortlisted candidates. This is slow and inconsistent.

**Goal:** Automatically (or on-demand) send a personalized email to every candidate who crosses the shortlist threshold.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| EMAIL-01 | Admin can configure email sender name, subject template, and body template | Must |
| EMAIL-02 | Templates support variables: `{{candidateName}}`, `{{jobTitle}}`, `{{companyName}}`, `{{nextSteps}}` | Must |
| EMAIL-03 | Send triggered manually via "Send Shortlist Emails" button on Candidates view | Must |
| EMAIL-04 | Send can be triggered automatically when a candidate's score crosses the threshold | Should |
| EMAIL-05 | Preview email before sending (rendered with real candidate data) | Should |
| EMAIL-06 | Email status tracked per candidate: Pending / Sent / Failed / Bounced | Must |
| EMAIL-07 | Sent timestamp recorded and visible in candidate row | Must |
| EMAIL-08 | Bulk send with per-candidate opt-out | Should |
| EMAIL-09 | Re-send capability for failed emails | Should |
| EMAIL-10 | Integration with transactional email provider (SendGrid / Resend / Postmark) | Must |

#### Acceptance Criteria
- Recruiter clicks "Send Shortlist Emails" → all candidates above threshold receive an email within 60 seconds
- Email status column updates in real time
- No duplicate emails sent to the same candidate for the same job

---

### 4.2 Multiple Jobs Support

**Problem:** Current system supports only one active job config at a time. Growing teams manage 5–50 open roles simultaneously.

**Goal:** Allow creation and management of multiple job positions, each with its own candidate pool, scoring config, and pipeline.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| JOBS-01 | Create, read, update, archive, delete job positions | Must |
| JOBS-02 | Each job has: title, department, location, type (full-time/contract/etc.), description, required skills, preferred skills, weights, threshold | Must |
| JOBS-03 | Jobs list view with status: Draft / Active / Paused / Closed | Must |
| JOBS-04 | Candidates are scoped per job — no cross-contamination | Must |
| JOBS-05 | Global dashboard shows aggregate stats across all active jobs | Should |
| JOBS-06 | Copy / duplicate an existing job config to save setup time | Should |
| JOBS-07 | Each job gets its own shareable Apply page URL (e.g. `/apply/frontend-engineer`) | Must |
| JOBS-08 | Bulk resume upload scoped to the selected job | Must |
| JOBS-09 | Analytics broken down per job and also aggregated | Should |
| JOBS-10 | Job templates: save a config as a reusable template | Could |

#### Acceptance Criteria
- User can switch between jobs from the sidebar without data leaking between pools
- Archiving a job hides it from active views but retains all candidate data
- Each job's Apply URL is unique and routes applicants to the correct pipeline

---

### 4.3 Advanced Candidate Filtering

**Problem:** As candidate volumes grow (50–500 per job), the flat ranked list becomes hard to navigate.

**Goal:** Rich filtering and segmentation so recruiters surface the right candidates fast.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| FILTER-01 | Filter by ATS score range (e.g. 70–100) | Must |
| FILTER-02 | Filter by recommendation tier (Strong Match, Good Match, etc.) | Must |
| FILTER-03 | Filter by shortlist status: Shortlisted / Rejected / Pending / On Hold | Must |
| FILTER-04 | Filter by current pipeline stage | Must |
| FILTER-05 | Filter by missing skills (e.g. "show candidates missing only React") | Should |
| FILTER-06 | Filter by application date range | Should |
| FILTER-07 | Multi-select filter combinations (AND logic) | Must |
| FILTER-08 | Save filter presets (e.g. "Strong Matches This Week") | Should |
| FILTER-09 | Full-text search across candidate name, email, and summary | Must |
| FILTER-10 | Column-level sort: score, name, date, stage | Must |
| FILTER-11 | Export filtered results to CSV | Should |

#### Acceptance Criteria
- Filter panel always visible alongside the candidates table
- Applying filters does not navigate away; results update in-place
- Active filter count shown as a badge; clear-all resets instantly

---

### 4.4 Shortlist Tracking & Pipeline Stages

**Problem:** After the initial AI screen, candidates move through multiple human-driven rounds (phone screen, technical interview, final round, offer). There is no way to track which stage a candidate is at.

**Goal:** A lightweight pipeline board to move shortlisted candidates through rounds, log outcomes, and maintain a clear history.

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| STAGE-01 | Default pipeline stages: Screened → Shortlisted → Phone Screen → Technical → Final Round → Offer → Hired / Rejected | Must |
| STAGE-02 | Recruiter can rename, add, or remove stages per job | Should |
| STAGE-03 | Move candidate to next/previous stage with a single click or drag | Must |
| STAGE-04 | Stage history log per candidate: who moved them, when, and any notes | Must |
| STAGE-05 | Add free-text notes per candidate per stage | Must |
| STAGE-06 | Kanban board view (one column per stage) and list view (stage as a column) | Should |
| STAGE-07 | Stage-level email trigger: auto-send emails when candidate advances (e.g. schedule interview) | Should |
| STAGE-08 | Interviewer assignment: assign a team member to a stage for a candidate | Could |
| STAGE-09 | Calendar integration to schedule interviews from within the app | Could |
| STAGE-10 | Stage conversion metrics in Analytics (funnel drop-off per stage) | Should |
| STAGE-11 | Bulk stage-move: select multiple candidates → move to a stage | Should |

#### Acceptance Criteria
- Recruiter can move a candidate from Shortlisted → Phone Screen in ≤2 clicks
- Full audit log visible in candidate detail drawer
- Analytics funnel reflects real stage data, not just AI screen output

---

## 5. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Candidate list renders < 300ms for up to 500 rows |
| AI Latency | Analysis completes in < 30s per resume; timeout at 60s with graceful error |
| Uptime | 99.5% for backend API (Render deployment) |
| Security | No PII logged in server logs; resumes access-controlled via Supabase RLS |
| Privacy | Candidates notified their data is used for screening; data deletion on request |
| Accessibility | WCAG 2.1 AA for all recruiter-facing UI |
| Mobile | Responsive for tablet (candidates view); apply page fully mobile-optimised |

---

## 6. Out of Scope (v2.0)

- Video interview recording or analysis
- Offer letter generation or e-signature
- Payroll or HRIS integration
- Bias auditing / EEO reporting (tracked for v3.0)
- Native mobile app

---

## 7. Open Questions

| # | Question | Owner | Due |
|---|---|---|---|
| OQ-01 | Which email provider to use (SendGrid vs Resend)? | Engineering | TBD |
| OQ-02 | Should multiple jobs share a candidate pool (one person applies to two roles)? | Product | TBD |
| OQ-03 | Will pipeline stages be job-specific or global across the org? | Product | TBD |
| OQ-04 | Is there a multi-user / team login requirement for v2? | Product | TBD |

---

## 8. Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-05-28 | Rahul | Initial PRD — v1 feature inventory + v2 roadmap |

---

*To add a new feature: create a new numbered subsection under §4, fill the requirements table with IDs, priorities, and acceptance criteria, then update the revision history.*
