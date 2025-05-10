import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

const Commentary = ({ commentary }) => {
  if (!commentary || commentary.length === 0) {
    return (
      <Card className="cricket-card">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground text-center">
            No commentary available at the moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cricket-card">
      <CardContent className="pt-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {commentary.map((ball, index) => (
              <div key={index} className="commentary-item border-b border-gray-100 pb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500">{ball?.timestamp}</span>
                  <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                    {`${ball?.ball_data?.overs} Overs`}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{ball?.commentary || 'No commentary'}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-cricket-green font-medium">
                    {`${ball?.ball_data?.match_context?.current_score?.runs}/${ball?.ball_data?.match_context?.current_score?.wickets}`}
                  </span>
                  {ball?.ball_data?.wicket?.is_wicket && (
                    <span className="text-xs text-cricket-red font-medium">WICKET!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Commentary;
