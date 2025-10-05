import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { restaurants } from "@/data/sampleData";
import { useTrip } from "@/context/TripContext";
import { Search, Star, MapPin } from "lucide-react";

export default function EatsMode() {
  const { trip, addRestaurant, removeRestaurant } = useTrip();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string | "all">("all");
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDestination = selectedDestination === "all" || 
                              restaurant.destinationId === selectedDestination;
                              
    return matchesSearch && matchesDestination;
  });
  
  const isInTrip = (id: string) => trip.restaurants.some(r => r.id === id);
  
  const renderPriceLevel = (price: number) => {
    return Array(price)
      .fill("$")
      .join("");
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Restaurants</h2>
          {trip.restaurants.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No restaurants added yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Add restaurants to your trip to plan your dining experiences.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trip.restaurants.map((restaurant) => {
                const destination = trip.destinations.find(d => d.id === restaurant.destinationId);
                
                return (
                  <Card key={restaurant.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-accent text-accent-foreground">
                          <Star className="h-3 w-3 mr-1 fill-current" /> {restaurant.rating}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{restaurant.name}</h3>
                          {destination && (
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" /> {destination.name}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline">{restaurant.cuisine}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{renderPriceLevel(restaurant.price)}</Badge>
                        <span className="text-sm text-muted-foreground">{restaurant.location}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => removeRestaurant(restaurant.id)}
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
            <h2 className="text-2xl font-bold tracking-tight">Find Restaurants</h2>
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
                  placeholder="Search restaurants or cuisines..." 
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => {
              const destination = trip.destinations.find(d => d.id === restaurant.destinationId);
                                
              return (
                <Card key={restaurant.id} className="card-hover overflow-hidden shadow-md">
                  <div className="relative h-48 overflow-hidden">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="h-3 w-3 mr-1 fill-current" /> {restaurant.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{restaurant.name}</h3>
                        {destination && (
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" /> {destination.name}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline">{restaurant.cuisine}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{renderPriceLevel(restaurant.price)}</Badge>
                      <span className="text-sm text-muted-foreground">{restaurant.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant={isInTrip(restaurant.id) ? "outline" : "default"}
                      className="w-full"
                      onClick={() => {
                        if (isInTrip(restaurant.id)) {
                          removeRestaurant(restaurant.id);
                        } else {
                          addRestaurant(restaurant);
                        }
                      }}
                    >
                      {isInTrip(restaurant.id) ? "Remove from Trip" : "Add to Trip"}
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
