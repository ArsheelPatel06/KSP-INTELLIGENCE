# Master Data Model

Sources used:

- `docs/database/dataset_analysis.md`
- `docs/database/entities.md`
- `docs/database/entity_gap_analysis.md`
- `datasets/raw/Police_FIR_ER_Diagram.pdf`

Design rule: the official Karnataka Police FIR ER Diagram is the source of truth. Official tables must remain unchanged. The AI Crime Intelligence Platform extends the system only through AI-specific extension tables that reference official identifiers.

This document is design-only. It does not contain SQL.

## Model Principles

- Keep official operational tables exactly as defined by Karnataka Police.
- Add AI tables in a separate intelligence layer.
- Reference official keys rather than duplicating official entities.
- Store AI outputs with model version, confidence, review status, and audit metadata.
- Keep raw-source lineage and data-quality tracking separate from police operational records.
- Treat aggregate crime-review datasets as analytical facts, not replacements for official FIR case records.

## Layer 1: Official Karnataka Police Core Tables

These tables are preserved as-is from the official ER Diagram. They are documented here so AI extension tables can reference them consistently.

### `CaseMaster`

- **Purpose:** Official FIR/case master record.
- **Columns:** `CaseMasterID`, `CrimeNo`, `CaseNo`, `CrimeRegisteredDate`, `PolicePersonID`, `PoliceStationID`, `CaseCategoryID`, `GravityOffenceID`, `CrimeMajorHeadID`, `CrimeMinorHeadID`, `CaseStatusID`, `CourtID`, `IncidentFromDate`, `IncidentToDate`, `InfoReceivedPSDate`, `latitude`, `longitude`, `BriefFacts`.
- **Primary Key:** `CaseMasterID`.
- **Foreign Keys:** `PolicePersonID` to `Employee`; `PoliceStationID` to `Unit`; `CaseCategoryID` to `CaseCategory`; `GravityOffenceID` to `GravityOffence`; `CrimeMajorHeadID` to `CrimeHead`; `CrimeMinorHeadID` to `CrimeSubHead`; `CaseStatusID` to `CaseStatusMaster`; `CourtID` to `Court`.
- **Relationships:** Parent of complainants, victims, accused persons, act-section associations, arrest/surrender events, occurrence/location records, chargesheets, AI recommendations, risk scores, hotspots, and case similarity results.
- **Source Dataset:** Official ERD; partially represented by `FIR_Details_Data.csv`.
- **Used by AI Features:** Crime analytics, case similarity, legal recommendation, risk scoring, hotspot detection, forecasting, investigation summarization, repeat-offender linkage.

### `ComplainantDetails`

- **Purpose:** Official complainant/person filing or providing case information.
- **Columns:** `ComplainantID`, `CaseMasterID`, `ComplainantName`, `AgeYear`, `OccupationID`, `ReligionID`, `CasteID`, `GenderID`.
- **Primary Key:** `ComplainantID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `OccupationID` to `OccupationMaster`; `ReligionID` to `ReligionMaster`; `CasteID` to `CasteMaster`.
- **Relationships:** Many complainants can belong to one case; complainants can connect to demographic analysis and future social relationship intelligence.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Victim/complainant analysis, case triage, social relationship analysis, complaint pattern analysis.

### `Victim`

- **Purpose:** Official person-level victim record.
- **Columns:** `VictimMasterID`, `CaseMasterID`, `VictimName`, `AgeYear`, `GenderID`, `VictimPolice`.
- **Primary Key:** `VictimMasterID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`.
- **Relationships:** Many victims can belong to one case; can link to evidence, offender relationships, risk scores, and victim demographic baselines.
- **Source Dataset:** Official ERD; only aggregate victim counts are present in `FIR_Details_Data.csv`, `VICTIM_OF_MURDER_2013.csv`, and `VICTIMS_OF_KA_2013.csv`.
- **Used by AI Features:** Victim analysis, vulnerability scoring, case prioritization, social graph analysis.

### `Accused`

- **Purpose:** Official person-level accused record for a case.
- **Columns:** `AccusedMasterID`, `CaseMasterID`, `AccusedName`, `AgeYear`, `GenderID`, `PersonID`.
- **Primary Key:** `AccusedMasterID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`.
- **Relationships:** Many accused persons can belong to one case; can link to arrest/surrender, repeat-offender profile, gang/network, evidence, phone, vehicle, and money-trail extension tables.
- **Source Dataset:** Official ERD; only aggregate accused counts are present in `FIR_Details_Data.csv`.
- **Used by AI Features:** Repeat offender detection, network analysis, risk scoring, case similarity, arrest analytics.

### `ArrestSurrender`

- **Purpose:** Official arrest or voluntary surrender event.
- **Columns:** `ArrestSurrenderID`, `CaseMasterID`, `ArrestSurrenderTypeID`, `ArrestSurrenderDate`, `ArrestSurrenderStateId`, `ArrestSurrenderDistrictId`, `PoliceStationID`, `IOID`, `CourtID`, `AccusedMasterID`, `IsAccused`, `IsComplainantAccused`.
- **Primary Key:** `ArrestSurrenderID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `ArrestSurrenderStateId` to `State`; `ArrestSurrenderDistrictId` to `District`; `PoliceStationID` to `Unit`; `IOID` to `Employee`; `CourtID` to `Court`; `AccusedMasterID` to `Accused`.
- **Relationships:** Links case, accused, IO, police station, court, district, and state; may also link through the official arrest-accused junction.
- **Source Dataset:** Official ERD; aggregate arrest counts appear in `FIR_Details_Data.csv`.
- **Used by AI Features:** Custody analytics, repeat-offender tracking, officer workload analysis, case progression modeling.

### `Act`

- **Purpose:** Official legal act master.
- **Columns:** `ActCode`, `ActDescription`, `ShortName`, `Active`.
- **Primary Key:** `ActCode`.
- **Foreign Keys:** None.
- **Relationships:** Parent of legal sections; referenced by case act-section associations and crime-head mappings.
- **Source Dataset:** Official ERD; related reference data in `indian_laws_and_acts_v2.csv`.
- **Used by AI Features:** Legal recommendation, statute lookup, charge normalization, legal Q&A.

### `Section`

- **Purpose:** Official legal section master under an act.
- **Columns:** `ActCode`, `SectionCode`, `SectionDescription`, `Active`.
- **Primary Key:** `ActCode` plus `SectionCode`.
- **Foreign Keys:** `ActCode` to `Act`.
- **Relationships:** Belongs to an act; referenced by case act-section associations and crime-head mappings.
- **Source Dataset:** Official ERD; related IPC reference in `ipc_sections.csv`.
- **Used by AI Features:** Legal recommendation, section normalization, case similarity, punishment lookup.

### `ActSectionAssociation`

- **Purpose:** Official association between a case and the legal acts/sections invoked in that case.
- **Columns:** `CaseMasterID`, `ActID`, `SectionID`, `ActOrderID`, `SectionOrderID`.
- **Primary Key:** Composite logical key using case, act, section, and display order.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `ActID` to `Act`; `SectionID` to `Section`.
- **Relationships:** Many act-section associations can belong to one case.
- **Source Dataset:** Official ERD; partially represented by free-form `ActSection` in `FIR_Details_Data.csv`.
- **Used by AI Features:** Legal recommendation, legal risk scoring, charge similarity, statute analytics.

