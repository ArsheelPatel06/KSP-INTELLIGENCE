# Entity Gap Analysis

Source documents compared:

- `datasets/raw/Police_FIR_ER_Diagram.pdf`
- `docs/database/entities.md`
- `docs/database/dataset_analysis.md`

Purpose: merge the official Karnataka Police FIR ER Diagram with the logical entity catalog and identify what is officially modeled, what is available in the current datasets, and what is still missing for a complete AI Investigation Platform.

No SQL is included in this document.

## SECTION 1: Official Karnataka Police Entities

These entities are explicitly present in `Police_FIR_ER_Diagram.pdf`. They should be treated as the official baseline for the FIR system model.

| Official Entity | Description | Official Identifier | Key Attributes | Relationship Role |
|---|---|---|---|---|
| `CaseMaster` | Core FIR/case record. | `CaseMasterID`, `CrimeNo`, `CaseNo` | Crime registered date, police person, police station, case category, gravity, major/minor crime head, case status, court, incident dates, information received date, latitude, longitude, brief facts. | Parent of victims, accused, complainants, arrests, act-sections, chargesheet, occurrence/location. |
| `ComplainantDetails` | Person who filed or provided case information. | `ComplainantID` | Case reference, complainant name, age, occupation, religion, caste, gender. | Many complainants can belong to one case; links to occupation, religion, caste. |
| `Victim` | Person harmed in the case. | `VictimMasterID` | Case reference, victim name, age, gender, police-victim flag. | Many victims can belong to one case. |
| `Accused` | Person accused in the case. | `AccusedMasterID` | Case reference, accused name, age, gender, person sequence such as A1/A2. | Many accused persons can belong to one case; links to arrests/surrenders. |
| `ArrestSurrender` | Arrest or voluntary surrender event. | `ArrestSurrenderID` | Case, arrest/surrender type, date, state, district, police station, IO, court, accused, primary-accused flag, complainant-accused flag. | Links case, accused, officer, unit, district, state, and court. |
| `Act` | Legal act master. | `ActCode` | Act description, short name, active flag. | Parent of sections and act-section mappings. |
| `Section` | Legal section master. | `ActCode` + `SectionCode` | Section description, active flag. | Belongs to act; referenced by case act-section associations. |
| `ActSectionAssociation` | Legal act/section applied to a case. | Case + act + section + order | Case, act, section, act order, section order. | Many act-sections can belong to one case. |
| `CrimeHead` | Major crime classification. | `CrimeHeadID` | Crime group/major head name, active flag. | Case major-head reference; parent of crime sub-heads. |
| `CrimeSubHead` | Minor crime classification under a major head. | `CrimeSubHeadID` | Parent crime head, crime sub-head name, sequence. | Case minor-head reference; child of crime head. |
| `CrimeHeadActSection` | Mapping between crime head and legal act/section. | Crime head + act + section | Crime head, act code, section code. | Connects offence taxonomy to law. |
| `CaseCategory` | Case category such as FIR, UDR, PAR. | `CaseCategoryID` | Lookup value. | Many cases can share one category. |
| `GravityOffence` | Case gravity/severity lookup. | `GravityOffenceID` | Lookup value such as heinous or non-heinous. | Many cases can share one gravity level. |
| `CaseStatusMaster` | Case status lookup. | `CaseStatusID` | Case status name. | Many cases can share one status. |
| `ChargesheetDetails` | Chargesheet or final report details. | `CSID` | Case, chargesheet date, final report type, police person. | One case can have chargesheet/final report details. |
| `Court` | Court master. | `CourtID` | Court name, district, state, active flag. | Cases and arrest/surrender events can link to court. |
| `District` | District master. | `DistrictID` | District name, state, active flag. | Parent for units, employees, courts, arrest districts. |
| `State` | State master. | `StateID` | State name, nationality ID, active flag. | Parent for districts, units, courts, arrest states. |
| `Unit` | Police station or police unit. | `UnitID` | Unit name, unit type, parent unit, nationality, state, district, active flag. | Case registration police station; employee unit; arrest police station. |
| `UnitType` | Type and hierarchy of police unit. | `UnitTypeID` | Unit type name, city/district/state level, hierarchy, active flag. | Classifies units. |
| `Employee` | Police employee master. | `EmployeeID` | District, unit, rank, designation, KGID, first name, DOB, gender, blood group, physically challenged flag, appointment date. | Registers cases, acts as IO for arrests, files chargesheets. |
| `Rank` | Police rank master. | `RankID` | Rank name, hierarchy, active flag. | Classifies employees. |
| `Designation` | Police designation master. | `DesignationID` | Designation name, active flag, sort order. | Classifies employees. |
| `OccupationMaster` | Occupation lookup. | `OccupationID` | Occupation name. | Classifies complainants. |
| `ReligionMaster` | Religion lookup. | `ReligionID` | Religion name. | Classifies complainants. |
| `CasteMaster` | Caste lookup. | `caste_master_id` | Caste name. | Classifies complainants. |
| `Inv_OccuranceTime` | Occurrence time/location record referenced in the relationship matrix. | `CaseMasterID` implied | Incident/occurrence time and location fields implied by the ERD relationship matrix. | One case has one occurrence time/location record. |
| `inv_arrestsurrenderaccused` | Junction table between arrest/surrender and accused. | Arrest/surrender + accused implied | Arrest/surrender reference and accused reference. | Allows one arrest event to link multiple accused persons. |

