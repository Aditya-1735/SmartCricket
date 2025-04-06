import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Commentary from "@/components/Commentary";
import PredictionCard from "@/components/PredictionCard";

const MatchDetails = ({ match, commentary, prediction }) => {
  const { team1, team2, venue, series, status } = match;

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
            <div className="mt-4 p-3 text-sm border-t border-gray-100 text-center">
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
                      <p className="text-sm text-muted-foreground">
                        {team1.name} won the toss and elected to bat first
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <PredictionCard
            team1={prediction.team1}
            team2={prediction.team2}
            predictedWinner={prediction.predictedWinner}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
