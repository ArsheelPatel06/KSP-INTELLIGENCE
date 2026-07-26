# Knowledge Graph Design

Source document: `docs/database/master_schema.md`

Purpose: design the conceptual knowledge graph for the AI Crime Intelligence Platform for Karnataka State Police. The graph uses the official Karnataka Police ER Diagram as the authoritative operational core and adds AI-specific graph nodes and relationships from the `AI_` extension layer.

This document is design-only. It does not contain SQL or implementation code.

## Design Principles

- `CaseMaster` remains the central official case node.
- Official entities are not modified; they are represented as graph node labels using their official identifiers.
- AI-specific nodes extend the graph for investigation intelligence, analytics, recommendations, audit, and explainability.
- Edges should preserve source lineage, confidence, model version, review status, and evidence support where applicable.
- Sensitive identifiers such as phone numbers, bank accounts, vehicle registrations, digital accounts, and names should be hashed, tokenized, or access-controlled.
- Every AI-derived edge should be explainable through source data, model version, confidence score, or human review.

## Graph Scope

The knowledge graph should support:

- Case-centric investigation views.
- Person, accused, victim, complainant, and witness relationship analysis.
- Repeat offender and gang network detection.
- Evidence, vehicle, phone, weapon, property, and financial trail linking.
- Crime hotspot and location-based intelligence.
- Legal recommendation and act-section reasoning.
- Case similarity and modus operandi matching.
- AI recommendation, risk score, alert, task, chat, and model audit traceability.

## Node Categories

### 1. Official Core Nodes

These nodes map directly to official Karnataka Police ERD entities.

| Graph Node Label | Source Table | Primary Identifier | Purpose |
|---|---|---|---|
| `Case` | `CaseMaster` | `CaseMasterID` | Official FIR/case record and central investigation node. |
| `Complainant` | `ComplainantDetails` | `ComplainantID` | Person filing or providing information for a case. |
| `Victim` | `Victim` | `VictimMasterID` | Person harmed in a case. |
| `Accused` | `Accused` | `AccusedMasterID` | Person accused in a case. |
| `ArrestSurrender` | `ArrestSurrender` | `ArrestSurrenderID` | Arrest or surrender event. |
| `Act` | `Act` | `ActCode` | Legal act master. |
| `Section` | `Section` | `ActCode` + `SectionCode` | Legal section under an act. |
| `ActSectionAssociation` | `ActSectionAssociation` | Case + act + section | Legal sections applied to a case. |
| `CrimeHead` | `CrimeHead` | `CrimeHeadID` | Major crime classification. |
| `CrimeSubHead` | `CrimeSubHead` | `CrimeSubHeadID` | Minor crime classification. |
| `CaseCategory` | `CaseCategory` | `CaseCategoryID` | Official category such as FIR, UDR, PAR, or Zero FIR. |
| `GravityOffence` | `GravityOffence` | `GravityOffenceID` | Case gravity/severity classification. |
| `CaseStatus` | `CaseStatusMaster` | `CaseStatusID` | Official case status. |
| `Chargesheet` | `ChargesheetDetails` | `CSID` | Chargesheet or final report record. |
| `Court` | `Court` | `CourtID` | Court associated with case, arrest, or proceeding. |
| `District` | `District` | `DistrictID` | District geography. |
| `State` | `State` | `StateID` | State geography. |
| `Unit` | `Unit` | `UnitID` | Police station or police unit. |
| `UnitType` | `UnitType` | `UnitTypeID` | Unit hierarchy/type. |
| `Employee` | `Employee` | `EmployeeID` | Police employee, investigating officer, reviewer, or assignee. |
| `Rank` | `Rank` | `RankID` | Police rank. |
| `Designation` | `Designation` | `DesignationID` | Police designation. |
| `Occupation` | `OccupationMaster` | `OccupationID` | Complainant occupation lookup. |
| `Religion` | `ReligionMaster` | `ReligionID` | Complainant religion lookup. |
| `Caste` | `CasteMaster` | `caste_master_id` | Complainant caste lookup. |
| `Occurrence` | `Inv_OccuranceTime` | `CaseMasterID` | Case occurrence time/location record. |

### 2. AI Source, Lineage, and Governance Nodes

| Graph Node Label | Source Table | Primary Identifier | Purpose |
|---|---|---|---|
| `DataSource` | `AI_DataSource` | `DataSourceID` | Raw CSV/PDF/source file lineage. |
| `DataQualityIssue` | `AI_DataQualityIssue` | `DataQualityIssueID` | Data-quality problem, missing field, duplicate, invalid coordinate, malformed value. |
| `DocumentAttachment` | `AI_DocumentAttachment` | `DocumentAttachmentID` | FIR copy, PDF report, court order, evidence document, extracted text artifact. |
| `ModelAuditLog` | `AI_ModelAuditLog` | `ModelAuditLogID` | Auditable model run and AI output lineage. |
| `FeatureVector` | `AI_FeatureVector` | `FeatureVectorID` | Embedding or feature-vector reference for search, similarity, clustering, or recommendation. |

### 3. AI Analytics and Reporting Nodes

| Graph Node Label | Source Table | Primary Identifier | Purpose |
|---|---|---|---|
| `CaseFeatureSnapshot` | `AI_CaseFeatureSnapshot` | `CaseFeatureSnapshotID` | Derived case features for risk, similarity, and forecasting. |
| `GeoLocation` | `AI_GeoLocation` | `GeoLocationID` | Validated/enriched location for cases and hotspots. |
| `Hotspot` | `AI_Hotspot` | `HotspotID` | AI-detected spatial or temporal hotspot. |
| `CrimeStatistic` | `AI_CrimeStatistic` | `CrimeStatisticID` | Aggregate crime statistic from monthly/multi-year reports. |
| `CrimeReviewReport` | `AI_CrimeReviewReport` | `CrimeReviewReportID` | Official crime review report document. |
| `ReportSection` | `AI_ReportSection` | `ReportSectionID` | Extracted narrative/table section from a report. |
| `VictimDemographicStatistic` | `AI_VictimDemographicStatistic` | `VictimDemographicStatisticID` | Historical victim demographic aggregate. |
| `CyberSuspectStatistic` | `AI_CyberSuspectStatistic` | `CyberSuspectStatisticID` | Aggregate cyber suspect category statistic. |
| `RoadAccidentStatistic` | `AI_RoadAccidentStatistic` | `RoadAccidentStatisticID` | Road accident or traffic safety statistic. |
| `ServicePerformanceMetric` | `AI_ServicePerformanceMetric` | `ServicePerformanceMetricID` | SAKALA, e-sign, Seva Sindhu, COTPA, vehicle-log, or other service metric. |