**Official Model Strengths**

- The ERD provides a clean case-centered model.
- It separates case, people, police organization, legal classification, geography, court, arrest, and chargesheet concepts.
- It has proper identifiers for most operational entities.
- It supports many-to-one classification and one-to-many case relationships needed for FIR management.

**Official Model Limits for AI**

- It does not explicitly model evidence, property, weapons, vehicles, phone/digital accounts, financial transactions, gangs, hotspots, recommendations, risk scores, chat history, case similarity, or machine-learning outputs.
- It does not include aggregate reporting entities from crime review PDFs/CSVs.
- It does not include data lineage, source quality, model audit, or feature-store concepts.

## SECTION 2: Entities Available From Datasets

These entities are available in the current raw datasets or can be derived directly from dataset fields. Some align with the official ERD, while others are aggregate/reporting entities outside the official FIR ERD.

| Dataset Entity | Availability | Source Dataset | Identifier Quality | Notes Compared With Official ERD |
|---|---|---|---|---|
| Case / FIR Record | Strong but incomplete | `FIR_Details_Data.csv` | Weak: no stable `CaseMasterID`, `CrimeNo`, or `CaseNo` | Aligns with `CaseMaster`, but lacks official case identifiers and brief facts. |
| FIR Registration Period | Strong | `FIR_Details_Data.csv` | Composite: year, month, day, unit | Partial match to `CrimeRegisteredDate`; date is split into year/month/day. |
| Complaint Mode | Strong | `FIR_Details_Data.csv` | Lookup value only | ERD has complainant details and information received date, but not a separate complaint-mode master. |
| District | Strong | `FIR_Details_Data.csv`, crime review PDF/CSVs | Name only | Aligns with `District`, but official `DistrictID` is missing in CSVs. |
| State / UT | Medium | victim/suspect CSVs, legal metadata | Name only | Aligns with `State`, but dataset values include all-India state/UT names, not only Karnataka operational state IDs. |
| Police Station / Unit | Strong | `FIR_Details_Data.csv` | `Unit_ID` plus `UnitName` | Aligns with `Unit`, but unit hierarchy/type is missing from CSVs. |
| Officer / Investigating Officer | Medium | `FIR_Details_Data.csv` | `KGID`, `Internal_IO`, `IOName` | Aligns with `Employee`, but only IO-related fields are available; rank/designation are not structured. |
| Crime Group / Category | Strong | `FIR_Details_Data.csv`, crime review files | Name only | Aligns with `CrimeHead`, but names need normalization. |
| Crime Major Head | Strong | `FIR_Details_Data.csv`, crime review files | Name only | Aligns with `CrimeHead`; official `CrimeHeadID` missing. |
| Crime Minor Head / Sub-Head | Medium | crime review CSVs | Name only | Aligns with `CrimeSubHead`; not consistently present in FIR CSV. |
| FIR Type / Gravity | Strong | `FIR_Details_Data.csv` | Lookup value only | Aligns with `GravityOffence`; official ID missing. |
| FIR Stage / Case Status | Strong but messy | `FIR_Details_Data.csv` | Lookup value only | Aligns with `CaseStatusMaster`, but has many inconsistent stage values. |
| Legal Act / Act-Section Text | Medium | `FIR_Details_Data.csv`, `indian_laws_and_acts_v2.csv` | Free text or URL/title | Partially aligns with `Act`; requires act-code normalization. |
| IPC Section | Strong reference, weak linkage | `ipc_sections.csv` | `IPC_###` section value | Aligns with `Section`, but FIR act-section text is free-form and includes non-IPC laws. |
| Act-Section Association | Medium | `FIR_Details_Data.csv` | Case identifier missing | Aligns conceptually with `ActSectionAssociation`, but cannot be keyed reliably without case ID and structured act/section codes. |
| Crime Head to Act-Section Mapping | Weak to medium | ERD, crime review headings, IPC reference | Composite mapping not present as data | Officially modeled, but current datasets do not provide a clean mapping table. |
| Victim Counts | Medium | `FIR_Details_Data.csv` | Case row implied | Aggregated counts only; official `Victim` person records are missing. |
| Victim Demographic Statistics | Strong aggregate | `VICTIM_OF_MURDER_2013.csv`, `VICTIMS_OF_KA_2013.csv` | Composite aggregate keys | Not part of ERD; useful for victim analytics but not person-level case victims. |
| Accused Counts | Medium | `FIR_Details_Data.csv` | Case row implied | Aggregated counts only; official `Accused` person records are missing. |
| Arrest Counts | Medium | `FIR_Details_Data.csv` | Case row implied | Aggregated counts only; official `ArrestSurrender` events are missing. |
| Chargesheeted Accused Count | Medium | `FIR_Details_Data.csv` | Case row implied | Partial match to `ChargesheetDetails`, but lacks chargesheet date/type and official `CSID`. |
| Conviction Count / Outcome | Medium | `FIR_Details_Data.csv` | Case row implied | Outcome is aggregate/status-based; official court outcome entity is not modeled separately in ERD. |
| Place / Incident Location | Medium | `FIR_Details_Data.csv` | Case row implied | Aligns with case location fields; coordinates are missing/invalid for many rows. |
| Beat | Medium | `FIR_Details_Data.csv` | Beat name scoped by unit needed | Useful operational geography, not explicitly modeled in official ERD. |
| Village / Area | Medium | `FIR_Details_Data.csv` | Name scoped by unit/district needed | Useful location entity, not explicitly modeled in official ERD. |
| City | Weak to medium | road/crime summary CSVs | City name | Not an official ERD entity, but useful for reporting and spatial aggregation. |
| Court | Not available as data | ERD only | Official `CourtID` in ERD | Present officially but not populated in available CSVs. |
| Rank | Not available as data | ERD only | Official `RankID` in ERD | Present officially but not populated in available CSVs. |
| Designation | Not available as data | ERD only | Official `DesignationID` in ERD | Present officially but not populated in available CSVs. |
| Occupation | Not available as data | ERD only | Official `OccupationID` in ERD | Present officially but not populated in available CSVs. |
| Religion | Not available as data | ERD only | Official `ReligionID` in ERD | Present officially but not populated in available CSVs. |
| Caste | Weak aggregate context only | ERD, SC/ST POA report categories | Official caste ID absent from CSVs | Present officially for complainants; current datasets only support statutory aggregate context. |
| Crime Statistic | Strong aggregate | 2021-2024 review CSVs, 2026 review CSVs, December 2025 PDF | Composite report keys | Not part of official FIR ERD; essential for analytics and forecasting. |
| Monthly Crime Review Report | Strong document source | `crime-review-december-modified-2025.pdf`, review CSVs | Report month/year/source file | Not part of official FIR ERD; essential for dashboards and briefings. |
| Road Accident Statistic | Medium | `D47-Crimes (1)_0.csv`, December 2025 PDF, FIR crime groups | Composite aggregate keys | Not an official ERD entity; useful for traffic safety analytics. |
| Road Type | Medium | December 2025 PDF, FIR crime head values | Road type label | Not an official ERD entity. |
| Cyber Suspect Category | Strong aggregate | `IT_Suspect_2013.csv` | State/year/category | Not part of official ERD; useful for cyber analytics. |
| Legal Document Source | Strong reference | `indian_laws_and_acts_v2.csv` | URL/title | Not part of official ERD; useful for legal retrieval and citation. |
| SAKALA Service Performance | Medium | December 2025 PDF | Report month/district/service | Not part of official ERD; operational performance entity. |
| e-Sign Performance | Medium | December 2025 PDF | Report month/district/document type | Not part of official ERD; digital compliance entity. |
| Police IT Vehicle Log | Medium | December 2025 PDF | Report month/unit | Not part of official ERD; operational compliance entity. |
| Seva Sindhu Service | Medium | December 2025 PDF | Report month/service | Not part of official ERD; citizen-service performance entity. |
| COTPA Enforcement Statistic | Medium | December 2025 PDF | Report month/unit/section | Not part of official ERD; enforcement aggregate entity. |
| Preventive Action / Security Case | Medium | crime review files, December 2025 PDF | Period/section/district if present | Not a separate official ERD entity; appears through legal/statistical reporting. |
| Time Period | Strong | All statistical and FIR datasets | Date/month/year/financial year | Not an official ERD master, but necessary for analytics. |
| Data Source / Lineage | Strong as file metadata | All datasets | Filename/source document | Not part of official ERD, but essential for audit and AI governance. |