### `CrimeHead`

- **Purpose:** Official major crime classification.
- **Columns:** `CrimeHeadID`, `CrimeGroupName`, `Active`.
- **Primary Key:** `CrimeHeadID`.
- **Foreign Keys:** None.
- **Relationships:** Parent of crime sub-heads; referenced by case major crime head and crime-head-to-act-section mappings.
- **Source Dataset:** Official ERD; related crime group/head values in FIR and crime review datasets.
- **Used by AI Features:** Crime analytics, forecasting, classification, dashboards, hotspot detection.

### `CrimeSubHead`

- **Purpose:** Official minor crime classification under a crime head.
- **Columns:** `CrimeSubHeadID`, `CrimeHeadID`, `CrimeHeadName`, `SeqID`.
- **Primary Key:** `CrimeSubHeadID`.
- **Foreign Keys:** `CrimeHeadID` to `CrimeHead`.
- **Relationships:** Many sub-heads belong to one crime head; cases can reference a sub-head.
- **Source Dataset:** Official ERD; related minor head values in crime review datasets.
- **Used by AI Features:** Fine-grained forecasting, case similarity, motive/subtype analytics.

### `CrimeHeadActSection`

- **Purpose:** Official mapping between crime classification and legal act-section combinations.
- **Columns:** `CrimeHeadID`, `ActCode`, `SectionCode`.
- **Primary Key:** Composite logical key using crime head, act, and section.
- **Foreign Keys:** `CrimeHeadID` to `CrimeHead`; `ActCode` to `Act`; `SectionCode` to `Section`.
- **Relationships:** One crime head can map to many act-section combinations; one act/section can support multiple crime heads.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Legal recommendation, classification validation, charge completeness checks.

### `CaseCategory`

- **Purpose:** Official case category lookup such as FIR, UDR, PAR, or Zero FIR.
- **Columns:** `CaseCategoryID`, `LookupValue`.
- **Primary Key:** `CaseCategoryID`.
- **Foreign Keys:** None.
- **Relationships:** Many cases can share one category.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Case filtering, workflow routing, report segmentation.

### `GravityOffence`

- **Purpose:** Official offence gravity/severity lookup.
- **Columns:** `GravityOffenceID`, `LookupValue`.
- **Primary Key:** `GravityOffenceID`.
- **Foreign Keys:** None.
- **Relationships:** Many cases can share one gravity level.
- **Source Dataset:** Official ERD; related `FIR Type` values in `FIR_Details_Data.csv`.
- **Used by AI Features:** Risk scoring, prioritization, case triage, resource allocation.

### `CaseStatusMaster`

- **Purpose:** Official case status lookup.
- **Columns:** `CaseStatusID`, `CaseStatusName`.
- **Primary Key:** `CaseStatusID`.
- **Foreign Keys:** None.
- **Relationships:** Many cases can share one status.
- **Source Dataset:** Official ERD; related `FIR_Stage` values in `FIR_Details_Data.csv`.
- **Used by AI Features:** Case stage prediction, pendency analytics, investigation performance.

### `ChargesheetDetails`

- **Purpose:** Official chargesheet or final report details.
- **Columns:** `CSID`, `CaseMasterID`, `csdate`, `cstype`, `PolicePersonID`.
- **Primary Key:** `CSID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `PolicePersonID` to `Employee`.
- **Relationships:** Chargesheet belongs to a case and is filed by a police employee.
- **Source Dataset:** Official ERD; aggregate chargesheet count appears in `FIR_Details_Data.csv`; e-sign chargesheet metrics appear in the December 2025 PDF.
- **Used by AI Features:** Case outcome prediction, delay analysis, chargesheet quality analytics.

### `Court`

- **Purpose:** Official court master.
- **Columns:** `CourtID`, `CourtName`, `DistrictID`, `StateID`, `Active`.
- **Primary Key:** `CourtID`.
- **Foreign Keys:** `DistrictID` to `District`; `StateID` to `State`.
- **Relationships:** Cases and arrest/surrender events can reference court.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Trial tracking, court load analysis, outcome analytics.

### `District`

- **Purpose:** Official district master.
- **Columns:** `DistrictID`, `DistrictName`, `StateID`, `Active`.
- **Primary Key:** `DistrictID`.
- **Foreign Keys:** `StateID` to `State`.
- **Relationships:** Parent of units, employees, courts, arrest locations, crime statistics, hotspots, and performance metrics.
- **Source Dataset:** Official ERD; district names appear in FIR, crime review, and performance datasets.
- **Used by AI Features:** District analytics, forecasting, hotspot aggregation, resource allocation.

### `State`

- **Purpose:** Official state master.
- **Columns:** `StateID`, `StateName`, `NationalityID`, `Active`.
- **Primary Key:** `StateID`.
- **Foreign Keys:** None.
- **Relationships:** Parent of districts, units, courts, and arrest states.
- **Source Dataset:** Official ERD; state/UT values appear in victim and cyber suspect aggregate datasets.
- **Used by AI Features:** Geographic normalization, state-level trend comparison, jurisdiction handling.

### `Unit`

- **Purpose:** Official police station or police unit master.
- **Columns:** `UnitID`, `UnitName`, `TypeID`, `ParentUnit`, `NationalityID`, `StateID`, `DistrictID`, `Active`.
- **Primary Key:** `UnitID`.
- **Foreign Keys:** `TypeID` to `UnitType`; `StateID` to `State`; `DistrictID` to `District`; `ParentUnit` to `Unit`.
- **Relationships:** Registers cases, contains employees, handles arrests, belongs to district/state, supports hierarchy.
- **Source Dataset:** Official ERD; `UnitName` and `Unit_ID` appear in `FIR_Details_Data.csv`.
- **Used by AI Features:** Police station analytics, workload monitoring, hotspot ownership, patrol recommendation.

### `UnitType`

- **Purpose:** Official classification and hierarchy for police units.
- **Columns:** `UnitTypeID`, `UnitTypeName`, `CityDistState`, `Hierarchy`, `Active`.
- **Primary Key:** `UnitTypeID`.
- **Foreign Keys:** None.
- **Relationships:** One unit type can classify many units.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Unit hierarchy analytics, commissionerate/range/district rollups.

### `Employee`

- **Purpose:** Official police employee master.
- **Columns:** `EmployeeID`, `DistrictID`, `UnitID`, `RankID`, `DesignationID`, `KGID`, `FirstName`, `EmployeeDOB`, `GenderID`, `BloodGroupID`, `PhysicallyChallenged`, `AppointmentDate`.
- **Primary Key:** `EmployeeID`.
- **Foreign Keys:** `DistrictID` to `District`; `UnitID` to `Unit`; `RankID` to `Rank`; `DesignationID` to `Designation`.
- **Relationships:** Registers cases, acts as IO for arrests, files chargesheets, reviews AI outputs.
- **Source Dataset:** Official ERD; `IOName`, `KGID`, and `Internal_IO` appear in `FIR_Details_Data.csv`.
- **Used by AI Features:** Officer workload analysis, investigation performance, recommendation review, audit trails.

### `Rank`

- **Purpose:** Official police rank lookup.
- **Columns:** `RankID`, `RankName`, `Hierarchy`, `Active`.
- **Primary Key:** `RankID`.
- **Foreign Keys:** None.
- **Relationships:** One rank can classify many employees.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Personnel analytics, escalation routing, workload normalization.

### `Designation`

- **Purpose:** Official police designation lookup.
- **Columns:** `DesignationID`, `DesignationName`, `Active`, `SortOrder`.
- **Primary Key:** `DesignationID`.
- **Foreign Keys:** None.
- **Relationships:** One designation can classify many employees.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Workflow routing, officer responsibility analysis, audit review assignment.

### `OccupationMaster`

- **Purpose:** Official occupation lookup for complainants.
- **Columns:** `OccupationID`, `OccupationName`.
- **Primary Key:** `OccupationID`.
- **Foreign Keys:** None.
- **Relationships:** One occupation can classify many complainants.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Complainant/victim profile analysis, vulnerability analytics.

### `ReligionMaster`

- **Purpose:** Official religion lookup for complainants.
- **Columns:** `ReligionID`, `ReligionName`.
- **Primary Key:** `ReligionID`.
- **Foreign Keys:** None.
- **Relationships:** One religion can classify many complainants.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** Statutory and safeguarded demographic analysis where policy permits.

### `CasteMaster`

- **Purpose:** Official caste lookup for complainants.
- **Columns:** `caste_master_id`, `caste_master_name`.
- **Primary Key:** `caste_master_id`.
- **Foreign Keys:** None.
- **Relationships:** One caste can classify many complainants.
- **Source Dataset:** Official ERD.
- **Used by AI Features:** SC/ST POA statutory analytics where policy permits.

### `Inv_OccuranceTime`

- **Purpose:** Official occurrence time/location record referenced in the ERD relationship matrix.
- **Columns:** `CaseMasterID`, occurrence date/time fields, occurrence location fields.
- **Primary Key:** `CaseMasterID` if one-to-one with case.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`.
- **Relationships:** One case has one occurrence time/location record.
- **Source Dataset:** Official ERD relationship matrix; related incident dates and coordinates are in `CaseMaster`.
- **Used by AI Features:** Temporal hotspot detection, crime forecasting, response-time analysis.

