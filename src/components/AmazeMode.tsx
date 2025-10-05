
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { experiences } from "@/data/sampleData";
import { useTrip } from "@/context/TripContext";
import { Search, Star, MapPin, Clock, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AmazeMode() {
  const { trip, addExperience, removeExperience } = useTrip();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string | "all">("all");
  const [isSearching, setIsSearching] = useState(false);
  
  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        experience.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDestination = selectedDestination === "all" || 
                              experience.destinationId === selectedDestination;
                              
    return matchesSearch && matchesDestination;
  });
  
  const isInTrip = (id: string) => trip.experiences.some(e => e.id === id);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && selectedDestination === "all") return;
    
    setIsSearching(true);
    
    // Simulate API search delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would make an API call to get more experiences
    setIsSearching(false);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Experiences</h2>
          {trip.experiences.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No experiences added yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Add experiences to your trip to plan your activities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {trip.experiences.map((experience) => {
                const destination = trip.destinations.find(d => d.id === experience.destinationId);
                
                return (
                  <Card key={experience.id} className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md">
                    <div className="relative h-36 overflow-hidden">
                      <img src={experience.image} alt={experience.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-accent text-accent-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" /> {experience.rating}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm">{experience.name}</h3>
                          {destination && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" /> {destination.name}
                            </div>
                          )}
                        </div>
                        {experience.duration && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 
                            {experience.duration}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{experience.description}</p>
                      {experience.price && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          ${experience.price}
                        </Badge>
                      )}
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full text-xs" 
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

        <div className="flex flex-col gap-4 border-t pt-6 mt-2">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Find Experiences</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
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
              <Button type="submit" variant="default" size="sm" className="hidden md:flex">
                {isSearching ? (
                  <><Loader className="h-4 w-4 animate-spin mr-2" /> Searching...</>
                ) : (
                  <>Search</>
                )}
              </Button>
            </form>
          </div>
          
          {isSearching ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                  <div className="h-40">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredExperiences.map((experience) => {
                const destination = trip.destinations.find(d => d.id === experience.destinationId);
                              
                return (
                  <Card key={experience.id} className="card-hover overflow-hidden shadow-md">
                    <div className="relative h-40 overflow-hidden">
                      <img src={experience.image} alt={experience.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-accent text-accent-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" /> {experience.rating}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-sm">{experience.name}</h3>
                          {destination && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" /> {destination.name}
                            </div>
                          )}
                        </div>
                        {experience.duration && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 
                            {experience.duration}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{experience.description}</p>
                      {experience.price && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          ${experience.price}
                        </Badge>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 p-4">
                      <Button 
                        variant={isInTrip(experience.id) ? "outline" : "default"}
                        size="sm"
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
          )}
        </div>
      </div>
    </div>
  );
}