### 4. AI Investigation Object Nodes

| Graph Node Label | Source Table | Primary Identifier | Purpose |
|---|---|---|---|
| `Evidence` | `AI_Evidence` | `EvidenceID` | Physical, digital, documentary, financial, or forensic evidence record. |
| `PropertyAsset` | `AI_PropertyAsset` | `PropertyAssetID` | Stolen, seized, recovered, or case-related property. |
| `Vehicle` | `AI_Vehicle` | `VehicleID` | Vehicle involved in theft, accident, suspect movement, or evidence. |
| `PhoneDigitalIdentifier` | `AI_PhoneDigitalIdentifier` | `DigitalIdentifierID` | Phone, SIM, device, email, social handle, or digital account. |
| `FinancialAccount` | `AI_FinancialAccount` | `FinancialAccountID` | Bank account, wallet, payment account, or similar financial endpoint. |
| `FinancialTransaction` | `AI_FinancialTransaction` | `FinancialTransactionID` | Money movement linked to fraud, extortion, cheating, recovery, or proceeds tracing. |
| `Weapon` | `AI_Weapon` | `WeaponID` | Weapon or instrument used in a crime. |
| `ForensicReport` | `AI_ForensicReport` | `ForensicReportID` | Scientific/forensic examination and result record. |
| `Witness` | `AI_Witness` | `WitnessID` | Witness associated with a case. |
| `CaseDiaryEntry` | `AI_CaseDiaryEntry` | `CaseDiaryEntryID` | Investigation chronology note or action. |
| `CourtProceeding` | `AI_CourtProceeding` | `CourtProceedingID` | Hearing, bail, remand, order, or court event. |
| `CustodyStatus` | `AI_CustodyStatus` | `CustodyStatusID` | Custody, remand, bail, or release event. |
| `Jail` | `AI_Jail` | `JailID` | Jail/prison reference for custody intelligence. |

### 5. AI Network and Pattern Nodes

| Graph Node Label | Source Table | Primary Identifier | Purpose |
|---|---|---|---|
| `GangNetwork` | `AI_GangNetwork` | `GangNetworkID` | Gang, organized group, or criminal network. |
| `GangNetworkMember` | `AI_GangNetworkMember` | `GangNetworkMemberID` | Membership link between accused/offender profile and gang/network. |
| `RepeatOffenderProfile` | `AI_RepeatOffenderProfile` | `RepeatOffenderProfileID` | Cross-case resolved offender profile. |
| `RepeatOffenderAccusedLink` | `AI_RepeatOffenderAccusedLink` | `RepeatOffenderAccusedLinkID` | Link between official accused record and repeat offender profile. |
| `ModusOperandi` | `AI_ModusOperandi` | `ModusOperandiID` | Structured crime pattern, method, target, tool, deception, or time pattern. |
| `SocialRelationship` | `AI_SocialRelationship` | `SocialRelationshipID` | Person-to-person or entity-to-entity relationship. |
| `AddressHistory` | `AI_AddressHistory` | `AddressHistoryID` | Person or organization address/location history. |
| `Organization` | `AI_Organization` | `OrganizationID` | Business, institution, or organization involved in a case or network. |

### 6. AI Decision, Workflow, and Interaction Nodes

| Graph Node Label | Source Table | Primary Identifier | Purpose |
|---|---|---|---|
| `RiskScore` | `AI_RiskScore` | `RiskScoreID` | AI score for case, accused, victim, unit, or hotspot. |
| `Recommendation` | `AI_Recommendation` | `RecommendationID` | AI-generated legal, investigative, patrol, or resource recommendation. |
| `CaseSimilarity` | `AI_CaseSimilarity` | `CaseSimilarityID` | AI-derived similarity relationship between two cases. |
| `Alert` | `AI_Alert` | `AlertID` | Generated warning or notification. |
| `Task` | `AI_Task` | `TaskID` | Human follow-up action created from alert or recommendation. |
| `ChatSession` | `AI_ChatSession` | `ChatSessionID` | Investigator/analyst AI assistant session. |
| `ChatMessage` | `AI_ChatMessage` | `ChatMessageID` | Prompt or response inside a chat session. |
| `SearchRequest` | `AI_SearchRequest` | `SearchRequestID` | Investigator search or intelligence request. |

## Edge Categories

### 1. Official Case and FIR Edges

| Edge Type | From Node | To Node | Description |
|---|---|---|---|
| `HAS_COMPLAINANT` | `Case` | `Complainant` | Case has one or more complainants. |
| `HAS_VICTIM` | `Case` | `Victim` | Case has one or more victims. |
| `HAS_ACCUSED` | `Case` | `Accused` | Case has one or more accused persons. |
| `HAS_ARREST_SURRENDER` | `Case` | `ArrestSurrender` | Case has arrest or surrender events. |
| `INVOKES_LEGAL_SECTION` | `Case` | `Section` | Case invokes a legal section through `ActSectionAssociation`. |
| `INVOKES_ACT` | `Case` | `Act` | Case invokes a legal act. |
| `HAS_CHARGESHEET` | `Case` | `Chargesheet` | Case has chargesheet or final report details. |
| `HAS_OCCURRENCE` | `Case` | `Occurrence` | Case has official occurrence time/location details. |
| `REGISTERED_BY` | `Case` | `Employee` | Case was registered by a police employee. |
| `REGISTERED_AT` | `Case` | `Unit` | Case was registered at a police unit/station. |
| `CLASSIFIED_AS` | `Case` | `CaseCategory` | Case category classification. |
| `HAS_GRAVITY` | `Case` | `GravityOffence` | Case severity/gravity classification. |
| `HAS_STATUS` | `Case` | `CaseStatus` | Current official case status. |
| `HAS_MAJOR_HEAD` | `Case` | `CrimeHead` | Major crime classification. |
| `HAS_MINOR_HEAD` | `Case` | `CrimeSubHead` | Minor crime classification. |
| `HEARD_IN` | `Case` | `Court` | Court associated with case. |

### 2. Organization, Geography, and Personnel Edges

