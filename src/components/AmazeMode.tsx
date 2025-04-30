
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { experiences } from "@/data/sampleData";
import { useTrip } from "@/context/TripContext";
import { Search, Star, MapPin, Clock, DollarSign } from "lucide-react";

export default function AmazeMode() {
  const { trip, addExperience, removeExperience } = useTrip();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string | "all">("all");
  
  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        experience.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDestination = selectedDestination === "all" || 
                              experience.destinationId === selectedDestination;
                              
    return matchesSearch && matchesDestination;
  });
  
  const isInTrip = (id: string) => trip.experiences.some(e => e.id === id);
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Experiences</h2>
          {trip.experiences.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <Star className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No experiences added yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Add experiences to make your trip more memorable. Discover popular activities below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trip.experiences.map((experience) => {
                const destination = trip.destinations.find(d => d.id === experience.destinationId);
                
                return (
                  <Card key={experience.id} className="overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img src={experience.image} alt={experience.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-accent text-accent-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" /> {experience.rating}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-bold">{experience.name}</h3>
                      {destination && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" /> {destination.name}, {destination.country}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {experience.duration && (
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" /> 
                            {experience.duration}
                          </div>
                        )}
                        {experience.price && (
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" /> 
                            {experience.price}
                          </div>
                        )}
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">{experience.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => removeExperience(experience.id)}
                      >
                        Remove from Trip
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Discover Experiences</h2>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 bg-background border rounded-md text-sm"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value as string | "all")}
              >
                <option value="all">All Destinations</option>
                {trip.destinations.map(destination => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search experiences..." 
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExperiences.map((experience) => {
              const destination = trip.destinations.find(d => d.id === experience.destinationId) || 
                                destinations.find(d => d.id === experience.destinationId);
                                
              return (
                <Card key={experience.id} className="card-hover overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img src={experience.image} alt={experience.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="h-3 w-3 mr-1 fill-current" /> {experience.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold">{experience.name}</h3>
                    {destination && (
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {destination.name}, {destination.country}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      {experience.duration && (
                        <div className="flex items-center text-sm">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" /> 
                          {experience.duration}
                        </div>
                      )}
                      {experience.price && (
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" /> 
                          ${experience.price}
                        </div>
                      )}
                    </div>
                    <p className="text-sm mt-2 line-clamp-2">{experience.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant={isInTrip(experience.id) ? "outline" : "default"}
                      className="w-full"
                      onClick={() => {
                        if (isInTrip(experience.id)) {
                          removeExperience(experience.id);
                        } else {
                          addExperience(experience);
                        }
                      }}
                    >
                      {isInTrip(experience.id) ? "Remove from Trip" : "Add to Trip"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
