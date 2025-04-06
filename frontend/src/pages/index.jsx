import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LiveMatchCard from "@/components/LiveMatchCard";
import PastMatchCard from "@/components/PastMatchCard";
import { apiService } from "@/utils/apiService";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveData, pastData] = await Promise.all([
          apiService.getLiveMatches(),
          apiService.getPastMatches()
        ]);

        setLiveMatches(liveData);
        setPastMatches(pastData.slice(0, 3)); // Limit to 3 past matches on the homepage
        setLoading(false);
      } catch (error) {
        console.error("Error fetching match data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cricket-green">Live Matches</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
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
          ) : liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match) => (
                <LiveMatchCard key={match.id} {...match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">No live Match at the moment</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cricket-green">Recent Matches</h2>
            <a href="/past" className="text-sm text-cricket-green hover:underline">View all</a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
              <p className="text-gray-500">No recent matches available</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