### `inv_arrestsurrenderaccused`

- **Purpose:** Official junction between arrest/surrender events and accused persons.
- **Columns:** `ArrestSurrenderID`, `AccusedMasterID`.
- **Primary Key:** Composite logical key using arrest/surrender and accused identifiers.
- **Foreign Keys:** `ArrestSurrenderID` to `ArrestSurrender`; `AccusedMasterID` to `Accused`.
- **Relationships:** One arrest event can involve multiple accused persons.
- **Source Dataset:** Official ERD relationship matrix.
- **Used by AI Features:** Arrest network analysis, accused-event timelines, custody analytics.

## Layer 2: AI Extension Tables

These tables extend the official system without modifying official tables. Extension table names use an `AI_` prefix to make the boundary visible.

### `AI_DataSource`

- **Purpose:** Track raw files, reports, extracted datasets, and lineage.
- **Columns:** `DataSourceID`, `SourceName`, `SourceType`, `SourcePath`, `ReportingMonth`, `ReportingYear`, `ExtractedOn`, `RowCount`, `PageCount`, `Checksum`, `QualitySummary`, `IsDuplicate`, `Notes`.
- **Primary Key:** `DataSourceID`.
- **Foreign Keys:** None.
- **Relationships:** Parent for imported aggregate facts, data-quality issues, document attachments, model inputs, and audit records.
- **Source Dataset:** All raw CSV and PDF files.
- **Used by AI Features:** Governance, explainability, duplicate prevention, source-backed analytics.

### `AI_DataQualityIssue`

- **Purpose:** Record quality issues such as invalid coordinates, duplicate files, missing IDs, blank rows, and malformed fields.
- **Columns:** `DataQualityIssueID`, `DataSourceID`, `OfficialEntityName`, `OfficialRecordID`, `AIEntityName`, `AIRecordID`, `FieldName`, `IssueType`, `Severity`, `IssueDescription`, `DetectedOn`, `ResolutionStatus`.
- **Primary Key:** `DataQualityIssueID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`.
- **Relationships:** Can reference official records by name and ID without altering official tables.
- **Source Dataset:** `dataset_analysis.md`, all raw datasets.
- **Used by AI Features:** Data trust scoring, model input filtering, audit readiness.

### `AI_CaseFeatureSnapshot`

- **Purpose:** Store derived analytical features for a case without changing `CaseMaster`.
- **Columns:** `CaseFeatureSnapshotID`, `CaseMasterID`, `FeatureSetName`, `FeatureSetVersion`, `GeneratedOn`, `CrimeAgeDays`, `HasValidGeo`, `VictimTotalDerived`, `AccusedTotalDerived`, `ArrestTotalDerived`, `ChargesheetedTotalDerived`, `ConvictionTotalDerived`, `TextFeatureSummary`, `SourceDataQualityLevel`.
- **Primary Key:** `CaseFeatureSnapshotID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`.
- **Relationships:** Used by risk scores, recommendations, case similarity, and forecast features.
- **Source Dataset:** `FIR_Details_Data.csv`, official `CaseMaster`, official case-related tables.
- **Used by AI Features:** Case similarity, risk scoring, forecasting, triage, dashboarding.

### `AI_GeoLocation`

- **Purpose:** Preserve validated and enriched location information for cases and hotspots.
- **Columns:** `GeoLocationID`, `CaseMasterID`, `RawLatitude`, `RawLongitude`, `ValidatedLatitude`, `ValidatedLongitude`, `CoordinateStatus`, `PlaceText`, `DistanceFromPoliceStation`, `BeatName`, `VillageAreaName`, `GeoConfidence`, `ValidationNotes`.
- **Primary Key:** `GeoLocationID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`.
- **Relationships:** Feeds hotspots, patrol recommendations, and data-quality records.
- **Source Dataset:** `FIR_Details_Data.csv`, official case location fields.
- **Used by AI Features:** Hotspot detection, map analytics, patrol planning, data-quality validation.

### `AI_Hotspot`

- **Purpose:** Store AI-detected geographic or temporal crime hotspots.
- **Columns:** `HotspotID`, `HotspotName`, `DistrictID`, `UnitID`, `CrimeHeadID`, `CrimeSubHeadID`, `TimeWindowStart`, `TimeWindowEnd`, `BoundaryReference`, `CenterLatitude`, `CenterLongitude`, `RiskLevel`, `ConfidenceScore`, `TrendDirection`, `GeneratedOn`, `ModelVersion`.
- **Primary Key:** `HotspotID`.
- **Foreign Keys:** `DistrictID` to `District`; `UnitID` to `Unit`; `CrimeHeadID` to `CrimeHead`; `CrimeSubHeadID` to `CrimeSubHead`.
- **Relationships:** Linked to cases through `AI_HotspotCase`; linked to recommendations and risk scores.
- **Source Dataset:** FIR location data, crime review aggregates.
- **Used by AI Features:** Hotspot detection, patrol recommendation, crime forecasting, district dashboards.

### `AI_HotspotCase`

