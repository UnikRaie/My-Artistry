import React from "react";
import { Card, CardContent } from "@/components/ui/card";

// Sample placeholder image
const thumbnail = "https://via.placeholder.com/300x200";

function VideoCard() {
  return (
    <Card className="flex flex-col md:flex-row items-start max-h-[200px] shadow-md overflow-hidden">
      <img
        src={thumbnail}
        alt="Video thumbnail"
        className="w-full md:w-[300px] h-[200px] object-cover"
      />
      <CardContent className="py-6 px-4">
        <h5 className="text-xl font-semibold">Sajjan Raj Vaidya - Hawaijahaj</h5>
        <p className="text-muted-foreground mt-2">This is my original song.</p>
      </CardContent>
    </Card>
  );
}

export default VideoCard;
