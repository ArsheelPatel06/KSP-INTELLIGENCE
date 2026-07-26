# Logical Entity Catalog

Source basis: `docs/database/dataset_analysis.md`

Purpose: identify logical real-world entities across the available datasets and group information by entity rather than by source file. This is a conceptual data architecture document only. It does not define SQL.

## Entity Summary

The platform should center on `Case` as the core operational entity, with supporting dimensions for people, police organization, geography, crime classification, legal references, investigation events, case outcomes, and aggregate crime statistics. Some entities are directly present in the raw CSVs, some are described only in the FIR ER diagram PDF, and some are important intelligence-platform entities that are currently missing or only weakly represented.

## 1. Case

**Description:** A registered FIR/crime case or related police case record.

**Source Dataset:** `FIR_Details_Data.csv`, `FIR_Details_Data-selected-columns.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Not reliably present in the CSV. ERD proposes `CaseMasterID`, `CrimeNo`, and `CaseNo`.

**Attributes:** District, police unit, FIR year, FIR month, FIR day, offence duration, FIR type, FIR stage, complaint mode, crime group, crime head, latitude, longitude, act-section text, IO name, IO KGID, internal IO ID, place of offence, distance from police station, beat, village/area, victim counts, accused counts, arrest counts, chargesheeted accused count, conviction count, unit ID.

**Possible Relationships:** Case belongs to a police station/unit, district, crime category, crime head, legal act/section, case category, case status, gravity level, investigating officer, place, beat, village/area, victims, accused persons, complainants, arrests, chargesheets, court, and case outcome.

## 2. FIR Registration

**Description:** The registration event that records when and where a case entered the police system.

**Source Dataset:** `FIR_Details_Data.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Not present as a separate ID. ERD models it through `CaseMaster.CrimeRegisteredDate`, `CrimeNo`, and `PoliceStationID`.

**Attributes:** FIR year, FIR month, FIR day, police station/unit, complaint mode, registering police person, case category, FIR type, case number/crime number if available.

**Possible Relationships:** Registration creates a case, occurs at a police station, is handled by an officer, receives a complaint, and starts downstream investigation, arrest, chargesheet, trial, and disposal events.

## 3. Complaint

**Description:** The mode and source channel through which incident information reached police.

**Source Dataset:** `FIR_Details_Data.csv`, `FIR_Details_Data-selected-columns.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Not present. Could be represented by case identifier plus complaint sequence in a future model.

**Attributes:** Complaint mode, written/oral/online/suo motu/judicial reference/distress call categories, received date/time if available from ERD.

**Possible Relationships:** Complaint initiates a case, may be filed by a complainant, is received by a police station, and can influence triage, response time, and case classification.

## 4. Complainant

**Description:** Person who files or provides information for a complaint.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** ERD proposes `ComplainantID`.

**Attributes:** Complainant name, age, occupation, religion, caste, gender, case reference.

**Possible Relationships:** Complainant files one or more complaints/cases, belongs to demographic reference entities, and may also be accused in specific cases according to ERD flags.

## 5. Victim

**Description:** Person harmed or affected by a case.

**Source Dataset:** `FIR_Details_Data.csv`, `Police_FIR_ER_Diagram.pdf`, `VICTIM_OF_MURDER_2013.csv`, `VICTIMS_OF_KA_2013.csv`.

**Primary Identifier:** Not present in CSVs. ERD proposes `VictimMasterID`.

**Attributes:** Victim name if available from ERD, age, gender, police-victim flag, aggregate counts for male, female, boy, girl, age-zero category, total victim count, murder victim age bands, kidnapping/abduction victim purpose and age/gender bands.

**Possible Relationships:** Victim belongs to a case, may be associated with crime category, legal section, place, accused, demographic group, and victim statistic aggregate.

## 6. Victim Demographic Statistic

**Description:** Aggregated victim counts by state/UT, year, gender, age band, and purpose.

**Source Dataset:** `VICTIM_OF_MURDER_2013.csv`, `VICTIMS_OF_KA_2013.csv`.

**Primary Identifier:** Composite logical key: state/UT, year, gender or purpose, age band.

**Attributes:** State/UT, year, gender, purpose, age-band counts, total male, total female, grand total, total cases reported.

**Possible Relationships:** Relates to state, crime category, victim, age band, gender, and historical risk baselines for crime analytics.

## 7. Accused

**Description:** Person alleged to have committed an offence.

**Source Dataset:** `FIR_Details_Data.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Not present in CSVs. ERD proposes `AccusedMasterID`.

