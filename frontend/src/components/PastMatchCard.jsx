import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const PastMatchCard = ({ match }) => {
  const { id, team1, team2, venue, series, result } = match;

  return (
    <Link to={`/match/${id}`}>
      <Card className="cricket-card h-full">
        <CardContent className="pt-4">
          <div className="text-xs text-gray-500 mb-3">{series}</div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cricket-gray rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{team1.shortName}</span>
                </div>
                <span className="team-name">{team1.name}</span>
              </div>
              <div className="flex items-center">
                <span className="score">{`${team1.runs}/${team1.wickets}`}</span>
                <span className="text-xs text-gray-500 ml-2">{`(${team1.overs})`}</span>
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
                <span className="score">{`${team2.runs}/${team2.wickets}`}</span>
                <span className="text-xs text-gray-500 ml-2">{`(${team2.overs})`}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 pb-3">
          <div className="w-full">
            <p className="text-xs text-gray-500">{venue}</p>
            {result && <p className="text-sm font-medium mt-1">{result}</p>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PastMatchCard;
