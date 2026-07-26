# Relationship Matrix

Source: `docs/database/master_schema.md`

Purpose: define the conceptual relationships across the official Karnataka Police core tables and AI-specific extension tables. This is design documentation only and contains no SQL.

## Official Karnataka Police Core Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `CaseMaster` | HAS | `ComplainantDetails` | One case can have one or more complainants. |
| `CaseMaster` | HAS | `Victim` | One case can have one or more victims. |
| `CaseMaster` | HAS | `Accused` | One case can have one or more accused persons. |
| `CaseMaster` | HAS | `ArrestSurrender` | One case can have one or more arrest or surrender events. |
| `CaseMaster` | HAS | `ActSectionAssociation` | One case can invoke one or more legal act-section combinations. |
| `CaseMaster` | HAS | `ChargesheetDetails` | One case can have chargesheet or final report details. |
| `CaseMaster` | HAS | `Inv_OccuranceTime` | One case has an official occurrence time/location record. |
| `CaseMaster` | REGISTERED_BY | `Employee` | A case is registered by a police employee. |
| `CaseMaster` | REGISTERED_AT | `Unit` | A case is registered at a police station or police unit. |
| `CaseMaster` | CLASSIFIED_AS | `CaseCategory` | A case belongs to an official case category such as FIR, UDR, or PAR. |
| `CaseMaster` | HAS_GRAVITY | `GravityOffence` | A case has a gravity/severity classification such as heinous or non-heinous. |
| `CaseMaster` | HAS_MAJOR_HEAD | `CrimeHead` | A case is classified under a major crime head. |
| `CaseMaster` | HAS_MINOR_HEAD | `CrimeSubHead` | A case is classified under a minor crime sub-head. |
| `CaseMaster` | HAS_STATUS | `CaseStatusMaster` | A case has a current official case status. |
| `CaseMaster` | HEARD_IN | `Court` | A case can be associated with the court where it is heard. |
| `ComplainantDetails` | BELONGS_TO | `CaseMaster` | A complainant record belongs to a case. |
| `ComplainantDetails` | HAS_OCCUPATION | `OccupationMaster` | A complainant can reference an occupation lookup value. |
| `ComplainantDetails` | HAS_RELIGION | `ReligionMaster` | A complainant can reference a religion lookup value. |
| `ComplainantDetails` | HAS_CASTE | `CasteMaster` | A complainant can reference a caste lookup value. |
| `Victim` | BELONGS_TO | `CaseMaster` | A victim record belongs to a case. |
| `Accused` | BELONGS_TO | `CaseMaster` | An accused record belongs to a case. |
| `ArrestSurrender` | BELONGS_TO | `CaseMaster` | An arrest/surrender event belongs to a case. |
| `ArrestSurrender` | INVOLVES | `Accused` | An arrest/surrender event can involve an accused person. |
| `ArrestSurrender` | OCCURS_IN_STATE | `State` | An arrest/surrender event occurs in a state. |
| `ArrestSurrender` | OCCURS_IN_DISTRICT | `District` | An arrest/surrender event occurs in a district. |
| `ArrestSurrender` | HANDLED_BY_UNIT | `Unit` | A police unit handles the arrest/surrender event. |
| `ArrestSurrender` | CONDUCTED_BY | `Employee` | An investigating officer conducts or records the arrest/surrender event. |
| `ArrestSurrender` | PRODUCED_BEFORE | `Court` | An accused may be produced before a court after arrest/surrender. |
| `inv_arrestsurrenderaccused` | LINKS | `ArrestSurrender` | Junction record links an arrest/surrender event. |
| `inv_arrestsurrenderaccused` | LINKS | `Accused` | Junction record links an accused person. |
| `ActSectionAssociation` | BELONGS_TO | `CaseMaster` | A case act-section association belongs to a case. |
| `ActSectionAssociation` | USES_ACT | `Act` | A case act-section association references a legal act. |
| `ActSectionAssociation` | USES_SECTION | `Section` | A case act-section association references a legal section. |
| `Act` | HAS | `Section` | One legal act can contain many sections. |
| `CrimeHead` | HAS | `CrimeSubHead` | One major crime head can have many minor crime sub-heads. |
| `CrimeSubHead` | BELONGS_TO | `CrimeHead` | A crime sub-head belongs to a major crime head. |
| `CrimeHead` | MAPS_TO | `CrimeHeadActSection` | A crime head can map to multiple legal act-section combinations. |
| `CrimeHeadActSection` | MAPS_CRIME_HEAD | `CrimeHead` | The mapping links a crime head to law. |
| `CrimeHeadActSection` | MAPS_ACT | `Act` | The mapping references a legal act. |
| `CrimeHeadActSection` | MAPS_SECTION | `Section` | The mapping references a legal section. |
| `Court` | LOCATED_IN | `District` | A court is located in a district. |
| `Court` | LOCATED_IN | `State` | A court is located in a state. |
| `District` | BELONGS_TO | `State` | A district belongs to a state. |
| `State` | HAS | `District` | A state has districts. |
| `Unit` | HAS_TYPE | `UnitType` | A police unit has a unit type. |
| `Unit` | BELONGS_TO | `District` | A police unit belongs to a district. |
| `Unit` | BELONGS_TO | `State` | A police unit belongs to a state. |
| `Unit` | HAS_PARENT | `Unit` | A unit can report to another parent unit. |
| `UnitType` | CLASSIFIES | `Unit` | A unit type classifies many police units. |
| `Employee` | POSTED_IN | `District` | A police employee is posted in a district. |
| `Employee` | ASSIGNED_TO | `Unit` | A police employee is assigned to a unit. |
| `Employee` | HAS_RANK | `Rank` | A police employee has a rank. |
| `Employee` | HAS_DESIGNATION | `Designation` | A police employee has a designation. |
| `Rank` | CLASSIFIES | `Employee` | A rank can classify many employees. |
| `Designation` | CLASSIFIES | `Employee` | A designation can classify many employees. |
| `ChargesheetDetails` | BELONGS_TO | `CaseMaster` | A chargesheet/final report belongs to a case. |
| `ChargesheetDetails` | FILED_BY | `Employee` | A chargesheet/final report is filed by a police employee. |
| `Inv_OccuranceTime` | BELONGS_TO | `CaseMaster` | The occurrence time/location record belongs to a case. |

