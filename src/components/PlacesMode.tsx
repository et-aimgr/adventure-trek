
import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/sampleData";
import { useTrip } from "@/context/TripContext";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Destination } from "@/types";

export default function PlacesMode() {
  const { trip, addDestination, removeDestination } = useTrip();
  const [searchQuery, setSearchQuery] = useState("");
  const animateRef = useRef<{ destination: Destination | null, element: HTMLElement | null }>({
    destination: null,
    element: null
  });
  const destinationsContainerRef = useRef<HTMLDivElement>(null);
  
  // Filter out destinations that are already in the trip
  const availableDestinations = destinations.filter(
    destination => 
      !trip.destinations.some(d => d.id === destination.id) &&
      (destination.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       destination.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddDestination = (destination: Destination, cardElement: HTMLElement) => {
    // Get the destination card's position and dimensions
    const cardRect = cardElement.getBoundingClientRect();
    
    // Create a clone of the card for animation
    const clone = cardElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = `${cardRect.top}px`;
    clone.style.left = `${cardRect.left}px`;
    clone.style.width = `${cardRect.width}px`;
    clone.style.height = `${cardRect.height}px`;
    clone.style.zIndex = '50';
    clone.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    clone.style.pointerEvents = 'none';
    
    // Add clone to body
    document.body.appendChild(clone);
    
    // Force a reflow to ensure the initial position is set
    void clone.offsetWidth;

    // Get the target position (first position in the destination grid)
    const targetContainer = destinationsContainerRef.current;
    if (targetContainer) {
      const targetRect = targetContainer.getBoundingClientRect();
      
      // Set the arc animation with transform
      clone.style.transform = 'translateY(-50px) scale(0.9)';
      clone.style.top = `${targetRect.top + 20}px`;
      clone.style.left = `${targetRect.left + 20}px`;
      clone.style.opacity = '0.9';
      
      // After the animation completes, remove the clone and add the destination
      setTimeout(() => {
        clone.style.opacity = '0';
        addDestination(destination);
        
        // Remove clone after fade-out
        setTimeout(() => {
          document.body.removeChild(clone);
        }, 300);
      }, 600);
    } else {
      // Fallback if container reference is not available
      addDestination(destination);
    }
  };
  
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
            {availableDestinations.map((destination) => (
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
                    variant="default" 
                    size="sm"
                    className="w-full text-xs"
                    onClick={(e) => handleAddDestination(destination, e.currentTarget.closest('.card-hover') as HTMLElement)}
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add to Trip
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {availableDestinations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No more destinations available to add</p>
              </div>
            )}
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
            <div 
              ref={destinationsContainerRef} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up"
            >
              {trip.destinations.map((destination, index) => (
                <Card 
                  key={destination.id} 
                  className={`overflow-hidden h-full ${index === 0 ? 'animate-scale-in' : ''}`}
                >
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
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeDestination(destination.id)}
                      >
                        Remove
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
