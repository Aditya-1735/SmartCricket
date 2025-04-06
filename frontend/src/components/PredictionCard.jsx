import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PredictionCard = ({ team1, team2, predictedWinner }) => {
  return (
    <Card className="cricket-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="text-cricket-gold">✨</span>
          <span className="ml-2">Match Predictions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-cricket-gray rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">{team1.shortName}</span>
                </div>
                <span className="text-sm font-medium">{team1.name}</span>
              </div>
              <span className="text-sm font-bold">{team1.winProbability}%</span>
            </div>
            <Progress value={team1.winProbability} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-1 items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-cricket-gray rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">{team2.shortName}</span>
                </div>
                <span className="text-sm font-medium">{team2.name}</span>
              </div>
              <span className="text-sm font-bold">{team2.winProbability}%</span>
            </div>
            <Progress value={team2.winProbability} className="h-2" />
          </div>

          {(team1.predictedScore || team2.predictedScore) && (
            <div className="pt-2 border-t border-gray-100">
              <h4 className="text-sm font-semibold mb-2">Predicted Final Scores</h4>
              {team1.predictedScore && (
                <div className="flex justify-between">
                  <span className="text-sm">{team1.name}</span>
                  <span className="text-sm font-medium">{team1.predictedScore}</span>
                </div>
              )}
              {team2.predictedScore && (
                <div className="flex justify-between">
                  <span className="text-sm">{team2.name}</span>
                  <span className="text-sm font-medium">{team2.predictedScore}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <div className="rounded-md bg-cricket-green/5 p-3 text-sm">
              <span className="font-medium text-cricket-green">AI Prediction: </span>
              <span>{predictedWinner} is predicted to win this match.</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