## AI Source, Lineage, and Quality Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `AI_DataSource` | PROVIDES | `AI_CrimeStatistic` | A raw source file can provide aggregate crime statistics. |
| `AI_DataSource` | PROVIDES | `AI_CrimeReviewReport` | A raw PDF or CSV source can provide a crime review report. |
| `AI_DataSource` | PROVIDES | `AI_LegalDocumentSource` | Legal metadata files provide external legal document references. |
| `AI_DataSource` | PROVIDES | `AI_IPCSectionReference` | IPC reference files provide enriched section details. |
| `AI_DataSource` | PROVIDES | `AI_VictimDemographicStatistic` | Victim datasets provide demographic aggregate statistics. |
| `AI_DataSource` | PROVIDES | `AI_CyberSuspectStatistic` | Cyber suspect datasets provide aggregate suspect category statistics. |
| `AI_DataSource` | PROVIDES | `AI_RoadAccidentStatistic` | Road and crime summary files provide accident statistics. |
| `AI_DataSource` | PROVIDES | `AI_ServicePerformanceMetric` | Report sections provide SAKALA, e-sign, Seva Sindhu, COTPA, and vehicle-log metrics. |
| `AI_DataSource` | HAS | `AI_DataQualityIssue` | A source can have one or more recorded quality issues. |
| `AI_DataQualityIssue` | REFERENCES | `CaseMaster` | A quality issue can reference an official case record when applicable. |
| `AI_DataQualityIssue` | REFERENCES | `AI_CrimeStatistic` | A quality issue can reference an AI aggregate statistic when applicable. |
| `AI_DataQualityIssue` | REFERENCES | `AI_LegalDocumentSource` | A quality issue can reference legal metadata when parsing or dates are unreliable. |
| `AI_DocumentAttachment` | DERIVED_FROM | `AI_DataSource` | A document attachment can be derived from a raw source file. |
| `AI_DocumentAttachment` | ATTACHED_TO | `CaseMaster` | A document can be attached to a case. |