**Attributes:** Accused count, accused chargesheeted count, accused name, age, gender, person sequence such as A1/A2/A3 when available from ERD.

**Possible Relationships:** Accused belongs to a case, may be linked to arrest/surrender events, chargesheet details, victims, legal sections, court, and repeat-offender intelligence when person identifiers become available.

## 8. Cyber Suspect Category

**Description:** Aggregate category of suspected cyber crime actor.

**Source Dataset:** `IT_Suspect_2013.csv`.

**Primary Identifier:** Composite logical key: state/UT, year, crime head, suspect category.

**Attributes:** Foreign national/group count, disgruntled employee count, cracker/student/professional learner count, business competitor count, neighbour/friend/relative count, others count, total count.

**Possible Relationships:** Relates to cyber crime cases, state/UT, suspect typology, and cyber crime analytics.

## 9. Officer / Employee

**Description:** Police employee involved in registering, investigating, or arresting in a case.

**Source Dataset:** `FIR_Details_Data.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** `KGID` and `Internal_IO` in FIR data; ERD proposes `EmployeeID`.

**Attributes:** IO name, KGID, internal IO ID, district, unit, rank, designation, first name, date of birth, gender, blood group, physically challenged flag, appointment date.

**Possible Relationships:** Officer belongs to a unit, district, rank, and designation; registers cases; investigates cases; conducts arrests; files chargesheets; contributes to unit performance metrics.

## 10. Rank

**Description:** Police rank hierarchy.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** ERD proposes `RankID`.

**Attributes:** Rank name, hierarchy, active flag.

**Possible Relationships:** Rank classifies officers and supports personnel hierarchy, workload analysis, and investigation responsibility analysis.

## 11. Designation

**Description:** Functional role or posting designation of a police employee.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** ERD proposes `DesignationID`.

**Attributes:** Designation name, active flag, sort order.

**Possible Relationships:** Designation classifies officers and can be linked to case registration, investigation, arrest, and chargesheet responsibilities.

## 12. Police Station / Unit

**Description:** Police station or operational unit responsible for case registration, investigation, or reporting.

**Source Dataset:** `FIR_Details_Data.csv`, `FIR_Details_Data-selected-columns.csv`, `Police_FIR_ER_Diagram.pdf`, `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** `Unit_ID` where populated; ERD proposes `UnitID`.

**Attributes:** Unit name, unit ID, unit type, parent unit, nationality ID, state, district, active flag.

**Possible Relationships:** Unit belongs to district and state, may have parent/child units, has officers, registers cases, handles arrests, contributes to crime statistics and performance metrics.

## 13. Unit Type

**Description:** Classification of police unit such as police station, city unit, district unit, or state-level unit.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`, `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** ERD proposes `UnitTypeID`.

**Attributes:** Unit type name, city/district/state operational level, hierarchy, active flag.

**Possible Relationships:** Unit type classifies police units and supports commissionerate/range/district reporting.

## 14. District

**Description:** Administrative district or police district/unit geography.

**Source Dataset:** `FIR_Details_Data.csv`, `FIR_Details_Data-selected-columns.csv`, `Police_FIR_ER_Diagram.pdf`, `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** District name in CSVs; ERD proposes `DistrictID`.

**Attributes:** District name, state, active flag, district/unit report values.

**Possible Relationships:** District contains police units, officers, courts, cases, arrests, crime statistics, CCTNS performance metrics, SAKALA metrics, e-sign metrics, and road accident statistics.

## 15. State / UT

**Description:** State or union territory geography.

**Source Dataset:** `VICTIM_OF_MURDER_2013.csv`, `VICTIMS_OF_KA_2013.csv`, `IT_Suspect_2013.csv`, `Police_FIR_ER_Diagram.pdf`, `indian_laws_and_acts_v2.csv`.

**Primary Identifier:** State/UT name in aggregate CSVs; ERD proposes `StateID`.

**Attributes:** State name, nationality ID, active flag, legal place/jurisdiction.

**Possible Relationships:** State contains districts, units, courts, aggregate victim statistics, cyber suspect statistics, and jurisdiction-specific legal documents.

## 16. City

**Description:** City-level location used in road/crime summary extracts.

**Source Dataset:** `D47-Crimes (1)_0.csv`, `D47Crimes_3_1.csv`, `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** City name.