- **Purpose:** Link cases that contributed to a hotspot.
- **Columns:** `HotspotCaseID`, `HotspotID`, `CaseMasterID`, `ContributionScore`, `MatchReason`.
- **Primary Key:** `HotspotCaseID`.
- **Foreign Keys:** `HotspotID` to `AI_Hotspot`; `CaseMasterID` to `CaseMaster`.
- **Relationships:** Many cases can contribute to one hotspot.
- **Source Dataset:** FIR case and location data.
- **Used by AI Features:** Hotspot explainability, patrol planning, model audit.

### `AI_CrimeStatistic`

- **Purpose:** Store aggregate crime counts from monthly and multi-year review files.
- **Columns:** `CrimeStatisticID`, `DataSourceID`, `ReportMonth`, `ReportYear`, `DistrictID`, `UnitID`, `CrimeHeadID`, `CrimeSubHeadID`, `RawActLabel`, `RawMajorHead`, `RawMinorHead`, `CurrentMonthCount`, `YearToDateCount`, `PreviousMonthCount`, `CorrespondingPreviousYearCount`, `MeasureNotes`, `IsProvisional`.
- **Primary Key:** `CrimeStatisticID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`; `DistrictID` to `District`; `UnitID` to `Unit`; `CrimeHeadID` to `CrimeHead`; `CrimeSubHeadID` to `CrimeSubHead`.
- **Relationships:** Feeds forecasting, dashboards, and report narratives.
- **Source Dataset:** 2021-2024 crime review CSVs, 2026 monthly crime review CSVs, December 2025 PDF.
- **Used by AI Features:** Crime analytics, forecasting, anomaly detection, trend summaries.

### `AI_CrimeReviewReport`

- **Purpose:** Represent official monthly report documents and extracted sections.
- **Columns:** `CrimeReviewReportID`, `DataSourceID`, `ReportTitle`, `ReportMonth`, `ReportYear`, `PublishedBy`, `ClassificationAsOfDate`, `IsProvisional`, `SummaryText`.
- **Primary Key:** `CrimeReviewReportID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`.
- **Relationships:** Parent of report sections, aggregate statistics, and report-generated recommendations.
- **Source Dataset:** `crime-review-december-modified-2025.pdf`, monthly review CSVs.
- **Used by AI Features:** Report summarization, executive briefing, trend explanation.

### `AI_ReportSection`

- **Purpose:** Store extracted sections and narrative observations from crime review PDFs.
- **Columns:** `ReportSectionID`, `CrimeReviewReportID`, `SectionNumber`, `SectionTitle`, `RelatedCrimeHeadID`, `NarrativeText`, `CurrentPeriodObservation`, `PreviousPeriodComparison`, `PreviousYearComparison`.
- **Primary Key:** `ReportSectionID`.
- **Foreign Keys:** `CrimeReviewReportID` to `AI_CrimeReviewReport`; `RelatedCrimeHeadID` to `CrimeHead`.
- **Relationships:** Sections explain crime statistics and feed narrative AI outputs.
- **Source Dataset:** December 2025 crime review PDF.
- **Used by AI Features:** Report summarization, policy briefing, anomaly explanation.

### `AI_LegalDocumentSource`

- **Purpose:** Extend official legal acts with external legal metadata and source URLs.
- **Columns:** `LegalDocumentSourceID`, `DataSourceID`, `ActCode`, `Title`, `SourceName`, `JurisdictionPlace`, `PublishedDateText`, `CommencementDateText`, `SourceUrl`, `ParseQualityStatus`.
- **Primary Key:** `LegalDocumentSourceID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`; `ActCode` to `Act`.
- **Relationships:** Supports legal retrieval and links external law metadata to official acts.
- **Source Dataset:** `indian_laws_and_acts_v2.csv`.
- **Used by AI Features:** Legal recommendation, legal Q&A, citation support.

### `AI_IPCSectionReference`

- **Purpose:** Store enhanced IPC section descriptions and punishments from reference data while official `Section` remains unchanged.
- **Columns:** `IPCSectionReferenceID`, `DataSourceID`, `ActCode`, `SectionCode`, `RawSectionLabel`, `DescriptionText`, `OffenseText`, `PunishmentText`, `ParseQualityStatus`.
- **Primary Key:** `IPCSectionReferenceID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`; `ActCode` and `SectionCode` to official legal section where mapped.
- **Relationships:** Enriches official sections and case act-section associations.
- **Source Dataset:** `ipc_sections.csv`.
- **Used by AI Features:** Legal recommendation, offence explanation, punishment lookup, case similarity.

### `AI_VictimDemographicStatistic`

- **Purpose:** Store historical victim demographic aggregate statistics.
- **Columns:** `VictimDemographicStatisticID`, `DataSourceID`, `StateID`, `StateUTNameRaw`, `StatisticYear`, `CrimeContext`, `PurposeLabel`, `GenderLabel`, `AgeBandLabel`, `CaseCount`, `VictimCount`, `MaleCount`, `FemaleCount`, `GrandTotal`.
- **Primary Key:** `VictimDemographicStatisticID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`; `StateID` to `State` when mapped.
- **Relationships:** Provides baseline demographic context for victim analysis.
- **Source Dataset:** `VICTIM_OF_MURDER_2013.csv`, `VICTIMS_OF_KA_2013.csv`.
- **Used by AI Features:** Victim analysis, vulnerability baselines, policy dashboards.

### `AI_CyberSuspectStatistic`

- **Purpose:** Store aggregate cyber suspect category statistics.
- **Columns:** `CyberSuspectStatisticID`, `DataSourceID`, `StateID`, `StateUTNameRaw`, `StatisticYear`, `CrimeHeadLabel`, `SuspectCategory`, `SuspectCount`, `TotalCount`.
- **Primary Key:** `CyberSuspectStatisticID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`; `StateID` to `State` when mapped.
- **Relationships:** Links cyber suspect patterns to cyber crime analytics.
- **Source Dataset:** `IT_Suspect_2013.csv`.
- **Used by AI Features:** Cyber crime analytics, suspect profile priors, cyber triage.

### `AI_RoadAccidentStatistic`

- **Purpose:** Store fatal/non-fatal road accident and road-type aggregate statistics.
- **Columns:** `RoadAccidentStatisticID`, `DataSourceID`, `DistrictID`, `UnitID`, `CityNameRaw`, `StatisticYear`, `FinancialYear`, `RoadTypeLabel`, `FatalCount`, `NonFatalCount`, `KilledCount`, `InjuredCount`, `TotalCount`, `QualityStatus`.
- **Primary Key:** `RoadAccidentStatisticID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`; `DistrictID` to `District`; `UnitID` to `Unit`.
- **Relationships:** Supports traffic safety analytics and links to motor vehicle accident crime categories.
- **Source Dataset:** `D47-Crimes (1)_0.csv`, `D47Crimes_3_1.csv`, December 2025 PDF, FIR crime groups.
- **Used by AI Features:** Road accident analytics, hotspot detection, patrol planning.

### `AI_ServicePerformanceMetric`

