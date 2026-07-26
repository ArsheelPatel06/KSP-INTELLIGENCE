# Investigation Workflows

Role perspective: Senior Karnataka Police Investigation Officer and Product Designer

Reference documents:

- `docs/database/master_schema.md`
- `docs/database/knowledge_graph.md`
- `docs/database/relationship_matrix.md`

Purpose: define the investigation workflows for the KSP Intelligence OS before backend or frontend implementation. This document focuses only on police officer workflows, product behavior, AI assistance, outputs, and operational benefits. It does not discuss database design.

## Product Principle

The platform should feel like an investigation operating system, not a chatbot or static dashboard. Every workflow should help a police officer answer:

- What happened?
- Who is involved?
- Where did it happen?
- Has this happened before?
- Which laws may apply?
- What evidence is missing?
- What should I do next?
- Who needs to review or approve this?

Every AI response should be structured with:

- Summary
- Evidence
- Connections
- Insights
- Suggested leads
- Confidence
- Next action

## Core User Roles

| Role | Primary Responsibility |
|---|---|
| Station House Officer / SHO | Overall police station supervision, FIR approval, investigation oversight. |
| Sub-Inspector / Investigating Officer | FIR registration, investigation execution, evidence collection, case diary, chargesheet preparation. |
| Inspector / Circle Inspector | Case review, escalation, supervision, resource allocation. |
| ACP / DySP / Senior Officer | District or subdivision-level monitoring, sensitive case oversight. |
| Crime Analyst | Pattern discovery, hotspot analysis, forecasting, network intelligence. |
| Legal Officer / Prosecutor Support | Legal section validation, chargesheet support, court readiness. |
| Control Room / Operations Officer | Alert monitoring, hotspot response, patrol coordination. |
| System AI Assistant | Investigation support, recommendations, validation, similarity, network and legal reasoning. |

## Core Product Screens

| Screen | Purpose |
|---|---|
| Home / Attention Dashboard | Shows what needs attention today: critical alerts, new FIRs, high-risk cases, hotspots, pending reviews. |
| FIR Registration | Guided FIR entry and validation. |
| Case Detail | Complete investigation workspace for one case. |
| Case Timeline | Chronological investigation view: complaint, evidence, arrest, chargesheet, court events. |
| Persons Tab | Victims, accused, complainants, witnesses, associates. |
| Evidence Tab | Documents, weapons, vehicles, phones, financial records, forensic items. |
| Legal Recommendation Panel | Suggested legal sections with reasons, confidence, and references. |
| Similar Cases Panel | Similar FIRs and shared patterns. |
| Network Graph | Interactive relationship graph across cases, people, phones, vehicles, locations, money, gangs. |
| Criminal Profile | Intelligence profile of accused/repeat offender. |
| Victim Profile | Victim risk, demographics, prior victimization, support flags. |
| Crime Map | Karnataka map, heatmaps, hotspots, station filters, time filters. |
| Analytics Dashboard | Trends, district comparison, crime type analysis, station performance. |
| Forecasting Dashboard | Predicted crime trends and likely emerging hotspots. |
| Supervisor Review Queue | Pending approvals, AI warnings, delayed cases, chargesheet review. |
| Chargesheet Workspace | Evidence checklist, legal sections, accused/victim/witness readiness, court package. |
| AI Chat Investigation | Conversational investigation assistant with evidence panel. |
| Alerts and Tasks | AI alerts, assigned actions, due dates, closure notes. |

---

# 1. FIR Registration Workflow

## Goal

Allow an officer to register a complete, structured, investigation-ready FIR while capturing enough detail for legal reasoning, analytics, graph linking, and future AI assistance.

## Actors

- Duty Officer / Sub-Inspector
- SHO / Station House Officer
- Complainant
- AI Assistant

## Screens Used

- FIR Registration
- Legal Recommendation Panel
- Location Picker / Crime Scene Map
- Person Entry Panel
- Evidence Quick Capture
- Supervisor Review Queue

## Input

- Complaint narrative
- Complaint mode
- Complainant details
- Victim details, if known
- Accused details, if known
- Date and time of incident
- Place of offence
- Police station/unit
- Crime type or preliminary offence category
- Known vehicle, phone, weapon, property, or financial details
- Initial legal sections, if entered by officer

## Processing

