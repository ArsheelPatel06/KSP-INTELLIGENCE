# Sentinel: Intelligent Conversational AI & Crime Analytics Platform 🛡️

![Sentinel Dashboard](frontend/public/gallery/Screenshot%202026-07-28%20at%204.42.48%20pm.png)

## The Challenge

Law enforcement agencies sit on massive silos of data—FIRs, suspect records, financial transactions, and geographic data—that are historically difficult to query and connect.

**Sentinel** is an Intelligent Conversational AI and Crime Analytics Platform designed for investigators, analysts, and policymakers. It enables natural language interactions with state crime databases, providing advanced analytical capabilities grounded in criminology and sociological insights.

Our platform goes beyond simple data retrieval. It discovers hidden relationships, maps criminal networks, identifies socio-economic patterns, supports investigative decision-making, and provides predictive insights to strengthen proactive law enforcement.

---

## 🌟 Key Capabilities & Solution Framework

### 1. Conversational Crime Intelligence Interface
- **Natural Language Chatbot:** Query complex crime records using plain English (and regional languages like Kannada).
- **Deep Retrieval:** Instantly pull records on FIRs, accused individuals, victims, locations, and criminal histories.
- **Context-Aware Follow-ups:** Engage in natural, continuous dialogue. Sentinel remembers the context of the investigation so you don't have to repeat yourself.
- **Export & Accessibility:** Save entire conversation histories and investigation timelines locally as PDFs. Voice interaction support for hands-free Q&A.

![Conversational Interface](frontend/public/gallery/Screenshot%202026-07-28%20at%204.41.05%20pm.png)

### 2. Criminal Network & Relationship Analysis
- **Entity Linking:** Automatically identifies hidden links between the accused, victims, geographical locations, financial accounts, and prior crime incidents.
- **Network Visualization:** Generates interactive node-based graphs of criminal networks.
- **Organized Crime Detection:** Automatically flags potential organized crime groups and highlights repeat offender networks.

![Network Graph Analysis](frontend/public/gallery/Screenshot%202026-07-28%20at%204.41.23%20pm.png)

### 3. Crime Pattern & Trend Analytics
- **Multi-dimensional Analysis:** Track crime trends across time, geography, modus operandi, and specific crime types.
- **Hotspot Identification:** Detect emerging crime clusters and existing geographical hotspots.
- **Temporal Analysis:** Execute seasonal and event-based crime trend predictions based on historical patterns.

![Trend Analytics](frontend/public/gallery/Screenshot%202026-07-28%20at%204.43.14%20pm.png)

### 4. Sociological Crime Insights
- **Demographic Profiling:** Correlate crime patterns with age, gender, and socio-economic backgrounds.
- **Social Indicator Analysis:** Map crime against urbanization rates, migration, economic stress, and educational levels to identify foundational risk factors influencing crime patterns.

### 5. Criminology-Based Offender Profiling
- **Behavioral Analysis:** Construct comprehensive profiles of repeat offenders based on their crime history and modus operandi.
- **Risk Scoring:** Assign automated threat and flight risk scores to offenders to help investigators prioritize resources.

![Offender Profiling](frontend/public/gallery/Screenshot%202026-07-28%20at%204.42.22%20pm.png)

### 6. Investigator Decision Support
- **Automated Summaries:** Generate one-click case summaries and chronologically accurate investigation timelines.
- **Historical Precedents:** Automatically retrieve similar past cases and their investigation outcomes to guide current strategy.
- **Smart Recommendations:** The AI actively suggests potential investigative leads and next steps.

![Decision Support](frontend/public/gallery/Screenshot%202026-07-28%20at%204.44.06%20pm.png)

### 7. Financial Crime & Transaction Link Analysis
- **Money Trails:** Detect financial transactions linked to criminal activities and visualize suspicious transaction networks.
- **Workflow Integration:** Seamlessly integrates with financial crime investigation modules for end-to-end tracking.

### 8. Crime Forecasting & Early Warning
- **Proactive Alerts:** AI-driven identification of emerging crime patterns and early warning alerts for potential gang activity or organized crime resurgence.
- **Predictive Hotspots:** Algorithms forecast potential locations for future incidents based on environmental and temporal data.

### 9. Explainable AI & Transparent Analytics
- **Evidence-Backed Responses:** Every AI conclusion is supported by clear data references and evidence trails (e.g., citing specific FIRs).
- **Reasoning Paths:** Visualizes the logic and correlations used in analysis, ensuring full compliance with law enforcement accountability requirements.

![Explainable AI & Evidence](frontend/public/gallery/Screenshot%202026-07-28%20at%204.43.38%20pm.png)

### 10. Secure Role-Based Access & Governance
- **Granular Permissions:** Strict role-based access for investigators, analysts, supervisors, and policymakers.
- **Audit Trails:** Secure handling of sensitive data with immutable audit logs and complete traceability in compliance with data protection frameworks.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, TailwindCSS, Lucide React (Icons)
- **Backend:** Node.js, Express, TypeScript
- **AI Core:** Llama 3 (via Groq API) for fast, structured natural language processing
- **Database Architecture:** Multi-agent pipeline with support for relational and graph database structures for entity mapping.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Groq API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArsheelPatel06/KSP-INTELLIGENCE.git
   cd crime-intelligence-platform
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   # Add your GROQ_API_KEY to the .env file
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open your browser and navigate to the frontend URL (typically `http://localhost:3001` or `http://localhost:5173`).

---
*Built with ❤️ for law enforcement agencies to make communities safer through data-driven intelligence.*