- **Purpose:** Store operational service metrics from SAKALA, e-sign, Seva Sindhu, vehicle logs, and COTPA report sections.
- **Columns:** `ServicePerformanceMetricID`, `DataSourceID`, `MetricDomain`, `ReportMonth`, `ReportYear`, `DistrictID`, `UnitID`, `ServiceName`, `MetricName`, `MetricValue`, `MetricUnit`, `PendingCount`, `DisposedCount`, `ReceivedCount`, `Remarks`.
- **Primary Key:** `ServicePerformanceMetricID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`; `DistrictID` to `District`; `UnitID` to `Unit`.
- **Relationships:** Connects performance metrics to districts, units, reports, and recommendations.
- **Source Dataset:** December 2025 PDF.
- **Used by AI Features:** Unit performance analytics, operational dashboards, compliance alerts.

### `AI_Evidence`

- **Purpose:** Store AI-layer evidence records without changing official case tables.
- **Columns:** `EvidenceID`, `CaseMasterID`, `EvidenceType`, `EvidenceDescription`, `CollectionDate`, `CollectedByEmployeeID`, `SourceLocationText`, `ForensicStatus`, `ChainOfCustodyStatus`, `EvidenceConfidence`, `DataSourceID`.
- **Primary Key:** `EvidenceID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `CollectedByEmployeeID` to `Employee`; `DataSourceID` to `AI_DataSource`.
- **Relationships:** Can link to accused, victims, property, vehicles, weapons, phones, financial transactions, and forensic reports through association tables.
- **Source Dataset:** Missing in current datasets; designed from `entity_gap_analysis.md`.
- **Used by AI Features:** Investigation graph, case similarity, legal recommendation, court preparation.

### `AI_PropertyAsset`

- **Purpose:** Track stolen, seized, recovered, or case-related property.
- **Columns:** `PropertyAssetID`, `CaseMasterID`, `PropertyType`, `Description`, `EstimatedValue`, `OwnerVictimID`, `RecoveryStatus`, `StolenDate`, `RecoveredDate`, `RecoveryLocationText`, `EvidenceID`.
- **Primary Key:** `PropertyAssetID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `OwnerVictimID` to `Victim`; `EvidenceID` to `AI_Evidence`.
- **Relationships:** Links property crimes to victims, accused, evidence, and recovery outcomes.
- **Source Dataset:** Missing directly; implied by theft, robbery, burglary, and vehicle theft categories.
- **Used by AI Features:** Property crime analytics, recovery prediction, case similarity.

### `AI_Vehicle`

- **Purpose:** Represent vehicles involved in theft, accident, suspect movement, evidence, or police operational logs.
- **Columns:** `VehicleID`, `CaseMasterID`, `RegistrationNumberHash`, `VehicleType`, `OwnerPersonType`, `OwnerVictimID`, `OwnerAccusedID`, `InvolvementType`, `TheftStatus`, `AccidentStatus`, `RecoveryStatus`, `EvidenceID`.
- **Primary Key:** `VehicleID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `OwnerVictimID` to `Victim`; `OwnerAccusedID` to `Accused`; `EvidenceID` to `AI_Evidence`.
- **Relationships:** Vehicle may link cases, people, accidents, thefts, property, and evidence.
- **Source Dataset:** Road accident summaries, motor vehicle theft categories, December 2025 vehicle-log report; case-level vehicle details are missing.
- **Used by AI Features:** Vehicle theft analytics, accident intelligence, suspect mobility analysis.

### `AI_PhoneDigitalIdentifier`

- **Purpose:** Store phone, device, SIM, email, social handle, or digital account identifiers used in investigations.
- **Columns:** `DigitalIdentifierID`, `CaseMasterID`, `IdentifierType`, `IdentifierHash`, `PlatformName`, `LinkedVictimID`, `LinkedAccusedID`, `LinkedComplainantID`, `FirstSeenDate`, `LastSeenDate`, `VerificationStatus`, `EvidenceID`.
- **Primary Key:** `DigitalIdentifierID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `LinkedVictimID` to `Victim`; `LinkedAccusedID` to `Accused`; `LinkedComplainantID` to `ComplainantDetails`; `EvidenceID` to `AI_Evidence`.
- **Relationships:** Connects phones/accounts to people, cases, evidence, and money trail.
- **Source Dataset:** Missing directly; complaint mode and cyber aggregate data imply need.
- **Used by AI Features:** Network analysis, cyber investigation, fraud detection, case similarity.

### `AI_FinancialAccount`

- **Purpose:** Represent bank accounts, wallets, or payment accounts involved in cases.
- **Columns:** `FinancialAccountID`, `CaseMasterID`, `AccountIdentifierHash`, `InstitutionName`, `AccountType`, `OwnerAccusedID`, `OwnerVictimID`, `KYCStatus`, `FreezeStatus`, `EvidenceID`.
- **Primary Key:** `FinancialAccountID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `OwnerAccusedID` to `Accused`; `OwnerVictimID` to `Victim`; `EvidenceID` to `AI_Evidence`.
- **Relationships:** Parent/endpoint for financial transactions.
- **Source Dataset:** Missing directly; economic offence and cyber crime categories imply need.
- **Used by AI Features:** Money trail analysis, fraud network detection, recovery tracking.

### `AI_FinancialTransaction`

- **Purpose:** Store transaction-level money movement for cyber fraud, cheating, extortion, and proceeds tracing.
- **Columns:** `FinancialTransactionID`, `CaseMasterID`, `FromFinancialAccountID`, `ToFinancialAccountID`, `TransactionReferenceHash`, `TransactionDateTime`, `Amount`, `Currency`, `PaymentChannel`, `FreezeStatus`, `RecoveryStatus`, `EvidenceID`.
- **Primary Key:** `FinancialTransactionID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `FromFinancialAccountID` to `AI_FinancialAccount`; `ToFinancialAccountID` to `AI_FinancialAccount`; `EvidenceID` to `AI_Evidence`.
- **Relationships:** Links cases, victims, accused, accounts, digital identifiers, and evidence.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Money trail, cyber fraud detection, network analysis, recovery prioritization.

### `AI_GangNetwork`

- **Purpose:** Represent gangs, criminal groups, or organized networks.
- **Columns:** `GangNetworkID`, `NetworkName`, `AliasNames`, `PrimaryDistrictID`, `PrimaryUnitID`, `KnownCrimeHeadID`, `ActiveFromDate`, `ActiveToDate`, `ThreatLevel`, `ConfidenceScore`, `Notes`.
- **Primary Key:** `GangNetworkID`.
- **Foreign Keys:** `PrimaryDistrictID` to `District`; `PrimaryUnitID` to `Unit`; `KnownCrimeHeadID` to `CrimeHead`.
- **Relationships:** Members are linked through `AI_GangNetworkMember`; networks can connect to cases, locations, vehicles, phones, and money trail.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Network analysis, organized crime intelligence, repeat-offender detection.

### `AI_GangNetworkMember`

- **Purpose:** Link accused persons or offender profiles to a gang/network.
- **Columns:** `GangNetworkMemberID`, `GangNetworkID`, `AccusedMasterID`, `RepeatOffenderProfileID`, `RoleInNetwork`, `StartDate`, `EndDate`, `ConfidenceScore`, `SourceEvidenceID`.
- **Primary Key:** `GangNetworkMemberID`.
- **Foreign Keys:** `GangNetworkID` to `AI_GangNetwork`; `AccusedMasterID` to `Accused`; `RepeatOffenderProfileID` to `AI_RepeatOffenderProfile`; `SourceEvidenceID` to `AI_Evidence`.
- **Relationships:** Many people can belong to one network; one person can belong to multiple networks.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Gang intelligence, network centrality, co-offending analysis.