**Attributes:** City name, year or financial year, fatal accident count, non-fatal accident count, total crime count.

**Possible Relationships:** City can map to district, police commissionerate, police units, road accident statistics, and aggregate crime statistics.

## 17. Beat

**Description:** Police beat area associated with a case location.

**Source Dataset:** `FIR_Details_Data.csv`.

**Primary Identifier:** Beat name, ideally scoped by unit or district.

**Attributes:** Beat name, police unit, district, place/village/area context.

**Possible Relationships:** Beat belongs to a police station/unit and district; contains cases and offence locations; supports hotspot and patrol planning.

## 18. Village / Area

**Description:** Local administrative or operational area where an offence occurred.

**Source Dataset:** `FIR_Details_Data.csv`.

**Primary Identifier:** Village/area name, ideally scoped by unit, district, and state.

**Attributes:** Village/area name, district, police station, beat, place of offence.

**Possible Relationships:** Village/area contains offence locations and cases, belongs to beat/unit/district, and supports spatial aggregation.

## 19. Place / Incident Location

**Description:** Specific offence location or geospatial point for an incident.

**Source Dataset:** `FIR_Details_Data.csv`, `Police_FIR_ER_Diagram.pdf`, `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** Not present. Could be represented by case identifier plus location sequence.

**Attributes:** Place of offence, latitude, longitude, distance from police station, beat, village/area, incident from/to date-time from ERD.

**Possible Relationships:** Location belongs to case, beat, village/area, unit, district, road type, and hotspot zones.

## 20. Court

**Description:** Court where a case is heard or where an accused is produced.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** ERD proposes `CourtID`.

**Attributes:** Court name, district, state, active flag.

**Possible Relationships:** Court hears cases, receives accused through arrest/surrender events, links to chargesheet and outcome information, and belongs to district and state.

## 21. Case Category

**Description:** High-level case category such as FIR, UDR, PAR, Zero FIR, or other police case category.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** ERD proposes `CaseCategoryID`.

**Attributes:** Lookup value, category name, category code implied by crime number format.

**Possible Relationships:** Case has one category; category influences numbering, reporting, and workflow.

## 22. Gravity / FIR Type

**Description:** Severity classification such as heinous or non-heinous.

**Source Dataset:** `FIR_Details_Data.csv`, `FIR_Details_Data-selected-columns.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** FIR type value in CSV; ERD proposes `GravityOffenceID`.

**Attributes:** FIR type, gravity lookup value, active/severity metadata when available.

**Possible Relationships:** Gravity classifies cases and supports triage, prioritization, forecasting, and resource allocation.

## 23. Case Status / FIR Stage

**Description:** Investigation, trial, and disposal status of a case.

