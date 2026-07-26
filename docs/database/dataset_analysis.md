# Dataset Analysis for AI Crime Intelligence Platform

Workspace analyzed: `datasets/raw/`

Scope: 17 CSV files and 2 PDF files were reviewed. This document is analytical only. It does not define SQL, clean data, or change source datasets.

## Executive Summary

The raw workspace contains four major data domains:

- FIR operational data: detailed case-level police records with location, station, offence, legal section, IO, victim-count, accused-count, arrest, chargesheet, and conviction fields.
- Crime review aggregates: monthly and multi-year crime statistics by act, major head, minor head, month, and year.
- Legal reference data: IPC section descriptions, punishments, and broader Indian laws/acts metadata.
- Victim and special-topic statistics: NCRB-style 2013 victim demographics, cyber suspect categories, and road/traffic accident summaries.

Best AI use cases supported by the current data are crime analytics, hotspot detection, crime forecasting, crime classification, case similarity, legal recommendation, victim analysis, station/unit performance analytics, and limited network analysis. Stronger repeat-offender and investigative network features will require person-level accused, complainant, victim, arrest, vehicle, property, phone, and case linkage identifiers that are mostly absent from the CSVs.

## Cross-Dataset Observations

- `CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv` and `CRIME_REVIEW_2021_TO_2024_KARNATAKA (1).csv` are byte-identical duplicates.
- `CRIME_REVIEW_2021_TO_2024_KARNATAKA_CLEAN.csv` appears to be a cleaned version of the same 2021-2024 monthly review data, with missing numeric values filled and numeric counts stored as decimal strings.
- Monthly 2026 crime review CSVs use a common eight-column statistical structure, but February, March, April, and May contain seven additional blank-header columns with sparse hidden values.
- `FIR_Details_Data.csv` is the strongest dataset for case-level AI. It has 1,674,734 rows and 34 columns, but latitude and longitude are missing in about 69.7% of rows.
- `FIR_Details_Data-selected-columns.csv` has the expected FIR headers but all 124 rows are blank, so it is not analytically useful in its current form.
- The PDF `Police_FIR_ER_Diagram.pdf` is a conceptual target schema and relationship reference rather than transactional data.
- The PDF `crime-review-december-modified-2025.pdf` is a rich narrative and tabular crime review for December 2025, useful as a reporting reference and a source for extraction into structured review tables.

## Dataset Inventory

| Dataset | Type | Rows / Pages | Main Grain |
|---|---:|---:|---|
| `FIR_Details_Data.csv` | CSV | 1,674,734 rows | FIR / case record |
| `FIR_Details_Data-selected-columns.csv` | CSV | 124 rows | Empty FIR extract |
| `CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv` | CSV | 30,956 rows | Crime head by month-year |
| `CRIME_REVIEW_2021_TO_2024_KARNATAKA (1).csv` | CSV | 30,956 rows | Duplicate crime head by month-year |
| `CRIME_REVIEW_2021_TO_2024_KARNATAKA_CLEAN.csv` | CSV | 30,956 rows | Cleaned crime head by month-year |
| `CRIME_REVIEW_FOR_THE_MONTH_OF_JANUARY_2026_0_5.csv` | CSV | 764 rows | Crime head for January 2026 |
| `CRIME_REVIEW_FOR_THE_MONTH_OF_FEBRUARY_2026_12.csv` | CSV | 763 rows | Crime head for February 2026 |
| `CRIME_REVIEW_FOR_THE_MONTH_OF_MARCH_2026_0.csv` | CSV | 765 rows | Crime head for March 2026 |
| `CRIME_REVIEW_FOR_THE_MONTH_OF_APRIL_2026.csv` | CSV | 767 rows | Crime head for April 2026 |
| `CRIME_REVIEW_FOR_THE_MONTH_OF_MAY_2026.csv` | CSV | 771 rows | Crime head for May 2026 |
| `CRIME_REVIEW_FOR_THE_MONTH_OF_JUNE_2026.csv` | CSV | 765 rows | Crime head for June 2026 |
| `crime-review-december-modified-2025.pdf` | PDF | 54 pages | Narrative monthly crime review |
| `Police_FIR_ER_Diagram.pdf` | PDF | 9 pages | FIR system schema design |
| `ipc_sections.csv` | CSV | 456 parsed rows | IPC section reference |
| `indian_laws_and_acts_v2.csv` | CSV | 10,612 rows | Law / act metadata |
| `VICTIM_OF_MURDER_2013.csv` | CSV | 105 rows | Murder victims by state, gender, age |
| `VICTIMS_OF_KA_2013.csv` | CSV | 490 rows | Kidnapping / abduction victims by purpose, age, gender |
| `IT_Suspect_2013.csv` | CSV | 38 rows | Cyber suspect category by state |
| `D47-Crimes (1)_0.csv` | CSV | 965 rows | Bangalore accident summary, poorly structured |
| `D47Crimes_3_1.csv` | CSV | 4 rows | Tumakuru crime count by year |

