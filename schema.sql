-- KSP Intelligence OS - AI-ready PostgreSQL Schema
-- Generated from docs/database and docs/product design artifacts.
-- Purpose: operational police model + intelligence extensions + analytics + RAG + knowledge graph projection.
-- Notes:
--   1. Official Karnataka Police ERD entities are preserved conceptually as core tables.
--   2. AI/intelligence capabilities are added through ai_* and kg_* extension tables.
--   3. No pgvector or non-portable extensions are required; embeddings are referenced externally.
--   4. Table and column names use snake_case for PostgreSQL and easier Zoho Catalyst DataStore adaptation.
--   5. Sensitive identifiers such as phone, account, vehicle registration, and names should be hashed/tokenized by ETL/API layers.

BEGIN;

-- ============================================================
-- 1. COMMON REFERENCE / GOVERNANCE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS data_source (
    data_source_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    source_path TEXT,
    source_batch VARCHAR(50),
    reporting_month INTEGER,
    reporting_year INTEGER,
    extracted_on TIMESTAMP,
    row_count BIGINT,
    page_count INTEGER,
    checksum VARCHAR(128),
    quality_summary TEXT,
    is_duplicate BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_data_source_checksum UNIQUE (checksum)
);

COMMENT ON TABLE data_source IS 'Lineage registry for raw CSV, PDF, API, legal knowledge, and derived sources.';