| Edge Type | From Node | To Node | Description |
|---|---|---|---|
| `BELONGS_TO_STATE` | `District` | `State` | District belongs to state. |
| `BELONGS_TO_DISTRICT` | `Unit` | `District` | Police unit belongs to district. |
| `BELONGS_TO_STATE` | `Unit` | `State` | Police unit belongs to state. |
| `HAS_PARENT_UNIT` | `Unit` | `Unit` | Unit has parent unit in police hierarchy. |
| `HAS_UNIT_TYPE` | `Unit` | `UnitType` | Unit is classified by unit type. |
| `POSTED_IN_DISTRICT` | `Employee` | `District` | Employee is posted in district. |
| `ASSIGNED_TO_UNIT` | `Employee` | `Unit` | Employee is assigned to unit. |
| `HAS_RANK` | `Employee` | `Rank` | Employee has police rank. |
| `HAS_DESIGNATION` | `Employee` | `Designation` | Employee has designation. |
| `LOCATED_IN_DISTRICT` | `Court` | `District` | Court is located in district. |
| `LOCATED_IN_STATE` | `Court` | `State` | Court is located in state. |

### 3. Legal and Crime Taxonomy Edges

| Edge Type | From Node | To Node | Description |
|---|---|---|---|
| `HAS_SECTION` | `Act` | `Section` | Act contains legal section. |
| `HAS_SUB_HEAD` | `CrimeHead` | `CrimeSubHead` | Major crime head has minor crime sub-head. |
| `MAPS_TO_ACT` | `CrimeHead` | `Act` | Crime classification maps to legal act. |
| `MAPS_TO_SECTION` | `CrimeHead` | `Section` | Crime classification maps to legal section. |
| `ENRICHED_BY_LEGAL_SOURCE` | `Act` | `LegalDocumentSource` | External legal source enriches act. |
| `ENRICHED_BY_IPC_REFERENCE` | `Section` | `IPCSectionReference` | IPC reference enriches official section. |

### 4. Investigation Object Edges

| Edge Type | From Node | To Node | Description |
|---|---|---|---|
| `HAS_EVIDENCE` | `Case` | `Evidence` | Case has evidence. |
| `COLLECTED_BY` | `Evidence` | `Employee` | Evidence was collected by employee. |
| `SUPPORTED_BY_EVIDENCE` | `PropertyAsset` | `Evidence` | Property asset is supported by evidence. |
| `OWNED_BY_VICTIM` | `PropertyAsset` | `Victim` | Stolen/recovered property belongs to victim. |
| `INVOLVES_VEHICLE` | `Case` | `Vehicle` | Vehicle is involved in case. |
| `VEHICLE_OWNED_BY_ACCUSED` | `Vehicle` | `Accused` | Vehicle is owned/used by accused. |
| `VEHICLE_OWNED_BY_VICTIM` | `Vehicle` | `Victim` | Vehicle is owned by victim. |
| `USES_PHONE_OR_DIGITAL_ID` | `Case` | `PhoneDigitalIdentifier` | Phone/device/account is involved in case. |
| `LINKED_TO_ACCUSED` | `PhoneDigitalIdentifier` | `Accused` | Digital identifier is linked to accused. |
| `LINKED_TO_VICTIM` | `PhoneDigitalIdentifier` | `Victim` | Digital identifier is linked to victim. |
| `LINKED_TO_COMPLAINANT` | `PhoneDigitalIdentifier` | `Complainant` | Digital identifier is linked to complainant. |
| `HAS_FINANCIAL_ACCOUNT` | `Case` | `FinancialAccount` | Financial account is involved in case. |
| `ACCOUNT_OWNED_BY_ACCUSED` | `FinancialAccount` | `Accused` | Account is owned/controlled by accused. |
| `ACCOUNT_OWNED_BY_VICTIM` | `FinancialAccount` | `Victim` | Account is owned by victim. |
| `HAS_TRANSACTION` | `Case` | `FinancialTransaction` | Transaction is involved in case. |
| `FROM_ACCOUNT` | `FinancialTransaction` | `FinancialAccount` | Transaction source account. |
| `TO_ACCOUNT` | `FinancialTransaction` | `FinancialAccount` | Transaction destination account. |
| `USED_WEAPON` | `Case` | `Weapon` | Weapon was used in case. |
| `WEAPON_LINKED_TO_ACCUSED` | `Weapon` | `Accused` | Weapon is linked to accused. |
| `WEAPON_LINKED_TO_VICTIM` | `Weapon` | `Victim` | Weapon is linked to victim. |
| `HAS_FORENSIC_REPORT` | `Case` | `ForensicReport` | Case has forensic report. |
| `ANALYZES_EVIDENCE` | `ForensicReport` | `Evidence` | Forensic report analyzes evidence. |
| `HAS_WITNESS` | `Case` | `Witness` | Case has witness. |
| `HAS_DIARY_ENTRY` | `Case` | `CaseDiaryEntry` | Case has investigation diary entry. |
| `DIARY_WRITTEN_BY` | `CaseDiaryEntry` | `Employee` | Diary entry was written by employee. |

### 5. Court and Custody Edges

| Edge Type | From Node | To Node | Description |
|---|---|---|---|
| `HAS_COURT_PROCEEDING` | `Case` | `CourtProceeding` | Case has court proceeding. |
| `PROCEEDING_HELD_IN` | `CourtProceeding` | `Court` | Proceeding held in court. |
| `HAS_CUSTODY_STATUS` | `Case` | `CustodyStatus` | Case has custody/bail/remand event. |
| `CUSTODY_APPLIES_TO` | `CustodyStatus` | `Accused` | Custody event applies to accused. |
| `CUSTODY_ORDERED_BY` | `CustodyStatus` | `Court` | Custody event ordered/reviewed by court. |
| `HELD_AT_JAIL` | `CustodyStatus` | `Jail` | Accused held at jail/prison. |
| `JAIL_LOCATED_IN` | `Jail` | `District` | Jail located in district. |

### 6. Hotspot, Analytics, and Reporting Edges

