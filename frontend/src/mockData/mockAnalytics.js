// Crime Analytics Datasets for Recharts Visualizations

export const monthlyCrimeTrends = [
  { month: "Jan", firs: 72, solved: 54, cyber: 24, violent: 18, property: 30 },
  { month: "Feb", firs: 68, solved: 51, cyber: 28, violent: 12, property: 28 },
  { month: "Mar", firs: 85, solved: 62, cyber: 35, violent: 16, property: 34 },
  { month: "Apr", firs: 94, solved: 70, cyber: 41, violent: 22, property: 31 },
  { month: "May", firs: 110, solved: 81, cyber: 48, violent: 25, property: 37 },
  { month: "Jun", firs: 128, solved: 95, cyber: 59, violent: 29, property: 40 },
  { month: "Jul", firs: 115, solved: 88, cyber: 52, violent: 21, property: 42 },
  { month: "Aug", firs: 102, solved: 78, cyber: 45, violent: 19, property: 38 },
  { month: "Sep", firs: 96, solved: 73, cyber: 40, violent: 18, property: 38 },
  { month: "Oct", firs: 118, solved: 89, cyber: 55, violent: 24, property: 39 },
  { month: "Nov", firs: 106, solved: 82, cyber: 49, violent: 20, property: 37 },
  { month: "Dec", firs: 122, solved: 94, cyber: 60, violent: 26, property: 36 }
];

export const crimeCategoryDistribution = [
  { name: "Cyber Fraud & IT Crime", value: 380, color: "#3B82F6" },
  { name: "Property & Burglary", value: 240, color: "#06B6D4" },
  { name: "Violent & Armed Assault", value: 160, color: "#EF4444" },
  { name: "Narcotics Trafficking", value: 120, color: "#A855F7" },
  { name: "Financial Embezzlement", value: 60, color: "#F59E0B" },
  { name: "Other Offenses", value: 40, color: "#64748B" }
];

export const districtCrimeDistribution = [
  { district: "Bengaluru Urban", total: 320, solved: 245, active: 75, rate: 76.5 },
  { district: "Mysuru", total: 140, solved: 112, active: 28, rate: 80.0 },
  { district: "Hubballi-Dharwad", total: 110, solved: 82, active: 28, rate: 74.5 },
  { district: "Mangaluru", total: 95, solved: 76, active: 19, rate: 80.0 },
  { district: "Belagavi", total: 85, solved: 63, active: 22, rate: 74.1 },
  { district: "Kalaburagi", total: 70, solved: 51, active: 19, rate: 72.8 },
  { district: "Davanagere", total: 60, solved: 48, active: 12, rate: 80.0 },
  { district: "Ballari", total: 55, solved: 41, active: 14, rate: 74.5 },
  { district: "Shivamogga", total: 35, solved: 29, active: 6, rate: 82.8 },
  { district: "Tumakuru", total: 30, solved: 24, active: 6, rate: 80.0 }
];

export const repeatOffenderStats = [
  { gang: "Shetty Syndicate", activeMembers: 14, linkedFirs: 28, riskScore: 94 },
  { gang: "Net-Mules Cyber Network", activeMembers: 22, linkedFirs: 45, riskScore: 89 },
  { gang: "Devaraja Heist Ring", activeMembers: 8, linkedFirs: 12, riskScore: 82 },
  { gang: "Coastal Narcotics Cartel", activeMembers: 19, linkedFirs: 31, riskScore: 91 },
  { gang: "North KA Auto Theft Ring", activeMembers: 11, linkedFirs: 19, riskScore: 78 }
];

export const aiForecastData = [
  { month: "Jan '26", actual: 108, predicted: 105 },
  { month: "Feb '26", actual: 95, predicted: 98 },
  { month: "Mar '26", actual: 112, predicted: 110 },
  { month: "Apr '26", actual: 125, predicted: 120 },
  { month: "May '26", actual: 138, predicted: 135 },
  { month: "Jun '26", actual: 142, predicted: 140 },
  { month: "Jul '26 (Current)", actual: 128, predicted: 130 },
  { month: "Aug '26 (Forecast)", actual: null, predicted: 124 },
  { month: "Sep '26 (Forecast)", actual: null, predicted: 118 },
  { month: "Oct '26 (Forecast)", actual: null, predicted: 132 }
];
