import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const LiveMatchCard = ({
  id,
  team1,
  team2,
  status,
  venue,
  time,
  series,
  result,
  battingTeam
}) => {
  const getStatusClass = () => {
    switch (status) {
      case "live":
        return "status-live";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "live":
        return "LIVE";
      case "completed":
        return "COMPLETED";
      default:
        return "";
    }
  };

  const getScoreDisplay = (team) => {
    if (team?.runs !== "-" && team?.wickets !== "-") {
      return `${team.runs}/${team.wickets}`;
    }
    return "-";
  };

  const getOversDisplay = (teamKey) => {
    const team = teamKey === "team1" ? team1 : team2;
    return battingTeam === teamKey && team?.overs !== "-" ? `(${team.overs})` : "";
  };

  return (
    <Link to={`/match/${id}`}>
      <Card className="cricket-card h-full">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">{series}</span>
            <span className={getStatusClass()}>{getStatusText()}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cricket-gray rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{team1.shortName}</span>
                </div>
                <span className="team-name">{team1.name}</span>
              </div>
              <div className="flex items-center">
                <span className={`score ${battingTeam === "team1" ? "text-cricket-red" : ""}`}>
                  {getScoreDisplay(team1)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {getOversDisplay("team1")}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cricket-gray rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{team2.shortName}</span>
                </div>
                <span className="team-name">{team2.name}</span>
              </div>
              <div className="flex items-center">
                <span className={`score ${battingTeam === "team2" ? "text-cricket-red" : ""}`}>
                  {getScoreDisplay(team2)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {getOversDisplay("team2")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 pb-3">
          <div className="w-full">
            <p className="text-xs text-gray-500">{venue}</p>
            {result && <p className="text-sm font-medium mt-1">{result}</p>}
            {status === "live" && (
              <Badge variant="outline" className="mt-2 bg-cricket-red/10 text-cricket-green border-cricket-green border-red-700 text-red-700">
                Watch Live
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default LiveMatchCard;