## AI Case, Location, and Analytics Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `CaseMaster` | HAS | `AI_CaseFeatureSnapshot` | A case can have derived analytical feature snapshots. |
| `AI_CaseFeatureSnapshot` | DESCRIBES | `CaseMaster` | A feature snapshot describes derived AI features for a case. |
| `CaseMaster` | HAS | `AI_GeoLocation` | A case can have validated or enriched AI location records. |
| `AI_GeoLocation` | VALIDATES_LOCATION_FOR | `CaseMaster` | AI geolocation validates and enriches case location data. |
| `AI_Hotspot` | LOCATED_IN | `District` | A hotspot can be associated with a district. |
| `AI_Hotspot` | OWNED_BY | `Unit` | A hotspot can be assigned to a responsible police unit. |
| `AI_Hotspot` | RELATED_TO | `CrimeHead` | A hotspot can be related to a major crime head. |
| `AI_Hotspot` | RELATED_TO | `CrimeSubHead` | A hotspot can be related to a minor crime sub-head. |
| `AI_Hotspot` | HAS | `AI_HotspotCase` | A hotspot has linked contributing cases. |
| `AI_HotspotCase` | LINKS | `AI_Hotspot` | A hotspot-case record links to a hotspot. |
| `AI_HotspotCase` | LINKS | `CaseMaster` | A hotspot-case record links to a case that contributed to the hotspot. |
| `AI_CrimeStatistic` | MEASURED_FOR | `District` | A crime statistic can be measured for a district. |
| `AI_CrimeStatistic` | MEASURED_FOR | `Unit` | A crime statistic can be measured for a police unit. |
| `AI_CrimeStatistic` | CLASSIFIED_BY | `CrimeHead` | A crime statistic can be classified by a major crime head. |
| `AI_CrimeStatistic` | CLASSIFIED_BY | `CrimeSubHead` | A crime statistic can be classified by a minor crime sub-head. |
| `AI_CrimeStatistic` | DERIVED_FROM | `AI_DataSource` | A crime statistic is derived from a source dataset or report. |
| `AI_CrimeReviewReport` | HAS | `AI_ReportSection` | A crime review report contains report sections. |
| `AI_ReportSection` | BELONGS_TO | `AI_CrimeReviewReport` | A report section belongs to a crime review report. |
| `AI_ReportSection` | DISCUSSES | `CrimeHead` | A report section can discuss a major crime category. |
| `AI_RoadAccidentStatistic` | MEASURED_FOR | `District` | A road accident statistic can be measured for a district. |
| `AI_RoadAccidentStatistic` | MEASURED_FOR | `Unit` | A road accident statistic can be measured for a police unit. |
| `AI_ServicePerformanceMetric` | MEASURED_FOR | `District` | A service metric can be measured for a district. |
| `AI_ServicePerformanceMetric` | MEASURED_FOR | `Unit` | A service metric can be measured for a police unit. |

## AI Legal Reference Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `AI_LegalDocumentSource` | ENRICHES | `Act` | External legal metadata enriches the official act master. |
| `AI_IPCSectionReference` | ENRICHES | `Section` | IPC reference data enriches the official legal section master. |
| `AI_IPCSectionReference` | BELONGS_TO | `Act` | An IPC reference belongs to a legal act when mapped. |
| `AI_Recommendation` | MAY_REFERENCE | `ActSectionAssociation` | A legal recommendation can reference act-section associations for a case. |
| `AI_Recommendation` | MAY_REFERENCE | `CrimeHeadActSection` | A legal recommendation can reference the official crime-head-to-section mapping. |