## 1. FIR_Details_Data.csv

**Purpose:** Case-level FIR analytics for Karnataka Police across districts, police stations, crime groups, legal sections, victims, accused, arrests, chargesheets, convictions, and locations.

**Important Columns:** `District_Name`, `UnitName`, `FIR_YEAR`, `FIR_MONTH`, `FIR_Day`, `Offence_Duration`, `FIR Type`, `FIR_Stage`, `Complaint_Mode`, `CrimeGroup_Name`, `CrimeHead_Name`, `Latitude`, `Longitude`, `ActSection`, `IOName`, `KGID`, `Internal_IO`, `Place of Offence`, `Distance from PS`, `Beat_Name`, `Village_Area_Name`, `Male`, `Female`, `Boy`, `Girl`, `Age 0`, `VICTIM COUNT`, `Accused Count`, `Arrested Male`, `Arrested Female`, `Arrested Count No.`, `Accused_ChargeSheeted Count`, `Conviction Count`, `Unit_ID`.

**Primary Entity Represented:** FIR / crime case record.

**Possible Relationships:** District and police station/unit dimensions via `District_Name`, `UnitName`, `Unit_ID`; legal references via `ActSection`, `CrimeGroup_Name`, `CrimeHead_Name`; personnel via `IOName`, `KGID`, `Internal_IO`; geography via `Latitude`, `Longitude`, `Place of Offence`, `Beat_Name`, `Village_Area_Name`; outcome tracking via `FIR_Stage`, arrest, chargesheet, and conviction counts.

**Data Quality Issues:** About 69.7% of latitude/longitude values are missing. Some populated coordinates are invalid or swapped, with examples such as latitude `75.655721`, longitude `16.172535`, longitude `777.744746`, and latitude `-0.7709293`. `FIR_Stage` has 343 distinct values, indicating inconsistent status granularity or spelling. `Offence_Duration` includes negative values and very large values up to 44,195. `VICTIM COUNT` is nearly always zero despite separate male/female/boy/girl counts. The column `Arrested Count\tNo.` contains an embedded tab in the header.

**Missing Information:** No stable FIR number, case ID, accused ID, victim ID, complainant ID, court ID, chargesheet date, incident date-time, full address standardization, offence narrative, property/weapon/vehicle details, accused-victim relationship, repeat-offender identifier, or explicit case-to-case linkage.

**AI Features Supported:** Crime analytics, hotspot detection where coordinates are available, station and district performance analytics, crime forecasting by time/location/category, case stage prediction, legal section recommendation from crime group/head and act-section text, victim-count analysis, accused/arrest/chargesheet/conviction outcome modeling, case similarity using offence category and place text, and limited network analysis through IO, unit, beat, and legal-section co-occurrence.

## 2. FIR_Details_Data-selected-columns.csv

**Purpose:** Intended to be a reduced FIR extract containing core case dimensions.

**Important Columns:** `District_Name`, `UnitName`, `FIR_YEAR`, `FIR_MONTH`, `Offence_Duration`, `FIR_Day`, `FIR Type`, `FIR_Stage`, `Complaint_Mode`, `CrimeGroup_Name`.

**Primary Entity Represented:** Intended FIR / case record extract.

**Possible Relationships:** Would relate to the full FIR dataset on district, unit, time, complaint mode, FIR type, FIR stage, and crime group if populated.

**Data Quality Issues:** All 124 rows are fully blank across every column.

**Missing Information:** All data values are missing. No case identifiers or populated attributes exist.

**AI Features Supported:** None in its current state. If repopulated, it could support lightweight crime analytics, forecasting, and stage distribution analysis.

## 3. CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv

**Purpose:** Monthly Karnataka crime review aggregates from 2021 through 2024, grouped by act, major head, minor head, month, and year.