**Source Dataset:** `FIR_Details_Data.csv`, `FIR_Details_Data-selected-columns.csv`, `Police_FIR_ER_Diagram.pdf`, `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** FIR stage value in CSV; ERD proposes `CaseStatusID`.

**Attributes:** FIR stage, case status name, values such as pending trial, convicted, undetected, acquitted/disposed, traced, under investigation, false case, compounded, abated.

**Possible Relationships:** Case has a current status; status connects to investigation outcomes, court outcomes, chargesheet details, and performance analytics.

## 24. Crime Category / Crime Group

**Description:** Broad offence grouping used for case classification and reporting.

**Source Dataset:** `FIR_Details_Data.csv`, `CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv`, `CRIME_REVIEW_2021_TO_2024_KARNATAKA (1).csv`, `CRIME_REVIEW_2021_TO_2024_KARNATAKA_CLEAN.csv`, 2026 monthly crime review CSVs, `crime-review-december-modified-2025.pdf`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Crime group/head value in CSV; ERD proposes `CrimeHeadID` for major head.

**Attributes:** Crime group name, head of crime, act category, active flag, reporting classification.

**Possible Relationships:** Crime category classifies cases, maps to crime major/minor heads, legal acts/sections, aggregate crime statistics, forecasting models, and dashboards.

## 25. Crime Major Head

**Description:** Major crime classification such as murder, robbery, POCSO, cyber crime, theft, NDPS, motor vehicle accident, or special/local law group.

**Source Dataset:** `FIR_Details_Data.csv`, crime review CSVs, `crime-review-december-modified-2025.pdf`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Major head name in reports; ERD proposes `CrimeHeadID`.

**Attributes:** Major head name, crime group, act/category label, embedded legal section mentions, active flag.

**Possible Relationships:** Major head groups crime sub-heads, classifies cases, maps to act-section combinations, and anchors aggregate crime statistics.

## 26. Crime Minor Head / Sub-Head

**Description:** More specific offence subtype or reason under a major head.

**Source Dataset:** Crime review CSVs, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Minor head name in reports; ERD proposes `CrimeSubHeadID`.

**Attributes:** Minor head name, parent major head, sequence/sort order.

**Possible Relationships:** Minor head belongs to a major crime head, classifies cases, appears in monthly crime statistics, and supports case similarity and detailed forecasting.

## 27. Crime Statistic

**Description:** Aggregate crime count fact by crime category, time, geography, and comparison period.

**Source Dataset:** Crime review CSVs from 2021-2024 and 2026, `crime-review-december-modified-2025.pdf`, `D47-Crimes (1)_0.csv`, `D47Crimes_3_1.csv`.

**Primary Identifier:** Composite logical key: source, year, month or financial year, geography when present, crime head, major head, minor head, measure type.

**Attributes:** Current month count, current year-to-date count, previous month count, corresponding previous-year count, fatal/non-fatal counts, total crime count, district-wise counts where present.

**Possible Relationships:** Crime statistic relates to time period, crime category, major head, minor head, district/city/unit, legal act, and source report.

## 28. Monthly Crime Review Report

**Description:** Official monthly crime and police-performance report.

**Source Dataset:** `crime-review-december-modified-2025.pdf`, 2026 monthly crime review CSVs, 2021-2024 crime review CSVs.

**Primary Identifier:** Report month, report year, source filename.

**Attributes:** Report title, month, year, review narrative, comparison statements, provisional flag, source classification date, report sections.

**Possible Relationships:** Report contains crime statistics, district statistics, road accident statistics, performance metrics, legal categories, and narrative observations.

## 29. Legal Act

**Description:** Law, act, rule, or legal source under which offences are registered or analyzed.

**Source Dataset:** `indian_laws_and_acts_v2.csv`, `FIR_Details_Data.csv`, crime review CSVs, `ipc_sections.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Act code in ERD if available; otherwise title/short name/source URL.

**Attributes:** Title, source, place, published date, commencement date, URL, act description, short name, active flag.

**Possible Relationships:** Legal act contains sections, is associated with cases through act-section associations, maps to crime heads, supports legal recommendations, and belongs to a jurisdiction/place.

## 30. Legal Section / IPC Section

**Description:** Specific section under IPC, BNS, SLL, or another legal act.

**Source Dataset:** `ipc_sections.csv`, `FIR_Details_Data.csv`, crime review CSVs, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** `Section` in `ipc_sections.csv` such as `IPC_302`; ERD proposes `SectionCode` scoped by `ActCode`.

**Attributes:** Description, offence, punishment, section code, section description, active flag, free-form act-section text in FIR data.

**Possible Relationships:** Section belongs to a legal act, applies to cases, maps to crime heads, supports legal recommendation, and can be compared across IPC/BNS/SLL references.

## 31. Act-Section Association

**Description:** Association between a case and one or more legal act-section combinations.

