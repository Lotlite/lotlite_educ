# Lotlite ATS — Wireframes & UI Specifications

**Version:** 1.0  
**Date:** 2026-05-28  
**Status:** Living Document — add new screen wireframes as features are planned  
**Format:** ASCII wireframes + layout notes. Each screen maps to a PRD section.

---

## How to Read These Wireframes

```
[ button ]         = clickable button
[ input     ]      = text input field
[v dropdown]       = dropdown selector
|  ...  |          = table row
░░░░░░░░░░         = active/highlighted element
┌─────────┐
│         │        = panel or card
└─────────┘
← →                = navigation flow
```

---

## Screen Map

```
┌─────────────────────────────────────────────────────┐
│                    LOTLITE ATS                      │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Jobs    │  │Dashboard │  │   Candidates     │  │
│  │  List    │→ │(per job) │→ │   View+Pipeline  │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│       │                              │              │
│       ↓                              ↓              │
│  ┌──────────┐              ┌──────────────────┐     │
│  │  Create  │              │  Candidate       │     │
│  │  Job     │              │  Detail Drawer   │     │
│  └──────────┘              └──────────────────┘     │
│                                      │              │
│                                      ↓              │
│                            ┌──────────────────┐     │
│                            │  Email Send &    │     │
│                            │  Stage Move      │     │
│                            └──────────────────┘     │
└─────────────────────────────────────────────────────┘
```

---

## WF-00 — Global App Shell (Current + Extended)

```
┌──────────────────────────────────────────────────────────────────────┐
│  ◆ Lotlite                                          Rahul ▾  ⚙️      │
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│ ▶ Jobs   │          MAIN CONTENT AREA                               │
│   · All  │                                                           │
│   · Active                                                          │
│   · Closed                                                          │
│          │                                                           │
│ ─────── │                                                           │
│ Dashboard│                                                           │
│ Candidates                                                          │
│ Analytics│                                                           │
│ Settings │                                                           │
│          │                                                           │
└──────────┴───────────────────────────────────────────────────────────┘
```

**Notes:**
- Sidebar collapses to icon-only on smaller viewports
- Jobs section is expandable; shows live count badges (e.g. "Active 3")
- Settings links to job config, email templates, scoring weights

---

## WF-01 — Jobs List  *(new — PRD §4.2)*

