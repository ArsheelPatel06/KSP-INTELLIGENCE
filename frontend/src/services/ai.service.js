import { api } from './api';

export const aiService = {
  /**
   * Send a query to the AI Orchestrator
   * @param {string} message The user's input query
   * @param {string} [threadId] Optional thread/session ID for continuity
   * @param {string} [caseMasterId] Optional case ID context
   * @returns {Promise<Object>} The finalOutput payload from the orchestrator
   */
  query: async (message, threadId = null, caseMasterId = null) => {
    try {
      const payload = { message };
      if (threadId) payload.threadId = threadId;
      if (caseMasterId) payload.caseMasterId = caseMasterId;

      const response = await api.post('/ai/query', payload);
      
      // Backend returns: { status: 'success', threadId, data: { payload: { ... } } }
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  /**
   * Check the health of the local AI provider (Ollama)
   * @returns {Promise<boolean>}
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/ai/health');
      return response.data?.status === 'ok';
    } catch (error) {
      return false;
    }
  }
};