**Source Dataset:** `FIR_Details_Data.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Composite logical key: case identifier, act identifier, section identifier, display order.

**Attributes:** Act-section text, act order, section order, act code, section code.

**Possible Relationships:** Links case to legal acts and sections; supports charge analysis, offence classification, legal recommendations, and case similarity.

## 32. Crime Head to Act-Section Mapping

**Description:** Reference mapping between crime classifications and applicable legal act-section combinations.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`, `ipc_sections.csv`, crime review CSVs.

**Primary Identifier:** Composite logical key: crime head, act code, section code.

**Attributes:** Crime head ID, act code, section code, active flag if maintained.

**Possible Relationships:** Connects crime category to law, validates case classification, and powers legal recommendations.

## 33. Arrest / Surrender Event

**Description:** Event recording arrest or voluntary surrender of an accused person.

**Source Dataset:** `FIR_Details_Data.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** ERD proposes `ArrestSurrenderID`; CSV only has aggregate arrest counts.

**Attributes:** Arrested male count, arrested female count, arrested count, arrest/surrender type, arrest/surrender date, arrest state, arrest district, police station, IO, court, accused reference, primary accused flag, complainant-accused flag.

**Possible Relationships:** Arrest/surrender belongs to a case, links to accused, officer, police station, district, state, and court; informs case progression and custody analytics.

## 34. Chargesheet / Final Report

**Description:** Formal report filed after investigation, including chargesheet, false case, or undetected final report.

**Source Dataset:** `FIR_Details_Data.csv`, `Police_FIR_ER_Diagram.pdf`, `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** ERD proposes `CSID`; CSV contains aggregate chargesheeted accused count.

**Attributes:** Chargesheet date, chargesheet type, police person, accused chargesheeted count, e-signed chargesheet count and percentage in report.

**Possible Relationships:** Chargesheet belongs to a case, is filed by an officer, references accused, legal sections, court, and final report type.

## 35. Conviction / Case Outcome

**Description:** Judicial or procedural outcome of a case.

**Source Dataset:** `FIR_Details_Data.csv`, `crime-review-december-modified-2025.pdf`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Not present as separate ID. Could be case identifier plus outcome event date in a future model.

**Attributes:** Conviction count, FIR stage, disposal/acquittal status, false case, undetected, compounded, pending trial, under investigation, other disposal.

**Possible Relationships:** Outcome belongs to a case, is influenced by chargesheet, court, legal sections, accused, and investigation quality metrics.

## 36. Time Period

**Description:** Calendar or financial reporting period used by FIR records and aggregate reports.

**Source Dataset:** `FIR_Details_Data.csv`, crime review CSVs, `crime-review-december-modified-2025.pdf`, victim/suspect CSVs, road/crime summary CSVs.

**Primary Identifier:** Date, month-year, year, or financial year depending on source.

**Attributes:** FIR year, FIR month, FIR day, month name, year, financial year, report month, current month, previous month, corresponding previous year, year-to-date.

**Possible Relationships:** Time period groups cases, crime statistics, victim statistics, suspect statistics, road accident statistics, and performance metrics.

## 37. Age Band

**Description:** Demographic age grouping used in victim statistics and person profiles.

**Source Dataset:** `VICTIM_OF_MURDER_2013.csv`, `VICTIMS_OF_KA_2013.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Age band label.

**Attributes:** Upto 10 years, 10-15 years, 15-18 years, 18-30 years, 30-50 years, above 50 years, exact age when available in ERD.

**Possible Relationships:** Age band classifies victims, complainants, accused, and demographic statistics.

## 38. Gender

**Description:** Gender classification for victims, accused, complainants, and employees.

**Source Dataset:** `FIR_Details_Data.csv`, `VICTIM_OF_MURDER_2013.csv`, `VICTIMS_OF_KA_2013.csv`, `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Gender value or gender lookup ID.

**Attributes:** Male, female, boy, girl, transgender/third gender if available from ERD lookup values, aggregate gender totals.

**Possible Relationships:** Gender classifies victims, accused, complainants, officers, and demographic statistics.

## 39. Occupation

