// Comprehensive Mock Dataset of 1000 FIRs & Crime Intelligence Entities

const CRIME_TYPES = [
  "Armed Robbery", "Chain Snatching", "Cyber Financial Fraud", "Homicide Investigation",
  "Narcotics Distribution", "Vehicle Theft Ring", "Corporate Embezzlement", "Extortion Racketeering",
  "Residential Burglary", "Counterfeit Currency Syndicate", "Illegal Arms Trafficking", "Kidnapping & Ransom"
];

const DISTRICTS = [
  "Bengaluru Urban", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi",
  "Kalaburagi", "Davanagere", "Ballari", "Shivamogga", "Tumakuru"
];

const STATIONS = {
  "Bengaluru Urban": ["High Grounds PS", "Koramangala PS", "Indiranagar PS", "Commercial Street PS", "CCB Cyber Unit"],
  "Mysuru": ["Devaraja PS", "Nazarbad PS", "Vidyaranyapuram PS", "Lashkar PS"],
  "Hubballi-Dharwad": ["Suburban PS", "Gokul Road PS", "Dharwad Town PS"],
  "Mangaluru": ["Panambur PS", "Kadri PS", "Bunder PS", "Urwa PS"],
  "Belagavi": ["Market PS", "Camp PS", "Tilakwadi PS"],
  "Kalaburagi": ["Station Bazar PS", "MB Nagar PS"],
  "Davanagere": ["City Central PS", "Extension PS"],
  "Ballari": ["Brucepet PS", "Cowled Bazar PS"],
  "Shivamogga": ["Doddapet PS", "Tunga Nagar PS"],
  "Tumakuru": ["Kyathsandra PS", "Town PS"]
};

const BNS_SECTIONS = [
  "BNS 304 / IPC 302 (Murder)", "BNS 309 / IPC 392 (Robbery)", "BNS 318 / IPC 420 (Cheating/Fraud)",
  "BNS 303 / IPC 379 (Theft)", "BNS 111 / IPC 120B (Organized Crime)", "NDPS Act Sec 21/22 (Narcotics)",
  "IT Act Sec 66D (Cyber Fraud)", "BNS 140 / IPC 364A (Kidnapping)", "Arms Act Sec 25 (Illegal Weapons)"
];

const STATUSES = ["Under Investigation", "Charge Sheet Filed", "Solved", "Pending Forensic", "Open"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];

const OFFICERS = [
  { id: "OFF-101", name: "DCP Vikram Rathore, IPS", rank: "Deputy Commissioner", badge: "IPS-KA-2016-89" },
  { id: "OFF-102", name: "ACP Ananya Hegde", rank: "Assistant Commissioner", badge: "KPS-KA-2018-42" },
  { id: "OFF-103", name: "Inspector Rajesh Kumar", rank: "Circle Inspector", badge: "KA-POL-5541" },
  { id: "OFF-104", name: "Inspector Kavita Patil", rank: "Crime Branch Inspector", badge: "KA-POL-6102" },
  { id: "OFF-105", name: "Sub-Inspector Mohammed Arif", rank: "Sub-Inspector", badge: "KA-POL-7823" },
  { id: "OFF-106", name: "Sub-Inspector Suresh Gowda", rank: "Sub-Inspector", badge: "KA-POL-8490" }
];

const DISTRICT_COORDS = {
  "Bengaluru Urban": { lat: 12.9716, lng: 77.5946 },
  "Mysuru": { lat: 12.2958, lng: 76.6394 },
  "Hubballi-Dharwad": { lat: 15.3647, lng: 75.1240 },
  "Mangaluru": { lat: 12.9141, lng: 74.8560 },
  "Belagavi": { lat: 15.8497, lng: 74.4977 },
  "Kalaburagi": { lat: 17.3297, lng: 76.8343 },
  "Davanagere": { lat: 14.4673, lng: 75.9241 },
  "Ballari": { lat: 15.1394, lng: 76.9214 },
  "Shivamogga": { lat: 13.9299, lng: 75.5681 },
  "Tumakuru": { lat: 13.3379, lng: 77.1173 }
};

const SUSPECT_NAMES = [
  "Ramesh 'Snake' Shetty", "Imran 'Phantom' Khan", "Sunil Gowda", "David D'Souza",
  "Pradeep Kumar alias 'Bull'", "Shabeer Ahmed", "Venkatesh Naidu", "Arjun Reddy",
  "Vijay 'Scorpion' Mallya", "Deepak Roy", "Santosh Naik", "Nayeem Pasha"
];