### `AI_RepeatOffenderProfile`

- **Purpose:** Resolve accused records across cases into a cross-case offender profile.
- **Columns:** `RepeatOffenderProfileID`, `ProfileNameHash`, `IdentityConfidence`, `PrimaryDistrictID`, `KnownAliasText`, `FirstKnownCaseDate`, `LastKnownCaseDate`, `TotalLinkedCases`, `TotalConvictions`, `RiskLevel`, `ProfileStatus`.
- **Primary Key:** `RepeatOffenderProfileID`.
- **Foreign Keys:** `PrimaryDistrictID` to `District`.
- **Relationships:** Links to official accused records through `AI_RepeatOffenderAccusedLink`.
- **Source Dataset:** Missing directly; official `Accused` and FIR counts indicate need.
- **Used by AI Features:** Repeat offender detection, risk scoring, network analysis.

### `AI_RepeatOffenderAccusedLink`

- **Purpose:** Link official case-level accused records to resolved offender profiles.
- **Columns:** `RepeatOffenderAccusedLinkID`, `RepeatOffenderProfileID`, `AccusedMasterID`, `CaseMasterID`, `MatchMethod`, `MatchConfidence`, `ReviewedByEmployeeID`, `ReviewStatus`.
- **Primary Key:** `RepeatOffenderAccusedLinkID`.
- **Foreign Keys:** `RepeatOffenderProfileID` to `AI_RepeatOffenderProfile`; `AccusedMasterID` to `Accused`; `CaseMasterID` to `CaseMaster`; `ReviewedByEmployeeID` to `Employee`.
- **Relationships:** Many accused records can resolve to one offender profile.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Repeat offender detection, model audit, officer review.

### `AI_ModusOperandi`

- **Purpose:** Store structured modus operandi patterns.
- **Columns:** `ModusOperandiID`, `CaseMasterID`, `CrimeHeadID`, `PatternType`, `TargetType`, `EntryMethod`, `ToolsUsed`, `DeceptionPattern`, `TimePattern`, `VictimApproach`, `ConfidenceScore`, `ExtractedFromText`.
- **Primary Key:** `ModusOperandiID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `CrimeHeadID` to `CrimeHead`.
- **Relationships:** Links cases to similarity models, suspects, evidence, and hotspots.
- **Source Dataset:** Missing directly; may be derived from future `BriefFacts` or investigation notes.
- **Used by AI Features:** Case similarity, suspect matching, crime pattern detection.

### `AI_Witness`

- **Purpose:** Store witness details in the AI layer when source systems provide them.
- **Columns:** `WitnessID`, `CaseMasterID`, `WitnessNameHash`, `AgeYear`, `GenderID`, `WitnessRole`, `StatementDate`, `ProtectionStatus`, `CredibilityNotes`, `ContactRestrictionFlag`.
- **Primary Key:** `WitnessID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`.
- **Relationships:** Witness can link to evidence, court proceedings, victims, accused, and outcomes.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Evidence graph, trial readiness, investigation completeness.

### `AI_Weapon`

- **Purpose:** Track weapons or instruments used in crimes.
- **Columns:** `WeaponID`, `CaseMasterID`, `WeaponType`, `Description`, `LicenseStatus`, `RecoveryStatus`, `RecoveredDate`, `EvidenceID`, `LinkedAccusedID`, `LinkedVictimID`.
- **Primary Key:** `WeaponID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `EvidenceID` to `AI_Evidence`; `LinkedAccusedID` to `Accused`; `LinkedVictimID` to `Victim`.
- **Relationships:** Links violent cases, accused, victims, evidence, and forensic reports.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Violent crime analysis, forensic linking, case similarity.

### `AI_ForensicReport`

- **Purpose:** Track forensic examination requests and results.
- **Columns:** `ForensicReportID`, `CaseMasterID`, `EvidenceID`, `LabName`, `TestType`, `RequestDate`, `ReportDate`, `ResultSummary`, `ResultStatus`, `ConfidenceLevel`, `DocumentAttachmentID`.
- **Primary Key:** `ForensicReportID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `EvidenceID` to `AI_Evidence`; `DocumentAttachmentID` to `AI_DocumentAttachment`.
- **Relationships:** Links evidence to scientific findings and court readiness.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Investigation completeness, case similarity, court preparation.

### `AI_CaseDiaryEntry`

- **Purpose:** Store investigation chronology notes and actions.
- **Columns:** `CaseDiaryEntryID`, `CaseMasterID`, `EmployeeID`, `EntryDateTime`, `EntryType`, `EntryText`, `ActionTaken`, `NextAction`, `SourceDocumentID`, `SensitivityLevel`.
- **Primary Key:** `CaseDiaryEntryID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `EmployeeID` to `Employee`; `SourceDocumentID` to `AI_DocumentAttachment`.
- **Relationships:** Supports recommendations, tasking, investigation summaries, and audit.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Investigation summarization, next-best-action recommendation, timeline analysis.

### `AI_CourtProceeding`

- **Purpose:** Store hearing and court event details beyond the official court master.
- **Columns:** `CourtProceedingID`, `CaseMasterID`, `CourtID`, `ProceedingDate`, `ProceedingType`, `OrderSummary`, `NextDate`, `ProceedingStatus`, `DocumentAttachmentID`.
- **Primary Key:** `CourtProceedingID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `CourtID` to `Court`; `DocumentAttachmentID` to `AI_DocumentAttachment`.
- **Relationships:** Links case, court, chargesheet, custody, and outcome events.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Trial tracking, pendency analytics, outcome prediction.

### `AI_CustodyStatus`

- **Purpose:** Track custody, remand, bail, and release events for accused persons.
- **Columns:** `CustodyStatusID`, `CaseMasterID`, `AccusedMasterID`, `CourtID`, `JailID`, `CustodyType`, `StartDate`, `EndDate`, `BailConditions`, `StatusNotes`.
- **Primary Key:** `CustodyStatusID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `AccusedMasterID` to `Accused`; `CourtID` to `Court`; `JailID` to `AI_Jail`.
- **Relationships:** Links accused to court and jail/prison timeline.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Risk monitoring, custody alerts, repeat-offender tracking.

### `AI_Jail`

- **Purpose:** Store jail/prison reference data for custody intelligence.
- **Columns:** `JailID`, `JailName`, `DistrictID`, `StateID`, `Capacity`, `Active`, `Notes`.
- **Primary Key:** `JailID`.
- **Foreign Keys:** `DistrictID` to `District`; `StateID` to `State`.
- **Relationships:** One jail can contain many custody events.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Custody analytics, release monitoring, offender risk tracking.

### `AI_RiskScore`