**Description:** Occupation reference for complainants or people involved in cases.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** ERD proposes `OccupationID`.

**Attributes:** Occupation name.

**Possible Relationships:** Occupation classifies complainants and can support victim/complainant vulnerability or profile analytics.

## 40. Religion

**Description:** Religion reference for complainants.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** ERD proposes `ReligionID`.

**Attributes:** Religion name.

**Possible Relationships:** Religion classifies complainants where legally and ethically permitted for reporting, safeguards, or statutory analysis.

## 41. Caste

**Description:** Caste reference for complainants.

**Source Dataset:** `Police_FIR_ER_Diagram.pdf`, `crime-review-december-modified-2025.pdf` through SC/ST POA reporting.

**Primary Identifier:** ERD proposes `caste_master_id`.

**Attributes:** Caste name, SC/ST POA reporting category where applicable.

**Possible Relationships:** Caste classifies complainants and statutory crime categories, especially SC/ST POA analysis, subject to strict governance.

## 42. Purpose / Motive

**Description:** Reason, purpose, or subtype context for an offence.

**Source Dataset:** `VICTIMS_OF_KA_2013.csv`, crime review CSVs.

**Primary Identifier:** Purpose or minor-head label.

**Attributes:** Kidnapping/abduction purpose, murder-for-gain, property dispute, personal vendetta, sexual jealousy, other minor-head labels.

**Possible Relationships:** Purpose/motive refines crime category, victim statistics, case similarity, forecasting, and investigation triage.

## 43. Road Accident Statistic

**Description:** Aggregate statistic for fatal and non-fatal road accidents, road type, deaths, and injuries.

**Source Dataset:** `D47-Crimes (1)_0.csv`, `crime-review-december-modified-2025.pdf`, `FIR_Details_Data.csv`.

**Primary Identifier:** Composite logical key: period, geography, road type or city, severity.

**Attributes:** Fatal count, non-fatal count, total accidents, killed count, injured count, national/state/other road type, city, year.

**Possible Relationships:** Relates to city, district, road type, motor vehicle accident crime groups, FIR case records, and monthly crime review reports.

## 44. Road Type

**Description:** Road classification used in accident analysis.

**Source Dataset:** `crime-review-december-modified-2025.pdf`, `FIR_Details_Data.csv` through crime head values like national highways, state highways, other roads.

**Primary Identifier:** Road type label.

**Attributes:** National highway, state highway, other road, accident severity and counts.

**Possible Relationships:** Road type groups road accident cases and statistics, supports hotspot detection and traffic safety analysis.

## 45. Vehicle

**Description:** Vehicle involved in motor vehicle theft, accident, police fleet logging, or investigation.

**Source Dataset:** `crime-review-december-modified-2025.pdf`, `FIR_Details_Data.csv`.

**Primary Identifier:** Not present for incident vehicles. Police IT report has unit-level vehicle log counts, not vehicle IDs.

**Attributes:** Motor vehicle theft case counts, police vehicle actual strength, log-entered vehicles, log-not-entered vehicles, accident involvement implied by motor vehicle accident groups.

**Possible Relationships:** Vehicle may relate to case, offence location, theft, road accident, police unit, log book performance, and evidence. Current data is aggregate only.

## 46. Police IT Vehicle Log

**Description:** Unit-level logging of police vehicles in the Police IT MT module.

**Source Dataset:** `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** Composite logical key: report month, district/unit.

**Attributes:** District/unit name, actual vehicle strength, log-entered vehicles, log-not-entered vehicles, remarks.

**Possible Relationships:** Relates to police unit, district, report, vehicle, and operational compliance analytics.

## 47. SAKALA Service Performance

**Description:** Public-service receipt, disposal, and pendency metrics under SAKALA.

**Source Dataset:** `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** Composite logical key: report month, district or service name.

**Attributes:** District, service name, stipulated time, receipts, disposals, pendency after due date.

**Possible Relationships:** Relates to district, police unit, report, service type, and citizen-service performance analytics.

## 48. e-Sign Performance

**Description:** FIR and chargesheet electronic signing performance metrics.

