export const IntentEngine = {
  classify: (message, currentContext) => {
    const text = message.toLowerCase().trim();

    // Greeting
    if (/^(hi|hello|hey|who are you\?*|what are you\?*|good morning|good evening|good afternoon|how are you\?*)([\s!.]*)$/.test(text) || text === 'thanks' || text === 'thank you') {
      return 'chat';
    }

    // Search (Cases, People, Vehicles)
    if (/^search (fir|person|vehicle|case)/.test(text) || /^who is/.test(text) || /^find (owner|vehicle)/.test(text) || /^fir-\d+/.test(text)) {
      if (text.includes('fir') || text.includes('case')) return 'search_case';
      if (text.includes('person') || text.includes('who is')) return 'search_person';
      if (text.includes('vehicle')) return 'search_vehicle';
      return 'search_case'; // Default to case for direct FIR searches
    }

    // Timeline
    if (text.includes('timeline')) {
      return 'timeline';
    }

    // Knowledge Graph
    if (text.includes('graph') || text.includes('network') || text.includes('connections') || text.includes('associates')) {
      return 'graph';
    }

    // Reports
    if (text.includes('report') || text.includes('summary') || text.includes('summarize')) {
      return 'report';
    }

    // Predictions / Analytics
    if (text.includes('predict') || text.includes('hotspot') || text.includes('analytics') || text.includes('show me all vehicle thefts')) {
      return text.includes('vehicle thefts') ? 'analysis' : 'prediction';
    }

    // Investigation (Default heavy operation)
    if (text.includes('investigate') || text.includes('find mastermind') || text.includes('deep dive')) {
      return 'investigation';
    }

    // If context is active and it's a generic question, default to investigation or chat depending on complexity
    if (currentContext) {
      return 'investigation';
    }

    return 'chat';
  }
};
