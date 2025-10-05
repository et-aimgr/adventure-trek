
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTrip } from "@/context/TripContext";
import { useState } from "react";

export default function Header() {
  const { trip, updateTripName } = useTrip();
  const [isEditing, setIsEditing] = useState(false);
  const [tripName, setTripName] = useState(trip.name);

  const handleSave = () => {
    updateTripName(tripName);
    setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-40 py-4 px-4 md:px-6 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Trip Name"
                className="max-w-xs"
              />
              <Button onClick={handleSave} size="sm">Save</Button>
              <Button onClick={() => setIsEditing(false)} size="sm" variant="outline">Cancel</Button>
            </div>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              {trip.name}
              <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                ✏️
              </Button>
            </h1>
          )}
          <p className="text-muted-foreground mt-1">Family trip planner for coordinating across multiple cities</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-sm text-muted-foreground">
            Destinations: {trip.destinations.length}
          </span>
          <Button variant="outline">Share Trip</Button>
          <Button>Save Trip</Button>
        </div>
      </div>
    </header>
  );
}
