import { api } from './api';

export const chatService = {
  createSession: async (sessionPurpose, caseMasterId = undefined) => {
    try {
      const response = await api.post('/chat/sessions', {
        sessionPurpose,
        caseMasterId
      });
      return response.data.data;
    } catch (error) {
      console.error('Chat Service Create Session Error:', error);
      throw error;
    }
  },

  sendMessage: async (chatSessionId, messageText) => {
    try {
      const response = await api.post(`/chat/sessions/${chatSessionId}/messages`, {
        messageText
      });
      return response.data.data;
    } catch (error) {
      console.error('Chat Service Send Message Error:', error);
      throw error;
    }
  },

  getSessionMessages: async (chatSessionId) => {
    try {
      const response = await api.get(`/chat/sessions/${chatSessionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Chat Service Get Session Error:', error);
      throw error;
    }
  }
};
