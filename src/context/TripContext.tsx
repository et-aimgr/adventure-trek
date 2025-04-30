
import { createContext, useContext, useState, ReactNode } from 'react';
import { Trip, Destination, Transportation, Experience, Restaurant } from '../types';
import { sampleTrip } from '../data/sampleData';
import { useToast } from '@/components/ui/use-toast';

interface TripContextType {
  trip: Trip;
  addDestination: (destination: Destination) => void;
  removeDestination: (destinationId: string) => void;
  addTransportation: (transportation: Transportation) => void;
  removeTransportation: (transportationId: string) => void;
  addExperience: (experience: Experience) => void;
  removeExperience: (experienceId: string) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  removeRestaurant: (restaurantId: string) => void;
  updateTripName: (name: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trip, setTrip] = useState<Trip>(sampleTrip);
  const { toast } = useToast();

  const addDestination = (destination: Destination) => {
    if (trip.destinations.some(d => d.id === destination.id)) {
      toast({
        title: "Already added",
        description: `${destination.name} is already in your trip.`,
        variant: "destructive",
      });
      return;
    }
    
    setTrip(prev => ({
      ...prev,
      destinations: [...prev.destinations, destination],
    }));
    
    toast({
      title: "Destination added",
      description: `${destination.name} has been added to your trip.`,
    });
  };

  const removeDestination = (destinationId: string) => {
    setTrip(prev => ({
      ...prev,
      destinations: prev.destinations.filter(d => d.id !== destinationId),
    }));
    
    toast({
      title: "Destination removed",
      description: "The destination has been removed from your trip.",
    });
  };

  const addTransportation = (transportation: Transportation) => {
    setTrip(prev => ({
      ...prev,
      transportation: [...prev.transportation, transportation],
    }));
    
    toast({
      title: "Transportation added",
      description: `${transportation.type.charAt(0).toUpperCase() + transportation.type.slice(1)} from ${transportation.from} to ${transportation.to} added.`,
    });
  };

  const removeTransportation = (transportationId: string) => {
    setTrip(prev => ({
      ...prev,
      transportation: prev.transportation.filter(t => t.id !== transportationId),
    }));
    
    toast({
      title: "Transportation removed",
      description: "The transportation option has been removed from your trip.",
    });
  };

  const addExperience = (experience: Experience) => {
    if (trip.experiences.some(e => e.id === experience.id)) {
      toast({
        title: "Already added",
        description: `${experience.name} is already in your trip.`,
        variant: "destructive",
      });
      return;
    }
    
    setTrip(prev => ({
      ...prev,
      experiences: [...prev.experiences, experience],
    }));
    
    toast({
      title: "Experience added",
      description: `${experience.name} has been added to your trip.`,
    });
  };

  const removeExperience = (experienceId: string) => {
    setTrip(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== experienceId),
    }));
    
    toast({
      title: "Experience removed",
      description: "The experience has been removed from your trip.",
    });
  };

  const addRestaurant = (restaurant: Restaurant) => {
    if (trip.restaurants.some(r => r.id === restaurant.id)) {
      toast({
        title: "Already added",
        description: `${restaurant.name} is already in your trip.`,
        variant: "destructive",
      });
      return;
    }
    
    setTrip(prev => ({
      ...prev,
      restaurants: [...prev.restaurants, restaurant],
    }));
    
    toast({
      title: "Restaurant added",
      description: `${restaurant.name} has been added to your trip.`,
    });
  };

  const removeRestaurant = (restaurantId: string) => {
    setTrip(prev => ({
      ...prev,
      restaurants: prev.restaurants.filter(r => r.id !== restaurantId),
    }));
    
    toast({
      title: "Restaurant removed",
      description: "The restaurant has been removed from your trip.",
    });
  };

  const updateTripName = (name: string) => {
    setTrip(prev => ({
      ...prev,
      name,
    }));
    
    toast({
      title: "Trip name updated",
      description: `Your trip is now called "${name}".`,
    });
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        addDestination,
        removeDestination,
        addTransportation,
        removeTransportation,
        addExperience,
        removeExperience,
        addRestaurant,
        removeRestaurant,
        updateTripName,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
