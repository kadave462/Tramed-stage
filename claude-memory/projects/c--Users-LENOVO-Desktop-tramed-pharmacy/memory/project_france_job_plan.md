---
name: project-france-job-plan
description: "User is applying for jobs in France (has titre de séjour), wants Tramed project to serve as portfolio — agreed plan to tackle GitHub + dashboard + tests"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9fd8983a-51cc-4f09-9f0a-0b14afb00756
---

User has a valid titre de séjour and wants to apply for tech jobs (QA engineer target) in France. The Tramed project is their main portfolio piece.

**Agreed three-track plan (in order):**
1. **GitHub setup** — push the project to GitHub; biggest impact on employability; do first
2. **Connect dashboard to real data** — dashboard currently uses hardcoded CSV in index.html; needs to fetch from `/api/sales` instead; the flagship feature
3. **Write one API test** — at least one test for the upload or sales endpoint; essential for QA roles

**Why:** French employers (especially for junior QA/dev roles) expect a GitHub profile, a real project with a README, and some testing evidence. The Tramed project covers all three once these tracks are done.

**How to apply:** When user is ready to resume, start with GitHub setup (check `git --version` first), then dashboard connection, then tests. Remind them of this plan if they come back asking about France job search.