```
┌──────────────────────────────────────────────────────────────────────┐
│  Jobs                                              [ + New Job ]     │
│                                                                      │
│  [ Search jobs...      ]   [v Status: All]   [v Dept: All]          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  JOB TITLE          DEPT       STATUS     CANDIDATES  ACTIONS  │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  Frontend Engineer  Eng      ░ Active ░    47 / 12 ✓  ···      │  │
│  │  Product Designer   Design     Active      23 / 5 ✓   ···      │  │
│  │  Backend Engineer   Eng        Draft        0          ···      │  │
│  │  Data Analyst       Analytics  Closed      89 / 31 ✓  ···      │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  "47 / 12 ✓" = 47 screened / 12 shortlisted                        │
│  ··· context menu: View · Edit · Duplicate · Archive · Delete       │
└──────────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Click row → goes to that job's Dashboard (WF-02)
- `+ New Job` → opens Create Job modal (WF-01a)
- Status badge color: Active=green, Draft=gray, Paused=yellow, Closed=red

---

## WF-01a — Create / Edit Job Modal  *(new — PRD §4.2)*

```
┌────────────────────────────────────────────────────────┐
│  New Job Position                              [  ✕  ] │
│ ─────────────────────────────────────────────────────  │
│  Job Title       [ Frontend Engineer           ]       │
│  Department      [v Engineering              ]         │
│  Location        [ Remote / Hybrid / On-site  ]       │
│  Type            [v Full-time               ]          │
│                                                        │
│  Job Description                                       │
│  ┌────────────────────────────────────────────────┐    │
│  │ We are looking for a Frontend Engineer to...   │    │
│  │                                                │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
│  Required Skills   [ React ] [ TypeScript ] [ + ]     │
│  Preferred Skills  [ GraphQL ] [ + ]                  │
│                                                        │
│  ATS Threshold   [────●────────────────] 70%           │
│                                                        │
│  Scoring Weights                                       │
│  Skills 20%  Experience 20%  Projects 20%             │
│  Education 20%  Certs 20%    Total: 100% ✓            │
│                                                        │
│  Apply Page Slug  [ /apply/frontend-engineer     ]     │
│                                                        │
│              [ Save as Draft ]  [ Activate ]           │
└────────────────────────────────────────────────────────┘
```

**Notes:**
- Slug auto-generated from title, editable
- "Activate" publishes Apply page and enables resume submission
- Weights validated in real-time; error shown if total ≠ 100%

---

## WF-02 — Job Dashboard (per-job context)  *(current, extended)*

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Jobs  /  Frontend Engineer                    ░ Active ░  [Edit] │
│                                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │ Screened   │  │ Shortlisted│  │ In Pipeline│  │  Hired     │     │
│  │    47      │  │    12      │  │     8      │  │     2      │     │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘     │
│                                                                      │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐  │
│  │  UPLOAD RESUMES             │  │  TOP CANDIDATES              │  │
│  │                             │  │                              │  │
│  │  ┌────────────────────────┐ │  │  1. Jane Doe      95% ████  │  │
│  │  │  Drop PDFs / DOCX here │ │  │  2. John Smith    88% ███   │  │
│  │  │     or [ Browse ]      │ │  │  3. Alice K.      82% ███   │  │
│  │  └────────────────────────┘ │  │  4. Bob M.        76% ██    │  │
│  │  [ Upload & Screen ]        │  │                              │  │
│  │                             │  │  [ View All Candidates → ]   │  │
│  └─────────────────────────────┘  └──────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  MISSING SKILLS (top 5)                                        │ │
│  │  GraphQL ████████ 28   AWS ██████ 19   Docker █████ 15        │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Apply Page:  lotlite.app/apply/frontend-engineer  [ Copy Link ]    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## WF-03 — Candidates View with Filters & Pipeline Stage  *(extended — PRD §4.3 + §4.4)*

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Jobs  /  Frontend Engineer  /  Candidates                        │
│                                                                      │
│  [ 🔍 Search name, email...       ]  [v Stage ▾] [v Score ▾]       │
│  [v Recommendation ▾]  [v Email Status ▾]  [ Clear Filters ]  2 ✕  │
│                                                                      │
│  [ List View ]  [ Kanban View ]          [ Send Shortlist Emails ]  │
│                                          [ Export CSV ]             │
│ ─────────────────────────────────────────────────────────────────── │
│  ☐  NAME           SCORE   TIER          STAGE        EMAIL   ···   │
│ ─────────────────────────────────────────────────────────────────── │
│  ☑  Jane Doe        95%   ░Strong░      Shortlisted   Sent    ···   │
│  ☑  John Smith      88%   ░Strong░      Phone Screen  Sent    ···   │
│  ☐  Alice K.        82%    Good         Shortlisted   Pending ···   │
│  ☐  Bob M.          76%    Good         Screened      —       ···   │
│  ☐  Carol T.        61%    Potential    Screened      —       ···   │
│  ☐  Dave L.         44%    ✗ No Match   Rejected      —       ···   │
│ ─────────────────────────────────────────────────────────────────── │
│  Showing 6 of 47   [ ← ] 1 2 3 [ → ]   Bulk: [ Move Stage ▾ ]     │
└──────────────────────────────────────────────────────────────────────┘
```

**Filter Sidebar (slides in on filter icon click):**
```
┌────────────────────────────────┐
│  Filters                  [✕]  │
│ ─────────────────────────────  │
│  ATS Score                     │
│  [──●──────────────────] 70+   │
│                                │
│  Recommendation                │
│  ☑ Strong Match                │
│  ☑ Good Match                  │
│  ☐ Potential Match             │
│  ☐ Not Recommended             │
│                                │
│  Pipeline Stage                │
│  ☑ Screened  ☑ Shortlisted    │
│  ☑ Phone Screen  ☐ Technical  │
│  ☐ Final  ☐ Offer  ☐ Hired   │
│                                │
│  Email Status                  │
│  ☐ Sent  ☑ Pending  ☐ Failed  │
│                                │
│  Applied Between               │
│  [ 2026-05-01 ] → [ today ]    │
│                                │
│  Missing Skills                │
│  [ React ] [ + ]               │
│                                │
│  [ Apply Filters ]             │
│  [ Save Preset...  ]           │
└────────────────────────────────┘
```

---

## WF-04 — Candidate Detail Drawer  *(extended — PRD §4.1, §4.4)*