1. Officer starts a new FIR.
2. Officer enters complaint details and incident narrative.
3. System guides officer through mandatory investigation fields:
   - incident date/time
   - location
   - complainant
   - victim
   - accused/suspect if known
   - offence category
   - property/evidence if applicable
4. Location is captured through map, text, or police beat/village selection.
5. Officer adds preliminary legal sections or requests AI suggestions.
6. FIR is saved as draft or submitted for SHO approval.

## AI Assistance

- Extracts crime indicators from narrative:
  - theft
  - trespass
  - assault
  - intimidation
  - cheating
  - cyber fraud
  - sexual offence
  - road accident
  - NDPS/POCSO/IT Act indicators
- Suggests missing fields.
- Detects inconsistent dates, missing location, missing victim count, or unclear accused role.
- Suggests possible act/section combinations.
- Warns if serious offence appears under-classified.
- Checks if phone, vehicle, location, accused name, or modus operandi resembles prior cases.
- Generates an FIR quality score before submission.

## Output

- Draft or registered FIR
- Structured case summary
- Preliminary legal recommendations
- Missing information warnings
- Initial risk level
- Initial investigation checklist
- Similar case alert if found

## Benefits

- Reduces incomplete FIRs.
- Helps junior officers capture legally relevant facts.
- Improves investigation readiness from day one.
- Creates structured data for intelligence analysis.
- Reduces later corrections and supervisory rework.

---

# 2. AI-Assisted FIR Validation Workflow

## Goal

Validate whether the FIR narrative, legal sections, people, location, and evidence are consistent and complete before or after registration.

## Actors

- Investigating Officer
- SHO
- Legal Officer
- AI Assistant

## Screens Used

- FIR Registration
- Case Detail
- AI Validation Panel
- Legal Recommendation Panel
- Supervisor Review Queue

## Input

- FIR narrative
- Entered legal sections
- Crime head/category
- Victim and accused details
- Location and time
- Evidence/property/vehicle/phone details
- Complaint mode

## Processing

1. Officer clicks `Validate FIR`.
2. System reads the FIR narrative and structured fields.
3. AI compares facts against offence ingredients and expected legal requirements.
4. System checks for missing investigation-critical fields.
5. Validation result is shown as warnings, suggestions, and confidence ratings.
6. Officer accepts, rejects, or marks each suggestion for supervisor/legal review.

## AI Assistance

- Identifies possible missing legal sections.
- Detects mismatch between crime category and narrative.
- Highlights missing victim, location, time, property value, weapon, or digital/payment detail.
- Suggests whether cyber, POCSO, NDPS, IT Act, Motor Vehicle Act, or special law review is needed.
- Explains each recommendation using plain language:
  - supporting words from FIR
  - relevant legal concept
  - confidence level
  - similar past FIRs
- Flags low-confidence recommendations for human review.

## Output

- FIR validation report
- Missing information checklist
- Suggested legal sections
- Accepted/rejected AI suggestions
- Review trail for supervisor

## Benefits

- Improves legal accuracy.
- Builds trust because AI explains every suggestion.
- Prevents weak FIR drafting.
- Creates early detection of under-classified serious offences.
- Supports training of officers without replacing officer judgment.

---

# 3. Case Assignment Workflow

## Goal

Assign cases to appropriate officers based on jurisdiction, workload, rank, expertise, crime type, risk level, and supervisory priorities.

## Actors

- SHO
- Inspector / Circle Inspector
- Investigating Officer
- AI Assistant

## Screens Used

- Home / Attention Dashboard
- Case Assignment Screen
- Officer Workload View
- Case Detail
- Alerts and Tasks

## Input

- Newly registered case
- Crime type
- Location and station jurisdiction
- Case gravity
- Risk score
- Officer availability
- Officer workload
- Specialist requirement, if any

## Processing

1. New case enters assignment queue.
2. SHO reviews crime type, location, and seriousness.
3. System displays eligible officers.
4. AI highlights workload, case complexity, and specialist needs.
5. SHO assigns IO and optional supporting officers.
6. Assignment creates initial investigation tasks.

## AI Assistance

- Recommends suitable officer based on:
  - jurisdiction
  - current workload
  - prior experience with similar cases
  - pending high-risk tasks
  - crime category specialization
- Warns if officer has excessive pending cases.
- Suggests escalation for heinous, cyber, organized, financial, or sensitive cases.
- Creates first 24-hour investigation checklist.