**Source Dataset:** `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** Composite logical key: report month, district, document type.

**Attributes:** District name, FIR count, FIR e-sign count, FIR percentage, chargesheeted count, e-signed chargesheet count, chargesheet percentage.

**Possible Relationships:** Relates to district, police unit, FIR registration, chargesheet, report, and digital process compliance analytics.

## 49. Seva Sindhu Service

**Description:** Public-service transaction category and monthly processing status.

**Source Dataset:** `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** Composite logical key: report month, service name.

**Attributes:** Service name, received count, disposed count, pending count.

**Possible Relationships:** Relates to report, district/unit if available, service performance, and citizen-facing police workflows.

## 50. COTPA Enforcement Statistic

**Description:** District/unit statistics for Cigarettes and Other Tobacco Products Act enforcement sections and fines.

**Source Dataset:** `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** Composite logical key: report month, unit/district, COTPA section.

**Attributes:** Unit/district, Section 4 count, Section 5 count, Section 6A count, Section 6B count, Section 7 count, total fine amount.

**Possible Relationships:** Relates to legal act, legal section, district/unit, enforcement statistics, and report.

## 51. Preventive Action / Security Case

**Description:** Preventive action booked under CrPC or BNSS sections.

**Source Dataset:** 2026 monthly crime review CSVs, `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** Composite logical key: period, section, district/unit when available.

**Attributes:** Section 107 CrPC / 126 BNSS count, Section 109 CrPC / 128 BNSS count, Section 110 CrPC / 129 BNSS count, total security cases.

**Possible Relationships:** Relates to legal section, crime statistic, police unit, district, report, and preventive policing analytics.

## 52. Legal Document Source

**Description:** External legal source or citation URL for law/act metadata.

**Source Dataset:** `indian_laws_and_acts_v2.csv`.

**Primary Identifier:** URL, preferably combined with title.

**Attributes:** Title, source, place, published date, commencement date, URL.

**Possible Relationships:** Legal document source supports legal act, legal section, jurisdiction, citation, retrieval, and legal recommendation workflows.

## 53. Report Section / Narrative Observation

**Description:** Narrative analytical text within an official crime review report.

**Source Dataset:** `crime-review-december-modified-2025.pdf`.

**Primary Identifier:** Composite logical key: report, section number, section title.

**Attributes:** Section title, crime topic, narrative comparison, current-month statement, previous-month comparison, previous-year comparison, notes/provisional flags.

**Possible Relationships:** Belongs to monthly crime review report, describes crime statistics, links to crime category and time period, and supports automated briefing generation.

## 54. Data Source / Lineage

**Description:** Dataset or report from which a record or aggregate is derived.

**Source Dataset:** All raw datasets and PDFs.

**Primary Identifier:** Source filename and extraction/load timestamp when available.

**Attributes:** File name, file type, row/page count, source system, report month/year, provisional flag, duplicate/cleaned variant indicator, extraction quality notes.

**Possible Relationships:** Data source produces cases, statistics, legal references, reports, and derived analytical entities; supports auditability and duplicate prevention.

## Important Gap Entities

The following entities are important for an AI crime intelligence platform but are not sufficiently represented in the current datasets. They should be modeled later when source data becomes available.

## 55. Evidence

**Description:** Physical, documentary, forensic, or digital material linked to a case.

**Source Dataset:** Not directly present. Mentioned as missing in `dataset_analysis.md`; implied by the investigation workflow in `Police_FIR_ER_Diagram.pdf`.

**Primary Identifier:** Not available. Future model should use evidence ID or property/seizure ID.

**Attributes:** Evidence type, description, collection date/time, seizure memo, forensic status, chain of custody, linked case, linked accused/victim, location recovered.

**Possible Relationships:** Evidence belongs to a case, may link accused, victim, officer, place, vehicle, phone/digital account, property, legal section, and court outcome.

## 56. Phone / Digital Account

**Description:** Phone number, device, online account, or digital identifier used in communication, cyber crime, fraud, or investigation.

**Source Dataset:** Not directly present. `FIR_Details_Data.csv` has complaint mode `Distress call over phone`; `IT_Suspect_2013.csv` and cyber crime categories imply cyber/digital context.

