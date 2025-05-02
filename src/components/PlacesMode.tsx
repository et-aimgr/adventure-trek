
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/sampleData";
import { useTrip } from "@/context/TripContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Plus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Destination } from "@/types";

export default function PlacesMode() {
  const { trip, addDestination, removeDestination } = useTrip();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredDestinations = destinations.filter(
    destination => 
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      destination.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isInTrip = (id: string) => trip.destinations.some(d => d.id === id);
  
  return (
    <div className="animate-fade-in">
      <div className="two-column-layout">
        {/* Left column - Search and add destinations */}
        <div className="search-column">
          <div className="section-header">
            <h2 className="text-xl font-bold">Find Destinations</h2>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search places..." 
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3 mt-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="card-hover overflow-hidden">
                <div className="destination-card h-32">
                  <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">{destination.name}</h3>
                      <p className="text-xs text-muted-foreground">{destination.country}</p>
                    </div>
                    <Badge className="text-xs">{destination.country}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 px-3 pb-3">
                  <Button 
                    variant={isInTrip(destination.id) ? "outline" : "default"} 
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      if (isInTrip(destination.id)) {
                        removeDestination(destination.id);
                      } else {
                        addDestination(destination);
                      }
                    }}
                  >
                    {isInTrip(destination.id) ? (
                      <>
                        <Check className="mr-1 h-3 w-3" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="mr-1 h-3 w-3" /> Add to Trip
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Right column - Main content showing selected destinations */}
        <div className="main-column content-column">
          <div className="section-header">
            <h2 className="text-2xl font-bold tracking-tight">Your Destinations</h2>
          </div>
          
          {trip.destinations.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No destinations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Add destinations to your trip from the search panel. You can add multiple places for a multi-city trip.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trip.destinations.map((destination) => (
                <Card key={destination.id} className="overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{destination.name}</h3>
                        <p className="text-sm text-muted-foreground">{destination.country}</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeDestination(destination.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