## Output

- Assigned investigating officer
- Assignment reason
- Initial tasks
- Due dates
- Supervisor visibility

## Benefits

- Better workload distribution.
- Faster assignment of serious cases.
- Reduces manual tracking burden on SHO.
- Creates accountability from the start.

---

# 4. Investigation Timeline Workflow

## Goal

Provide a chronological view of the investigation so officers and supervisors can understand progress, delays, evidence collection, arrests, chargesheet preparation, and court events.

## Actors

- Investigating Officer
- SHO
- Supervisor
- Legal Officer
- AI Assistant

## Screens Used

- Case Detail
- Case Timeline
- Case Diary
- Evidence Tab
- Arrest/Custody Panel
- Court Proceedings Panel
- Chargesheet Workspace

## Input

- FIR registration date
- Incident date/time
- Case diary entries
- Evidence collection events
- Arrest/surrender events
- Forensic requests and reports
- Witness statements
- Court proceedings
- Chargesheet events
- AI-generated tasks and alerts

## Processing

1. Officer opens case timeline.
2. System displays all events in chronological order.
3. Officer adds investigation notes, evidence events, witness statements, arrests, forensic updates, or court updates.
4. AI identifies missing chronological steps or long inactivity gaps.
5. Supervisor reviews timeline for delay, action quality, and next steps.

## AI Assistance

- Summarizes case progress.
- Detects investigation delays.
- Highlights pending forensic reports, missing witness statements, pending arrests, or overdue tasks.
- Generates automatic timeline:
  - complaint filed
  - FIR registered
  - evidence collected
  - accused identified
  - arrest/surrender
  - forensic report
  - chargesheet
  - court events
- Suggests next action based on stage.

## Output

- Complete investigation timeline
- Pending action list
- Delay warnings
- Supervisor-ready progress summary
- Court/chargesheet readiness indicator

## Benefits

- Makes case progress visible.
- Helps supervisors quickly understand investigation status.
- Reduces missed deadlines.
- Supports court preparation and internal review.

---

# 5. Similar Case Discovery Workflow

## Goal

Find prior cases that resemble the current case by crime type, legal sections, location, modus operandi, accused, phone, vehicle, financial account, property, weapon, or narrative pattern.

## Actors

- Investigating Officer
- Crime Analyst
- Supervisor
- AI Assistant

## Screens Used

- Case Detail
- Similar Cases Panel
- Network Graph
- AI Chat Investigation
- Criminal Profile
- Crime Map

## Input

- Current case narrative
- Crime head and sub-head
- Legal sections
- Modus operandi
- Location
- Time pattern
- Accused/suspect details
- Vehicle/phone/account/evidence details

## Processing

1. Officer opens `Find Similar Cases`.
2. System compares the current case against prior FIRs and investigation records.
3. Similarity is calculated across multiple dimensions:
   - text/narrative
   - legal sections
   - crime type
   - location
   - time
   - MO
   - people
   - vehicle/phone/account/evidence links
4. Results are ranked by similarity score.
5. Officer opens any matched case to compare details.

## AI Assistance

- Explains why each case is similar.
- Groups similarity reasons:
  - same location pattern
  - same night-time house entry
  - same suspect vehicle
  - same digital identifier
  - same legal sections
  - same property type
  - same modus operandi
- Highlights solved cases, chargesheeted cases, or convicted cases as priority references.
- Suggests useful leads from similar cases.

## Output

- Ranked list of similar cases
- Similarity score
- Reason features
- Related accused/offender profiles
- Related evidence, vehicle, phone, or location links
- Suggested investigative leads

## Benefits

- Helps officers avoid treating connected crimes as isolated incidents.
- Supports serial crime detection.
- Reuses learning from solved cases.
- Speeds up suspect identification.

---

# 6. Criminal Network Analysis Workflow

## Goal

Reveal hidden links between accused persons, repeat offenders, gangs, cases, vehicles, phones, locations, weapons, financial accounts, and organizations.

## Actors

- Investigating Officer
- Crime Analyst
- Intelligence Officer
- Supervisor
- AI Assistant

## Screens Used

- Network Graph
- Criminal Profile
- Case Detail
- Similar Cases Panel
- Crime Map
- AI Chat Investigation

## Input