```
┌──────────────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░ Candidates Table (dimmed) ░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                    ┌──────────────────────────────┐  │
│                                    │  Jane Doe               [✕]  │  │
│                                    │  jane@email.com  · +91-...   │  │
│                                    │                              │  │
│                                    │  ATS Score   ░░ 95% ░░░░░░   │  │
│                                    │  Tier        Strong Match    │  │
│                                    │                              │  │
│                                    │  ── PIPELINE STAGE ──────── │  │
│                                    │  Screened → ░Shortlisted░ →  │  │
│                                    │  Phone → Technical → Final   │  │
│                                    │  [ ← Back ] [ → Next Stage ] │  │
│                                    │                              │  │
│                                    │  ── ANALYSIS ────────────── │  │
│                                    │  Strong fit for React role.  │  │
│                                    │  5 yrs exp, OSS contributor. │  │
│                                    │                              │  │
│                                    │  ✓ React, TypeScript, CI/CD  │  │
│                                    │  ✗ Missing: GraphQL, AWS     │  │
│                                    │                              │  │
│                                    │  ── NOTES ───────────────── │  │
│                                    │  [ Add a note...           ] │  │
│                                    │  May 27 — "Great portfolio"  │  │
│                                    │  May 28 — "Scheduled call"   │  │
│                                    │                              │  │
│                                    │  ── EMAIL ───────────────── │  │
│                                    │  Status: Sent (May 27 3pm)   │  │
│                                    │  [ Resend Email ]            │  │
│                                    │                              │  │
│                                    │  [ View Resume ↗ ]           │  │
│                                    │  [ Reject ]  [ Move Stage → ]│  │
│                                    └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## WF-05 — Kanban Pipeline Board  *(new — PRD §4.4)*

```
┌──────────────────────────────────────────────────────────────────────┐
│  Frontend Engineer — Pipeline Board          [ List View ]          │
│                                                                      │
│  SCREENED (35)   SHORTLISTED (12)  PHONE (5)  TECHNICAL (3)  FINAL │
│  ┌───────────┐   ┌───────────┐    ┌─────────┐  ┌─────────┐  ┌────┐ │
│  │ Carol T.  │   │░Jane Doe░ │    │John S.  │  │Alice K. │  │Bob │ │
│  │   61%     │   │  95%      │    │  88%    │  │  82%    │  │76% │ │
│  ├───────────┤   ├───────────┤    │ ─────── │  └─────────┘  └────┘ │
│  │ Dave L.   │   │ Alice K.  │    │Carol T. │                       │
│  │   44%     │   │  82%      │    │  61%    │                       │
│  ├───────────┤   ├───────────┤    └─────────┘                       │
│  │  + 33     │   │  + 10     │                                       │
│  └───────────┘   └───────────┘                                       │
│                                                                      │
│  Drag cards between columns to advance/revert stage                 │
└──────────────────────────────────────────────────────────────────────┘
```

---

## WF-06 — Email Template Configuration  *(new — PRD §4.1)*

```
┌──────────────────────────────────────────────────────────────────────┐
│  Settings  /  Email Templates                                        │
│                                                                      │
│  Sender Name    [ Lotlite Hiring Team              ]                 │
│  Reply-To       [ hiring@yourcompany.com            ]                │
│                                                                      │
│  ── SHORTLIST EMAIL ────────────────────────────────────────────    │
│  Subject        [ You've been shortlisted for {{jobTitle}} ]        │
│                                                                      │
│  Body                                                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Hi {{candidateName}},                                          │  │
│  │                                                                │  │
│  │ Congratulations! After reviewing your application for          │  │
│  │ {{jobTitle}} at {{companyName}}, we'd like to move you         │  │
│  │ forward to the next stage.                                     │  │
│  │                                                                │  │
│  │ Next Steps: {{nextSteps}}                                      │  │
│  │                                                                │  │
│  │ Best regards,                                                  │  │
│  │ {{senderName}}                                                 │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Available variables:                                                │
│  {{candidateName}}  {{jobTitle}}  {{companyName}}                   │
│  {{nextSteps}}  {{senderName}}  {{atsScore}}                        │
│                                                                      │
│  [ Preview with Sample Data ]           [ Save Template ]           │
│                                                                      │
│  ── EMAIL PREVIEW ──────────────────────────────────────────────   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ To: jane@email.com                                             │  │
│  │ Subject: You've been shortlisted for Frontend Engineer         │  │
│  │ ─────────────────────────────────────────────────────          │  │
│  │ Hi Jane Doe,                                                   │  │
│  │                                                                │  │
│  │ Congratulations! After reviewing your application...           │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## WF-07 — Send Shortlist Emails Flow  *(new — PRD §4.1)*

```
Step 1: Click "Send Shortlist Emails" from Candidates view
                      │
                      ▼
┌───────────────────────────────────────────────────────┐
│  Send Shortlist Emails                          [✕]   │
│                                                       │
│  Threshold: 70+   Eligible: 12 candidates             │
│                                                       │
│  ☑ Jane Doe       95%   jane@email.com                │
│  ☑ John Smith     88%   john@email.com                │
│  ☑ Alice K.       82%   alice@email.com               │
│  ☐ Bob M.         76%   bob@email.com   (opt-out)     │
│  ... 8 more                                           │
│                                                       │
│  Template: Shortlist Email  [Change ▾]                │
│  Next Steps: [ We'll contact you for a phone call. ]  │
│                                                       │
│  [ Preview Email ]    [ Send to 11 Candidates ]       │
└───────────────────────────────────────────────────────┘

Step 2: Sending in progress
┌───────────────────────────────────────────────────────┐
│  Sending emails...                                    │
│  ████████████░░░░░░░  8 / 11                          │
│  Jane Doe ✓  John Smith ✓  Alice K. ✓                │
│                                  [ Cancel remaining ] │
└───────────────────────────────────────────────────────┘

Step 3: Done
┌───────────────────────────────────────────────────────┐
│  Emails sent!                                         │
│  ✓ 10 delivered   ✗ 1 failed (bob@email.com)         │
│                                                       │
│  [ Retry Failed ]              [ Done ]               │
└───────────────────────────────────────────────────────┘
```

---

## WF-08 — Analytics (extended for pipeline stages)  *(extended — PRD §4.4)*

```
┌──────────────────────────────────────────────────────────────────────┐
│  Analytics  /  Frontend Engineer           [v This Month]           │
│                                                                      │
│  ── RECRUITMENT FUNNEL ─────────────────────────────────────────── │
│                                                                      │
│  Applied     ████████████████████████████████████  47  100%         │
│  Screened    ████████████████████████████████████  47  100%         │
│  Shortlisted ████████████████████████  12   26%                     │
│  Phone       ████████████  5    11%                                  │
│  Technical   ███████  3     6%                                       │
│  Final       ████  2     4%                                          │
│  Hired       ██  2     4%                                            │
│                                                                      │
│  Drop-off: Screened→Shortlisted 74%  ⚠️  (review threshold?)        │
│                                                                      │
│  ── MISSING SKILLS (top missing across all shortlisted) ─────────  │
│  GraphQL    ██████████████████  28                                   │
│  AWS        ██████████████  19                                       │
│  Docker     ████████████  15                                         │
│  Terraform  ████████  10                                             │
│                                                                      │
│  ── EMAIL STATS ──────────────────────────────────────────────────  │
│  Sent: 10   Pending: 2   Failed: 1   Bounce rate: 0%                │
│                                                                      │
│  ── ACROSS ALL JOBS ──────────────────────────────────────────────  │
│  [ View aggregate analytics → ]                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Appendix A — Component Inventory

| Component | Used In | Status |
|---|---|---|
| Candidate Table Row | WF-03 | Existing |
| Candidate Detail Drawer | WF-04 | Existing, extend with stage + email |
| Resume Upload Dropzone | WF-02 | Existing |
| Score Bar | WF-02, WF-03 | Existing |
| Analytics Funnel | WF-08 | Existing, extend with stage rows |
| Job Card / Row | WF-01 | New |
| Job Create Modal | WF-01a | New |
| Filter Sidebar | WF-03 | New |
| Pipeline Stage Bar | WF-04 | New |
| Kanban Board | WF-05 | New |
| Email Template Editor | WF-06 | New |
| Send Email Modal | WF-07 | New |

---

## Appendix B — Navigation Flow

```
Jobs List (WF-01)
  └─ Create Job (WF-01a)
  └─ Job Dashboard (WF-02)
        └─ Candidates List View (WF-03)
              └─ Filter Sidebar
              └─ Candidate Drawer (WF-04)
                    └─ Stage Move
                    └─ Resend Email
              └─ Send Shortlist Emails (WF-07)
        └─ Kanban Board (WF-05)
              └─ Candidate Drawer (WF-04)
        └─ Analytics (WF-08)

Settings
  └─ Email Templates (WF-06)
  └─ Scoring Defaults
  └─ Team Members (future)
```

---

## Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-05-28 | Rahul | Initial wireframes — v1 shell + v2 screens for jobs, filters, pipeline, emails |

---

*To add a new screen: create a new WF-XX section, add it to Screen Map, Appendix A components, and Appendix B navigation flow.*