**Primary Identifier:** Not available. Future model should use phone/device/account ID with privacy controls.

**Attributes:** Phone number, device identifier, account handle, platform, SIM/provider, ownership, usage period, cyber offence context, communication metadata.

**Possible Relationships:** Phone/digital account may link case, accused, victim, complainant, cyber suspect category, money trail, evidence, and network analysis.

## 57. Money Trail / Financial Transaction

**Description:** Financial movement associated with cheating, cyber crime, economic offences, extortion, fraud, or proceeds of crime.

**Source Dataset:** Not directly present. Economic offence and cyber crime counts appear in `FIR_Details_Data.csv` and `crime-review-december-modified-2025.pdf`; financial loss details are missing.

**Primary Identifier:** Not available. Future model should use transaction ID, account ID, wallet ID, or bank reference number.

**Attributes:** Amount, currency, transaction date/time, sender, receiver, bank/wallet, payment channel, freeze/recovery status, linked case, linked accused/victim.

**Possible Relationships:** Money trail links case, accused, victim, phone/digital account, bank/account, cyber crime, economic offence, and evidence.

## 58. Property / Stolen Asset

**Description:** Property involved in theft, burglary, robbery, vehicle theft, seizure, or recovery.

**Source Dataset:** Not directly present. Theft, burglary, robbery, and motor vehicle theft categories appear in FIR and crime review datasets.

**Primary Identifier:** Not available. Future model should use property/seizure/recovery ID.

**Attributes:** Property type, value, description, stolen date, recovered date, recovery status, owner/victim, case, location.

**Possible Relationships:** Property belongs to case, victim/owner, accused, evidence, place, money trail, and court outcome.

## 59. Weapon

**Description:** Weapon or instrument used in a crime.

**Source Dataset:** Not directly present. Serious offence categories imply weapon relevance, but no weapon fields are available.

**Primary Identifier:** Not available. Future model should use weapon/evidence ID.

**Attributes:** Weapon type, description, license status, recovery status, forensic result, linked case, linked accused/victim.

**Possible Relationships:** Weapon links case, accused, victim, evidence, legal section, and offence severity.

## 60. Witness

**Description:** Person providing evidence or testimony in a case.

**Source Dataset:** Not present in current datasets.

**Primary Identifier:** Not available. Future model should use witness ID or protected witness reference.

**Attributes:** Name or protected identity, age, gender, statement date, role, protection status, linked case.

**Possible Relationships:** Witness relates to case, victim, accused, evidence, court, and outcome.

## 61. Repeat Offender Profile

**Description:** Resolved person-level identity that links an accused across multiple cases.

**Source Dataset:** Not directly present. `FIR_Details_Data.csv` contains accused counts only; ERD has accused person records but no raw accused CSV.

**Primary Identifier:** Not available. Future model should use accused/person ID with entity resolution controls.

**Attributes:** Person identifiers, aliases, demographics, known addresses, prior cases, offence history, arrest history, conviction history, risk indicators.

**Possible Relationships:** Repeat offender profile links accused records across cases, legal sections, locations, victims, phone/digital accounts, vehicles, weapons, and money trails.

## Conceptual Relationship Backbone

- Case is the central entity.
- Case connects to police organization through police station/unit, district, state, officer, rank, and designation.
- Case connects to crime classification through crime group, major head, minor head, case category, gravity, and status.
- Case connects to law through act-section association, legal act, legal section, and crime-head-to-section mapping.
- Case connects to people through complainant, victim, accused, officer, and future witness/repeat-offender entities.
- Case connects to events through FIR registration, complaint, arrest/surrender, chargesheet, and outcome.
- Case connects to geography through place, coordinates, beat, village/area, city, district, and state.
- Aggregate reporting connects time period, crime statistic, monthly crime review report, district/unit, legal category, road accident statistic, service metrics, and source lineage.
- Missing intelligence entities such as evidence, phone/digital account, money trail, property, weapon, witness, and repeat-offender profile are required for advanced network analysis and repeat-offender detection.
