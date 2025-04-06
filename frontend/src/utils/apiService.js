import { mockData, getMatchDetails } from "@/utils/mockData";

// This is a mock API service that simulates fetching data from an API
export const apiService = {
  getLiveMatches: async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockData.liveMatches;
  },

  getPastMatches: async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockData.pastMatches;
  },

  getMatchDetails: async (id) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 700));
    return getMatchDetails(id);
  }
};