const VICTIM_NAMES = [
  "Dr. Arvind Swamy", "Meena Deshmukh", "Rajeshwari Rao", "Karthik Sundaram",
  "Siddharth Narayan", "Pooja Hegde", "Manjunath Bhat", "Lakshmi Sharma",
  "Ganesh Prasad", "Nisha Kulkarni"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate 1000 structured FIRs deterministically
export const mockFirs = Array.from({ length: 1000 }, (_, index) => {
  const num = (index + 1).toString().padStart(4, '0');
  const firNumber = `FIR-2026-KA-${num}`;
  const district = DISTRICTS[index % DISTRICTS.length];
  const stationList = STATIONS[district];
  const station = stationList[index % stationList.length];
  const crimeType = CRIME_TYPES[index % CRIME_TYPES.length];
  const section = BNS_SECTIONS[index % BNS_SECTIONS.length];
  
  const status = index % 7 === 0 ? "Solved" :
                 index % 5 === 0 ? "Charge Sheet Filed" :
                 index % 3 === 0 ? "Under Investigation" :
                 index % 4 === 0 ? "Pending Forensic" : "Open";
                 
  const priority = index % 9 === 0 ? "Critical" :
                   index % 4 === 0 ? "High" :
                   index % 3 === 0 ? "Medium" : "Low";

  const baseCoords = DISTRICT_COORDS[district];
  // Add small random offset for mapping pin spread
  const lat = parseFloat((baseCoords.lat + (Math.random() - 0.5) * 0.08).toFixed(5));
  const lng = parseFloat((baseCoords.lng + (Math.random() - 0.5) * 0.08).toFixed(5));

  const suspectName = SUSPECT_NAMES[index % SUSPECT_NAMES.length];
  const victimName = VICTIM_NAMES[index % VICTIM_NAMES.length];
  const primaryOfficer = OFFICERS[index % OFFICERS.length];
  const secondaryOfficer = OFFICERS[(index + 2) % OFFICERS.length];

  // Dates between Jan 2025 and July 2026
  const month = (index % 12 + 1).toString().padStart(2, '0');
  const day = (index % 28 + 1).toString().padStart(2, '0');
  const year = index > 600 ? 2026 : 2025;
  const dateStr = `${year}-${month}-${day}`;

  return {
    id: firNumber,
    firNumber,
    crimeType,
    section,
    district,
    policeStation: station,
    status,
    priority,
    incidentDate: dateStr,
    reportedDate: dateStr,
    location: {
      address: `${getRandomNumber(12, 450)}, Sector ${getRandomNumber(1, 14)}, ${station.replace(' PS', '')}, ${district}`,
      lat,
      lng
    },
    suspects: [
      {
        id: `SUS-${1000 + index}`,
        name: suspectName,
        alias: suspectName.includes("'") ? suspectName.split("'")[1] : "Unknown",
        age: getRandomNumber(22, 48),
        status: status === "Solved" ? "In Custody" : "Absconding / At Large",
        phone: `+91 98${getRandomNumber(10000000, 99999999)}`,
        vehicle: `KA-0${getRandomNumber(1, 9)}-${String.fromCharCode(65 + (index % 26))}${String.fromCharCode(65 + ((index + 1) % 26))}-${getRandomNumber(1000, 9999)}`
      }
    ],
    victims: [
      {
        id: `VIC-${2000 + index}`,
        name: victimName,
        contact: `+91 94${getRandomNumber(10000000, 99999999)}`,
        statement: `Victim reported unauthorized access/attack at approximately ${getRandomNumber(1, 12)}:${getRandomNumber(10, 59)} ${index % 2 === 0 ? 'PM' : 'AM'}.`
      }
    ],
    officers: [primaryOfficer, secondaryOfficer],
    evidenceCount: getRandomNumber(2, 11),
    confidenceScore: getRandomNumber(78, 98),
    aiSummary: `AI Crime Pattern Analysis indicates a high probability match (M.O. Code #MO-${getRandomNumber(100, 999)}) with series of ${crimeType.toLowerCase()} incidents recorded across ${district}. Key triggers include suspicious cell tower pings and financial transfer anomalies.`,
    timeline: [
      { time: `${dateStr} 08:30 AM`, title: "FIR Registered", detail: `Incident formally logged at ${station}.` },
      { time: `${dateStr} 11:15 AM`, title: "Forensics Team Deployed", detail: "Digital & physical evidence secured from site." },
      { time: `${dateStr} 03:45 PM`, title: "AI Intelligence Query Run", detail: "Cross-referenced suspect phone IMEI with tower dumps." },
      { time: `${dateStr} 07:20 PM`, title: "Interim Case Review", detail: `Report assigned to ${primaryOfficer.name}.` }
    ],
    evidence: [
      { type: "CCTV Footage", file: `cctv_clip_${index + 101}.mp4`, size: "245 MB", hash: `SHA256-${getRandomNumber(10000, 99999)}` },
      { type: "Call Detail Records (CDR)", file: `cdr_analysis_${index + 101}.xlsx`, size: "12 MB", hash: `SHA256-${getRandomNumber(10000, 99999)}` },
      { type: "Forensic Physical Report", file: `forensics_lab_${index + 101}.pdf`, size: "4.2 MB", hash: `SHA256-${getRandomNumber(10000, 99999)}` }
    ]
  };
});
