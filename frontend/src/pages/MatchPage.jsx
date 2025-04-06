import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MatchDetails from "@/components/MatchDetails";
import { apiService } from "@/utils/apiService";
import { aiPredictionService } from "@/utils/aiPrediction";
import { Skeleton } from "@/components/ui/skeleton";

const MatchPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const [matchData, predictionData] = await Promise.all([
          apiService.getMatchDetails(id),
          aiPredictionService.getPrediction(id),
        ]);

        setMatch(matchData.match);
        setCommentary(matchData.commentary);
        setPrediction(predictionData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching match details:", error);
        setLoading(false);
      }
    };

    fetchData();
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
        ) : match && prediction ? (
          <MatchDetails match={match} commentary={commentary} prediction={prediction} />
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
