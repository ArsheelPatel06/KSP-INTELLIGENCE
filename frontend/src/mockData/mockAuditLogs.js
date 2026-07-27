export const mockAuditLogs = [
  {
    id: "LOG-9081",
    timestamp: "2026-07-25 01:05:42",
    user: "DCP Vikram Rathore",
    role: "Admin",
    action: "CASE_EXPORT_PDF",
    details: "Downloaded encrypted PDF case file FIR-2026-KA-0042",
    ip: "10.240.18.42",
    status: "SUCCESS"
  },
  {
    id: "LOG-9080",
    timestamp: "2026-07-25 00:52:19",
    user: "ACP Ananya Hegde",
    role: "Supervisor",
    action: "AI_QUERY_EXECUTE",
    details: "Queried AI Assistant: 'Mule bank account cluster analysis Bengaluru'",
    ip: "10.240.19.11",
    status: "SUCCESS"
  },
  {
    id: "LOG-9079",
    timestamp: "2026-07-25 00:34:01",
    user: "Inspector Rajesh Kumar",
    role: "Investigator",
    action: "FIR_NOTE_ADDED",
    details: "Added investigation note to FIR-2026-KA-0128: 'Interrogated witness'",
    ip: "10.240.22.89",
    status: "SUCCESS"
  },
  {
    id: "LOG-9078",
    timestamp: "2026-07-25 00:15:30",
    user: "Analyst Priya Sharma",
    role: "Analyst",
    action: "NETWORK_NODE_EDIT",
    details: "Added entity node Bank Account ICICI-0029 to Network Graph",
    ip: "10.240.15.60",
    status: "SUCCESS"
  },
  {
    id: "LOG-9077",
    timestamp: "2026-07-24 23:40:12",
    user: "System Daemon",
    role: "System",
    action: "VECTOR_INDEX_SYNC",
    details: "Synchronized 1,000 FIR embeddings with Crime Intelligence Vector DB",
    ip: "127.0.0.1",
    status: "SUCCESS"
  },
  {
    id: "LOG-9076",
    timestamp: "2026-07-24 22:11:05",
    user: "Sub-Inspector M. Arif",
    role: "Investigator",
    action: "LOGIN_SUCCESS",
    details: "Authenticated via 2FA Smart Card",
    ip: "10.240.24.102",
    status: "SUCCESS"
  }
];

export const mockUsers = [
  { id: "USR-01", name: "DCP Vikram Rathore, IPS", email: "v.rathore@ksp.gov.in", role: "Admin", station: "State HQ Bengaluru", status: "Active", lastLogin: "10 mins ago" },
  { id: "USR-02", name: "ACP Ananya Hegde", email: "a.hegde@ksp.gov.in", role: "Supervisor", station: "CCB Crime Branch", status: "Active", lastLogin: "30 mins ago" },
  { id: "USR-03", name: "Inspector Rajesh Kumar", email: "r.kumar@ksp.gov.in", role: "Investigator", station: "High Grounds PS", status: "Active", lastLogin: "1 hour ago" },
  { id: "USR-04", name: "Analyst Priya Sharma", email: "p.sharma@ksp.gov.in", role: "Analyst", station: "Cyber Intelligence Unit", status: "Active", lastLogin: "2 hours ago" },
  { id: "USR-05", name: "Inspector Kavita Patil", email: "k.patil@ksp.gov.in", role: "Investigator", station: "Devaraja PS Mysuru", status: "Active", lastLogin: "Yesterday" }
];

export const mockSystemHealth = {
  apiLatency: "24 ms",
  uptime: "99.98%",
  aiModelStatus: "Operational (Sentinel-AI-70B-Crime-FineTuned)",
  vectorDbDocs: "1,000 FIR Records / 14,200 Entities",
  serverLoad: "32% CPU / 4.2 GB RAM",
  activeSessions: 42,
  dbIndexing: "100% Up-to-date"
};
