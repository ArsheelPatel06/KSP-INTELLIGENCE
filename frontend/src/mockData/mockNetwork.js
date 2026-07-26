// Mock Entity Network Graph Data for React Flow Criminal Link Analysis

export const initialNetworkNodes = [
  // Key Cases
  {
    id: "case-1",
    type: "customEntity",
    position: { x: 450, y: 250 },
    data: {
      label: "FIR-2026-KA-0042",
      subLabel: "Cyber Financial Fraud (₹4.2 Cr)",
      category: "case",
      status: "Under Investigation",
      priority: "Critical",
      details: { district: "Bengaluru Urban", station: "CCB Cyber Unit", date: "2026-06-12" }
    }
  },
  {
    id: "case-2",
    type: "customEntity",
    position: { x: 900, y: 150 },
    data: {
      label: "FIR-2026-KA-0128",
      subLabel: "Armed Robbery & Hijack",
      category: "case",
      status: "Open",
      priority: "High",
      details: { district: "Mysuru", station: "Devaraja PS", date: "2026-05-20" }
    }
  },

  // Key Suspects
  {
    id: "suspect-1",
    type: "customEntity",
    position: { x: 250, y: 120 },
    data: {
      label: "Ramesh 'Snake' Shetty",
      subLabel: "Mastermind / Crime Syndicate Lead",
      category: "suspect",
      status: "Absconding",
      details: { age: 41, aliases: ["Snake", "Ramoo"], gang: "Shetty Syndicate", priors: 7 }
    }
  },
  {
    id: "suspect-2",
    type: "customEntity",
    position: { x: 680, y: 80 },
    data: {
      label: "Imran 'Phantom' Khan",
      subLabel: "Mule Account Coordinator",
      category: "suspect",
      status: "In Custody",
      details: { age: 34, aliases: ["Phantom"], gang: "Net-Mules", priors: 3 }
    }
  },
  {
    id: "suspect-3",
    type: "customEntity",
    position: { x: 780, y: 380 },
    data: {
      label: "Sunil Gowda",
      subLabel: "Getaway Driver & Logistics",
      category: "suspect",
      status: "Absconding",
      details: { age: 29, aliases: ["Sunny"], gang: "Shetty Syndicate", priors: 2 }
    }
  },

  // Phone Numbers
  {
    id: "phone-1",
    type: "customEntity",
    position: { x: 120, y: 300 },
    data: {
      label: "+91 98450 11209",
      subLabel: "Burner SIM (IMEI: 864291...)",
      category: "phone",
      status: "Active Tracking",
      details: { serviceProvider: "Airtel", towersPinged: 14, lastActive: "2026-07-24 22:15" }
    }
  },
  {
    id: "phone-2",
    type: "customEntity",
    position: { x: 480, y: 50 },
    data: {
      label: "+91 99801 77341",
      subLabel: "Encrypted VoIP Routing",
      category: "phone",
      status: "Intercepted",
      details: { serviceProvider: "Jio", towersPinged: 28, lastActive: "2026-07-25 00:40" }
    }
  },

  // Bank Accounts
  {
    id: "bank-1",
    type: "customEntity",
    position: { x: 300, y: 450 },
    data: {
      label: "HDFC A/C: 5010029381...",
      subLabel: "Shell Company Account (Mule)",
      category: "bank",
      status: "Frozen by CCB",
      details: { balance: "₹ 1,84,50,000", totalInflow: "₹ 5.2 Cr", holder: "Apex Global Traders" }
    }
  },
  {
    id: "bank-2",
    type: "customEntity",
    position: { x: 620, y: 500 },
    data: {
      label: "ICICI A/C: 00290159...",
      subLabel: "Offshore Layering Vault",
      category: "bank",
      status: "Under Watch",
      details: { balance: "₹ 62,00,000", totalInflow: "₹ 2.1 Cr", holder: "BlueSky Logistics" }
    }
  },

  // Vehicles
  {
    id: "veh-1",
    type: "customEntity",
    position: { x: 1020, y: 320 },
    data: {
      label: "KA-04-MJ-8812",
      subLabel: "Black SUV (Mahindra Thar)",
      category: "vehicle",
      status: "Impounded",
      details: { owner: "Sunil Gowda", fastagHits: "NH-44 Expressway (18 hits)" }
    }
  },

  // Victims
  {
    id: "victim-1",
    type: "customEntity",
    position: { x: 220, y: 250 },
    data: {
      label: "Dr. Arvind Swamy",
      subLabel: "Complainant / Fraud Victim",
      category: "victim",
      status: "Protected Witness",
      details: { loss: "₹ 85,00,000", statementRecorded: true }
    }
  },

  // Locations
  {
    id: "loc-1",
    type: "customEntity",
    position: { x: 500, y: 350 },
    data: {
      label: "MG Road Cyber Hub, Blr",
      subLabel: "Primary Crime Scene / Tower Dump",
      category: "location",
      status: "High Density Hotspot",
      details: { coordinates: "12.9756, 77.6097", incidentsLinked: 4 }
    }
  }
];

export const initialNetworkEdges = [
  { id: "e1", source: "suspect-1", target: "case-1", label: "Prime Suspect", animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
  { id: "e2", source: "suspect-1", target: "phone-1", label: "Registered IMEI", style: { stroke: '#06B6D4', strokeWidth: 1.5 } },
  { id: "e3", source: "phone-1", target: "bank-1", label: "OTP Authorized", style: { stroke: '#A855F7', strokeWidth: 1.5 } },
  { id: "e4", source: "bank-1", target: "case-1", label: "Fund Siphoned To", animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: "e5", source: "victim-1", target: "case-1", label: "Filed FIR", style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: "e6", source: "suspect-2", target: "case-1", label: "Co-Accused", style: { stroke: '#F59E0B', strokeWidth: 1.5 } },
  { id: "e7", source: "suspect-2", target: "bank-2", label: "Operates A/C", style: { stroke: '#A855F7', strokeWidth: 1.5 } },
  { id: "e8", source: "bank-1", target: "bank-2", label: "Wire Transfer (₹85L)", animated: true, style: { stroke: '#EF4444', strokeWidth: 2 } },
  { id: "e9", source: "suspect-1", target: "suspect-3", label: "Syndicate Commander", style: { stroke: '#EF4444', strokeWidth: 1.5 } },
  { id: "e10", source: "suspect-3", target: "veh-1", label: "Registered Vehicle", style: { stroke: '#F59E0B', strokeWidth: 1.5 } },
  { id: "e11", source: "veh-1", target: "case-2", label: "Spotted on CCTV", animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: "e12", source: "suspect-3", target: "case-2", label: "Getaway Driver", style: { stroke: '#EF4444', strokeWidth: 1.5 } },
  { id: "e13", source: "phone-2", target: "suspect-2", label: "VoIP Call Link", style: { stroke: '#06B6D4', strokeWidth: 1.5 } },
  { id: "e14", source: "loc-1", target: "case-1", label: "Tower Geofence", style: { stroke: '#64748B', strokeDasharray: '4 4' } }
];