- Accused profile
- Case ID
- Phone/digital identifier
- Vehicle number/hash
- Financial account
- Address/location
- Gang/network name
- Modus operandi
- Evidence records

## Processing

1. User starts from a case, accused, phone, vehicle, or account.
2. System expands connected entities.
3. User applies filters:
   - time period
   - district
   - crime type
   - confidence level
   - relationship type
4. System visualizes network clusters.
5. Officer expands suspicious nodes.
6. AI summarizes important links and possible hidden associations.

## AI Assistance

- Detects connected components and clusters.
- Identifies bridge offenders linking multiple groups.
- Finds shared phones, vehicles, accounts, addresses, or co-accused relationships.
- Highlights high-centrality suspects or mule accounts.
- Suggests possible gang membership with confidence and evidence.
- Warns when relationship is AI-inferred and needs human verification.

## Output

- Interactive criminal network graph
- Key suspects
- Shared identifiers
- Connected cases
- Possible gang clusters
- Evidence-backed connection paths
- Suggested leads

## Benefits

- Enables intelligence-led policing.
- Detects organized crime patterns.
- Helps identify repeat offenders and associates.
- Supports joint investigation across police stations or districts.

---

# 7. Victim Analysis Workflow

## Goal

Understand victim profile, vulnerability, repeat victimization, victim-accused relationship, demographic patterns, and required support actions.

## Actors

- Investigating Officer
- Women/Child Protection Officer, where applicable
- Victim Support Officer
- Supervisor
- Crime Analyst
- AI Assistant

## Screens Used

- Victim Profile
- Case Detail
- Persons Tab
- Network Graph
- Analytics Dashboard
- AI Chat Investigation

## Input

- Victim demographics
- Case details
- Victim role
- Relationship to accused
- Crime type
- Location
- Prior cases, if any
- Protection or vulnerability indicators
- Demographic aggregate context

## Processing

1. Officer opens victim profile from case.
2. System displays personal role, case involvement, and vulnerability context.
3. AI checks whether the victim appears in other cases.
4. System highlights relationship to accused or other persons.
5. Officer records support needs or protection flags.
6. Supervisor reviews sensitive or high-risk victim cases.

## AI Assistance

- Detects repeat victimization.
- Identifies victim-accused relationship if available.
- Highlights risk factors:
  - child victim
  - elderly victim
  - woman victim in sensitive crime
  - vulnerable community context
  - repeated targeting
  - cyber fraud victim pattern
- Suggests victim support actions.
- Provides demographic context for analysts without making operational decisions based only on protected attributes.

## Output

- Victim profile summary
- Vulnerability indicators
- Repeat victimization alert
- Relationship insights
- Suggested support/protection actions
- Supervisor review flag if needed

## Benefits

- Improves victim-centered policing.
- Helps identify repeat targeting.
- Supports sensitive case handling.
- Prevents victim details from being buried inside FIR text.

---

# 8. Legal Recommendation Workflow

## Goal

Assist officers in identifying relevant legal sections based on FIR facts, crime category, evidence, victim details, accused behavior, and similar cases.

## Actors

- Investigating Officer
- SHO
- Legal Officer / Prosecutor Support
- AI Assistant

## Screens Used

- Legal Recommendation Panel
- FIR Registration
- Case Detail
- Similar Cases Panel
- AI Chat Investigation
- Chargesheet Workspace

## Input

- FIR narrative
- Crime type
- Victim/accused details
- Time and location facts
- Evidence and property details
- Officer-entered sections
- Similar cases
- Legal reference knowledge base

## Processing

1. Officer requests legal suggestions.
2. AI extracts offence ingredients from facts.
3. System searches legal references and past similar cases.
4. AI generates suggested sections with reasons and confidence.
5. Officer reviews and accepts, rejects, or sends for legal review.
6. Accepted suggestions become part of case review trail.

## AI Assistance

- Suggests possible IPC/BNS/IT Act/POCSO/NDPS/MV Act/special law sections.
- Explains why each section may apply.
- Shows supporting FIR phrases or evidence.
- Flags missing legal ingredients.
- Compares officer-selected sections with AI-suggested sections.
- Shows previous similar FIRs and their sections/outcomes where available.
- Provides confidence and human review requirement.

## Output

- Recommended legal sections
- Reasoning for each section
- Supporting keywords/facts
- Confidence score
- Related cases
- Legal review trail

## Benefits