**Main Dataset-to-ERD Mismatches**

- The FIR CSV has many useful case attributes but lacks the official `CaseMasterID`, `CrimeNo`, and `CaseNo`.
- Person-level `Victim`, `Accused`, and `ComplainantDetails` are official ERD entities, but the CSVs mostly contain counts or no data.
- Official master identifiers such as `DistrictID`, `UnitID`, `EmployeeID`, `CrimeHeadID`, `CrimeSubHeadID`, `ActCode`, and `SectionCode` are mostly absent from the CSVs.
- Court, rank, designation, occupation, religion, caste, and chargesheet details are official entities but are not populated as raw datasets.
- The datasets contain useful analytics/reporting entities that the official ERD does not cover, including crime review reports, aggregate crime statistics, e-sign metrics, SAKALA metrics, road accident summaries, and cyber suspect aggregate statistics.

## SECTION 3: Entities Missing For An AI Investigation Platform

These entities are not adequately covered by the official FIR ERD or the available datasets but are important for an AI-powered crime investigation and intelligence platform.

| Missing Entity | Why It Is Needed | Current Coverage | Suggested Identifier | Core Attributes | Key Relationships |
|---|---|---|---|---|---|
| Evidence | Required to reason over physical, forensic, documentary, and digital proof. | Missing from datasets and official ERD. | Evidence ID / seizure ID | Evidence type, description, collection date, seizure memo, forensic status, chain of custody. | Case, accused, victim, officer, location, court, legal section. |
| Property / Stolen Asset | Needed for theft, robbery, burglary, seizure, recovery, and value analysis. | Only crime categories imply property crimes. | Property ID / recovery ID | Property type, value, owner, stolen date, recovered date, recovery status. | Case, victim/owner, accused, evidence, location. |
| Vehicle | Needed for vehicle theft, accidents, fleet logs, suspect mobility, and recovered property. | Aggregate motor vehicle theft/accident data and police vehicle logs only. | Vehicle ID / registration number with privacy controls | Registration number, vehicle type, owner, theft status, accident status, recovery status. | Case, victim/owner, accused, location, evidence, police unit. |
| Phone | Needed for call-based complaints, cyber crime, fraud, CDR analysis, and contact networks. | Only complaint mode and cyber aggregate context. | Phone ID / hashed phone number | Number, subscriber, device, provider, usage period, CDR metadata. | Case, accused, victim, complainant, money trail, evidence. |
| Digital Account | Needed for cyber crime, social media, email, wallet, and online fraud investigation. | Missing. | Digital account ID / platform handle | Platform, handle, account owner, creation date, linked phone/email, status. | Case, accused, victim, phone, financial transaction, evidence. |
| Financial Transaction | Needed for cyber fraud, cheating, extortion, proceeds tracing, recovery, and freezing. | Missing, despite cyber/economic offence categories. | Transaction ID / bank reference / wallet reference | Amount, currency, date/time, sender, receiver, bank/wallet, channel, freeze/recovery status. | Case, victim, accused, phone, digital account, bank account, evidence. |
| Bank Account / Wallet | Needed to connect financial transactions and identify fraud networks. | Missing. | Account ID / masked account number / wallet ID | Institution, account type, owner, KYC status, freeze status. | Financial transaction, accused, victim, case, digital account. |
| Gang / Criminal Network | Needed for organized crime, repeat co-offending, and network intelligence. | Missing. | Gang/network ID | Name, aliases, area of operation, active period, known members, crime types. | Accused, case, location, phone, vehicle, weapon, money trail. |
| Repeat Offender Profile | Needed to connect accused persons across cases and identify repeat patterns. | Official ERD has accused per case, but no resolved cross-case offender profile. | Person/offender ID | Identity, aliases, demographics, prior cases, arrest history, conviction history, risk indicators. | Accused, case, arrest, conviction, gang, location, phone, vehicle. |
| Modus Operandi | Needed for case similarity, crime pattern detection, and suspect matching. | Not structured; may be hidden in missing brief facts. | MO ID / case-MO association | Entry method, target type, tools used, deception pattern, time pattern, victim approach. | Case, crime category, accused, evidence, property, hotspot. |
| Witness | Needed for investigation quality, trial support, and evidence graph completeness. | Missing. | Witness ID / protected witness reference | Statement date, role, protection status, credibility notes, contact controls. | Case, victim, accused, evidence, court, outcome. |
| Weapon | Needed for violent crime intelligence and forensic linking. | Missing. | Weapon ID / evidence ID | Weapon type, license status, recovery status, forensic result. | Case, accused, victim, evidence, legal section. |
| Forensic Report | Needed for scientific evidence, lab status, DNA/fingerprint/ballistic/cyber analysis. | Missing. | Forensic report ID | Lab, request date, report date, test type, result summary, confidence, status. | Evidence, case, accused, victim, court. |
| Case Diary / Investigation Note | Needed for investigative chronology and AI summarization. | Missing. | Case diary entry ID | Date/time, officer, note text, action taken, next step. | Case, officer, evidence, accused, victim, recommendation. |
| Court Proceeding | Needed to track hearings, bail, remand, adjournments, trial progress, and judgments. | Court master is official, but proceeding events are missing. | Proceeding ID | Hearing date, proceeding type, order summary, next date, judge/court. | Case, court, accused, chargesheet, outcome. |
| Bail / Custody Status | Needed for risk monitoring, offender tracking, and court process intelligence. | Missing. | Custody event ID | Custody type, start/end date, bail conditions, jail/remand details. | Accused, case, arrest, court, risk score. |
| Jail / Prison | Needed for custody, release, and recidivism intelligence. | Missing. | Jail ID | Jail name, district, state, capacity, status. | Accused, custody event, court, case. |
| Hotspot | Needed for AI hotspot detection and patrol planning. | Derivable from FIR location data, but not modeled. | Hotspot ID | Geometry, time window, crime type, risk level, confidence, trend. | Case, location, beat, unit, district, risk score, recommendation. |
| Risk Score | Needed for prioritization, patrol allocation, repeat-offender risk, victim risk, and case risk. | Missing as AI output. | Risk score ID | Score type, value, model version, generated date, explanation, confidence. | Case, accused, victim, hotspot, officer/unit, recommendation. |
| AI Recommendation | Needed to store AI-generated investigative, legal, patrol, or resource recommendations. | Missing. | Recommendation ID | Recommendation type, text, rationale, confidence, model version, status, reviewed by. | Case, officer, legal section, risk score, hotspot, evidence. |
| Case Similarity | Needed to connect similar cases by MO, location, legal section, accused patterns, and text. | Missing as AI output; possible to derive partially. | Case similarity ID | Source case, matched case, similarity score, reason features, model version. | Case, modus operandi, legal section, location, accused, evidence. |
| Chat History | Needed if investigators interact with an AI assistant and decisions must be auditable. | Missing. | Chat session/message ID | User, role, prompt, response, timestamp, linked case, model version. | Officer, case, recommendation, audit log. |
| Model Audit / AI Decision Log | Needed for governance, explainability, accountability, and review. | Missing. | Audit event ID | Model name/version, input references, output, confidence, reviewer, action taken. | AI recommendation, risk score, case similarity, officer, case. |
| Search Query / Intelligence Request | Needed to track investigative searches and analyst workflows. | Missing. | Query ID | Query text, filters, requester, timestamp, result set, linked case. | Officer, case, chat history, recommendation. |
| Alert | Needed for real-time or scheduled warnings on hotspots, repeat offenders, linked cases, or overdue actions. | Missing. | Alert ID | Alert type, severity, generated date, status, trigger reason. | Case, officer, unit, hotspot, risk score, recommendation. |
| Task / Follow-Up Action | Needed to operationalize AI recommendations and investigation workflow. | Missing. | Task ID | Owner, due date, status, priority, action description, closure note. | Case, officer, recommendation, evidence, court proceeding. |
| Social Relationship | Needed for victim-accused, accused-accused, gang, family, friend, and associate networks. | Missing except ERD flag for complainant-as-accused. | Relationship ID | Person A, person B, relationship type, confidence, source. | Accused, victim, complainant, witness, gang, phone, case. |
| Address / Person Location History | Needed for suspect tracking, hotspot validation, service of notices, and network mapping. | Missing except offence place. | Address ID / person-address association | Address text, geocode, period valid, address type, verification status. | Accused, victim, complainant, witness, case, unit. |
| Organization / Business | Needed for economic offences, cyber fraud, workplace suspects, business competitors, and victims. | Only aggregate cyber suspect category references business competitors. | Organization ID | Name, registration, type, address, owner/contact, role in case. | Case, accused, victim, money trail, digital account. |
| Document / Attachment | Needed for FIR copies, chargesheets, reports, evidence documents, notices, and court orders. | Missing except PDF source files as reports. | Document ID | Document type, file path/source, date, author, hash, extraction status. | Case, chargesheet, evidence, court, recommendation. |
| Data Quality Issue | Needed to track invalid coordinates, duplicate datasets, missing identifiers, and unreliable values. | Mentioned in analysis, not modeled. | Data quality issue ID | Source, field, issue type, severity, detected date, resolution status. | Data source, case, statistic, legal reference, AI model input. |
| Feature Vector / Embedding | Needed for AI search, semantic case similarity, clustering, and retrieval. | Missing. | Feature vector ID | Entity type, entity ID, embedding/model version, generated date, vector reference. | Case, legal section, evidence, report, recommendation. |

