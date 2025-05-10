import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Commentary from "@/components/Commentary";
import PredictionCard from "@/components/PredictionCard";
import { apiService } from "@/utils/apiService";

const MatchDetails = ({ match, commentary }) => {
  const { team1, team2, venue, series, status, toss } = match;
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

  useEffect(() => {
    const getPrediction = async () => {
      try {
        setPredictionLoading(true);
        // Format data for prediction
        const features1 = {
          batting_team: team1.name,
          bowling_team: team2.name,
          city: venue.split(',')[0], // Extract city from venue
          current_runs: parseInt(team1.runs) || 0,
          overs: parseFloat(team1.overs) || 0,
          wickets: parseInt(team1.wickets) || 0,
          last_five: parseFloat(team1.overs) > 0 ? (parseInt(team1.runs) / parseFloat(team1.overs)) * 5 : 0, // Avoid division by zero
        };
        const features2 = {
          batting_team: team2.name,
          bowling_team: team1.name,
          city: venue.split(',')[0], // Extract city from venue
          current_runs: parseInt(team2.runs) || 0,
          overs: parseFloat(team2.overs) || 0,
          wickets: parseInt(team2.wickets) || 0,
          last_five: parseFloat(team2.overs) > 0 ? (parseInt(team2.runs) / parseFloat(team2.overs)) * 5 : 0, // Avoid division by zero
        };

        console.log("Features 1:", features1);
        console.log("Features 2:", features2);

        let predictedScoreteam1 = null;
        let predictedScoreteam2 = null;

        if (Object.values(features1).every(value => value !== 0)) {
          predictedScoreteam1 = await apiService.predictScore(features1);
          console.log("Predicted Score Team 1:", features1, predictedScoreteam1);
        } else {
          console.log("Skipping prediction for Team 1 due to zero values in features.");
        }

        if (Object.values(features2).every(value => value !== 0)) {
          predictedScoreteam2 = await apiService.predictScore(features2);
          console.log("Predicted Score Team 2:", features2, predictedScoreteam2);
        } else {
          console.log("Skipping prediction for Team 2 due to zero values in features.");
        }
        setPrediction({
          team1: {
            name: team1.name,
            shortName: team1.shortName,
            winProbability: 88, // Calculate based on current situation
            predictedScore: predictedScoreteam1 ? `${predictedScoreteam1} (20.0)` : "Yet to Bat" 
          },
          team2: {
            name: team2.name,
            shortName: team2.shortName,
            winProbability: 12, // 100 - team1 probability
            predictedScore: predictedScoreteam2 ? `${predictedScoreteam2} (20.0)` : "Yet to Bat"
          },
          predictedWinner: (predictedScoreteam1 > predictedScoreteam2) ? team1.name : team2.name // Based on win probability
        });
      } catch (error) {
        console.error("Error getting prediction:", error);
      } finally {
        setPredictionLoading(false);
      }
    };

    if (match && status === "live") {
      getPrediction();
    }
  }, [match, status, team1.name, team2.name, venue, team1.runs, team1.overs, team1.wickets, team2.runs, team2.wickets, team2.overs]);

  return (
    <div className="space-y-6">
      <Card className="cricket-card">
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <h2 className="text-sm font-medium text-gray-500">{series}</h2>
            <p className="text-xs text-gray-400 mt-1">{venue}</p>
            {status === "live" && (
              <div className="inline-block mt-2 px-2 py-1 bg-cricket-red/10 text-cricket-red text-xs font-medium rounded-full animate-pulse">
                LIVE
              </div>
            )}
          </div>

          <div className="flex justify-center items-center space-x-6 md:space-x-12 my-8">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-cricket-gray rounded-full flex items-center justify-center mx-auto">
                <span className="text-lg md:text-xl font-bold">{team1.shortName}</span>
              </div>
              <p className="mt-2 text-sm md:text-base font-medium">{team1.name}</p>
              <div className="mt-1">
                <span className="score text-xl md:text-2xl font-bold">{`${team1.runs}/${team1.wickets}`}</span>
                <span className="text-xs text-gray-500 block">{`(${team1.overs})`}</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xl font-medium text-gray-400">vs</span>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-cricket-gray rounded-full flex items-center justify-center mx-auto">
                <span className="text-lg md:text-xl font-bold">{team2.shortName}</span>
              </div>
              <p className="mt-2 text-sm md:text-base font-medium">{team2.name}</p>
              <div className="mt-1">
                <span className="score text-xl md:text-2xl font-bold">{`${team2.runs}/${team2.wickets}`}</span>
                <span className="text-xs text-gray-500 block">{`(${team2.overs})`}</span>
              </div>
            </div>
          </div>

          {match.result && (
            <div className="mt-4 p-3 text-sm border-t border-gray-100 text-center text-red-700">
              <span className="font-medium">{match.result}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="commentary" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="commentary">Commentary</TabsTrigger>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>

            <TabsContent value="commentary">
              <Commentary commentary={commentary} />
            </TabsContent>

            <TabsContent value="scorecard">
              <Card className="cricket-card">
                <CardHeader>
                  <CardTitle className="text-lg">Scorecard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Detailed scorecard will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info">
              <Card className="cricket-card">
                <CardHeader>
                  <CardTitle className="text-lg">Match Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Venue</h3>
                      <p className="text-sm text-muted-foreground">{venue}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Series</h3>
                      <p className="text-sm text-muted-foreground">{series}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Toss</h3>
                      <p className="text-sm text-muted-foreground">{toss}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          {status === "live" && (
            predictionLoading ? (
              <Card className="cricket-card">
                <CardHeader>
                  <CardTitle className="text-lg">Match Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Calculating prediction...</p>
                </CardContent>
              </Card>
            ) : prediction ? (
              <PredictionCard {...prediction} />
            ) : (
              <Card className="cricket-card">
                <CardHeader>
                  <CardTitle className="text-lg">Match Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Unable to generate prediction at this time
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