**Important Columns:** `Sl. No.`, `ACT`, `MAJOR HEAD`, `MINOR HEAD`, `During the current year upto the end of month under review`, `During the corresponding month of previous year`, `During the previous month`, `During the current month`, `Month`, `Year`.

**Primary Entity Represented:** Crime statistic row for an act / major head / minor head / month / year.

**Possible Relationships:** Can link to FIR crime groups and heads through `ACT`, `MAJOR HEAD`, `MINOR HEAD`; can link to legal references through section mentions embedded in head names; can align with monthly 2026 crime review CSVs and the December 2025 PDF.

**Data Quality Issues:** `MINOR HEAD` is missing in 3,462 rows, about 11.2%. Several numeric measure columns have small missingness around 0.3%. Four rows have missing `MAJOR HEAD`. The duplicate file with `(1)` has the same content.

**Missing Information:** No district/unit dimension, no source extraction timestamp, no unique crime-head code, no explicit month number, no legal act/section code split into structured fields.

**AI Features Supported:** Crime analytics, trend analysis, seasonality detection, crime forecasting, anomaly detection, major/minor crime category embeddings, policy dashboarding, and comparison against corresponding previous year/month.

## 4. CRIME_REVIEW_2021_TO_2024_KARNATAKA (1).csv

**Purpose:** Duplicate copy of the 2021-2024 Karnataka crime review aggregate dataset.

**Important Columns:** Same as `CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv`.

**Primary Entity Represented:** Crime statistic row for an act / major head / minor head / month / year.

**Possible Relationships:** Same as the non-`(1)` file.

**Data Quality Issues:** Byte-identical duplicate of `CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv`, creating risk of double counting if both are loaded as independent facts.

**Missing Information:** Same as the non-`(1)` file.

**AI Features Supported:** Same as the non-`(1)` file, but should be deduplicated or treated as a redundant source.

## 5. CRIME_REVIEW_2021_TO_2024_KARNATAKA_CLEAN.csv

**Purpose:** Cleaned variant of the 2021-2024 crime review aggregate data.

**Important Columns:** Same ten columns as the raw 2021-2024 review files.

**Primary Entity Represented:** Cleaned crime statistic row for an act / major head / minor head / month / year.

**Possible Relationships:** Same as the raw 2021-2024 crime review files.

**Data Quality Issues:** Numeric measures are represented as decimal strings such as `2.0`, while raw files use integer strings. `MINOR HEAD` is still missing in 4 rows. Because the cleaning method is not documented, filled values should be treated as derived rather than authoritative until validated.

**Missing Information:** No cleaning lineage, source hash, imputation method, or validation notes.

**AI Features Supported:** Crime analytics, forecasting, anomaly detection, and model training where complete numeric series are required, subject to validation of the cleaning process.

## 6. CRIME_REVIEW_FOR_THE_MONTH_OF_JANUARY_2026_0_5.csv

**Purpose:** Monthly crime review aggregate for January 2026.

**Important Columns:** `Sl.No.`, `Heads of Crime`, `Major Heads`, `Minor Heads`, `During the current year upto the end of month under review`, `During the corresponding month of previous year`, `During the previous month`, `During the current month`.

**Primary Entity Represented:** Crime head / minor head statistic for January 2026.

**Possible Relationships:** Links to 2021-2024 review data through crime heads; links to 2026 monthly review files; links to legal references through IPC/BNS section mentions in `Major Heads`; can validate against FIR aggregates by month.

**Data Quality Issues:** `Minor Heads` is missing in 64 rows, about 8.4%. One row has missing values in all four count measures.

**Missing Information:** No explicit `Month` or `Year` columns; they must be inferred from the filename. No district/unit dimension.

**AI Features Supported:** Crime analytics, current-year trend tracking, early 2026 forecasting, anomaly detection, category comparison, and legal-category mapping.

## 7. CRIME_REVIEW_FOR_THE_MONTH_OF_FEBRUARY_2026_12.csv

**Purpose:** Monthly crime review aggregate for February 2026.

**Important Columns:** Same eight core crime review columns as January 2026, plus seven blank-header columns in the raw CSV.

**Primary Entity Represented:** Crime head / minor head statistic for February 2026.

**Possible Relationships:** Same as January 2026; can be combined with other 2026 monthly review files after normalizing blank-header columns.