CREATE TABLE IF NOT EXISTS gender_master (
    gender_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    gender_name VARCHAR(100) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- 2. OFFICIAL KARNATAKA POLICE CORE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS state (
    state_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    state_name VARCHAR(150) NOT NULL,
    nationality_id BIGINT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_state_name UNIQUE (state_name)
);

CREATE TABLE IF NOT EXISTS district (
    district_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    district_name VARCHAR(150) NOT NULL,
    state_id BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_district_state FOREIGN KEY (state_id) REFERENCES state (state_id),
    CONSTRAINT uq_district_state UNIQUE (district_name, state_id)
);

CREATE TABLE IF NOT EXISTS unit_type (
    unit_type_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    unit_type_name VARCHAR(150) NOT NULL,
    city_dist_state VARCHAR(100),
    hierarchy_level INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_unit_type_name UNIQUE (unit_type_name)
);

CREATE TABLE IF NOT EXISTS unit (
    unit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    unit_name VARCHAR(255) NOT NULL,
    unit_type_id BIGINT,
    parent_unit_id BIGINT,
    nationality_id BIGINT,
    state_id BIGINT,
    district_id BIGINT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    source_unit_code VARCHAR(100),
    CONSTRAINT fk_unit_unit_type FOREIGN KEY (unit_type_id) REFERENCES unit_type (unit_type_id),
    CONSTRAINT fk_unit_parent FOREIGN KEY (parent_unit_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_unit_state FOREIGN KEY (state_id) REFERENCES state (state_id),
    CONSTRAINT fk_unit_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT uq_unit_name_district UNIQUE (unit_name, district_id)
);

CREATE TABLE IF NOT EXISTS rank_master (
    rank_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rank_name VARCHAR(150) NOT NULL UNIQUE,
    hierarchy_level INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS designation (
    designation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    designation_name VARCHAR(150) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS employee (
    employee_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    district_id BIGINT,
    unit_id BIGINT,
    rank_id BIGINT,
    designation_id BIGINT,
    kgid VARCHAR(100),
    first_name VARCHAR(255),
    employee_dob DATE,
    gender_id BIGINT,
    blood_group_id BIGINT,
    physically_challenged BOOLEAN,
    appointment_date DATE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_employee_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_employee_unit FOREIGN KEY (unit_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_employee_rank FOREIGN KEY (rank_id) REFERENCES rank_master (rank_id),
    CONSTRAINT fk_employee_designation FOREIGN KEY (designation_id) REFERENCES designation (designation_id),
    CONSTRAINT fk_employee_gender FOREIGN KEY (gender_id) REFERENCES gender_master (gender_id),
    CONSTRAINT uq_employee_kgid UNIQUE (kgid)
);

CREATE TABLE IF NOT EXISTS court (
    court_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    court_name VARCHAR(255) NOT NULL,
    district_id BIGINT,
    state_id BIGINT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_court_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_court_state FOREIGN KEY (state_id) REFERENCES state (state_id),
    CONSTRAINT uq_court_name_district UNIQUE (court_name, district_id)
);

CREATE TABLE IF NOT EXISTS case_category (
    case_category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lookup_value VARCHAR(150) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS gravity_offence (
    gravity_offence_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lookup_value VARCHAR(150) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS case_status_master (
    case_status_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_status_name VARCHAR(200) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS occupation_master (
    occupation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occupation_name VARCHAR(200) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS religion_master (
    religion_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    religion_name VARCHAR(150) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS caste_master (
    caste_master_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    caste_master_name VARCHAR(200) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS act (
    act_code VARCHAR(50) PRIMARY KEY,
    act_description TEXT NOT NULL,
    short_name VARCHAR(150),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS section (
    act_code VARCHAR(50) NOT NULL,
    section_code VARCHAR(100) NOT NULL,
    section_description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (act_code, section_code),
    CONSTRAINT fk_section_act FOREIGN KEY (act_code) REFERENCES act (act_code)
);

CREATE TABLE IF NOT EXISTS crime_head (
    crime_head_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    crime_group_name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_crime_head_name UNIQUE (crime_group_name)
);

CREATE TABLE IF NOT EXISTS crime_sub_head (
    crime_sub_head_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    crime_head_id BIGINT NOT NULL,
    crime_head_name VARCHAR(255) NOT NULL,
    seq_id INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_crime_sub_head_parent FOREIGN KEY (crime_head_id) REFERENCES crime_head (crime_head_id),
    CONSTRAINT uq_crime_sub_head UNIQUE (crime_head_id, crime_head_name)
);

CREATE TABLE IF NOT EXISTS crime_head_act_section (
    crime_head_id BIGINT NOT NULL,
    act_code VARCHAR(50) NOT NULL,
    section_code VARCHAR(100) NOT NULL,
    PRIMARY KEY (crime_head_id, act_code, section_code),
    CONSTRAINT fk_chas_crime_head FOREIGN KEY (crime_head_id) REFERENCES crime_head (crime_head_id),
    CONSTRAINT fk_chas_section FOREIGN KEY (act_code, section_code) REFERENCES section (act_code, section_code)
);

CREATE TABLE IF NOT EXISTS case_master (
    case_master_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    crime_no VARCHAR(100),
    case_no VARCHAR(100),
    crime_registered_date TIMESTAMP,
    police_person_id BIGINT,
    police_station_id BIGINT,
    case_category_id BIGINT,
    gravity_offence_id BIGINT,
    crime_major_head_id BIGINT,
    crime_minor_head_id BIGINT,
    case_status_id BIGINT,
    court_id BIGINT,
    incident_from_date TIMESTAMP,
    incident_to_date TIMESTAMP,
    info_received_ps_date TIMESTAMP,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    brief_facts TEXT,
    data_source_id BIGINT,
    source_row_number BIGINT,
    source_case_key VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_case_employee FOREIGN KEY (police_person_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_case_station FOREIGN KEY (police_station_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_case_category FOREIGN KEY (case_category_id) REFERENCES case_category (case_category_id),
    CONSTRAINT fk_case_gravity FOREIGN KEY (gravity_offence_id) REFERENCES gravity_offence (gravity_offence_id),
    CONSTRAINT fk_case_major_head FOREIGN KEY (crime_major_head_id) REFERENCES crime_head (crime_head_id),
    CONSTRAINT fk_case_minor_head FOREIGN KEY (crime_minor_head_id) REFERENCES crime_sub_head (crime_sub_head_id),
    CONSTRAINT fk_case_status FOREIGN KEY (case_status_id) REFERENCES case_status_master (case_status_id),
    CONSTRAINT fk_case_court FOREIGN KEY (court_id) REFERENCES court (court_id),
    CONSTRAINT fk_case_data_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT uq_case_crime_no UNIQUE (crime_no),
    CONSTRAINT uq_case_case_no UNIQUE (case_no)
);

CREATE TABLE IF NOT EXISTS complainant_details (
    complainant_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    complainant_name_hash VARCHAR(256),
    age_year INTEGER,
    occupation_id BIGINT,
    religion_id BIGINT,
    caste_id BIGINT,
    gender_id BIGINT,
    CONSTRAINT fk_complainant_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_complainant_occupation FOREIGN KEY (occupation_id) REFERENCES occupation_master (occupation_id),
    CONSTRAINT fk_complainant_religion FOREIGN KEY (religion_id) REFERENCES religion_master (religion_id),
    CONSTRAINT fk_complainant_caste FOREIGN KEY (caste_id) REFERENCES caste_master (caste_master_id),
    CONSTRAINT fk_complainant_gender FOREIGN KEY (gender_id) REFERENCES gender_master (gender_id)
);

CREATE TABLE IF NOT EXISTS victim (
    victim_master_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    victim_name_hash VARCHAR(256),
    age_year INTEGER,
    gender_id BIGINT,
    victim_police BOOLEAN,
    CONSTRAINT fk_victim_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_victim_gender FOREIGN KEY (gender_id) REFERENCES gender_master (gender_id)
);

CREATE TABLE IF NOT EXISTS accused (
    accused_master_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    accused_name_hash VARCHAR(256),
    age_year INTEGER,
    gender_id BIGINT,
    person_id VARCHAR(50),
    CONSTRAINT fk_accused_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_accused_gender FOREIGN KEY (gender_id) REFERENCES gender_master (gender_id)
);

CREATE TABLE IF NOT EXISTS arrest_surrender (
    arrest_surrender_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    arrest_surrender_type_id BIGINT,
    arrest_surrender_date TIMESTAMP,
    arrest_surrender_state_id BIGINT,
    arrest_surrender_district_id BIGINT,
    police_station_id BIGINT,
    io_id BIGINT,
    court_id BIGINT,
    accused_master_id BIGINT,
    is_accused BOOLEAN,
    is_complainant_accused BOOLEAN,
    CONSTRAINT fk_arrest_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_arrest_state FOREIGN KEY (arrest_surrender_state_id) REFERENCES state (state_id),
    CONSTRAINT fk_arrest_district FOREIGN KEY (arrest_surrender_district_id) REFERENCES district (district_id),
    CONSTRAINT fk_arrest_station FOREIGN KEY (police_station_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_arrest_io FOREIGN KEY (io_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_arrest_court FOREIGN KEY (court_id) REFERENCES court (court_id),
    CONSTRAINT fk_arrest_accused FOREIGN KEY (accused_master_id) REFERENCES accused (accused_master_id)
);

CREATE TABLE IF NOT EXISTS inv_arrest_surrender_accused (
    arrest_surrender_id BIGINT NOT NULL,
    accused_master_id BIGINT NOT NULL,
    PRIMARY KEY (arrest_surrender_id, accused_master_id),
    CONSTRAINT fk_asa_arrest FOREIGN KEY (arrest_surrender_id) REFERENCES arrest_surrender (arrest_surrender_id),
    CONSTRAINT fk_asa_accused FOREIGN KEY (accused_master_id) REFERENCES accused (accused_master_id)
);

CREATE TABLE IF NOT EXISTS act_section_association (
    case_master_id BIGINT NOT NULL,
    act_code VARCHAR(50) NOT NULL,
    section_code VARCHAR(100) NOT NULL,
    act_order_id INTEGER NOT NULL DEFAULT 1,
    section_order_id INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (case_master_id, act_code, section_code, act_order_id, section_order_id),
    CONSTRAINT fk_asa_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_asa_section FOREIGN KEY (act_code, section_code) REFERENCES section (act_code, section_code)
);

CREATE TABLE IF NOT EXISTS chargesheet_details (
    cs_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    cs_date DATE,
    cs_type VARCHAR(100),
    police_person_id BIGINT,
    CONSTRAINT fk_chargesheet_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_chargesheet_employee FOREIGN KEY (police_person_id) REFERENCES employee (employee_id)
);

CREATE TABLE IF NOT EXISTS inv_occurrence_time (
    case_master_id BIGINT PRIMARY KEY,
    occurrence_from TIMESTAMP,
    occurrence_to TIMESTAMP,
    occurrence_place_text TEXT,
    occurrence_notes TEXT,
    CONSTRAINT fk_occurrence_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id)
);

-- ============================================================
-- 3. ANALYTICS, REPORTING, AND DEMOGRAPHIC INTELLIGENCE
-- ============================================================

CREATE TABLE IF NOT EXISTS crime_review_report (
    crime_review_report_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT NOT NULL,
    report_title VARCHAR(500),
    report_month INTEGER,
    report_year INTEGER,
    published_by VARCHAR(255),
    classification_as_of_date DATE,
    is_provisional BOOLEAN NOT NULL DEFAULT FALSE,
    summary_text TEXT,
    CONSTRAINT fk_crime_review_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id)
);

CREATE TABLE IF NOT EXISTS report_section (
    report_section_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    crime_review_report_id BIGINT NOT NULL,
    section_number VARCHAR(50),
    section_title VARCHAR(500),
    related_crime_head_id BIGINT,
    narrative_text TEXT,
    current_period_observation TEXT,
    previous_period_comparison TEXT,
    previous_year_comparison TEXT,
    CONSTRAINT fk_report_section_report FOREIGN KEY (crime_review_report_id) REFERENCES crime_review_report (crime_review_report_id),
    CONSTRAINT fk_report_section_crime_head FOREIGN KEY (related_crime_head_id) REFERENCES crime_head (crime_head_id)
);

CREATE TABLE IF NOT EXISTS crime_statistic (
    crime_statistic_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT NOT NULL,
    report_month INTEGER,
    report_year INTEGER NOT NULL,
    district_id BIGINT,
    unit_id BIGINT,
    crime_head_id BIGINT,
    crime_sub_head_id BIGINT,
    raw_act_label VARCHAR(500),
    raw_major_head VARCHAR(500),
    raw_minor_head VARCHAR(500),
    current_month_count NUMERIC(18, 2),
    year_to_date_count NUMERIC(18, 2),
    previous_month_count NUMERIC(18, 2),
    corresponding_previous_year_count NUMERIC(18, 2),
    measure_notes TEXT,
    is_provisional BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_crime_stat_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_crime_stat_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_crime_stat_unit FOREIGN KEY (unit_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_crime_stat_head FOREIGN KEY (crime_head_id) REFERENCES crime_head (crime_head_id),
    CONSTRAINT fk_crime_stat_sub_head FOREIGN KEY (crime_sub_head_id) REFERENCES crime_sub_head (crime_sub_head_id)
);

CREATE TABLE IF NOT EXISTS victim_demographic_statistic (
    victim_demographic_statistic_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT NOT NULL,
    state_id BIGINT,
    state_ut_name_raw VARCHAR(200),
    statistic_year INTEGER NOT NULL,
    crime_context VARCHAR(255),
    purpose_label VARCHAR(255),
    gender_label VARCHAR(100),
    age_band_label VARCHAR(100),
    case_count NUMERIC(18, 2),
    victim_count NUMERIC(18, 2),
    male_count NUMERIC(18, 2),
    female_count NUMERIC(18, 2),
    grand_total NUMERIC(18, 2),
    CONSTRAINT fk_victim_demo_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_victim_demo_state FOREIGN KEY (state_id) REFERENCES state (state_id)
);

CREATE TABLE IF NOT EXISTS cyber_suspect_statistic (
    cyber_suspect_statistic_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT NOT NULL,
    state_id BIGINT,
    state_ut_name_raw VARCHAR(200),
    statistic_year INTEGER NOT NULL,
    crime_head_label VARCHAR(255),
    suspect_category VARCHAR(255),
    suspect_count NUMERIC(18, 2),
    total_count NUMERIC(18, 2),
    CONSTRAINT fk_cyber_stat_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_cyber_stat_state FOREIGN KEY (state_id) REFERENCES state (state_id)
);

CREATE TABLE IF NOT EXISTS road_accident_statistic (
    road_accident_statistic_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT NOT NULL,
    district_id BIGINT,
    unit_id BIGINT,
    city_name_raw VARCHAR(200),
    statistic_year INTEGER,
    financial_year VARCHAR(20),
    road_type_label VARCHAR(255),
    fatal_count NUMERIC(18, 2),
    non_fatal_count NUMERIC(18, 2),
    killed_count NUMERIC(18, 2),
    injured_count NUMERIC(18, 2),
    total_count NUMERIC(18, 2),
    quality_status VARCHAR(100),
    CONSTRAINT fk_road_stat_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_road_stat_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_road_stat_unit FOREIGN KEY (unit_id) REFERENCES unit (unit_id)
);

CREATE TABLE IF NOT EXISTS service_performance_metric (
    service_performance_metric_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT NOT NULL,
    metric_domain VARCHAR(150) NOT NULL,
    report_month INTEGER,
    report_year INTEGER,
    district_id BIGINT,
    unit_id BIGINT,
    service_name VARCHAR(255),
    metric_name VARCHAR(255),
    metric_value NUMERIC(18, 2),
    metric_unit VARCHAR(50),
    pending_count NUMERIC(18, 2),
    disposed_count NUMERIC(18, 2),
    received_count NUMERIC(18, 2),
    remarks TEXT,
    CONSTRAINT fk_service_metric_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_service_metric_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_service_metric_unit FOREIGN KEY (unit_id) REFERENCES unit (unit_id)
);

-- ============================================================
-- 4. LEGAL KNOWLEDGE AND RAG-READY LAW REFERENCES
-- ============================================================

CREATE TABLE IF NOT EXISTS legal_document_source (
    legal_document_source_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT,
    act_code VARCHAR(50),
    title VARCHAR(500) NOT NULL,
    source_name VARCHAR(255),
    jurisdiction_place VARCHAR(255),
    published_date_text VARCHAR(100),
    commencement_date_text VARCHAR(100),
    source_url TEXT,
    parse_quality_status VARCHAR(100),
    CONSTRAINT fk_legal_doc_data_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_legal_doc_act FOREIGN KEY (act_code) REFERENCES act (act_code)
);

CREATE TABLE IF NOT EXISTS ipc_section_reference (
    ipc_section_reference_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT,
    act_code VARCHAR(50),
    section_code VARCHAR(100),
    raw_section_label VARCHAR(200),
    description_text TEXT,
    offense_text TEXT,
    punishment_text TEXT,
    parse_quality_status VARCHAR(100),
    CONSTRAINT fk_ipc_ref_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_ipc_ref_section FOREIGN KEY (act_code, section_code) REFERENCES section (act_code, section_code)
);

CREATE TABLE IF NOT EXISTS legal_keyword (
    legal_keyword_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    keyword_text VARCHAR(255) NOT NULL,
    keyword_type VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_legal_keyword UNIQUE (keyword_text, keyword_type)
);

CREATE TABLE IF NOT EXISTS legal_section_keyword (
    legal_section_keyword_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    act_code VARCHAR(50) NOT NULL,
    section_code VARCHAR(100) NOT NULL,
    legal_keyword_id BIGINT NOT NULL,
    relevance_weight NUMERIC(8, 4) DEFAULT 1.0,
    notes TEXT,
    CONSTRAINT fk_lsk_section FOREIGN KEY (act_code, section_code) REFERENCES section (act_code, section_code),
    CONSTRAINT fk_lsk_keyword FOREIGN KEY (legal_keyword_id) REFERENCES legal_keyword (legal_keyword_id),
    CONSTRAINT uq_lsk UNIQUE (act_code, section_code, legal_keyword_id)
);

-- ============================================================
-- 5. RAG KNOWLEDGE BASE
-- ============================================================

CREATE TABLE IF NOT EXISTS rag_corpus (
    rag_corpus_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    corpus_name VARCHAR(255) NOT NULL UNIQUE,
    corpus_type VARCHAR(100) NOT NULL,
    description TEXT,
    access_level VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rag_document (
    rag_document_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rag_corpus_id BIGINT NOT NULL,
    data_source_id BIGINT,
    legal_document_source_id BIGINT,
    case_master_id BIGINT,
    document_title VARCHAR(500) NOT NULL,
    document_type VARCHAR(100),
    document_date DATE,
    source_uri TEXT,
    source_hash VARCHAR(128),
    extraction_status VARCHAR(100),
    sensitivity_level VARCHAR(100),
    summary_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rag_doc_corpus FOREIGN KEY (rag_corpus_id) REFERENCES rag_corpus (rag_corpus_id),
    CONSTRAINT fk_rag_doc_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_rag_doc_legal FOREIGN KEY (legal_document_source_id) REFERENCES legal_document_source (legal_document_source_id),
    CONSTRAINT fk_rag_doc_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id)
);

CREATE TABLE IF NOT EXISTS rag_chunk (
    rag_chunk_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rag_document_id BIGINT NOT NULL,
    chunk_sequence INTEGER NOT NULL,
    chunk_title VARCHAR(500),
    chunk_text TEXT NOT NULL,
    token_count INTEGER,
    language_code VARCHAR(20) DEFAULT 'en',
    page_number INTEGER,
    section_reference VARCHAR(255),
    quality_status VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rag_chunk_doc FOREIGN KEY (rag_document_id) REFERENCES rag_document (rag_document_id),
    CONSTRAINT uq_rag_chunk_sequence UNIQUE (rag_document_id, chunk_sequence)
);

CREATE TABLE IF NOT EXISTS rag_embedding_ref (
    rag_embedding_ref_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rag_chunk_id BIGINT NOT NULL,
    embedding_model VARCHAR(255) NOT NULL,
    embedding_model_version VARCHAR(100),
    vector_store_name VARCHAR(255),
    vector_store_reference TEXT NOT NULL,
    vector_dimension INTEGER,
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_embedding_chunk FOREIGN KEY (rag_chunk_id) REFERENCES rag_chunk (rag_chunk_id),
    CONSTRAINT uq_embedding_ref UNIQUE (rag_chunk_id, embedding_model, embedding_model_version)
);

CREATE TABLE IF NOT EXISTS rag_retrieval_log (
    rag_retrieval_log_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id BIGINT,
    case_master_id BIGINT,
    query_text TEXT NOT NULL,
    intent_label VARCHAR(150),
    retrieved_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(100),
    result_summary TEXT,
    CONSTRAINT fk_rag_log_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_rag_log_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id)
);

CREATE TABLE IF NOT EXISTS rag_retrieval_result (
    rag_retrieval_result_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rag_retrieval_log_id BIGINT NOT NULL,
    rag_chunk_id BIGINT NOT NULL,
    rank_order INTEGER NOT NULL,
    similarity_score NUMERIC(10, 6),
    reason_text TEXT,
    CONSTRAINT fk_rag_result_log FOREIGN KEY (rag_retrieval_log_id) REFERENCES rag_retrieval_log (rag_retrieval_log_id),
    CONSTRAINT fk_rag_result_chunk FOREIGN KEY (rag_chunk_id) REFERENCES rag_chunk (rag_chunk_id),
    CONSTRAINT uq_rag_result_rank UNIQUE (rag_retrieval_log_id, rank_order)
);

-- ============================================================
-- 6. INVESTIGATION INTELLIGENCE EXTENSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS data_quality_issue (
    data_quality_issue_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT,
    official_entity_name VARCHAR(150),
    official_record_id VARCHAR(150),
    ai_entity_name VARCHAR(150),
    ai_record_id VARCHAR(150),
    field_name VARCHAR(150),
    issue_type VARCHAR(150) NOT NULL,
    severity VARCHAR(50),
    issue_description TEXT,
    detected_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolution_status VARCHAR(100) DEFAULT 'open',
    CONSTRAINT fk_dqi_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id)
);

CREATE TABLE IF NOT EXISTS case_feature_snapshot (
    case_feature_snapshot_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    feature_set_name VARCHAR(150) NOT NULL,
    feature_set_version VARCHAR(100) NOT NULL,
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    crime_age_days INTEGER,
    has_valid_geo BOOLEAN,
    victim_total_derived INTEGER,
    accused_total_derived INTEGER,
    arrest_total_derived INTEGER,
    chargesheeted_total_derived INTEGER,
    conviction_total_derived INTEGER,
    text_feature_summary TEXT,
    source_data_quality_level VARCHAR(100),
    CONSTRAINT fk_case_feature_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT uq_case_feature_version UNIQUE (case_master_id, feature_set_name, feature_set_version)
);

CREATE TABLE IF NOT EXISTS geo_location (
    geo_location_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT,
    raw_latitude NUMERIC(12, 8),
    raw_longitude NUMERIC(12, 8),
    validated_latitude NUMERIC(12, 8),
    validated_longitude NUMERIC(12, 8),
    coordinate_status VARCHAR(100),
    place_text TEXT,
    distance_from_police_station VARCHAR(100),
    beat_name VARCHAR(255),
    village_area_name VARCHAR(255),
    geo_confidence NUMERIC(6, 4),
    validation_notes TEXT,
    CONSTRAINT fk_geo_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id)
);

CREATE TABLE IF NOT EXISTS evidence (
    evidence_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    evidence_type VARCHAR(150) NOT NULL,
    evidence_description TEXT,
    collection_date TIMESTAMP,
    collected_by_employee_id BIGINT,
    source_location_text TEXT,
    forensic_status VARCHAR(100),
    chain_of_custody_status VARCHAR(100),
    evidence_confidence NUMERIC(6, 4),
    data_source_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidence_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_evidence_employee FOREIGN KEY (collected_by_employee_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_evidence_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id)
);

CREATE TABLE IF NOT EXISTS property_asset (
    property_asset_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    property_type VARCHAR(150),
    description TEXT,
    estimated_value NUMERIC(18, 2),
    owner_victim_id BIGINT,
    recovery_status VARCHAR(100),
    stolen_date DATE,
    recovered_date DATE,
    recovery_location_text TEXT,
    evidence_id BIGINT,
    CONSTRAINT fk_property_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_property_victim FOREIGN KEY (owner_victim_id) REFERENCES victim (victim_master_id),
    CONSTRAINT fk_property_evidence FOREIGN KEY (evidence_id) REFERENCES evidence (evidence_id)
);

CREATE TABLE IF NOT EXISTS vehicle (
    vehicle_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT,
    registration_number_hash VARCHAR(256),
    vehicle_type VARCHAR(150),
    owner_person_type VARCHAR(100),
    owner_victim_id BIGINT,
    owner_accused_id BIGINT,
    involvement_type VARCHAR(150),
    theft_status VARCHAR(100),
    accident_status VARCHAR(100),
    recovery_status VARCHAR(100),
    evidence_id BIGINT,
    CONSTRAINT fk_vehicle_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_vehicle_victim FOREIGN KEY (owner_victim_id) REFERENCES victim (victim_master_id),
    CONSTRAINT fk_vehicle_accused FOREIGN KEY (owner_accused_id) REFERENCES accused (accused_master_id),
    CONSTRAINT fk_vehicle_evidence FOREIGN KEY (evidence_id) REFERENCES evidence (evidence_id)
);

CREATE TABLE IF NOT EXISTS phone_digital_identifier (
    digital_identifier_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT,
    identifier_type VARCHAR(100) NOT NULL,
    identifier_hash VARCHAR(256) NOT NULL,
    platform_name VARCHAR(150),
    linked_victim_id BIGINT,
    linked_accused_id BIGINT,
    linked_complainant_id BIGINT,
    first_seen_date DATE,
    last_seen_date DATE,
    verification_status VARCHAR(100),
    evidence_id BIGINT,
    CONSTRAINT fk_pdi_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_pdi_victim FOREIGN KEY (linked_victim_id) REFERENCES victim (victim_master_id),
    CONSTRAINT fk_pdi_accused FOREIGN KEY (linked_accused_id) REFERENCES accused (accused_master_id),
    CONSTRAINT fk_pdi_complainant FOREIGN KEY (linked_complainant_id) REFERENCES complainant_details (complainant_id),
    CONSTRAINT fk_pdi_evidence FOREIGN KEY (evidence_id) REFERENCES evidence (evidence_id)
);

CREATE TABLE IF NOT EXISTS financial_account (
    financial_account_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT,
    account_identifier_hash VARCHAR(256) NOT NULL,
    institution_name VARCHAR(255),
    account_type VARCHAR(100),
    owner_accused_id BIGINT,
    owner_victim_id BIGINT,
    kyc_status VARCHAR(100),
    freeze_status VARCHAR(100),
    evidence_id BIGINT,
    CONSTRAINT fk_fin_account_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_fin_account_accused FOREIGN KEY (owner_accused_id) REFERENCES accused (accused_master_id),
    CONSTRAINT fk_fin_account_victim FOREIGN KEY (owner_victim_id) REFERENCES victim (victim_master_id),
    CONSTRAINT fk_fin_account_evidence FOREIGN KEY (evidence_id) REFERENCES evidence (evidence_id)
);

CREATE TABLE IF NOT EXISTS financial_transaction (
    financial_transaction_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT,
    from_financial_account_id BIGINT,
    to_financial_account_id BIGINT,
    transaction_reference_hash VARCHAR(256),
    transaction_date_time TIMESTAMP,
    amount NUMERIC(18, 2),
    currency VARCHAR(20) DEFAULT 'INR',
    payment_channel VARCHAR(100),
    freeze_status VARCHAR(100),
    recovery_status VARCHAR(100),
    evidence_id BIGINT,
    CONSTRAINT fk_fin_txn_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_fin_txn_from FOREIGN KEY (from_financial_account_id) REFERENCES financial_account (financial_account_id),
    CONSTRAINT fk_fin_txn_to FOREIGN KEY (to_financial_account_id) REFERENCES financial_account (financial_account_id),
    CONSTRAINT fk_fin_txn_evidence FOREIGN KEY (evidence_id) REFERENCES evidence (evidence_id)
);

CREATE TABLE IF NOT EXISTS weapon (
    weapon_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    weapon_type VARCHAR(150),
    description TEXT,
    license_status VARCHAR(100),
    recovery_status VARCHAR(100),
    recovered_date DATE,
    evidence_id BIGINT,
    linked_accused_id BIGINT,
    linked_victim_id BIGINT,
    CONSTRAINT fk_weapon_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_weapon_evidence FOREIGN KEY (evidence_id) REFERENCES evidence (evidence_id),
    CONSTRAINT fk_weapon_accused FOREIGN KEY (linked_accused_id) REFERENCES accused (accused_master_id),
    CONSTRAINT fk_weapon_victim FOREIGN KEY (linked_victim_id) REFERENCES victim (victim_master_id)
);

CREATE TABLE IF NOT EXISTS document_attachment (
    document_attachment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_source_id BIGINT,
    case_master_id BIGINT,
    document_type VARCHAR(150),
    document_title VARCHAR(500),
    document_date DATE,
    file_reference TEXT,
    file_hash VARCHAR(128),
    extraction_status VARCHAR(100),
    extracted_text_summary TEXT,
    sensitivity_level VARCHAR(100),
    CONSTRAINT fk_doc_attach_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_doc_attach_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id)
);

CREATE TABLE IF NOT EXISTS forensic_report (
    forensic_report_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    evidence_id BIGINT,
    lab_name VARCHAR(255),
    test_type VARCHAR(150),
    request_date DATE,
    report_date DATE,
    result_summary TEXT,
    result_status VARCHAR(100),
    confidence_level VARCHAR(100),
    document_attachment_id BIGINT,
    CONSTRAINT fk_forensic_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_forensic_evidence FOREIGN KEY (evidence_id) REFERENCES evidence (evidence_id),
    CONSTRAINT fk_forensic_doc FOREIGN KEY (document_attachment_id) REFERENCES document_attachment (document_attachment_id)
);

CREATE TABLE IF NOT EXISTS witness (
    witness_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    witness_name_hash VARCHAR(256),
    age_year INTEGER,
    gender_id BIGINT,
    witness_role VARCHAR(150),
    statement_date DATE,
    protection_status VARCHAR(100),
    credibility_notes TEXT,
    contact_restriction_flag BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_witness_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_witness_gender FOREIGN KEY (gender_id) REFERENCES gender_master (gender_id)
);

CREATE TABLE IF NOT EXISTS case_diary_entry (
    case_diary_entry_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    employee_id BIGINT,
    entry_date_time TIMESTAMP NOT NULL,
    entry_type VARCHAR(150),
    entry_text TEXT,
    action_taken TEXT,
    next_action TEXT,
    source_document_id BIGINT,
    sensitivity_level VARCHAR(100),
    CONSTRAINT fk_diary_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_diary_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_diary_document FOREIGN KEY (source_document_id) REFERENCES document_attachment (document_attachment_id)
);

CREATE TABLE IF NOT EXISTS court_proceeding (
    court_proceeding_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    court_id BIGINT,
    proceeding_date DATE,
    proceeding_type VARCHAR(150),
    order_summary TEXT,
    next_date DATE,
    proceeding_status VARCHAR(100),
    document_attachment_id BIGINT,
    CONSTRAINT fk_court_proc_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_court_proc_court FOREIGN KEY (court_id) REFERENCES court (court_id),
    CONSTRAINT fk_court_proc_doc FOREIGN KEY (document_attachment_id) REFERENCES document_attachment (document_attachment_id)
);

CREATE TABLE IF NOT EXISTS jail (
    jail_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jail_name VARCHAR(255) NOT NULL,
    district_id BIGINT,
    state_id BIGINT,
    capacity INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    CONSTRAINT fk_jail_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_jail_state FOREIGN KEY (state_id) REFERENCES state (state_id),
    CONSTRAINT uq_jail_name_district UNIQUE (jail_name, district_id)
);

CREATE TABLE IF NOT EXISTS custody_status (
    custody_status_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    accused_master_id BIGINT NOT NULL,
    court_id BIGINT,
    jail_id BIGINT,
    custody_type VARCHAR(150),
    start_date DATE,
    end_date DATE,
    bail_conditions TEXT,
    status_notes TEXT,
    CONSTRAINT fk_custody_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_custody_accused FOREIGN KEY (accused_master_id) REFERENCES accused (accused_master_id),
    CONSTRAINT fk_custody_court FOREIGN KEY (court_id) REFERENCES court (court_id),
    CONSTRAINT fk_custody_jail FOREIGN KEY (jail_id) REFERENCES jail (jail_id)
);

-- ============================================================
-- 7. NETWORK, PROFILE, ORGANIZED CRIME, AND MO INTELLIGENCE
-- ============================================================

CREATE TABLE IF NOT EXISTS repeat_offender_profile (
    repeat_offender_profile_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_name_hash VARCHAR(256),
    identity_confidence NUMERIC(6, 4),
    primary_district_id BIGINT,
    known_alias_text TEXT,
    first_known_case_date DATE,
    last_known_case_date DATE,
    total_linked_cases INTEGER DEFAULT 0,
    total_convictions INTEGER DEFAULT 0,
    risk_level VARCHAR(100),
    profile_status VARCHAR(100),
    CONSTRAINT fk_rop_district FOREIGN KEY (primary_district_id) REFERENCES district (district_id)
);

CREATE TABLE IF NOT EXISTS repeat_offender_accused_link (
    repeat_offender_accused_link_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    repeat_offender_profile_id BIGINT NOT NULL,
    accused_master_id BIGINT NOT NULL,
    case_master_id BIGINT NOT NULL,
    match_method VARCHAR(150),
    match_confidence NUMERIC(6, 4),
    reviewed_by_employee_id BIGINT,
    review_status VARCHAR(100) DEFAULT 'pending',
    CONSTRAINT fk_roal_profile FOREIGN KEY (repeat_offender_profile_id) REFERENCES repeat_offender_profile (repeat_offender_profile_id),
    CONSTRAINT fk_roal_accused FOREIGN KEY (accused_master_id) REFERENCES accused (accused_master_id),
    CONSTRAINT fk_roal_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_roal_reviewer FOREIGN KEY (reviewed_by_employee_id) REFERENCES employee (employee_id),
    CONSTRAINT uq_roal UNIQUE (repeat_offender_profile_id, accused_master_id, case_master_id)
);

CREATE TABLE IF NOT EXISTS gang_network (
    gang_network_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    network_name VARCHAR(255),
    alias_names TEXT,
    primary_district_id BIGINT,
    primary_unit_id BIGINT,
    known_crime_head_id BIGINT,
    active_from_date DATE,
    active_to_date DATE,
    threat_level VARCHAR(100),
    confidence_score NUMERIC(6, 4),
    notes TEXT,
    CONSTRAINT fk_gang_district FOREIGN KEY (primary_district_id) REFERENCES district (district_id),
    CONSTRAINT fk_gang_unit FOREIGN KEY (primary_unit_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_gang_crime_head FOREIGN KEY (known_crime_head_id) REFERENCES crime_head (crime_head_id)
);

CREATE TABLE IF NOT EXISTS gang_network_member (
    gang_network_member_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    gang_network_id BIGINT NOT NULL,
    accused_master_id BIGINT,
    repeat_offender_profile_id BIGINT,
    role_in_network VARCHAR(150),
    start_date DATE,
    end_date DATE,
    confidence_score NUMERIC(6, 4),
    source_evidence_id BIGINT,
    CONSTRAINT fk_gnm_network FOREIGN KEY (gang_network_id) REFERENCES gang_network (gang_network_id),
    CONSTRAINT fk_gnm_accused FOREIGN KEY (accused_master_id) REFERENCES accused (accused_master_id),
    CONSTRAINT fk_gnm_profile FOREIGN KEY (repeat_offender_profile_id) REFERENCES repeat_offender_profile (repeat_offender_profile_id),
    CONSTRAINT fk_gnm_evidence FOREIGN KEY (source_evidence_id) REFERENCES evidence (evidence_id)
);

CREATE TABLE IF NOT EXISTS modus_operandi (
    modus_operandi_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT NOT NULL,
    crime_head_id BIGINT,
    pattern_type VARCHAR(150),
    target_type VARCHAR(150),
    entry_method VARCHAR(150),
    tools_used TEXT,
    deception_pattern TEXT,
    time_pattern VARCHAR(150),
    victim_approach TEXT,
    confidence_score NUMERIC(6, 4),
    extracted_from_text TEXT,
    CONSTRAINT fk_mo_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_mo_crime_head FOREIGN KEY (crime_head_id) REFERENCES crime_head (crime_head_id)
);

CREATE TABLE IF NOT EXISTS social_relationship (
    social_relationship_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT,
    person_a_type VARCHAR(100) NOT NULL,
    person_a_official_id BIGINT NOT NULL,
    person_b_type VARCHAR(100) NOT NULL,
    person_b_official_id BIGINT NOT NULL,
    relationship_type VARCHAR(150) NOT NULL,
    confidence_score NUMERIC(6, 4),
    source_evidence_id BIGINT,
    data_source_id BIGINT,
    review_status VARCHAR(100) DEFAULT 'pending',
    CONSTRAINT fk_social_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_social_evidence FOREIGN KEY (source_evidence_id) REFERENCES evidence (evidence_id),
    CONSTRAINT fk_social_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id)
);

CREATE TABLE IF NOT EXISTS address_history (
    address_history_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_official_id BIGINT NOT NULL,
    address_text TEXT,
    district_id BIGINT,
    state_id BIGINT,
    latitude NUMERIC(12, 8),
    longitude NUMERIC(12, 8),
    valid_from_date DATE,
    valid_to_date DATE,
    verification_status VARCHAR(100),
    source_evidence_id BIGINT,
    CONSTRAINT fk_address_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_address_state FOREIGN KEY (state_id) REFERENCES state (state_id),
    CONSTRAINT fk_address_evidence FOREIGN KEY (source_evidence_id) REFERENCES evidence (evidence_id)
);

CREATE TABLE IF NOT EXISTS organization (
    organization_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(150),
    registration_identifier_hash VARCHAR(256),
    district_id BIGINT,
    state_id BIGINT,
    address_text TEXT,
    role_in_case VARCHAR(150),
    verification_status VARCHAR(100),
    CONSTRAINT fk_org_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_org_state FOREIGN KEY (state_id) REFERENCES state (state_id)
);

-- ============================================================
-- 8. HOTSPOTS, AI SCORES, RECOMMENDATIONS, SIMILARITY, WORKFLOW
-- ============================================================

CREATE TABLE IF NOT EXISTS hotspot (
    hotspot_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hotspot_name VARCHAR(255),
    district_id BIGINT,
    unit_id BIGINT,
    crime_head_id BIGINT,
    crime_sub_head_id BIGINT,
    time_window_start TIMESTAMP,
    time_window_end TIMESTAMP,
    boundary_reference TEXT,
    center_latitude NUMERIC(12, 8),
    center_longitude NUMERIC(12, 8),
    risk_level VARCHAR(100),
    confidence_score NUMERIC(6, 4),
    trend_direction VARCHAR(100),
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(100),
    CONSTRAINT fk_hotspot_district FOREIGN KEY (district_id) REFERENCES district (district_id),
    CONSTRAINT fk_hotspot_unit FOREIGN KEY (unit_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_hotspot_head FOREIGN KEY (crime_head_id) REFERENCES crime_head (crime_head_id),
    CONSTRAINT fk_hotspot_sub_head FOREIGN KEY (crime_sub_head_id) REFERENCES crime_sub_head (crime_sub_head_id)
);

CREATE TABLE IF NOT EXISTS hotspot_case (
    hotspot_case_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hotspot_id BIGINT NOT NULL,
    case_master_id BIGINT NOT NULL,
    contribution_score NUMERIC(6, 4),
    match_reason TEXT,
    CONSTRAINT fk_hotspot_case_hotspot FOREIGN KEY (hotspot_id) REFERENCES hotspot (hotspot_id),
    CONSTRAINT fk_hotspot_case_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT uq_hotspot_case UNIQUE (hotspot_id, case_master_id)
);

CREATE TABLE IF NOT EXISTS risk_score (
    risk_score_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    score_subject_type VARCHAR(100) NOT NULL,
    case_master_id BIGINT,
    accused_master_id BIGINT,
    victim_master_id BIGINT,
    unit_id BIGINT,
    hotspot_id BIGINT,
    score_type VARCHAR(150) NOT NULL,
    score_value NUMERIC(10, 4),
    risk_level VARCHAR(100),
    explanation_text TEXT,
    confidence_score NUMERIC(6, 4),
    model_version VARCHAR(100),
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    review_status VARCHAR(100) DEFAULT 'pending',
    reviewed_by_employee_id BIGINT,
    CONSTRAINT fk_risk_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_risk_accused FOREIGN KEY (accused_master_id) REFERENCES accused (accused_master_id),
    CONSTRAINT fk_risk_victim FOREIGN KEY (victim_master_id) REFERENCES victim (victim_master_id),
    CONSTRAINT fk_risk_unit FOREIGN KEY (unit_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_risk_hotspot FOREIGN KEY (hotspot_id) REFERENCES hotspot (hotspot_id),
    CONSTRAINT fk_risk_reviewer FOREIGN KEY (reviewed_by_employee_id) REFERENCES employee (employee_id)
);

CREATE TABLE IF NOT EXISTS recommendation (
    recommendation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT,
    hotspot_id BIGINT,
    risk_score_id BIGINT,
    recommendation_type VARCHAR(150) NOT NULL,
    recommendation_text TEXT NOT NULL,
    rationale_text TEXT,
    confidence_score NUMERIC(6, 4),
    priority_level VARCHAR(100),
    model_version VARCHAR(100),
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(100) DEFAULT 'pending',
    reviewed_by_employee_id BIGINT,
    review_notes TEXT,
    CONSTRAINT fk_reco_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_reco_hotspot FOREIGN KEY (hotspot_id) REFERENCES hotspot (hotspot_id),
    CONSTRAINT fk_reco_risk FOREIGN KEY (risk_score_id) REFERENCES risk_score (risk_score_id),
    CONSTRAINT fk_reco_reviewer FOREIGN KEY (reviewed_by_employee_id) REFERENCES employee (employee_id)
);

CREATE TABLE IF NOT EXISTS recommendation_legal_section (
    recommendation_legal_section_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    recommendation_id BIGINT NOT NULL,
    act_code VARCHAR(50) NOT NULL,
    section_code VARCHAR(100) NOT NULL,
    recommendation_action VARCHAR(100) NOT NULL,
    reason_text TEXT,
    confidence_score NUMERIC(6, 4),
    CONSTRAINT fk_reco_legal_reco FOREIGN KEY (recommendation_id) REFERENCES recommendation (recommendation_id),
    CONSTRAINT fk_reco_legal_section FOREIGN KEY (act_code, section_code) REFERENCES section (act_code, section_code),
    CONSTRAINT uq_reco_legal UNIQUE (recommendation_id, act_code, section_code, recommendation_action)
);

CREATE TABLE IF NOT EXISTS case_similarity (
    case_similarity_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_case_master_id BIGINT NOT NULL,
    matched_case_master_id BIGINT NOT NULL,
    similarity_score NUMERIC(10, 6) NOT NULL,
    similarity_type VARCHAR(150),
    reason_features TEXT,
    model_version VARCHAR(100),
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    review_status VARCHAR(100) DEFAULT 'pending',
    reviewed_by_employee_id BIGINT,
    CONSTRAINT fk_similarity_source_case FOREIGN KEY (source_case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_similarity_match_case FOREIGN KEY (matched_case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_similarity_reviewer FOREIGN KEY (reviewed_by_employee_id) REFERENCES employee (employee_id),
    CONSTRAINT uq_case_similarity UNIQUE (source_case_master_id, matched_case_master_id, similarity_type)
);

CREATE TABLE IF NOT EXISTS feature_vector_ref (
    feature_vector_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_official_id BIGINT,
    ai_entity_id BIGINT,
    vector_purpose VARCHAR(150) NOT NULL,
    model_version VARCHAR(100),
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vector_store_reference TEXT NOT NULL,
    feature_summary TEXT,
    data_source_id BIGINT,
    CONSTRAINT fk_feature_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id)
);

CREATE TABLE IF NOT EXISTS alert (
    alert_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    alert_type VARCHAR(150) NOT NULL,
    case_master_id BIGINT,
    unit_id BIGINT,
    hotspot_id BIGINT,
    risk_score_id BIGINT,
    recommendation_id BIGINT,
    severity VARCHAR(100),
    alert_text TEXT NOT NULL,
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(100) DEFAULT 'open',
    assigned_to_employee_id BIGINT,
    CONSTRAINT fk_alert_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_alert_unit FOREIGN KEY (unit_id) REFERENCES unit (unit_id),
    CONSTRAINT fk_alert_hotspot FOREIGN KEY (hotspot_id) REFERENCES hotspot (hotspot_id),
    CONSTRAINT fk_alert_risk FOREIGN KEY (risk_score_id) REFERENCES risk_score (risk_score_id),
    CONSTRAINT fk_alert_reco FOREIGN KEY (recommendation_id) REFERENCES recommendation (recommendation_id),
    CONSTRAINT fk_alert_assignee FOREIGN KEY (assigned_to_employee_id) REFERENCES employee (employee_id)
);

CREATE TABLE IF NOT EXISTS task (
    task_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_master_id BIGINT,
    recommendation_id BIGINT,
    alert_id BIGINT,
    assigned_to_employee_id BIGINT,
    task_title VARCHAR(255) NOT NULL,
    task_description TEXT,
    priority_level VARCHAR(100),
    due_date DATE,
    status VARCHAR(100) DEFAULT 'open',
    closure_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_task_reco FOREIGN KEY (recommendation_id) REFERENCES recommendation (recommendation_id),
    CONSTRAINT fk_task_alert FOREIGN KEY (alert_id) REFERENCES alert (alert_id),
    CONSTRAINT fk_task_assignee FOREIGN KEY (assigned_to_employee_id) REFERENCES employee (employee_id)
);

-- ============================================================
-- 9. AI CHAT, SEARCH, AND MODEL AUDIT
-- ============================================================

CREATE TABLE IF NOT EXISTS model_audit_log (
    model_audit_log_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    model_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(100),
    run_purpose VARCHAR(150),
    input_entity_type VARCHAR(100),
    input_entity_id BIGINT,
    output_entity_type VARCHAR(100),
    output_entity_id BIGINT,
    confidence_score NUMERIC(6, 4),
    generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    triggered_by_employee_id BIGINT,
    review_status VARCHAR(100) DEFAULT 'pending',
    review_notes TEXT,
    CONSTRAINT fk_audit_employee FOREIGN KEY (triggered_by_employee_id) REFERENCES employee (employee_id)
);

CREATE TABLE IF NOT EXISTS chat_session (
    chat_session_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id BIGINT,
    case_master_id BIGINT,
    session_started_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_ended_on TIMESTAMP,
    session_purpose VARCHAR(150),
    security_classification VARCHAR(100),
    model_version VARCHAR(100),
    CONSTRAINT fk_chat_session_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_chat_session_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id)
);

CREATE TABLE IF NOT EXISTS chat_message (
    chat_message_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    chat_session_id BIGINT NOT NULL,
    message_sequence INTEGER NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    message_text TEXT NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    linked_recommendation_id BIGINT,
    linked_audit_log_id BIGINT,
    CONSTRAINT fk_chat_message_session FOREIGN KEY (chat_session_id) REFERENCES chat_session (chat_session_id),
    CONSTRAINT fk_chat_message_reco FOREIGN KEY (linked_recommendation_id) REFERENCES recommendation (recommendation_id),
    CONSTRAINT fk_chat_message_audit FOREIGN KEY (linked_audit_log_id) REFERENCES model_audit_log (model_audit_log_id),
    CONSTRAINT uq_chat_message_sequence UNIQUE (chat_session_id, message_sequence)
);

CREATE TABLE IF NOT EXISTS search_request (
    search_request_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id BIGINT,
    case_master_id BIGINT,
    search_text TEXT NOT NULL,
    search_filters_summary TEXT,
    requested_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    result_summary TEXT,
    linked_chat_session_id BIGINT,
    linked_recommendation_id BIGINT,
    CONSTRAINT fk_search_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_search_case FOREIGN KEY (case_master_id) REFERENCES case_master (case_master_id),
    CONSTRAINT fk_search_chat FOREIGN KEY (linked_chat_session_id) REFERENCES chat_session (chat_session_id),
    CONSTRAINT fk_search_reco FOREIGN KEY (linked_recommendation_id) REFERENCES recommendation (recommendation_id)
);

-- ============================================================
-- 10. KNOWLEDGE GRAPH PROJECTION TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS kg_node (
    kg_node_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    node_label VARCHAR(100) NOT NULL,
    source_table VARCHAR(150) NOT NULL,
    source_record_id VARCHAR(150) NOT NULL,
    display_name VARCHAR(500),
    sensitivity_level VARCHAR(100),
    quality_status VARCHAR(100),
    source_confidence NUMERIC(6, 4),
    data_source_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_kg_node_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT uq_kg_node_source UNIQUE (source_table, source_record_id, node_label)
);

CREATE TABLE IF NOT EXISTS kg_edge (
    kg_edge_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    from_kg_node_id BIGINT NOT NULL,
    to_kg_node_id BIGINT NOT NULL,
    relationship_type VARCHAR(150) NOT NULL,
    source_table VARCHAR(150),
    source_record_id VARCHAR(150),
    confidence_score NUMERIC(6, 4),
    edge_weight NUMERIC(10, 4) DEFAULT 1.0,
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    evidence_id BIGINT,
    data_source_id BIGINT,
    model_version VARCHAR(100),
    review_status VARCHAR(100) DEFAULT 'accepted',
    reviewed_by_employee_id BIGINT,
    explanation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_kg_edge_from FOREIGN KEY (from_kg_node_id) REFERENCES kg_node (kg_node_id),
    CONSTRAINT fk_kg_edge_to FOREIGN KEY (to_kg_node_id) REFERENCES kg_node (kg_node_id),
    CONSTRAINT fk_kg_edge_evidence FOREIGN KEY (evidence_id) REFERENCES evidence (evidence_id),
    CONSTRAINT fk_kg_edge_source FOREIGN KEY (data_source_id) REFERENCES data_source (data_source_id),
    CONSTRAINT fk_kg_edge_reviewer FOREIGN KEY (reviewed_by_employee_id) REFERENCES employee (employee_id)
);

-- ============================================================
-- 11. INDEX STRATEGY - OPERATIONAL QUERY PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_district_state ON district (state_id);
CREATE INDEX IF NOT EXISTS idx_unit_district ON unit (district_id);
CREATE INDEX IF NOT EXISTS idx_unit_parent ON unit (parent_unit_id);
CREATE INDEX IF NOT EXISTS idx_employee_unit ON employee (unit_id);
CREATE INDEX IF NOT EXISTS idx_employee_district ON employee (district_id);
CREATE INDEX IF NOT EXISTS idx_employee_rank ON employee (rank_id);
CREATE INDEX IF NOT EXISTS idx_case_registered_date ON case_master (crime_registered_date);
CREATE INDEX IF NOT EXISTS idx_case_station_date ON case_master (police_station_id, crime_registered_date);
CREATE INDEX IF NOT EXISTS idx_case_status ON case_master (case_status_id);
CREATE INDEX IF NOT EXISTS idx_case_crime_heads ON case_master (crime_major_head_id, crime_minor_head_id);
CREATE INDEX IF NOT EXISTS idx_case_court ON case_master (court_id);
CREATE INDEX IF NOT EXISTS idx_case_source_key ON case_master (source_case_key);
CREATE INDEX IF NOT EXISTS idx_case_geo ON case_master (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_complainant_case ON complainant_details (case_master_id);
CREATE INDEX IF NOT EXISTS idx_victim_case ON victim (case_master_id);
CREATE INDEX IF NOT EXISTS idx_accused_case ON accused (case_master_id);
CREATE INDEX IF NOT EXISTS idx_arrest_case ON arrest_surrender (case_master_id);
CREATE INDEX IF NOT EXISTS idx_arrest_accused ON arrest_surrender (accused_master_id);
CREATE INDEX IF NOT EXISTS idx_arrest_date ON arrest_surrender (arrest_surrender_date);
CREATE INDEX IF NOT EXISTS idx_act_section_case ON act_section_association (case_master_id);
CREATE INDEX IF NOT EXISTS idx_act_section_section ON act_section_association (act_code, section_code);
CREATE INDEX IF NOT EXISTS idx_chargesheet_case ON chargesheet_details (case_master_id);

-- ============================================================
-- 12. INDEX STRATEGY - ANALYTICS AND DASHBOARDS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_crime_stat_period ON crime_statistic (report_year, report_month);
CREATE INDEX IF NOT EXISTS idx_crime_stat_district_period ON crime_statistic (district_id, report_year, report_month);
CREATE INDEX IF NOT EXISTS idx_crime_stat_unit_period ON crime_statistic (unit_id, report_year, report_month);
CREATE INDEX IF NOT EXISTS idx_crime_stat_head_period ON crime_statistic (crime_head_id, report_year, report_month);
CREATE INDEX IF NOT EXISTS idx_crime_review_period ON crime_review_report (report_year, report_month);
CREATE INDEX IF NOT EXISTS idx_report_section_head ON report_section (related_crime_head_id);
CREATE INDEX IF NOT EXISTS idx_victim_demo_year_state ON victim_demographic_statistic (statistic_year, state_id);
CREATE INDEX IF NOT EXISTS idx_cyber_stat_year_state ON cyber_suspect_statistic (statistic_year, state_id);
CREATE INDEX IF NOT EXISTS idx_road_stat_year_district ON road_accident_statistic (statistic_year, district_id);
CREATE INDEX IF NOT EXISTS idx_service_metric_period_domain ON service_performance_metric (report_year, report_month, metric_domain);
CREATE INDEX IF NOT EXISTS idx_hotspot_district_time ON hotspot (district_id, time_window_start, time_window_end);
CREATE INDEX IF NOT EXISTS idx_hotspot_unit_time ON hotspot (unit_id, time_window_start, time_window_end);
CREATE INDEX IF NOT EXISTS idx_hotspot_risk ON hotspot (risk_level, confidence_score);
CREATE INDEX IF NOT EXISTS idx_hotspot_case_case ON hotspot_case (case_master_id);

-- ============================================================
-- 13. INDEX STRATEGY - INVESTIGATION AND GRAPH SEARCH
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_geo_case ON geo_location (case_master_id);
CREATE INDEX IF NOT EXISTS idx_geo_validated ON geo_location (validated_latitude, validated_longitude);
CREATE INDEX IF NOT EXISTS idx_evidence_case ON evidence (case_master_id);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence (evidence_type);
CREATE INDEX IF NOT EXISTS idx_property_case ON property_asset (case_master_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_case ON vehicle (case_master_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_reg_hash ON vehicle (registration_number_hash);
CREATE INDEX IF NOT EXISTS idx_pdi_case ON phone_digital_identifier (case_master_id);
CREATE INDEX IF NOT EXISTS idx_pdi_identifier_hash ON phone_digital_identifier (identifier_hash);
CREATE INDEX IF NOT EXISTS idx_fin_account_hash ON financial_account (account_identifier_hash);
CREATE INDEX IF NOT EXISTS idx_fin_txn_case ON financial_transaction (case_master_id);
CREATE INDEX IF NOT EXISTS idx_fin_txn_from ON financial_transaction (from_financial_account_id);
CREATE INDEX IF NOT EXISTS idx_fin_txn_to ON financial_transaction (to_financial_account_id);
CREATE INDEX IF NOT EXISTS idx_fin_txn_date ON financial_transaction (transaction_date_time);
CREATE INDEX IF NOT EXISTS idx_weapon_case ON weapon (case_master_id);
CREATE INDEX IF NOT EXISTS idx_forensic_case ON forensic_report (case_master_id);
CREATE INDEX IF NOT EXISTS idx_witness_case ON witness (case_master_id);
CREATE INDEX IF NOT EXISTS idx_diary_case_date ON case_diary_entry (case_master_id, entry_date_time);
CREATE INDEX IF NOT EXISTS idx_court_proc_case_date ON court_proceeding (case_master_id, proceeding_date);
CREATE INDEX IF NOT EXISTS idx_custody_accused ON custody_status (accused_master_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rop_district ON repeat_offender_profile (primary_district_id);
CREATE INDEX IF NOT EXISTS idx_roal_accused ON repeat_offender_accused_link (accused_master_id);
CREATE INDEX IF NOT EXISTS idx_roal_case ON repeat_offender_accused_link (case_master_id);
CREATE INDEX IF NOT EXISTS idx_gang_district ON gang_network (primary_district_id);
CREATE INDEX IF NOT EXISTS idx_gang_member_accused ON gang_network_member (accused_master_id);
CREATE INDEX IF NOT EXISTS idx_gang_member_profile ON gang_network_member (repeat_offender_profile_id);
CREATE INDEX IF NOT EXISTS idx_mo_case ON modus_operandi (case_master_id);
CREATE INDEX IF NOT EXISTS idx_mo_pattern ON modus_operandi (pattern_type, target_type, time_pattern);
CREATE INDEX IF NOT EXISTS idx_social_person_a ON social_relationship (person_a_type, person_a_official_id);
CREATE INDEX IF NOT EXISTS idx_social_person_b ON social_relationship (person_b_type, person_b_official_id);
CREATE INDEX IF NOT EXISTS idx_address_entity ON address_history (entity_type, entity_official_id);

-- ============================================================
-- 14. INDEX STRATEGY - AI, RAG, LEGAL, AND WORKFLOW
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_legal_doc_act ON legal_document_source (act_code);
CREATE INDEX IF NOT EXISTS idx_ipc_ref_section ON ipc_section_reference (act_code, section_code);
CREATE INDEX IF NOT EXISTS idx_legal_keyword_text ON legal_keyword (keyword_text);
CREATE INDEX IF NOT EXISTS idx_rag_doc_corpus ON rag_document (rag_corpus_id);
CREATE INDEX IF NOT EXISTS idx_rag_doc_case ON rag_document (case_master_id);
CREATE INDEX IF NOT EXISTS idx_rag_chunk_doc_sequence ON rag_chunk (rag_document_id, chunk_sequence);
CREATE INDEX IF NOT EXISTS idx_embedding_chunk ON rag_embedding_ref (rag_chunk_id);
CREATE INDEX IF NOT EXISTS idx_rag_log_case_time ON rag_retrieval_log (case_master_id, retrieved_on);
CREATE INDEX IF NOT EXISTS idx_rag_result_log_rank ON rag_retrieval_result (rag_retrieval_log_id, rank_order);
CREATE INDEX IF NOT EXISTS idx_feature_vector_entity ON feature_vector_ref (entity_type, entity_official_id, vector_purpose);
CREATE INDEX IF NOT EXISTS idx_risk_case ON risk_score (case_master_id, score_type, generated_on);
CREATE INDEX IF NOT EXISTS idx_risk_accused ON risk_score (accused_master_id, score_type, generated_on);
CREATE INDEX IF NOT EXISTS idx_risk_hotspot ON risk_score (hotspot_id, score_type, generated_on);
CREATE INDEX IF NOT EXISTS idx_reco_case_status ON recommendation (case_master_id, status, generated_on);
CREATE INDEX IF NOT EXISTS idx_reco_hotspot_status ON recommendation (hotspot_id, status, generated_on);
CREATE INDEX IF NOT EXISTS idx_reco_legal_section ON recommendation_legal_section (act_code, section_code);
CREATE INDEX IF NOT EXISTS idx_similarity_source ON case_similarity (source_case_master_id, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_similarity_match ON case_similarity (matched_case_master_id, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_alert_status_severity ON alert (status, severity, generated_on);
CREATE INDEX IF NOT EXISTS idx_alert_assignee ON alert (assigned_to_employee_id, status);
CREATE INDEX IF NOT EXISTS idx_task_assignee_status ON task (assigned_to_employee_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_task_case_status ON task (case_master_id, status);
CREATE INDEX IF NOT EXISTS idx_chat_session_employee ON chat_session (employee_id, session_started_on);
CREATE INDEX IF NOT EXISTS idx_chat_session_case ON chat_session (case_master_id, session_started_on);
CREATE INDEX IF NOT EXISTS idx_chat_message_session ON chat_message (chat_session_id, message_sequence);
CREATE INDEX IF NOT EXISTS idx_search_employee_time ON search_request (employee_id, requested_on);
CREATE INDEX IF NOT EXISTS idx_model_audit_output ON model_audit_log (output_entity_type, output_entity_id);
CREATE INDEX IF NOT EXISTS idx_model_audit_input ON model_audit_log (input_entity_type, input_entity_id);
CREATE INDEX IF NOT EXISTS idx_kg_node_label ON kg_node (node_label);
CREATE INDEX IF NOT EXISTS idx_kg_node_source ON kg_node (source_table, source_record_id);
CREATE INDEX IF NOT EXISTS idx_kg_edge_from_type ON kg_edge (from_kg_node_id, relationship_type);
CREATE INDEX IF NOT EXISTS idx_kg_edge_to_type ON kg_edge (to_kg_node_id, relationship_type);
CREATE INDEX IF NOT EXISTS idx_kg_edge_relationship ON kg_edge (relationship_type);
CREATE INDEX IF NOT EXISTS idx_kg_edge_confidence ON kg_edge (confidence_score);

-- PostgreSQL full-text indexes for RAG/legal/case retrieval.
-- These use built-in PostgreSQL functions and do not require extensions.
CREATE INDEX IF NOT EXISTS idx_case_brief_facts_fts ON case_master USING GIN (to_tsvector('english', COALESCE(brief_facts, '')));
CREATE INDEX IF NOT EXISTS idx_rag_chunk_text_fts ON rag_chunk USING GIN (to_tsvector('english', COALESCE(chunk_text, '')));
CREATE INDEX IF NOT EXISTS idx_section_description_fts ON section USING GIN (to_tsvector('english', COALESCE(section_description, '')));
CREATE INDEX IF NOT EXISTS idx_ipc_reference_fts ON ipc_section_reference USING GIN (to_tsvector('english', COALESCE(description_text, '') || ' ' || COALESCE(offense_text, '') || ' ' || COALESCE(punishment_text, '')));
CREATE INDEX IF NOT EXISTS idx_evidence_description_fts ON evidence USING GIN (to_tsvector('english', COALESCE(evidence_description, '')));
CREATE INDEX IF NOT EXISTS idx_diary_entry_fts ON case_diary_entry USING GIN (to_tsvector('english', COALESCE(entry_text, '') || ' ' || COALESCE(action_taken, '') || ' ' || COALESCE(next_action, '')));

COMMIT;