## Priority Gap Assessment

**Highest Priority Gaps**

- Stable case identifiers from the official model: `CaseMasterID`, `CrimeNo`, `CaseNo`.
- Person-level records: complainant, victim, accused, witness, repeat offender profile.
- Investigation objects: evidence, property, vehicle, weapon, forensic report.
- Digital and financial intelligence: phone, digital account, bank account/wallet, financial transaction.
- AI governance objects: AI recommendation, risk score, case similarity, model audit, chat history.

**Medium Priority Gaps**

- Court proceeding, bail/custody, jail/prison, case diary, task/follow-up action.
- Hotspot, alert, search query/intelligence request, feature vector/embedding.
- Organization/business, social relationship, address/person location history.

**Already Strong Enough For Initial Analytics**

- Case-level aggregate FIR analytics.
- District/unit crime analysis.
- Crime group/head trends.
- Monthly crime review reporting.
- Legal reference enrichment using IPC and law metadata.
- Basic hotspot analysis where coordinates are valid.

## Recommended Merge Strategy

- Use the official ERD as the authoritative operational core.
- Map dataset-derived FIR fields into official ERD concepts, but preserve a data-quality layer for missing IDs and invalid coordinates.
- Treat crime review CSV/PDF data as aggregate reporting facts outside the official FIR transaction model.
- Add AI investigation entities as a separate intelligence layer rather than forcing them into the FIR ERD.
- Prioritize identifiers and person-level linkage before attempting advanced repeat-offender, gang, financial network, or case-similarity models.