**Data Quality Issues:** `Minor Heads` is missing in 73 rows, about 9.6%. The file has one fully blank row. Several core descriptor fields are missing in some rows. Seven blank-header columns are 95% to 99.6% missing but contain sparse values, likely artifacts from PDF/table extraction or merged report columns.

**Missing Information:** No explicit month/year fields, no labels for the seven extra columns, no district/unit dimension.

**AI Features Supported:** Crime analytics, forecasting, monthly anomaly detection, category comparison, and limited report reconciliation.

## 8. CRIME_REVIEW_FOR_THE_MONTH_OF_MARCH_2026_0.csv

**Purpose:** Monthly crime review aggregate for March 2026.

**Important Columns:** Same eight core crime review columns, plus seven blank-header columns.

**Primary Entity Represented:** Crime head / minor head statistic for March 2026.

**Possible Relationships:** Same as other 2026 monthly crime review datasets.

**Data Quality Issues:** `Minor Heads` is missing in 71 rows, about 9.3%. Two rows have missing count measures. Blank-header columns are mostly empty but contain sparse unlabeled values.

**Missing Information:** No explicit month/year fields, no labels for extra columns, no district/unit dimension.

**AI Features Supported:** Crime analytics, trend monitoring, forecasting, monthly variance detection, and category-to-law mapping.

## 9. CRIME_REVIEW_FOR_THE_MONTH_OF_APRIL_2026.csv

**Purpose:** Monthly crime review aggregate for April 2026.

**Important Columns:** Same eight core crime review columns, plus seven blank-header columns.

**Primary Entity Represented:** Crime head / minor head statistic for April 2026.

**Possible Relationships:** Same as other 2026 monthly crime review datasets.

**Data Quality Issues:** `Minor Heads` is missing in 71 rows, about 9.3%. Three to four rows have missing values in count columns. Blank-header columns are mostly empty but contain sparse unlabeled values.

**Missing Information:** No explicit month/year fields, no labels for extra columns, no district/unit dimension.

**AI Features Supported:** Crime analytics, trend monitoring, forecasting, anomaly detection, and legal category enrichment.

## 10. CRIME_REVIEW_FOR_THE_MONTH_OF_MAY_2026.csv

**Purpose:** Monthly crime review aggregate for May 2026.

**Important Columns:** Same eight core crime review columns, plus seven blank-header columns.

**Primary Entity Represented:** Crime head / minor head statistic for May 2026.

**Possible Relationships:** Same as other 2026 monthly crime review datasets.

**Data Quality Issues:** `Minor Heads` is missing in 73 rows, about 9.5%. One fully blank row exists. Five rows have missing count measures. Blank-header columns are mostly empty but contain sparse unlabeled values.

**Missing Information:** No explicit month/year fields, no labels for extra columns, no district/unit dimension.

**AI Features Supported:** Crime analytics, trend monitoring, forecasting, monthly anomaly detection, and category comparison.

## 11. CRIME_REVIEW_FOR_THE_MONTH_OF_JUNE_2026.csv

**Purpose:** Monthly crime review aggregate for June 2026.

**Important Columns:** Same eight core crime review columns as January 2026.

**Primary Entity Represented:** Crime head / minor head statistic for June 2026.

**Possible Relationships:** Same as other 2026 monthly crime review datasets.

**Data Quality Issues:** `Minor Heads` is missing in 72 rows, about 9.4%. One row has missing values in all four count measures.

**Missing Information:** No explicit month/year fields; no district/unit dimension.

**AI Features Supported:** Crime analytics, mid-year trend detection, crime forecasting, anomaly detection, category comparison, and legal-category mapping.

## 12. crime-review-december-modified-2025.pdf

**Purpose:** Official Karnataka Police crime review and CCTNS performance report for December 2025.

**Important Content:** Narrative sections for murder, dacoity, robbery, burglary, theft, riots, hurt, special and local laws, crimes against women, POCSO, SC/ST POA, preventive action, cyber crime, economic offences, MMDR/KMMCR, motor vehicle theft, and NDPS. It also includes district-wise reported cases, IPC/BNS and special/local law statistics, crime against women/children/SC-ST, road accidents, commissionerate/range summaries, SAKALA receipts/disposals, comparative crime statements, e-sign FIR/chargesheet details, police IT vehicle log book details, Seva Sindhu report, and COTPA statistics.