## AI People, Investigation, and Evidence Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `CaseMaster` | HAS | `AI_Evidence` | A case can have AI-layer evidence records. |
| `AI_Evidence` | BELONGS_TO | `CaseMaster` | Evidence belongs to a case. |
| `AI_Evidence` | COLLECTED_BY | `Employee` | Evidence can be collected by an employee. |
| `AI_PropertyAsset` | BELONGS_TO | `CaseMaster` | A property asset belongs to a case. |
| `AI_PropertyAsset` | OWNED_BY | `Victim` | A property asset can be owned by a victim. |
| `AI_PropertyAsset` | SUPPORTED_BY | `AI_Evidence` | A property asset can be supported by evidence. |
| `AI_Vehicle` | USED_IN | `CaseMaster` | A vehicle can be involved in a case. |
| `AI_Vehicle` | OWNED_BY | `Victim` | A vehicle can be owned by a victim. |
| `AI_Vehicle` | OWNED_BY | `Accused` | A vehicle can be owned or used by an accused person. |
| `AI_Vehicle` | SUPPORTED_BY | `AI_Evidence` | Vehicle involvement can be supported by evidence. |
| `AI_PhoneDigitalIdentifier` | USED_IN | `CaseMaster` | A phone or digital identifier can be involved in a case. |
| `AI_PhoneDigitalIdentifier` | LINKED_TO | `Victim` | A phone or digital identifier can be linked to a victim. |
| `AI_PhoneDigitalIdentifier` | LINKED_TO | `Accused` | A phone or digital identifier can be linked to an accused person. |
| `AI_PhoneDigitalIdentifier` | LINKED_TO | `ComplainantDetails` | A phone or digital identifier can be linked to a complainant. |
| `AI_PhoneDigitalIdentifier` | SUPPORTED_BY | `AI_Evidence` | A phone or digital identifier can be supported by evidence. |
| `AI_FinancialAccount` | INVOLVED_IN | `CaseMaster` | A financial account can be involved in a case. |
| `AI_FinancialAccount` | OWNED_BY | `Accused` | A financial account can be owned or controlled by an accused person. |
| `AI_FinancialAccount` | OWNED_BY | `Victim` | A financial account can be owned by a victim. |
| `AI_FinancialAccount` | SUPPORTED_BY | `AI_Evidence` | A financial account can be supported by evidence. |
| `AI_FinancialTransaction` | INVOLVED_IN | `CaseMaster` | A financial transaction can be involved in a case. |
| `AI_FinancialTransaction` | FROM_ACCOUNT | `AI_FinancialAccount` | A transaction has a source financial account. |
| `AI_FinancialTransaction` | TO_ACCOUNT | `AI_FinancialAccount` | A transaction has a destination financial account. |
| `AI_FinancialTransaction` | SUPPORTED_BY | `AI_Evidence` | A transaction can be supported by evidence. |
| `AI_Weapon` | USED_IN | `CaseMaster` | A weapon can be used in a case. |
| `AI_Weapon` | LINKED_TO | `Accused` | A weapon can be linked to an accused person. |
| `AI_Weapon` | LINKED_TO | `Victim` | A weapon can be linked to a victim. |
| `AI_Weapon` | SUPPORTED_BY | `AI_Evidence` | A weapon can be supported by evidence. |
| `AI_ForensicReport` | BELONGS_TO | `CaseMaster` | A forensic report belongs to a case. |
| `AI_ForensicReport` | ANALYZES | `AI_Evidence` | A forensic report analyzes evidence. |
| `AI_ForensicReport` | HAS_DOCUMENT | `AI_DocumentAttachment` | A forensic report can have a document attachment. |
| `AI_Witness` | BELONGS_TO | `CaseMaster` | A witness belongs to a case. |
| `AI_CaseDiaryEntry` | BELONGS_TO | `CaseMaster` | A case diary entry belongs to a case. |
| `AI_CaseDiaryEntry` | WRITTEN_BY | `Employee` | A case diary entry is written by an employee. |
| `AI_CaseDiaryEntry` | BASED_ON | `AI_DocumentAttachment` | A case diary entry can be based on a document attachment. |

