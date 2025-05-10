import axios from "axios";
import { getMatchDetails } from "./mockData";

const API_BASE_URL = "http://localhost:8000";

export const apiService = {
  getLiveMatches: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fetch-live-score/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching live matches:", error);
      return { livematches: [] };
    }
  },

  getPastMatches: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/match-details/`);
      return response.data.pastMatches;
    } catch (error) {
      console.error("Error fetching match details:", error);
      return [];
    }
  },

  getMatchDetails: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/match/${id}/`);
      return response.data.match;
    } catch (error) {
      console.error("Error fetching single match details:", error);
      throw error;
    }
  },

  predictScore: async (features) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict-score/`, features);
      return response.data.predicted_score;
    } catch (error) {
      console.error("Error predicting score:", error);
      throw error;
    }
  },

  generateCommentary: async (ballData, style = "") => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/commentary/`, {
        ...ballData,
        additional_context: style
      });
      return response.data;
    } catch (error) {
      console.error("Error generating commentary:", error);
      throw error;
    }
  }
}
