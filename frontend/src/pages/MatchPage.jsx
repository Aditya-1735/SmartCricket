import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MatchDetails from "@/components/MatchDetails";
import { apiService } from "@/utils/apiService";
import { Skeleton } from "@/components/ui/skeleton";

const MatchPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        setLoading(true);
        setError(null);

        // Fetch match details
        const matchData = await apiService.getMatchDetails(id);
        setMatch(matchData);

        // Generate ball-by-ball commentary
        const ballData = {
          ball_number: matchData.team1.overs,
          batsman: "Batsman",
          bowler: "Bowler",
          runs_scored: parseInt(matchData.team1.runs),
          extras: {
            wides: 0,
            no_balls: 0,
            byes: 0,
            leg_byes: 0,
          },
          wicket: { is_wicket: false },
          match_context: {
            current_score: {
              runs: parseInt(matchData.team1.runs),
              wickets: parseInt(matchData.team1.wickets),
            },
            overs: parseFloat(matchData.team1.overs),
            target: matchData.target ? parseInt(matchData.target) : 0,
          },
        };

        const commentaryData = await apiService.generateCommentary(
          ballData,
          "Attractive english commentary without short type and ball type "
        );
        setCommentary([commentaryData]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching match details:", error);
        setError("Failed to load match details");
        setLoading(false);
      }
    };

    fetchData();

    // Set up periodic refresh for live matches
    let interval;
    if (match?.status === "live") {
      interval = setInterval(fetchData, 30000); // Refresh every 30 seconds for live matches
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-96 md:col-span-2 rounded-lg" />
              <Skeleton className="h-96 rounded-lg" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xl text-red-600">{error}</p>
            <a href="/" className="text-cricket-green hover:underline mt-4 inline-block">
              Return to homepage
            </a>
          </div>
        ) : match ? (
          <MatchDetails match={match} commentary={commentary} />
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Match details not found</p>
            <a href="/" className="text-cricket-green hover:underline mt-4 inline-block">
              Return to homepage
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchPage;