## AI Court and Custody Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `AI_CourtProceeding` | BELONGS_TO | `CaseMaster` | A court proceeding belongs to a case. |
| `AI_CourtProceeding` | HELD_IN | `Court` | A court proceeding is held in a court. |
| `AI_CourtProceeding` | HAS_DOCUMENT | `AI_DocumentAttachment` | A court proceeding can have a document attachment. |
| `AI_CustodyStatus` | BELONGS_TO | `CaseMaster` | A custody status event belongs to a case. |
| `AI_CustodyStatus` | APPLIES_TO | `Accused` | A custody status applies to an accused person. |
| `AI_CustodyStatus` | ORDERED_BY | `Court` | A custody status can be ordered or reviewed by a court. |
| `AI_CustodyStatus` | HELD_AT | `AI_Jail` | A custody status can link an accused person to a jail. |
| `AI_Jail` | LOCATED_IN | `District` | A jail is located in a district. |
| `AI_Jail` | LOCATED_IN | `State` | A jail is located in a state. |

## AI Network and Offender Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `AI_GangNetwork` | OPERATES_IN | `District` | A gang or criminal network can primarily operate in a district. |
| `AI_GangNetwork` | ASSOCIATED_WITH | `Unit` | A gang/network can be associated with a police unit jurisdiction. |
| `AI_GangNetwork` | ASSOCIATED_WITH | `CrimeHead` | A gang/network can be associated with a major crime category. |
| `AI_GangNetwork` | HAS | `AI_GangNetworkMember` | A gang/network has members. |
| `AI_GangNetworkMember` | BELONGS_TO | `AI_GangNetwork` | A member link belongs to a gang/network. |
| `AI_GangNetworkMember` | LINKS | `Accused` | A gang/network member link can reference an accused person. |
| `AI_GangNetworkMember` | LINKS | `AI_RepeatOffenderProfile` | A gang/network member link can reference a repeat offender profile. |
| `AI_GangNetworkMember` | SUPPORTED_BY | `AI_Evidence` | Gang membership can be supported by evidence. |
| `AI_RepeatOffenderProfile` | OPERATES_IN | `District` | A repeat offender profile can be associated with a primary district. |
| `AI_RepeatOffenderProfile` | HAS | `AI_RepeatOffenderAccusedLink` | A repeat offender profile has links to official accused records. |
| `AI_RepeatOffenderAccusedLink` | LINKS | `AI_RepeatOffenderProfile` | A link connects to a repeat offender profile. |
| `AI_RepeatOffenderAccusedLink` | LINKS | `Accused` | A link connects to an official accused record. |
| `AI_RepeatOffenderAccusedLink` | LINKS | `CaseMaster` | A link records the case context for the accused record. |
| `AI_RepeatOffenderAccusedLink` | REVIEWED_BY | `Employee` | A repeat-offender match can be reviewed by an employee. |
| `AI_ModusOperandi` | DESCRIBES | `CaseMaster` | A modus operandi record describes a case pattern. |
| `AI_ModusOperandi` | CLASSIFIED_BY | `CrimeHead` | A modus operandi record is associated with a crime head. |
| `AI_SocialRelationship` | OBSERVED_IN | `CaseMaster` | A social relationship can be observed in a case. |
| `AI_SocialRelationship` | SUPPORTED_BY | `AI_Evidence` | A social relationship can be supported by evidence. |
| `AI_AddressHistory` | LOCATED_IN | `District` | An address history record can be located in a district. |
| `AI_AddressHistory` | LOCATED_IN | `State` | An address history record can be located in a state. |
| `AI_AddressHistory` | SUPPORTED_BY | `AI_Evidence` | An address record can be supported by evidence. |
| `AI_Organization` | LOCATED_IN | `District` | An organization can be located in a district. |
| `AI_Organization` | LOCATED_IN | `State` | An organization can be located in a state. |