- Improves legal consistency.
- Helps officers handle complex offences.
- Supports transparent AI because every suggestion has reasoning.
- Reduces undercharging or missed special-law sections.

---

# 9. Chargesheet Preparation Workflow

## Goal

Help the investigating officer prepare a complete, evidence-backed, legally consistent chargesheet or final report package.

## Actors

- Investigating Officer
- SHO
- Legal Officer / Prosecutor Support
- Court Liaison Officer
- AI Assistant

## Screens Used

- Chargesheet Workspace
- Case Detail
- Evidence Tab
- Legal Recommendation Panel
- Timeline
- Court Proceedings Panel
- Supervisor Review Queue

## Input

- FIR details
- Accused details
- Victim details
- Witness statements
- Evidence records
- Forensic reports
- Arrest/custody details
- Legal sections
- Case diary
- Court proceedings
- Similar solved cases

## Processing

1. Officer opens chargesheet workspace.
2. System displays completion checklist:
   - accused details
   - victim details
   - witness statements
   - evidence list
   - forensic reports
   - legal sections
   - arrest/custody details
   - timeline
   - pending tasks
3. AI checks for missing or weak elements.
4. Officer attaches documents and finalizes summary.
5. Legal officer or supervisor reviews.
6. Chargesheet package is marked ready or returned for correction.

## AI Assistance

- Generates case summary.
- Creates evidence-to-section mapping.
- Flags missing witness/evidence/forensic items.
- Checks whether legal sections match facts and evidence.
- Identifies contradiction between timeline and evidence dates.
- Suggests chargesheet structure.
- Provides court-readiness score.

## Output

- Chargesheet readiness report
- Evidence checklist
- Legal consistency report
- Timeline summary
- Pending correction list
- Supervisor/legal approval status

## Benefits

- Reduces incomplete chargesheets.
- Improves prosecution readiness.
- Helps officers organize evidence logically.
- Gives supervisors quick review visibility.

---

# 10. Supervisor Review Workflow

## Goal

Give supervisors a high-level and drill-down view of cases needing review, approval, escalation, correction, or resource support.

## Actors

- SHO
- Inspector / Circle Inspector
- ACP / DySP / Senior Officer
- AI Assistant

## Screens Used

- Supervisor Review Queue
- Home / Attention Dashboard
- Case Detail
- Case Timeline
- Alerts and Tasks
- Analytics Dashboard
- AI Chat Investigation

## Input

- Pending FIR approvals
- AI validation warnings
- High-risk cases
- Overdue tasks
- Investigation delays
- Chargesheet readiness reports
- Officer workload
- Hotspot alerts
- Legal recommendation review items

## Processing

1. Supervisor opens review queue.
2. System groups items by urgency:
   - critical case risk
   - pending FIR approval
   - AI legal warning
   - overdue investigation task
   - missing evidence
   - chargesheet review
   - hotspot alert
3. Supervisor opens each item, reviews context and AI explanation.
4. Supervisor approves, rejects, returns for correction, escalates, or assigns action.
5. System records decision and creates tasks if needed.

## AI Assistance

- Prioritizes cases needing attention today.
- Summarizes why a case is risky or delayed.
- Highlights officer workload imbalance.
- Detects repeated missing-field patterns by station/officer.
- Suggests escalation for organized crime, sensitive victim cases, repeat offender, or hotspot emergence.
- Produces supervisor briefing notes.

## Output

- Approved or returned FIRs
- Escalated cases
- Assigned follow-up tasks
- Review notes
- Supervisor dashboard updates
- Accountability trail

## Benefits

- Helps supervisors manage many cases quickly.
- Reduces missed critical issues.
- Creates consistent review discipline.
- Improves station-level accountability.

---

# 11. Crime Analytics Workflow

## Goal

Help officers and analysts understand current and historical crime patterns by district, station, crime type, time, victim profile, accused pattern, and case outcome.

## Actors

- Crime Analyst
- SHO
- District Officer
- Senior Command
- AI Assistant

## Screens Used

- Analytics Dashboard
- Crime Map
- Hotspot Monitoring
- District Comparison View
- AI Chat Investigation
- Report Briefing View

## Input

- FIR case records
- Monthly crime statistics
- Crime review reports
- District/unit information
- Crime heads and sub-heads
- Victim demographic statistics
- Road accident statistics
- Service/performance metrics

