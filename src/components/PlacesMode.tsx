
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Destinations</h2>
          {trip.destinations.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No destinations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Add destinations to your trip from the list below. You can add multiple places for a multi-city trip.
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

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Add Destinations</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search destinations..." 
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="card-hover overflow-hidden">
                <div className="destination-card h-40">
                  <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">{destination.country}</p>
                    </div>
                    <Badge>{destination.country}</Badge>
                  </div>
                  <p className="text-sm mt-2 line-clamp-2">{destination.description}</p>
                </CardContent>
                <CardFooter className="pt-0 px-4 pb-4">
                  <Button 
                    variant={isInTrip(destination.id) ? "outline" : "default"} 
                    className="w-full"
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
                        <Check className="mr-2 h-4 w-4" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Add to Trip
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
