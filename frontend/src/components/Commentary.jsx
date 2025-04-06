import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Commentary = ({ commentary }) => {
  const formatOver = (ballNumber) => {
    const over = Math.floor(ballNumber);
    const ball = Math.round((ballNumber - over) * 10);
    return `${over}.${ball}`;
  };

  const isWicket = (ball) => {
    return ball.wicket.is_wicket;
  };

  const isBoundary = (ball) => {
    return ball.runs_scored === 4 || ball.runs_scored === 6;
  };

  const getRunClassName = (item) => {
    if (isBoundary(item.ball_data)) {
      return item.ball_data.runs_scored === 4
        ? "text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
        : "text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700";
    }
    return "text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200";
  };

  return (
    <Card className="cricket-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Commentary</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {commentary.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-md ${
                  isWicket(item.ball_data)
                    ? "bg-cricket-red/10 border-l-2 border-cricket-red"
                    : isBoundary(item.ball_data)
                    ? "bg-cricket-green/10 border-l-2 border-cricket-green"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-xs font-bold bg-gray-200 px-2 py-0.5 rounded-full">
                    {formatOver(item.ball_data.ball_number)}
                  </span>
                  <span className="text-xs text-gray-500">{item.timestamp}</span>
                </div>
                <p className="mt-2 text-sm">{item.text}</p>
                {item.ball_data.runs_scored > 0 && !isWicket(item.ball_data) && (
                  <div className="mt-2">
                    <span className={getRunClassName(item)}>
                      {item.ball_data.runs_scored}{" "}
                      {item.ball_data.runs_scored === 1 ? "Run" : "Runs"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Commentary;


      {/* <div className="container mx-auto px-4 py-6">
        <Commentary
          commentary={[
            { id: 1, over: '1.1', text: 'Player A to Player B', runs: 0 },
            { id: 2, over: '1.2', text: 'Player B hits a boundary!', runs: 4, isBoundary: true },
            { id: 3, over: '1.3', text: 'Player A to Player B', runs: 1 },
            { id: 4, over: '1.4', text: 'Player B is out!', runs: 0, isWicket: true },
          ]}
        />
      </div> */}