## Processing

1. User selects district, unit, crime type, and time period.
2. Dashboard displays trends, comparisons, and breakdowns.
3. Analyst drills into crime type, station, beat, or district.
4. AI identifies anomalies and explains possible causes using available evidence.
5. User exports or presents a briefing summary.

## AI Assistance

- Explains trend changes in plain language.
- Detects unusual increases or decreases.
- Compares current period with previous month/year.
- Identifies stations with high pendency or unusual patterns.
- Summarizes report sections into officer-friendly briefing notes.
- Suggests areas needing operational focus.

## Output

- Crime trend charts
- District and station comparison
- Crime category breakdown
- Victim demographic insights
- AI-generated briefing
- Anomaly alerts

## Benefits

- Converts raw crime statistics into operational intelligence.
- Helps command staff make resource decisions.
- Supports monthly crime review preparation.
- Reduces manual report reading.

---

# 12. Crime Forecasting Workflow

## Goal

Predict likely crime trends and emerging risk areas to support preventive policing, patrol planning, and resource allocation.

## Actors

- Crime Analyst
- District Officer
- SHO
- Control Room / Operations Officer
- AI Assistant

## Screens Used

- Forecasting Dashboard
- Crime Map
- Hotspot Monitoring
- Analytics Dashboard
- Alerts and Tasks

## Input

- Historical crime statistics
- FIR trends
- District/unit crime history
- Crime categories
- Time period
- Hotspot history
- Current month counts
- Prior year and prior month comparisons

## Processing

1. Analyst selects forecast scope:
   - district
   - unit
   - crime type
   - period
2. System generates predicted trend.
3. AI highlights high-risk crime categories and locations.
4. Forecast is translated into operational recommendations.
5. Tasks or alerts are created for patrol/resource planning.

## AI Assistance

- Predicts expected crime volume by crime type and location.
- Identifies likely emerging hotspots.
- Explains forecast drivers:
  - recent increase
  - seasonal pattern
  - repeated cases
  - station-level trend
- Suggests preventive actions:
  - night patrol
  - hotspot watch
  - repeat offender monitoring
  - cyber awareness campaign
  - vehicle theft checks

## Output

- Forecasted crime trend
- Risk-ranked districts/units
- Emerging hotspot list
- Preventive policing recommendations
- Alerts/tasks for field units

## Benefits

- Moves policing from reactive to preventive.
- Helps allocate limited resources.
- Supports data-backed patrol planning.
- Improves readiness for seasonal or recurring crime.

---

# 13. Hotspot Monitoring Workflow

## Goal

Monitor high-risk geographic areas, understand contributing cases, identify nearby suspect networks, and recommend patrol or preventive action.

## Actors

- Control Room / Operations Officer
- SHO
- Patrol Supervisor
- Crime Analyst
- AI Assistant

## Screens Used

- Crime Map
- Hotspot Monitoring
- Case Detail
- Network Graph
- Alerts and Tasks
- Forecasting Dashboard

## Input

- Case locations
- Crime type
- Time window
- District/unit boundaries
- Beat/village/place data
- Hotspot risk score
- Contributing cases
- Repeat offender locations, if available

## Processing

1. Officer opens crime map.
2. System displays heatmap and active hotspots.
3. Officer filters by crime type, date range, station, district, or time of day.
4. Hotspot is opened to show contributing cases and risk explanation.
5. AI recommends patrol or surveillance action.
6. Officer creates or assigns hotspot task.

## AI Assistance

- Explains why an area is a hotspot.
- Shows contributing FIRs.
- Identifies time-of-day and day-of-week pattern.
- Detects nearby repeat offender addresses or gang areas where available.
- Suggests patrol windows and target beats.
- Warns about low-quality coordinates if hotspot confidence is weak.

## Output

- Hotspot map
- Risk score
- Contributing case list
- Patrol recommendation
- Assigned task/alert
- Trend direction

## Benefits

- Supports patrol planning.
- Makes hotspot detection explainable.
- Helps stations focus on high-risk areas.
- Links map intelligence with investigation intelligence.

---

# 14. AI Chat Investigation Workflow

## Goal

Provide an investigation copilot that can answer officer questions using case records, legal references, analytics, graph connections, and AI reasoning while always showing evidence, confidence, and suggested next steps.

## Actors