| Edge Type | From Node | To Node | Description |
|---|---|---|---|
| `HAS_FEATURE_SNAPSHOT` | `Case` | `CaseFeatureSnapshot` | Case has derived analytical features. |
| `HAS_GEO_LOCATION` | `Case` | `GeoLocation` | Case has validated/enriched geolocation. |
| `CONTRIBUTES_TO_HOTSPOT` | `Case` | `Hotspot` | Case contributes to detected hotspot through `AI_HotspotCase`. |
| `HOTSPOT_IN_DISTRICT` | `Hotspot` | `District` | Hotspot belongs to district. |
| `HOTSPOT_OWNED_BY_UNIT` | `Hotspot` | `Unit` | Hotspot assigned to police unit. |
| `HOTSPOT_FOR_CRIME_HEAD` | `Hotspot` | `CrimeHead` | Hotspot associated with crime category. |
| `STATISTIC_FOR_DISTRICT` | `CrimeStatistic` | `District` | Aggregate statistic measured for district. |
| `STATISTIC_FOR_UNIT` | `CrimeStatistic` | `Unit` | Aggregate statistic measured for unit. |
| `STATISTIC_FOR_CRIME_HEAD` | `CrimeStatistic` | `CrimeHead` | Statistic classified by crime head. |
| `REPORT_HAS_SECTION` | `CrimeReviewReport` | `ReportSection` | Report contains extracted section. |
| `SECTION_DISCUSS_CRIME_HEAD` | `ReportSection` | `CrimeHead` | Report section discusses crime category. |
| `DERIVED_FROM_SOURCE` | `CrimeStatistic` | `DataSource` | Statistic derived from raw source file/report. |

### 7. Network, Offender, and Pattern Edges

| Edge Type | From Node | To Node | Description |
|---|---|---|---|
| `HAS_MEMBER` | `GangNetwork` | `GangNetworkMember` | Gang/network has member link. |
| `MEMBER_IS_ACCUSED` | `GangNetworkMember` | `Accused` | Network member references accused. |
| `MEMBER_IS_OFFENDER_PROFILE` | `GangNetworkMember` | `RepeatOffenderProfile` | Network member references offender profile. |
| `OPERATES_IN_DISTRICT` | `GangNetwork` | `District` | Gang/network operates in district. |
| `ASSOCIATED_WITH_UNIT` | `GangNetwork` | `Unit` | Gang/network associated with police unit jurisdiction. |
| `ASSOCIATED_WITH_CRIME_HEAD` | `GangNetwork` | `CrimeHead` | Gang/network associated with crime category. |
| `RESOLVES_TO_PROFILE` | `Accused` | `RepeatOffenderProfile` | Accused record resolves to offender profile. |
| `PROFILE_LINKED_TO_CASE` | `RepeatOffenderProfile` | `Case` | Offender profile connected to case through accused links. |
| `HAS_MODUS_OPERANDI` | `Case` | `ModusOperandi` | Case has structured MO pattern. |
| `MO_CLASSIFIED_BY` | `ModusOperandi` | `CrimeHead` | MO associated with crime head. |
| `HAS_SOCIAL_RELATIONSHIP` | `Case` | `SocialRelationship` | Relationship observed in case. |
| `SUPPORTED_BY_EVIDENCE` | `SocialRelationship` | `Evidence` | Relationship supported by evidence. |
| `HAS_ADDRESS_HISTORY` | `Accused` | `AddressHistory` | Accused linked to historical/current address. |
| `ORGANIZATION_LOCATED_IN` | `Organization` | `District` | Organization located in district. |

### 8. AI Decision, Workflow, and Audit Edges

| Edge Type | From Node | To Node | Description |
|---|---|---|---|
| `SCORES_CASE` | `RiskScore` | `Case` | Risk score evaluates case. |
| `SCORES_ACCUSED` | `RiskScore` | `Accused` | Risk score evaluates accused. |
| `SCORES_VICTIM` | `RiskScore` | `Victim` | Risk score evaluates victim context. |
| `SCORES_UNIT` | `RiskScore` | `Unit` | Risk score evaluates unit/jurisdiction. |
| `SCORES_HOTSPOT` | `RiskScore` | `Hotspot` | Risk score evaluates hotspot. |
| `REVIEWED_BY` | `RiskScore` | `Employee` | Risk score reviewed by employee. |
| `RECOMMENDS_FOR_CASE` | `Recommendation` | `Case` | Recommendation generated for case. |
| `RECOMMENDS_FOR_HOTSPOT` | `Recommendation` | `Hotspot` | Recommendation generated for hotspot. |
| `BASED_ON_RISK_SCORE` | `Recommendation` | `RiskScore` | Recommendation based on risk score. |
| `RECOMMENDATION_REVIEWED_BY` | `Recommendation` | `Employee` | Recommendation reviewed by employee. |
| `SIMILAR_TO` | `Case` | `Case` | Two cases are similar, sourced from `AI_CaseSimilarity`. |
| `SIMILARITY_REVIEWED_BY` | `CaseSimilarity` | `Employee` | Similarity result reviewed by employee. |
| `HAS_ALERT` | `Case` | `Alert` | Alert generated for case. |
| `ALERT_FOR_HOTSPOT` | `Alert` | `Hotspot` | Alert generated for hotspot. |
| `ALERT_ASSIGNED_TO` | `Alert` | `Employee` | Alert assigned to employee. |
| `HAS_TASK` | `Case` | `Task` | Task assigned for case. |
| `TASK_BASED_ON_RECOMMENDATION` | `Task` | `Recommendation` | Task operationalizes recommendation. |
| `TASK_BASED_ON_ALERT` | `Task` | `Alert` | Task operationalizes alert. |
| `TASK_ASSIGNED_TO` | `Task` | `Employee` | Task assigned to employee. |
| `AUDITS_OUTPUT` | `ModelAuditLog` | `Recommendation` / `RiskScore` / `CaseSimilarity` / `Hotspot` | Audit record tracks AI output. |
| `MODEL_TRIGGERED_BY` | `ModelAuditLog` | `Employee` | Model run triggered by employee. |
| `HAS_CHAT_SESSION` | `Employee` | `ChatSession` | Employee used AI assistant session. |
| `CHAT_CONTEXT_FOR_CASE` | `ChatSession` | `Case` | Chat session linked to case context. |
| `HAS_CHAT_MESSAGE` | `ChatSession` | `ChatMessage` | Chat session contains messages. |
| `MESSAGE_REFERENCES_RECOMMENDATION` | `ChatMessage` | `Recommendation` | Chat message references recommendation. |
| `MADE_SEARCH_REQUEST` | `Employee` | `SearchRequest` | Employee made intelligence search. |
| `SEARCH_CONTEXT_FOR_CASE` | `SearchRequest` | `Case` | Search request linked to case context. |

## Node Properties

### Common Node Properties

These properties should be available on most graph nodes.