- **Purpose:** Store AI-generated risk scores for cases, accused persons, victims, units, or hotspots.
- **Columns:** `RiskScoreID`, `ScoreSubjectType`, `CaseMasterID`, `AccusedMasterID`, `VictimMasterID`, `UnitID`, `HotspotID`, `ScoreType`, `ScoreValue`, `RiskLevel`, `ExplanationText`, `ConfidenceScore`, `ModelVersion`, `GeneratedOn`, `ReviewStatus`, `ReviewedByEmployeeID`.
- **Primary Key:** `RiskScoreID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `AccusedMasterID` to `Accused`; `VictimMasterID` to `Victim`; `UnitID` to `Unit`; `HotspotID` to `AI_Hotspot`; `ReviewedByEmployeeID` to `Employee`.
- **Relationships:** Can drive recommendations, alerts, tasks, and audit records.
- **Source Dataset:** AI derived from FIR, aggregate, geospatial, legal, and investigation data.
- **Used by AI Features:** Risk scoring, prioritization, patrol planning, victim/offender risk analysis.

### `AI_Recommendation`

- **Purpose:** Store AI-generated recommendations with review status.
- **Columns:** `RecommendationID`, `CaseMasterID`, `HotspotID`, `RiskScoreID`, `RecommendationType`, `RecommendationText`, `RationaleText`, `ConfidenceScore`, `PriorityLevel`, `ModelVersion`, `GeneratedOn`, `Status`, `ReviewedByEmployeeID`, `ReviewNotes`.
- **Primary Key:** `RecommendationID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `HotspotID` to `AI_Hotspot`; `RiskScoreID` to `AI_RiskScore`; `ReviewedByEmployeeID` to `Employee`.
- **Relationships:** Can create tasks, alerts, and audit events.
- **Source Dataset:** AI derived.
- **Used by AI Features:** Legal recommendation, next-best-action, patrol recommendation, resource allocation.

### `AI_CaseSimilarity`

- **Purpose:** Store case-to-case similarity results.
- **Columns:** `CaseSimilarityID`, `SourceCaseMasterID`, `MatchedCaseMasterID`, `SimilarityScore`, `SimilarityType`, `ReasonFeatures`, `ModelVersion`, `GeneratedOn`, `ReviewStatus`, `ReviewedByEmployeeID`.
- **Primary Key:** `CaseSimilarityID`.
- **Foreign Keys:** `SourceCaseMasterID` to `CaseMaster`; `MatchedCaseMasterID` to `CaseMaster`; `ReviewedByEmployeeID` to `Employee`.
- **Relationships:** Connects cases for investigative lead generation.
- **Source Dataset:** AI derived from FIR, legal sections, crime head, location, MO, evidence, and narrative fields.
- **Used by AI Features:** Case similarity, serial crime detection, pattern discovery.

### `AI_SocialRelationship`

- **Purpose:** Store person-to-person relationship links for graph intelligence.
- **Columns:** `SocialRelationshipID`, `CaseMasterID`, `PersonAType`, `PersonAOfficialID`, `PersonBType`, `PersonBOfficialID`, `RelationshipType`, `ConfidenceScore`, `SourceEvidenceID`, `DataSourceID`.
- **Primary Key:** `SocialRelationshipID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `SourceEvidenceID` to `AI_Evidence`; `DataSourceID` to `AI_DataSource`.
- **Relationships:** Links victims, accused, complainants, witnesses, offender profiles, and gang members.
- **Source Dataset:** Missing directly; derived from future person and evidence sources.
- **Used by AI Features:** Network analysis, victim-accused relationship analysis, gang detection.

### `AI_AddressHistory`

- **Purpose:** Store person or organization address/location history for intelligence use.
- **Columns:** `AddressHistoryID`, `EntityType`, `EntityOfficialID`, `AddressText`, `DistrictID`, `StateID`, `Latitude`, `Longitude`, `ValidFromDate`, `ValidToDate`, `VerificationStatus`, `SourceEvidenceID`.
- **Primary Key:** `AddressHistoryID`.
- **Foreign Keys:** `DistrictID` to `District`; `StateID` to `State`; `SourceEvidenceID` to `AI_Evidence`.
- **Relationships:** Links people/organizations to locations and hotspots.
- **Source Dataset:** Missing directly.
- **Used by AI Features:** Suspect tracking, network mapping, hotspot validation.

### `AI_Organization`

- **Purpose:** Store businesses, institutions, or organizations involved in cases.
- **Columns:** `OrganizationID`, `OrganizationName`, `OrganizationType`, `RegistrationIdentifierHash`, `DistrictID`, `StateID`, `AddressText`, `RoleInCase`, `VerificationStatus`.
- **Primary Key:** `OrganizationID`.
- **Foreign Keys:** `DistrictID` to `District`; `StateID` to `State`.
- **Relationships:** Links to cases, accused, victims, financial accounts, digital accounts, and cyber suspect patterns.
- **Source Dataset:** Missing directly; business competitor aggregate appears in `IT_Suspect_2013.csv`.
- **Used by AI Features:** Economic offence analysis, cyber fraud investigation, network analysis.

### `AI_DocumentAttachment`

- **Purpose:** Store metadata for FIR copies, court orders, reports, evidence files, and extracted documents.
- **Columns:** `DocumentAttachmentID`, `DataSourceID`, `CaseMasterID`, `DocumentType`, `DocumentTitle`, `DocumentDate`, `FileReference`, `FileHash`, `ExtractionStatus`, `ExtractedTextSummary`, `SensitivityLevel`.
- **Primary Key:** `DocumentAttachmentID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`; `CaseMasterID` to `CaseMaster`.
- **Relationships:** Documents can support evidence, forensic reports, court proceedings, case diary, recommendations, and audit.
- **Source Dataset:** Existing PDF reports; future case documents.
- **Used by AI Features:** Document retrieval, summarization, citation-backed answers.

### `AI_FeatureVector`

- **Purpose:** Store references to embeddings or model-ready feature vectors.
- **Columns:** `FeatureVectorID`, `EntityType`, `EntityOfficialID`, `AIEntityID`, `VectorPurpose`, `ModelVersion`, `GeneratedOn`, `VectorStoreReference`, `FeatureSummary`, `DataSourceID`.
- **Primary Key:** `FeatureVectorID`.
- **Foreign Keys:** `DataSourceID` to `AI_DataSource`.
- **Relationships:** Feature vectors support search, similarity, clustering, and recommendations.
- **Source Dataset:** AI derived from official and extension data.
- **Used by AI Features:** Semantic search, case similarity, recommendation, clustering.

### `AI_ModelAuditLog`

- **Purpose:** Store auditable record of AI model runs and outputs.
- **Columns:** `ModelAuditLogID`, `ModelName`, `ModelVersion`, `RunPurpose`, `InputEntityType`, `InputEntityID`, `OutputEntityType`, `OutputEntityID`, `ConfidenceScore`, `GeneratedOn`, `TriggeredByEmployeeID`, `ReviewStatus`, `ReviewNotes`.
- **Primary Key:** `ModelAuditLogID`.
- **Foreign Keys:** `TriggeredByEmployeeID` to `Employee`.
- **Relationships:** Audits recommendations, risk scores, case similarity, hotspots, feature vectors, and chat outputs.
- **Source Dataset:** AI platform operational metadata.
- **Used by AI Features:** Governance, explainability, accountability.

### `AI_ChatSession`

- **Purpose:** Track AI assistant sessions used by investigators or analysts.
- **Columns:** `ChatSessionID`, `EmployeeID`, `CaseMasterID`, `SessionStartedOn`, `SessionEndedOn`, `SessionPurpose`, `SecurityClassification`, `ModelVersion`.
- **Primary Key:** `ChatSessionID`.
- **Foreign Keys:** `EmployeeID` to `Employee`; `CaseMasterID` to `CaseMaster`.
- **Relationships:** Parent of chat messages and can link to recommendations or searches.
- **Source Dataset:** AI platform operational metadata.
- **Used by AI Features:** Chat history, investigator assistant, audit.

### `AI_ChatMessage`

- **Purpose:** Store prompts and responses in an AI assistant session.
- **Columns:** `ChatMessageID`, `ChatSessionID`, `MessageSequence`, `SenderRole`, `MessageText`, `CreatedOn`, `LinkedRecommendationID`, `LinkedAuditLogID`.
- **Primary Key:** `ChatMessageID`.
- **Foreign Keys:** `ChatSessionID` to `AI_ChatSession`; `LinkedRecommendationID` to `AI_Recommendation`; `LinkedAuditLogID` to `AI_ModelAuditLog`.
- **Relationships:** Many messages belong to one session.
- **Source Dataset:** AI platform operational metadata.
- **Used by AI Features:** Chat history, explainability, investigator workflow continuity.

### `AI_SearchRequest`

- **Purpose:** Track investigator searches and intelligence requests.
- **Columns:** `SearchRequestID`, `EmployeeID`, `CaseMasterID`, `SearchText`, `SearchFiltersSummary`, `RequestedOn`, `ResultSummary`, `LinkedChatSessionID`, `LinkedRecommendationID`.
- **Primary Key:** `SearchRequestID`.
- **Foreign Keys:** `EmployeeID` to `Employee`; `CaseMasterID` to `CaseMaster`; `LinkedChatSessionID` to `AI_ChatSession`; `LinkedRecommendationID` to `AI_Recommendation`.
- **Relationships:** Search requests can generate recommendations, audits, and follow-up tasks.
- **Source Dataset:** AI platform operational metadata.
- **Used by AI Features:** Intelligence search, retrieval analytics, user workflow audit.

### `AI_Alert`

- **Purpose:** Store alerts generated from risk scores, hotspots, linked cases, or overdue actions.
- **Columns:** `AlertID`, `AlertType`, `CaseMasterID`, `UnitID`, `HotspotID`, `RiskScoreID`, `RecommendationID`, `Severity`, `AlertText`, `GeneratedOn`, `Status`, `AssignedToEmployeeID`.
- **Primary Key:** `AlertID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `UnitID` to `Unit`; `HotspotID` to `AI_Hotspot`; `RiskScoreID` to `AI_RiskScore`; `RecommendationID` to `AI_Recommendation`; `AssignedToEmployeeID` to `Employee`.
- **Relationships:** Alerts can produce tasks and review actions.
- **Source Dataset:** AI derived.
- **Used by AI Features:** Proactive notification, hotspot warnings, case prioritization.