**Primary Entity Represented:** Monthly crime and police-performance report, combining narrative observations and tabular aggregates.

**Possible Relationships:** Can be reconciled to monthly crime-review CSVs, FIR aggregates, district/unit dimensions, road accident datasets, SAKALA service data, e-sign performance data, and legal sections mentioned in IPC/BNS headings.

**Data Quality Issues:** PDF extraction creates line breaks and merged table text, so values require careful table extraction validation. Several report statements are narrative and not atomic facts. Statistics are explicitly provisional for 2024 and 2025 and based on Police IT classification as of 01/01/2026.

**Missing Information:** No machine-readable table structure, no row-level FIR/case records, no stable district codes, no direct primary keys, no extraction metadata.

**AI Features Supported:** Report summarization, monthly crime analytics, automated briefing generation, trend explanation, district comparison, CCTNS performance analytics, anomaly detection, narrative-to-table extraction, and policy question answering.

## 13. Police_FIR_ER_Diagram.pdf

**Purpose:** FIR system entity relationship design document for Karnataka Police.

**Important Content:** Entities include `CaseMaster`, `ComplainantDetails`, `ActSectionAssociation`, `Victim`, `Accused`, `ArrestSurrender`, `Act`, `Section`, `CrimeHeadActSection`, `CrimeHead`, `CrimeSubHead`, `CasteMaster`, `ReligionMaster`, `OccupationMaster`, `CaseStatusMaster`, `Court`, `District`, `State`, `Unit`, `UnitType`, `Rank`, `Designation`, `Employee`, `CaseCategory`, `GravityOffence`, and `ChargesheetDetails`.

**Primary Entity Represented:** Data model / schema reference, not operational records.

**Possible Relationships:** Provides target relationships for FIR data architecture: one case to many victims, accused, arrests, complainants, and act-section associations; cases to category, gravity, crime head, sub-head, court, police station, and registering employee; units to districts/states and unit types; employees to rank/designation/unit; act/section to crime head mappings.

**Data Quality Issues:** It is a PDF specification, not a loadable data table. Some naming differs from the CSVs, such as `CaseMasterID` in the ERD versus no case ID in the FIR CSV. Relationship text mentions an occurrence table and arrest-surrender junction that are not present as CSVs.

**Missing Information:** No actual master data rows, no physical DDL, no indexes, no constraints beyond descriptive notes, no sample data, and no mapping document from CSV fields to ERD entities.

**AI Features Supported:** Canonical data model design, entity resolution planning, knowledge graph architecture, relationship-aware case intelligence, repeat offender design, victim/accused network design, legal recommendation architecture, and data gap analysis.

## 14. ipc_sections.csv

**Purpose:** Reference dataset for Indian Penal Code sections, offence descriptions, punishments, and section identifiers.

**Important Columns:** `Description`, `Offense`, `Punishment`, `Section`.

**Primary Entity Represented:** IPC section.

**Possible Relationships:** Can map to `ActSection` in FIR records, IPC section mentions in crime review `Major Heads`, and act-section associations in the ERD. Can support enrichment of crime heads with punishments and legal descriptions.

**Data Quality Issues:** 456 parsed rows, but the file contains embedded newlines in descriptions. There are 2 blank parsed rows, 27 rows with parsing-length inconsistencies, 12 missing punishments, 12 missing sections, and 11 missing offences. Section values use a format such as `IPC_302`, while FIR `ActSection` text uses free-form legal language.

**Missing Information:** No BNS equivalent sections, no effective dates, no severity score, no bailable/cognizable/compoundable flags, no state amendments, no structured imprisonment/fine fields, no legal hierarchy by chapter.

**AI Features Supported:** Legal recommendation, charge suggestion, offence explanation, case similarity by legal section, legal Q&A, punishment lookup, and legal-section normalization.

## 15. indian_laws_and_acts_v2.csv

**Purpose:** Broad legal metadata reference for Indian laws, rules, acts, publication dates, commencement dates, places, sources, and URLs.

**Important Columns:** `title`, `source`, `place`, `published_date`, `commencement_date`, `url`.

**Primary Entity Represented:** Law / act / rule / legal document metadata record.

**Possible Relationships:** Can enrich FIR `ActSection`, crime review act names, legal recommendation workflows, and a broader legal knowledge base. URLs can link to source documents on Indian Kanoon.