| Property | Meaning |
|---|---|
| `id` | Stable graph identifier. |
| `source_table` | Master schema table that produced the node. |
| `source_identifier` | Official or AI table primary identifier. |
| `display_name` | Human-readable label for graph UI. |
| `created_on` | Date/time the graph node was created or ingested. |
| `updated_on` | Last graph update time. |
| `source_confidence` | Confidence in source mapping or extraction. |
| `sensitivity_level` | Access-control classification. |
| `data_source_id` | Link to `DataSource` where applicable. |
| `quality_status` | Trusted, provisional, incomplete, invalid, duplicate, or unknown. |

### Case Node Properties

| Property | Source | Meaning |
|---|---|---|
| `case_master_id` | `CaseMaster.CaseMasterID` | Official case identifier. |
| `crime_no` | `CaseMaster.CrimeNo` | Official crime number where available. |
| `case_no` | `CaseMaster.CaseNo` | Official case number where available. |
| `registered_date` | `CaseMaster.CrimeRegisteredDate` | Case registration date. |
| `incident_from_date` | `CaseMaster.IncidentFromDate` | Incident start date/time. |
| `incident_to_date` | `CaseMaster.IncidentToDate` | Incident end date/time. |
| `brief_facts` | `CaseMaster.BriefFacts` | Narrative facts, if available. |
| `latitude` | `CaseMaster.latitude` / `AI_GeoLocation` | Case latitude. |
| `longitude` | `CaseMaster.longitude` / `AI_GeoLocation` | Case longitude. |
| `case_status` | `CaseStatusMaster` | Current status. |
| `gravity` | `GravityOffence` | Severity. |
| `source_quality_level` | `AI_CaseFeatureSnapshot` | Derived trust/quality rating. |

### Person Node Properties

Applies to `Complainant`, `Victim`, `Accused`, `Witness`, and `RepeatOffenderProfile` where permitted.

| Property | Meaning |
|---|---|
| `person_role` | Complainant, victim, accused, witness, offender profile. |
| `name_hash` | Hashed/tokenized name for privacy-preserving matching. |
| `age_year` | Age in years where available. |
| `gender_id` | Gender reference where available. |
| `identity_confidence` | Confidence that records refer to the same person. |
| `known_alias_text` | Alias summary where authorized. |
| `risk_level` | Risk label if AI-generated. |
| `profile_status` | Active, merged, under review, rejected, or archived. |

### Location Node Properties

Applies to `GeoLocation`, `District`, `Unit`, `Hotspot`, `AddressHistory`, `Jail`, and `Court` where applicable.

| Property | Meaning |
|---|---|
| `district_id` | Official district identifier. |
| `unit_id` | Official unit/station identifier. |
| `state_id` | Official state identifier. |
| `latitude` | Validated latitude. |
| `longitude` | Validated longitude. |
| `coordinate_status` | Valid, missing, invalid, swapped, approximate, geocoded. |
| `geo_confidence` | Confidence in location mapping. |
| `boundary_reference` | Hotspot or jurisdiction geometry reference. |
| `time_window_start` | Hotspot/statistical time window start. |
| `time_window_end` | Hotspot/statistical time window end. |

### Evidence and Object Properties

Applies to `Evidence`, `Vehicle`, `PropertyAsset`, `Weapon`, `PhoneDigitalIdentifier`, `FinancialAccount`, and `FinancialTransaction`.

| Property | Meaning |
|---|---|
| `object_type` | Evidence/object category. |
| `description` | Summary description. |
| `identifier_hash` | Hashed sensitive identifier. |
| `collection_date` | Date evidence/object was collected or recorded. |
| `recovery_status` | Stolen, seized, recovered, unrecovered, frozen, released. |
| `forensic_status` | Pending, sent, received, conclusive, inconclusive, not required. |
| `chain_of_custody_status` | Complete, incomplete, disputed, unknown. |
| `evidence_confidence` | Confidence that the object is correctly linked. |

### AI Output Properties

Applies to `RiskScore`, `Recommendation`, `CaseSimilarity`, `Hotspot`, `Alert`, and `ModelAuditLog`.

| Property | Meaning |
|---|---|
| `model_name` | Name of AI/ML model. |
| `model_version` | Version used to generate output. |
| `generated_on` | Output generation timestamp. |
| `confidence_score` | Model confidence. |
| `risk_level` | Low, medium, high, critical, or equivalent. |
| `score_value` | Numeric risk/similarity/priority score. |
| `explanation_text` | Human-readable rationale. |
| `reason_features` | Factors contributing to result. |
| `review_status` | Pending, accepted, rejected, modified, escalated. |
| `reviewed_by_employee_id` | Human reviewer. |

## Edge Properties

| Property | Meaning |
|---|---|
| `edge_id` | Stable graph relationship identifier. |
| `relationship_type` | Semantic edge type such as `HAS_ACCUSED`, `SIMILAR_TO`, `FROM_ACCOUNT`. |
| `source_table` | Table or process that created the edge. |
| `source_record_id` | Source row/entity identifier. |
| `confidence_score` | Confidence in the relationship. |
| `weight` | Numeric edge weight for algorithms. |
| `created_on` | Edge creation timestamp. |
| `valid_from` | Start date/time when relationship is valid. |
| `valid_to` | End date/time when relationship is valid. |
| `evidence_id` | Supporting evidence reference where applicable. |
| `data_source_id` | Source dataset/document where applicable. |
| `model_version` | Model that inferred the relationship. |
| `review_status` | Pending, accepted, rejected, or under review. |
| `reviewed_by_employee_id` | Employee who reviewed the relationship. |
| `explanation` | Human-readable reason for relationship. |

## Important Subgraphs

### 1. Case Investigation Subgraph

Purpose: summarize everything known about one case.

Core pattern:

```text
Case
  -> Victim
  -> Accused
  -> Complainant
  -> Evidence
  -> Vehicle
  -> PhoneDigitalIdentifier
  -> FinancialTransaction
  -> Weapon
  -> ModusOperandi
  -> Legal Section
  -> CourtProceeding
  -> RiskScore
  -> Recommendation
  -> Task
```

Supported features:

- Investigation summary.
- Case completeness check.
- Evidence gap detection.
- Legal recommendation.
- Next-best action.
- Court readiness.

### 2. Repeat Offender Subgraph

Purpose: connect case-level accused records into a cross-case offender profile.

Core pattern:

```text
RepeatOffenderProfile
  -> Accused
  -> Case
  -> ArrestSurrender
  -> CustodyStatus
  -> CrimeHead
  -> District
  -> GangNetwork
```

