import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PastMatchCard from "@/components/PastMatchCard";
import { apiService } from "@/utils/apiService";
import { Skeleton } from "@/components/ui/skeleton";

const PastMatches = () => {
  const [pastMatches, setPastMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getPastMatches();
        setPastMatches(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching past matches:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-cricket-green">Past Matches</h1>
            <p className="text-gray-500 mt-2">Recent results from cricket matches around the world</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="cricket-card p-4">
                  <Skeleton className="h-6 w-2/3 mb-4" />
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mt-4" />
                </div>
              ))}
            </div>
          ) : pastMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastMatches.map((match) => (
                <PastMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">No past match records available</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PastMatches;