## AI Scores, Recommendations, Similarity, and Workflow Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `AI_RiskScore` | SCORES | `CaseMaster` | A risk score can score a case. |
| `AI_RiskScore` | SCORES | `Accused` | A risk score can score an accused person. |
| `AI_RiskScore` | SCORES | `Victim` | A risk score can score a victim or victim-risk context. |
| `AI_RiskScore` | SCORES | `Unit` | A risk score can score a unit or jurisdiction workload/risk context. |
| `AI_RiskScore` | SCORES | `AI_Hotspot` | A risk score can score a hotspot. |
| `AI_RiskScore` | REVIEWED_BY | `Employee` | A risk score can be reviewed by a police employee. |
| `AI_Recommendation` | RECOMMENDS_FOR | `CaseMaster` | A recommendation can be generated for a case. |
| `AI_Recommendation` | RECOMMENDS_FOR | `AI_Hotspot` | A recommendation can be generated for a hotspot. |
| `AI_Recommendation` | BASED_ON | `AI_RiskScore` | A recommendation can be based on a risk score. |
| `AI_Recommendation` | REVIEWED_BY | `Employee` | A recommendation can be reviewed by a police employee. |
| `AI_CaseSimilarity` | COMPARES_SOURCE | `CaseMaster` | A case similarity record has a source case. |
| `AI_CaseSimilarity` | COMPARES_MATCH | `CaseMaster` | A case similarity record has a matched case. |
| `AI_CaseSimilarity` | REVIEWED_BY | `Employee` | A similarity result can be reviewed by an employee. |
| `AI_FeatureVector` | REPRESENTS | `CaseMaster` | A feature vector can represent a case. |
| `AI_FeatureVector` | REPRESENTS | `Section` | A feature vector can represent a legal section. |
| `AI_FeatureVector` | REPRESENTS | `AI_Evidence` | A feature vector can represent evidence. |
| `AI_FeatureVector` | DERIVED_FROM | `AI_DataSource` | A feature vector can be derived from a source. |
| `AI_Alert` | ALERTS_FOR | `CaseMaster` | An alert can be generated for a case. |
| `AI_Alert` | ALERTS_FOR | `Unit` | An alert can be generated for a police unit. |
| `AI_Alert` | ALERTS_FOR | `AI_Hotspot` | An alert can be generated for a hotspot. |
| `AI_Alert` | BASED_ON | `AI_RiskScore` | An alert can be based on a risk score. |
| `AI_Alert` | BASED_ON | `AI_Recommendation` | An alert can be based on a recommendation. |
| `AI_Alert` | ASSIGNED_TO | `Employee` | An alert can be assigned to an employee. |
| `AI_Task` | ASSIGNED_FOR | `CaseMaster` | A task can be assigned for a case. |
| `AI_Task` | BASED_ON | `AI_Recommendation` | A task can be based on a recommendation. |
| `AI_Task` | BASED_ON | `AI_Alert` | A task can be based on an alert. |
| `AI_Task` | ASSIGNED_TO | `Employee` | A task can be assigned to an employee. |