Supported features:

- Repeat offender detection.
- Recidivism monitoring.
- Cross-case linking.
- Bail/custody risk monitoring.
- Gang intelligence.

### 3. Cyber and Financial Fraud Subgraph

Purpose: trace money and digital identifiers across victims, accused, accounts, and transactions.

Core pattern:

```text
Victim
  -> FinancialAccount
  -> FinancialTransaction
  -> FinancialAccount
  -> Accused
  -> PhoneDigitalIdentifier
  -> Digital account / platform
  -> Case
```

Supported features:

- Money trail analysis.
- Mule account detection.
- Shared phone/account detection.
- Fraud network discovery.
- Recovery prioritization.

### 4. Hotspot and Patrol Subgraph

Purpose: connect cases, geolocations, hotspots, crime categories, police units, and recommendations.

Core pattern:

```text
Case
  -> GeoLocation
  -> Hotspot
  -> District
  -> Unit
  -> CrimeHead
  -> RiskScore
  -> Recommendation
  -> Task
```

Supported features:

- Hotspot detection.
- Patrol planning.
- District/unit crime monitoring.
- Crime forecasting.
- Resource allocation.

### 5. Legal Reasoning Subgraph

Purpose: connect case facts, crime categories, acts, sections, legal references, and recommendations.

Core pattern:

```text
Case
  -> CrimeHead
  -> CrimeSubHead
  -> Act
  -> Section
  -> IPCSectionReference
  -> LegalDocumentSource
  -> Recommendation
```

Supported features:

- Legal recommendation.
- Charge completeness check.
- Offence explanation.
- Punishment lookup.
- Case similarity by law.

### 6. AI Governance Subgraph

Purpose: trace every AI output to source data, model run, review, chat, search, and task.

Core pattern:

```text
DataSource
  -> FeatureVector
  -> ModelAuditLog
  -> RiskScore / Recommendation / CaseSimilarity / Hotspot
  -> Employee review
  -> ChatSession
  -> ChatMessage
  -> Task
```

Supported features:

- Explainability.
- Audit trail.
- Human review workflow.
- Model governance.
- Accountability.

## Traversal Examples

### 1. Case to Complete Investigation Context

Starting node: `Case`

Traversal:

```text
Case
  -> HAS_VICTIM
  -> HAS_ACCUSED
  -> HAS_EVIDENCE
  -> INVOLVES_VEHICLE
  -> USES_PHONE_OR_DIGITAL_ID
  -> HAS_TRANSACTION
  -> HAS_MODUS_OPERANDI
  -> INVOKES_LEGAL_SECTION
  -> HAS_RISK_SCORE
  -> HAS_RECOMMENDATION
```

Question answered:

- What are all known people, objects, evidence, legal sections, AI risks, and recommendations for this case?

### 2. Accused to Similar Cases

Starting node: `Accused`

Traversal:

```text
Accused
  -> BELONGS_TO Case
  -> SIMILAR_TO Case
  -> HAS_ACCUSED Accused
  -> RESOLVES_TO_PROFILE RepeatOffenderProfile
```

Question answered:

- Are there other cases with similar MO, legal sections, locations, or suspect patterns involving related accused persons?

### 3. Victim to Financial Trail

Starting node: `Victim`

Traversal:

```text
Victim
  -> ACCOUNT_OWNED_BY_VICTIM FinancialAccount
  <- FROM_ACCOUNT / TO_ACCOUNT FinancialTransaction
  -> TO_ACCOUNT / FROM_ACCOUNT FinancialAccount
  -> ACCOUNT_OWNED_BY_ACCUSED Accused
  -> Case
```

Question answered:

- Which accused or accounts received money from a victim, and in which other cases are those accounts involved?

### 4. Phone or Digital Identifier to Network

Starting node: `PhoneDigitalIdentifier`

Traversal:

```text
PhoneDigitalIdentifier
  -> LINKED_TO_ACCUSED Accused
  -> Case
  -> HAS_ACCUSED Accused
  -> GangNetworkMember
  -> GangNetwork
```

Question answered:

- Which accused, cases, gangs, or offender profiles are connected to the same phone, SIM, email, device, or digital handle?

### 5. Hotspot to Patrol Recommendation

Starting node: `Hotspot`

Traversal:

```text
Hotspot
  <- CONTRIBUTES_TO_HOTSPOT Case
  -> HOTSPOT_FOR_CRIME_HEAD CrimeHead
  -> HOTSPOT_OWNED_BY_UNIT Unit
  <- SCORES_HOTSPOT RiskScore
  <- RECOMMENDS_FOR_HOTSPOT Recommendation
  <- TASK_BASED_ON_RECOMMENDATION Task
```

Question answered:

- Which cases caused this hotspot, what risk was assigned, and what patrol or resource tasks were recommended?

### 6. Legal Section to Cases and Recommendations

Starting node: `Section`

Traversal:

```text
Section
  <- INVOKES_LEGAL_SECTION Case
  -> CrimeHead
  -> CaseSimilarity
  -> Recommendation
  -> ModelAuditLog
```

Question answered:

- Which cases invoke this legal section, which crime categories are associated, and what recommendations were generated?

### 7. Officer Workload and AI Review Trace

Starting node: `Employee`

Traversal:

```text
Employee
  <- REGISTERED_BY Case
  <- DIARY_WRITTEN_BY CaseDiaryEntry
  <- REVIEWED_BY RiskScore
  <- RECOMMENDATION_REVIEWED_BY Recommendation
  <- ALERT_ASSIGNED_TO Alert
  <- TASK_ASSIGNED_TO Task
  -> ChatSession
```

Question answered:

- What cases, tasks, AI outputs, and review actions are associated with a police employee?

## Investigation Queries

These are conceptual graph questions, not SQL or implementation syntax.

### Case Investigation

1. Show all victims, accused, complainants, witnesses, evidence, weapons, vehicles, phones, accounts, and transactions connected to a case.
2. Find all cases that share the same accused, repeat offender profile, phone, vehicle, financial account, weapon, or modus operandi.
3. Find cases with high gravity but missing evidence, missing chargesheet, no forensic report, or no recent diary entry.
4. Find unresolved cases similar to solved or chargesheeted cases in the same district or crime head.
5. Identify cases where AI recommended additional legal sections but review is still pending.

### Repeat Offender and Gang Intelligence