**Data Quality Issues:** 47 rows have column-length mismatches during parsing. `commencement_date` is missing in 394 rows, about 3.7%. Date values include suspicious years such as `1074` and `1800`. Some sample values indicate column drift, with values like `2003"` appearing in source/place fields. Duplicate titles and URLs appear likely.

**Missing Information:** No act code, section-level detail, legal status, repeal/amendment status, jurisdiction normalization, official gazette identifier, document text, or mapping to IPC/BNS/SLL act codes.

**AI Features Supported:** Legal knowledge retrieval, legal recommendation context, act-name normalization, source citation support, policy/legal Q&A, and legal document discovery.

## 16. VICTIM_OF_MURDER_2013.csv

**Purpose:** Murder victim demographic statistics by state/UT, gender, age band, and total count for 2013.

**Important Columns:** `STATE/UT`, `YEAR`, `GENDER`, `Upto 10 years`, `10-15 years`, `15-18 years`, `18-30 years`, `30-50 years`, `Above 50 years`, `Total`.

**Primary Entity Represented:** State-year-gender murder victim demographic aggregate.

**Possible Relationships:** Can compare with FIR victim counts for murder categories, link to state dimension, and enrich victim-risk analytics with historical demographic baselines.

**Data Quality Issues:** Includes `Male`, `Female`, and `Total` rows, so aggregation must avoid double counting. Single year only. State/UT names may not match FIR district/state naming.

**Missing Information:** No district, police station, caste/religion, accused relationship, motive, weapon, location, incident date, or case outcome.

**AI Features Supported:** Victim analysis, demographic risk profiling, murder trend baseline, crime analytics, and model feature priors for age/gender vulnerability.

## 17. VICTIMS_OF_KA_2013.csv

**Purpose:** Victim demographics for kidnapping/abduction purposes by state/UT, age band, gender, and total counts for 2013.

**Important Columns:** `STATE/UT`, `YEAR`, `Pupose`, `Total No. of cases reported`, male/female age-band columns, `Total Male`, `Total Female`, `Grand Total`.

**Primary Entity Represented:** State-year-purpose victim demographic aggregate.

**Possible Relationships:** Can link to FIR crime groups such as kidnapping, missing person, crimes against women/children, and victim demographic counts. Can link to state dimension and legal references for kidnapping/abduction offences.

**Data Quality Issues:** Column `Pupose` is misspelled. Aggregates by purpose, not case-level records. Single year only. State-level only, no Karnataka district granularity. Need care not to mix case counts and victim counts.

**Missing Information:** No district/unit, case ID, offender relationship, recovery status, trafficking indicators, FIR stage, or legal sections.

**AI Features Supported:** Victim analysis, vulnerable age/gender segmentation, kidnapping purpose analytics, crimes-against-children analysis, case triage priors, and policy dashboards.

## 18. IT_Suspect_2013.csv

**Purpose:** Cyber crime suspect category statistics by state/UT for 2013.

**Important Columns:** `State/ UTs`, `Crime Head`, `Year`, `Foreign National /Group`, `Disgrunted Employee /Employee`, `Cracker/Student/ Professional learners`, `Business Competitor`, `Neighbours /Friends & Relatives`, `Others`, `Total`.

**Primary Entity Represented:** State-year cyber suspect category aggregate.

**Possible Relationships:** Can enrich FIR records where `CrimeGroup_Name` is `CYBER CRIME`, link to state dimension, and support suspect-type priors for cyber case triage.

**Data Quality Issues:** `Disgrunted` is misspelled. The dataset is one year only and state-level, not case-level. The broad `Others` category dominates many rows, limiting interpretability.

**Missing Information:** No district, police station, case IDs, specific cyber offence types, victim profile, modus operandi, platform/channel, financial loss, accused identity, or investigation outcome.

**AI Features Supported:** Cyber crime analytics, suspect profile priors, victim/suspect pattern analysis, cyber case triage, and high-level comparative dashboards.

## 19. D47-Crimes (1)_0.csv

**Purpose:** Intended summary of Bangalore city road accident counts, split into fatal and non-fatal accident counts by year.

**Important Columns:** `City Name`, `Year`, `Total number of crimes recorded (Total No of Accidents in Bangalore city)`, and a blank fourth column that actually contains `Non fatal` values after a multi-row header.

**Primary Entity Represented:** City-year accident summary, but the raw structure is distorted.

