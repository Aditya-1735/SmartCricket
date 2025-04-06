export const aiPredictionService = {
  getPrediction: (matchId) => {
    return {
      team1: {name: "India",shortName: "IND",winProbability: 65,predictedScore: "342/7 (50)",},
      team2: {name: "India",shortName: "IND",winProbability: 65,predictedScore: "342/7 (50)",},
      predictedWinner: "India",
    };
  },
};