1. Find accused persons connected to more than one case across districts or police units.
2. Identify offender profiles linked to multiple crime heads or recurring modus operandi patterns.
3. Find gang networks whose members share phones, vehicles, addresses, accounts, or co-accused relationships.
4. Identify bridge offenders who connect otherwise separate gangs or districts.
5. Find accused persons with recent bail/release status and high risk scores.

### Cyber and Financial Investigation

1. Trace all transactions from a victim account to final beneficiary accounts within a defined number of hops.
2. Find financial accounts receiving funds from multiple unrelated victims.
3. Find phone numbers, devices, or digital accounts shared by multiple accused across cases.
4. Find organizations connected to suspected financial accounts, accused persons, or cyber suspect categories.
5. Identify transaction chains where freeze status is pending and recovery value is high.

### Hotspot and Crime Pattern Analysis

1. Find hotspots with increasing trend and high-confidence risk scores.
2. Show all cases contributing to a hotspot by crime head, unit, beat, or district.
3. Find police units responsible for multiple active high-risk hotspots.
4. Compare hotspots with monthly crime statistics for the same crime head and district.
5. Identify hotspots near addresses of repeat offender profiles or gang networks.

### Legal and Court Intelligence

1. Find cases where crime head suggests a legal section that is missing from act-section associations.
2. Identify sections frequently associated with high conviction counts or chargesheet outcomes.
3. Find cases awaiting court proceedings or with repeated adjournment patterns.
4. Link forensic reports and evidence to court proceedings for trial readiness review.
5. Show legal references and IPC explanations used to generate a recommendation.

### AI Governance and Audit

1. Explain why a case received a high risk score.
2. Show source datasets, feature vectors, model runs, and review status behind a recommendation.
3. Find AI outputs generated from low-quality or duplicate data sources.
4. Identify recommendations that were rejected by officers and analyze common reasons.
5. Retrieve all chat messages, search requests, and tasks related to an AI recommendation.

## Graph Algorithms That Can Be Used

### 1. Community Detection

Purpose: identify clusters of people, cases, phones, vehicles, financial accounts, locations, and gangs that form criminal communities or operational networks.

Recommended algorithms:

| Algorithm | Use Case |
|---|---|
| Louvain Community Detection | Detect dense offender/gang/case communities using co-accused, phone, vehicle, address, and financial links. |
| Leiden Community Detection | More stable community detection for large criminal networks and fraud rings. |
| Label Propagation | Fast initial clustering for exploratory analysis. |
| Weakly Connected Components as pre-step | Split graph into candidate networks before running more expensive community algorithms. |

Applicable subgraphs:

- Accused-case co-offending graph.
- Accused-phone-vehicle-address graph.
- Financial account and transaction graph.
- Gang membership graph.
- Case similarity graph.

Investigation outcomes:

- Discover hidden gangs or fraud rings.
- Identify groups sharing infrastructure such as phones, vehicles, accounts, or addresses.
- Detect serial crime clusters.
- Prioritize network-level investigations rather than isolated cases.

### 2. Shortest Path

Purpose: find the smallest number of relationship hops connecting two entities.

Recommended algorithms:

| Algorithm | Use Case |
|---|---|
| Unweighted Shortest Path | Find simplest connection between a suspect and a case, gang, phone, account, or victim. |
| Weighted Shortest Path | Prefer high-confidence or stronger evidence links while avoiding weak inferred relationships. |
| K-Shortest Paths | Show multiple possible connection paths between suspects, cases, or accounts. |
| Time-constrained Shortest Path | Restrict paths to relationships valid during an investigation period. |

Applicable subgraphs:

- Accused to accused through shared cases, phones, or vehicles.
- Victim to accused through financial transactions.
- Case to gang through accused/offender profile links.
- Officer to recommendation through chat/audit/task trail.

Investigation outcomes:

- Explain how two suspects are connected.
- Trace a money trail between victim and beneficiary.
- Connect a case to a known gang or repeat offender.
- Find the evidentiary path supporting an AI recommendation.

### 3. Centrality

Purpose: identify important, influential, or bridge nodes in criminal and operational networks.

Recommended algorithms:

| Algorithm | Use Case |
|---|---|
| Degree Centrality | Find highly connected accused, phones, vehicles, accounts, or cases. |
| Weighted Degree Centrality | Prioritize entities with many high-confidence or high-value connections. |
| Betweenness Centrality | Identify bridge offenders, mule accounts, shared phones, or brokers connecting groups. |
| Closeness Centrality | Find nodes that can quickly reach many others in a network. |
| PageRank | Identify influential offenders, accounts, or cases based on quality of connected nodes. |
| Eigenvector Centrality | Identify entities connected to other important entities. |

Applicable subgraphs:

- Co-accused network.
- Phone/device sharing network.
- Financial transaction network.
- Gang member network.
- Case similarity graph.
- Officer-case-task workload graph.

Investigation outcomes:

- Prioritize high-impact suspects.
- Identify financial mule accounts.
- Find shared digital infrastructure.
- Detect key gang coordinators.
- Identify police units or officers with unusually high workload centrality.

### 4. Connected Components

Purpose: identify isolated or connected groups of entities.

Recommended algorithms:

| Algorithm | Use Case |
|---|---|
| Weakly Connected Components | Find all entities connected by any direction of relationship. Useful for broad investigation clusters. |
| Strongly Connected Components | Useful in directed transaction or communication networks where reciprocal paths matter. |
| Component Size Ranking | Prioritize large suspicious components for organized crime or fraud ring review. |
| Temporal Connected Components | Track how networks appear, split, or merge over time. |

Applicable subgraphs:

- Accused-case-phone-vehicle-account graph.
- Financial transaction graph.
- Case similarity graph.
- Hotspot-case-location graph.

Investigation outcomes:

- Separate unrelated networks.
- Detect large fraud clusters.
- Identify isolated cases needing more data.
- Track network growth over time.

### 5. Link Prediction

Purpose: infer probable missing relationships that require human review.

Recommended algorithms:

| Algorithm | Use Case |
|---|---|
| Common Neighbors | Suggest suspects or cases linked by shared phones, vehicles, accounts, or locations. |
| Adamic-Adar | Score stronger hidden links through rare shared identifiers. |
| Jaccard Similarity | Compare cases or offender profiles by shared features. |
| Graph Embedding Similarity | Use learned embeddings for case/person/entity similarity. |

Applicable subgraphs:

- Case similarity graph.
- Offender profile resolution graph.
- Phone/account/entity sharing graph.
- MO and legal section graph.