- Investigating Officer
- SHO
- Crime Analyst
- Supervisor
- Legal Officer
- AI Assistant

## Screens Used

- AI Chat Investigation
- Evidence Panel
- Case Detail
- Similar Cases Panel
- Network Graph
- Legal Recommendation Panel
- Crime Map
- Timeline

## Input

Natural language questions such as:

- What sections apply to this FIR?
- Find similar FIRs.
- Has this accused appeared before?
- Is this phone connected to other cases?
- What should I investigate next?
- Summarize this case for supervisor review.
- Why is this case high risk?
- Which hotspot needs attention today?
- Trace this transaction.
- Show connections between this accused and this gang.

## Processing

1. Officer asks a question.
2. AI detects intent:
   - legal recommendation
   - case summary
   - similarity search
   - graph connection
   - hotspot analysis
   - timeline generation
   - risk explanation
   - task recommendation
3. AI extracts entities:
   - person
   - case
   - vehicle
   - phone
   - location
   - time
   - crime type
   - legal section
4. System retrieves relevant evidence from structured records, graph links, legal references, analytics, and documents.
5. AI generates structured answer with evidence and confidence.
6. Officer can convert suggestions into tasks, notes, review items, or legal recommendations.

## AI Assistance

The assistant should not answer casually. It should reason like an investigation aide.

Every answer should include:

- Summary
- Evidence used
- Connections found
- Legal or analytical insight
- Suggested leads
- Confidence
- Next action

For legal questions, AI should include:

- Suggested sections
- Why they may apply
- Supporting facts
- Missing facts
- Similar cases
- Confidence
- Need for legal/supervisor review

For network questions, AI should include:

- Connection path
- Shared identifiers
- Relationship confidence
- Evidence support
- Recommended verification step

For analytics questions, AI should include:

- Trend
- Comparison period
- District/unit context
- Operational interpretation
- Suggested action

## Output

- Evidence-backed AI response
- Related cases
- Related persons/entities
- Suggested legal sections
- Suggested leads
- Risk explanation
- Timeline or summary
- Task/recommendation creation option
- Chat history for audit

## Benefits

- Makes AI useful to officers without forcing them to learn complex queries.
- Turns the chatbot into an investigation engine interface.
- Improves transparency by showing evidence and confidence.
- Helps junior officers reason like experienced investigators.
- Gives supervisors auditability over AI-assisted decisions.

---

# Cross-Workflow AI Behavior Rules

## AI Must Always

- Show evidence behind important claims.
- Display confidence level.
- Distinguish confirmed facts from inferred links.
- Suggest next investigative action.
- Allow officer acceptance, rejection, or escalation.
- Preserve human judgment as final authority.
- Keep sensitive data protected and role-based.

## AI Must Never

- Declare a person guilty.
- Replace officer/legal officer judgment.
- Hide uncertainty.
- Make operational decisions solely from protected demographic attributes.
- Treat inferred graph relationships as confirmed facts.
- Recommend legal sections without explaining why.

## Recommended AI Response Template

```text
Summary
- Short direct answer.

Evidence
- FIR facts, legal references, graph links, similar cases, documents, or statistics used.

Connections
- People, vehicles, phones, accounts, locations, gangs, or cases linked to the query.

Insights
- Pattern, risk, legal issue, missing information, or anomaly.

Suggested Leads
- Practical next actions for the officer.

Confidence
- High / Medium / Low with reason.

Next Action
- Create task, request review, open graph, open case, validate legal section, or export summary.
```

# End-to-End Investigation Journey

```text
Complaint received
        ↓
FIR registration
        ↓
AI FIR validation
        ↓
Legal recommendation
        ↓
Case assignment
        ↓
Initial investigation tasks
        ↓
Evidence/person/location capture
        ↓
Similar case discovery
        ↓
Network and repeat offender analysis
        ↓
Victim risk/support review
        ↓
Investigation timeline monitoring
        ↓
Supervisor review
        ↓
Chargesheet preparation
        ↓
Court readiness
        ↓
Analytics, hotspot, and forecasting feedback loop
```

# Product Outcome

These workflows define KSP Intelligence OS as a police investigation operating system. The product is not only storing FIRs or answering questions; it actively supports officers through validation, legal reasoning, similarity search, network intelligence, risk scoring, hotspot monitoring, supervisor review, and evidence-backed AI assistance.
