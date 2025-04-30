
export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
}

export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'taxi' | 'uber';
  from: string;
  to: string;
  departureTime?: string;
  arrivalTime?: string;
  price?: number;
  duration?: string;
  notes?: string;
}

export interface Experience {
  id: string;
  destinationId: string;
  name: string;
  image: string;
  description: string;
  duration?: string;
  price?: number;
  rating?: number;
}

export interface Restaurant {
  id: string;
  destinationId: string;
  name: string;
  image: string;
  cuisine: string;
  price: 1 | 2 | 3 | 4;
  rating?: number;
  location: string;
}

export interface Trip {
  id: string;
  name: string;
  destinations: Destination[];
  transportation: Transportation[];
  experiences: Experience[];
  restaurants: Restaurant[];
  startDate?: Date;
  endDate?: Date;
}