Investigation outcomes:

- Suggest probable repeat offender matches.
- Recommend likely gang membership.
- Identify hidden links between cases.
- Suggest missing legal or evidence associations.

### 6. Graph Similarity and Embeddings

Purpose: compare graph neighborhoods and generate semantic similarity features.

Recommended algorithms:

| Algorithm | Use Case |
|---|---|
| Node2Vec / DeepWalk | Generate embeddings for cases, accused, phones, accounts, or legal sections. |
| GraphSAGE | Learn inductive embeddings as new cases arrive. |
| Subgraph Similarity | Compare case investigation patterns. |
| Graph Edit Distance | Compare modus operandi or evidence structures across cases. |

Applicable subgraphs:

- Case-MO-evidence-law-location graph.
- Accused-case-identifier network.
- Legal section and crime taxonomy graph.

Investigation outcomes:

- Case similarity ranking.
- Serial crime pattern detection.
- Entity resolution support.
- Recommendation feature generation.

### 7. Path and Flow Analysis

Purpose: trace movement of money, vehicles, digital assets, or influence across entities.

Recommended algorithms:

| Algorithm | Use Case |
|---|---|
| Breadth-First Search | Explore local neighborhood around a suspect, phone, account, or case. |
| Depth-First Search | Trace long transaction or relationship chains. |
| Max Flow / Min Cut | Identify critical accounts or entities controlling money movement paths. |
| Random Walk | Rank likely next-hop entities in exploratory intelligence searches. |

Applicable subgraphs:

- Financial transactions.
- Phone/digital account networks.
- Vehicle movement and ownership links.
- Case-to-case similarity network.

Investigation outcomes:

- Trace proceeds of crime.
- Identify bottleneck accounts or brokers.
- Prioritize freeze/recovery actions.
- Support lead generation.

## Algorithm-to-Feature Mapping

| AI Feature | Useful Graph Algorithms |
|---|---|
| Crime Analytics | Connected components, centrality, community detection, graph aggregations. |
| Hotspot Detection | Spatial clustering, connected components, centrality over location-case graph. |
| Victim Analysis | Neighborhood traversal, risk propagation, centrality around victim networks. |
| Repeat Offender Detection | Entity resolution, link prediction, connected components, community detection. |
| Legal Recommendation | Case-law traversal, graph similarity, link prediction, embeddings. |
| Crime Forecasting | Temporal graph features, hotspot centrality, community evolution. |
| Network Analysis | Community detection, centrality, shortest path, connected components. |
| Case Similarity | Graph embeddings, subgraph similarity, Jaccard similarity, K-nearest neighbors. |
| Money Trail | Shortest path, DFS/BFS, flow analysis, centrality. |
| Gang Detection | Louvain/Leiden, betweenness centrality, connected components. |
| Investigation Assistant | Case neighborhood traversal, path explanation, recommendation audit traversal. |
| Governance | Source-to-output lineage traversal, shortest path from AI output to data source. |

## Prioritized Graph Views

### Phase 1: Case-Centric Graph

Minimum nodes:

- `Case`
- `District`
- `Unit`
- `Employee`
- `CrimeHead`
- `CrimeSubHead`
- `Act`
- `Section`
- `Victim`
- `Accused`
- `RiskScore`
- `Recommendation`
- `DataSource`

Primary use:

- Crime analytics.
- Legal recommendation.
- Case triage.
- Source explainability.

### Phase 2: Investigation Object Graph

Additional nodes:

- `Evidence`
- `Vehicle`
- `PhoneDigitalIdentifier`
- `FinancialAccount`
- `FinancialTransaction`
- `Weapon`
- `PropertyAsset`
- `ForensicReport`
- `Witness`
- `CaseDiaryEntry`

Primary use:

- Investigation graph.
- Money trail.
- Evidence completeness.
- Case similarity.

### Phase 3: Network Intelligence Graph

Additional nodes:

- `RepeatOffenderProfile`
- `GangNetwork`
- `GangNetworkMember`
- `SocialRelationship`
- `AddressHistory`
- `Organization`
- `ModusOperandi`
- `CaseSimilarity`
- `FeatureVector`

Primary use:

- Repeat offender detection.
- Gang/community detection.
- Network centrality.
- Serial crime discovery.

### Phase 4: Governance and Workflow Graph

Additional nodes:

- `ModelAuditLog`
- `ChatSession`
- `ChatMessage`
- `SearchRequest`
- `Alert`
- `Task`
- `DocumentAttachment`
- `DataQualityIssue`

Primary use:

- Explainability.
- Human review tracking.
- AI accountability.
- Operational task closure.

## Graph Quality and Governance Requirements

- Maintain separation between official facts and AI-inferred relationships.
- Store confidence and review status on all AI-derived nodes and edges.
- Mark inferred links as `pending_review` until accepted by an authorized employee.
- Use hashed identifiers for sensitive personal, phone, vehicle, account, and digital data.
- Preserve data source and model lineage for every AI output.
- Track data-quality issues that affect graph trust, especially missing official IDs and invalid coordinates.
- Allow temporal filtering so old relationships do not imply current criminal association without evidence.
- Avoid using protected demographic attributes for operational scoring unless explicitly permitted by law and policy.

## Example End-to-End Investigation Flow

```text
1. Investigator opens a high-risk Case.
2. Graph expands to Accused, Victim, Legal Sections, Location, Evidence, and RiskScore.
3. System finds SIMILAR_TO cases using MO, crime head, legal sections, and location.
4. System traverses Accused to RepeatOffenderProfile and GangNetwork.
5. System checks PhoneDigitalIdentifier and FinancialAccount reuse across other cases.
6. Community detection identifies a cluster of linked accused, accounts, and phone identifiers.
7. Shortest path explains how the current case connects to a known gang.
8. Centrality ranks the most important account, phone, and accused in the cluster.
9. Recommendation suggests next actions: freeze account, collect CDR, verify address, compare evidence.
10. Officer reviews the recommendation, creates tasks, and the full decision trail is logged in ModelAuditLog and ChatSession.
```

## Summary

The knowledge graph should treat `Case` as the central official node and use AI extension nodes to connect investigation objects, people, locations, legal references, evidence, money trails, digital identifiers, hotspots, recommendations, and audit records. The graph enables investigators to move from isolated FIR records to connected intelligence: who is related, what evidence connects them, where patterns repeat, which entities are central, which clusters exist, and how AI recommendations were produced and reviewed.