**Possible Relationships:** Can relate to FIR motor vehicle accident crime groups, road accident sections in the December 2025 crime review PDF, and city/unit dimensions.

**Data Quality Issues:** The file has a multi-line header, 23 columns, 19 fully empty extra columns, 6 blank rows, and many rows that only repeat `Bangalore City` with no values. The fatal/non-fatal labels appear in the first data row instead of proper headers. Only the first few rows contain clear year/count values.

**Missing Information:** No district code, no police station, no location, no accident severity beyond fatal/non-fatal, no injured/killed counts, no vehicle type, no road type, and no data dictionary.

**AI Features Supported:** Limited road accident trend analytics after structural correction. In current form, it is weak for AI features and should not be used for model training without validation.

## 20. D47Crimes_3_1.csv

**Purpose:** Small Tumakuru annual crime count extract.

**Important Columns:** `City Name`, `Year`, `Total number of crimes recorded`.

**Primary Entity Represented:** City-year crime count aggregate.

**Possible Relationships:** Can relate to district/city dimensions and aggregate crime trend data, but only for Tumakuru.

**Data Quality Issues:** Only 4 rows. Year values use financial-year format such as `2017-18`, unlike calendar-year fields in FIR and crime review datasets.

**Missing Information:** No crime category, no police station, no legal section, no victim/accused details, no monthly breakdown, and no source context.

**AI Features Supported:** Very limited trend analytics for Tumakuru. Not sufficient for forecasting or hotspot detection by itself.

## Recommended Conceptual Relationships

- FIR case facts should center on a canonical `Case` entity derived from `FIR_Details_Data.csv`, but the current CSV lacks a stable case ID.
- District, unit, beat, village/area, and coordinates should become location dimensions.
- Crime group/head and act-section values should be normalized and linked to IPC/BNS/SLL legal references.
- The ERD PDF should guide future target architecture for case, complainant, victim, accused, arrest/surrender, act-section, court, employee, unit, district, and state entities.
- Monthly crime review CSVs and the December 2025 PDF should be treated as aggregate fact sources for validation, reporting, and forecasting.
- Victim and suspect datasets should be treated as external historical aggregate references, not direct substitutes for case-level victim or accused entities.

## AI Feature Readiness

| AI Feature | Supported By | Readiness |
|---|---|---|
| Crime Analytics | FIR data, crime review CSVs, December 2025 PDF | High |
| Hotspot Detection | FIR coordinates, place text, beat, village/area | Medium, limited by missing/invalid coordinates |
| Crime Forecasting | 2021-2024 review, 2026 monthly review, FIR dates | High for aggregate trends, medium for geospatial trends |
| Victim Analysis | FIR victim counts, murder victims, KA victims | Medium, lacks person-level victim records |
| Repeat Offender Detection | Accused counts only | Low, requires accused identity/history |
| Legal Recommendation | FIR `ActSection`, IPC sections, laws/acts, ERD act-section model | Medium, needs structured section normalization and BNS mapping |
| Network Analysis | IO, unit, crime category, legal section co-occurrence | Low to medium, lacks person/entity links |
| Case Similarity | FIR crime group/head, act-section, place text, stage/outcome | Medium, stronger if narratives and case IDs are added |
| Unit Performance Analytics | FIR stages/outcomes, December 2025 CCTNS/e-sign/SAKALA sections | High for aggregate dashboards |
| Report Summarization | December 2025 PDF and crime review CSVs | High |

## Key Missing Data for a Full AI Crime Intelligence Platform

- Stable case identifiers: FIR number, crime number, case master ID, and court case number.
- Person identifiers: accused, victim, complainant, witness, IO, arresting officer, and repeat-offender IDs.
- Event chronology: incident from/to timestamp, FIR registration timestamp, arrest date, chargesheet date, trial milestones, disposal date.
- Geospatial precision: validated coordinates, address hierarchy, beat boundaries, police station boundaries, road type, landmark normalization.
- Legal normalization: structured act code, section code, IPC/BNS equivalence, offence severity, cognizable/bailable/compoundable flags.
- Investigation artifacts: modus operandi, weapons, property, vehicles, phone numbers, digital accounts, financial loss, evidence types.
- Outcome fields: court, chargesheet type, conviction/acquittal reasons, sentence, pendency, appeal status.
- Data lineage: source system, extraction date, classification date, provisional/final flag, and quality validation status.