## AI Audit, Chat, and Search Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `AI_ModelAuditLog` | AUDITS | `AI_Recommendation` | A model audit record can audit a recommendation output. |
| `AI_ModelAuditLog` | AUDITS | `AI_RiskScore` | A model audit record can audit a risk score output. |
| `AI_ModelAuditLog` | AUDITS | `AI_CaseSimilarity` | A model audit record can audit a case similarity output. |
| `AI_ModelAuditLog` | AUDITS | `AI_Hotspot` | A model audit record can audit a hotspot output. |
| `AI_ModelAuditLog` | TRIGGERED_BY | `Employee` | A model run can be triggered by an employee. |
| `AI_ChatSession` | USED_BY | `Employee` | A chat session is used by an employee. |
| `AI_ChatSession` | CONTEXT_FOR | `CaseMaster` | A chat session can be linked to a case context. |
| `AI_ChatSession` | HAS | `AI_ChatMessage` | A chat session has messages. |
| `AI_ChatMessage` | BELONGS_TO | `AI_ChatSession` | A chat message belongs to a chat session. |
| `AI_ChatMessage` | REFERENCES | `AI_Recommendation` | A chat message can reference a recommendation. |
| `AI_ChatMessage` | REFERENCES | `AI_ModelAuditLog` | A chat message can reference a model audit record. |
| `AI_SearchRequest` | REQUESTED_BY | `Employee` | A search request is made by an employee. |
| `AI_SearchRequest` | SEARCHES_CONTEXT | `CaseMaster` | A search request can be linked to a case context. |
| `AI_SearchRequest` | LINKED_TO | `AI_ChatSession` | A search request can be linked to a chat session. |
| `AI_SearchRequest` | LINKED_TO | `AI_Recommendation` | A search request can be linked to a recommendation. |

## Aggregate Reference Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| `AI_VictimDemographicStatistic` | MEASURED_FOR | `State` | Victim demographic statistics can be mapped to a state. |
| `AI_VictimDemographicStatistic` | CONTEXT_FOR | `Victim` | Victim demographic statistics provide aggregate context for victim analysis. |
| `AI_CyberSuspectStatistic` | MEASURED_FOR | `State` | Cyber suspect statistics can be mapped to a state. |
| `AI_CyberSuspectStatistic` | CONTEXT_FOR | `CrimeHead` | Cyber suspect statistics provide context for cyber crime categories. |
| `AI_RoadAccidentStatistic` | CONTEXT_FOR | `CrimeHead` | Road accident statistics provide context for motor vehicle accident crime categories. |
| `AI_ServicePerformanceMetric` | CONTEXT_FOR | `Unit` | Service performance metrics provide operational context for police units. |
| `AI_ServicePerformanceMetric` | CONTEXT_FOR | `District` | Service performance metrics provide operational context for districts. |

## High-Level Conceptual Relationships

| Entity A | Relationship | Entity B | Description |
|---|---|---|---|
| Case | HAS | Victim | A real-world case can have one or more victims. |
| Case | HAS | Accused | A real-world case can have one or more accused persons. |
| Case | HAS | Evidence | A real-world case can have physical, digital, financial, or documentary evidence. |
| Case | HAS | Legal Section | A real-world case invokes one or more legal sections. |
| Case | OCCURS_AT | Location | A real-world case occurs at a place or geospatial location. |
| Officer | INVESTIGATES | Case | An officer investigates, registers, arrests, or files reports for a case. |
| Vehicle | USED_IN | Case | A vehicle can be involved in a case as stolen property, accident object, or suspect mobility asset. |
| Phone | USED_IN | Case | A phone or digital identifier can be involved in a case. |
| Financial Transaction | LINKED_TO | Case | A transaction can be linked to a case as part of a money trail. |
| Gang | INVOLVES | Accused | A gang or criminal network can include accused persons or repeat offender profiles. |
| Hotspot | DERIVED_FROM | Case | A hotspot is derived from case locations and crime patterns. |
| Risk Score | SCORES | Case | A risk score can prioritize a case. |
| AI Recommendation | GUIDES | Officer | An AI recommendation can guide an officer’s next action. |
| Case Similarity | LINKS | Case | Case similarity links cases that share patterns, locations, legal sections, or modus operandi. |
| Chat History | DOCUMENTS | AI Recommendation | Chat history records how AI assistance and recommendations were produced and reviewed. |