### `AI_Task`

- **Purpose:** Operationalize AI recommendations into follow-up actions.
- **Columns:** `TaskID`, `CaseMasterID`, `RecommendationID`, `AlertID`, `AssignedToEmployeeID`, `TaskTitle`, `TaskDescription`, `PriorityLevel`, `DueDate`, `Status`, `ClosureNotes`.
- **Primary Key:** `TaskID`.
- **Foreign Keys:** `CaseMasterID` to `CaseMaster`; `RecommendationID` to `AI_Recommendation`; `AlertID` to `AI_Alert`; `AssignedToEmployeeID` to `Employee`.
- **Relationships:** Tasks close the loop between AI suggestions and human action.
- **Source Dataset:** AI platform operational metadata.
- **Used by AI Features:** Recommendation workflow, case management, accountability.

## Relationship Backbone

- Official `CaseMaster` remains the central operational table.
- AI tables reference official tables through official keys such as `CaseMasterID`, `AccusedMasterID`, `VictimMasterID`, `EmployeeID`, `UnitID`, `DistrictID`, `CrimeHeadID`, `CrimeSubHeadID`, `ActCode`, and `SectionCode`.
- Aggregate datasets are stored in AI tables such as `AI_CrimeStatistic`, `AI_CrimeReviewReport`, `AI_VictimDemographicStatistic`, `AI_CyberSuspectStatistic`, and `AI_RoadAccidentStatistic`.
- Missing investigation intelligence is added through AI extension tables such as `AI_Evidence`, `AI_PropertyAsset`, `AI_Vehicle`, `AI_PhoneDigitalIdentifier`, `AI_FinancialTransaction`, `AI_GangNetwork`, and `AI_RepeatOffenderProfile`.
- AI outputs are stored separately through `AI_Hotspot`, `AI_RiskScore`, `AI_Recommendation`, `AI_CaseSimilarity`, `AI_FeatureVector`, `AI_Alert`, and `AI_Task`.
- AI governance and explainability are handled by `AI_DataSource`, `AI_DataQualityIssue`, `AI_ModelAuditLog`, `AI_ChatSession`, and `AI_ChatMessage`.

## AI Feature Coverage

| AI Feature | Core Official Tables | AI Extension Tables |
|---|---|---|
| Crime Analytics | `CaseMaster`, `CrimeHead`, `CrimeSubHead`, `District`, `Unit` | `AI_CrimeStatistic`, `AI_CrimeReviewReport`, `AI_ServicePerformanceMetric` |
| Hotspot Detection | `CaseMaster`, `District`, `Unit`, `CrimeHead` | `AI_GeoLocation`, `AI_Hotspot`, `AI_HotspotCase`, `AI_RiskScore` |
| Victim Analysis | `Victim`, `CaseMaster`, `CrimeHead` | `AI_VictimDemographicStatistic`, `AI_RiskScore`, `AI_SocialRelationship` |
| Repeat Offender Detection | `Accused`, `ArrestSurrender`, `CaseMaster` | `AI_RepeatOffenderProfile`, `AI_RepeatOffenderAccusedLink`, `AI_GangNetworkMember` |
| Legal Recommendation | `Act`, `Section`, `ActSectionAssociation`, `CrimeHeadActSection` | `AI_LegalDocumentSource`, `AI_IPCSectionReference`, `AI_Recommendation` |
| Crime Forecasting | `CaseMaster`, `CrimeHead`, `District`, `Unit` | `AI_CrimeStatistic`, `AI_Hotspot`, `AI_FeatureVector` |
| Network Analysis | `Accused`, `Victim`, `ComplainantDetails`, `Employee` | `AI_SocialRelationship`, `AI_GangNetwork`, `AI_PhoneDigitalIdentifier`, `AI_FinancialTransaction` |
| Case Similarity | `CaseMaster`, `CrimeHead`, `CrimeSubHead`, `ActSectionAssociation` | `AI_CaseFeatureSnapshot`, `AI_ModusOperandi`, `AI_CaseSimilarity`, `AI_FeatureVector` |
| Investigation Assistant | `CaseMaster`, `Employee`, `ChargesheetDetails`, `Court` | `AI_Evidence`, `AI_CaseDiaryEntry`, `AI_Recommendation`, `AI_ChatSession`, `AI_Task` |
| Governance | Official IDs for traceability | `AI_DataSource`, `AI_DataQualityIssue`, `AI_ModelAuditLog`, `AI_ChatMessage` |
