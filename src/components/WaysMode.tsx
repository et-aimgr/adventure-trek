
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { transportationOptions } from "@/data/sampleData";
import { useTrip } from "@/context/TripContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaneTakeoff, Train, Bus, Car, MapPin, Search, Calendar, Clock } from "lucide-react";
import { Transportation } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface SearchFormValues {
  from: string;
  to: string;
  departureDate: Date | undefined;
  type: string;
}

export default function WaysMode() {
  const { trip, addTransportation, removeTransportation } = useTrip();
  const [activeTab, setActiveTab] = useState("all");
  const [displayedOptions, setDisplayedOptions] = useState(transportationOptions);
  const [isSearching, setIsSearching] = useState(false);
  
  const form = useForm<SearchFormValues>({
    defaultValues: {
      from: "",
      to: "",
      departureDate: undefined,
      type: "all"
    }
  });
  
  const getTransportationIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <PlaneTakeoff className="h-4 w-4" />;
      case "train":
        return <Train className="h-4 w-4" />;
      case "bus":
        return <Bus className="h-4 w-4" />;
      case "car":
      case "taxi":
      case "uber":
        return <Car className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };
  
  const filteredTransportation = trip.transportation.filter(t => 
    activeTab === "all" ? true : t.type === activeTab
  );
  
  // Simulated API call for transportation search
  const searchTransportation = async (data: SearchFormValues) => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate simulated search results based on form data
    const simulatedResults = generateSimulatedResults(data);
    setDisplayedOptions(simulatedResults);
    setIsSearching(false);
  };
  
  // Function to generate simulated transportation options based on search criteria
  const generateSimulatedResults = (data: SearchFormValues): Transportation[] => {
    const { from, to, departureDate, type } = data;
    
    // Return original options if no search criteria
    if (!from && !to) return transportationOptions;
    
    // Filter options based on search criteria
    let results = transportationOptions.filter(option => {
      const matchesFrom = !from || option.from.toLowerCase().includes(from.toLowerCase());
      const matchesTo = !to || option.to.toLowerCase().includes(to.toLowerCase());
      const matchesType = type === "all" || option.type === type;
      
      return matchesFrom && matchesTo && matchesType;
    });
    
    // If we have specific cities, generate more realistic options
    if ((from && to) || departureDate) {
      const cities = {
        "new york": ["JFK", "LGA", "EWR"],
        "london": ["LHR", "LGW", "STN"],
        "paris": ["CDG", "ORY"],
        "tokyo": ["NRT", "HND"],
        "berlin": ["BER"],
        "rome": ["FCO", "CIA"],
        "madrid": ["MAD"],
        "amsterdam": ["AMS"],
        "barcelona": ["BCN"],
        "miami": ["MIA", "FLL"],
      };
      
      // Function to get a random airport code for a city
      const getRandomAirport = (city: string): string => {
        const cityLower = city.toLowerCase();
        const airports = Object.entries(cities).find(([key]) => cityLower.includes(key));
        if (airports) {
          return airports[1][Math.floor(Math.random() * airports[1].length)];
        }
        return city;
      };
      
      // Generate new simulated results
      const newResults: Transportation[] = [];
      
      if (from && to) {
        // Create flight options
        if (type === "all" || type === "flight") {
          const fromAirport = getRandomAirport(from);
          const toAirport = getRandomAirport(to);
          
          // Generate 3-5 flight options with different times and prices
          const flightCount = Math.floor(Math.random() * 3) + 3;
          for (let i = 0; i < flightCount; i++) {
            const hour = 7 + Math.floor(Math.random() * 12); // Flights between 7am and 7pm
            const minute = Math.floor(Math.random() * 60);
            const duration = Math.floor(Math.random() * 3) + 1 + "h " + Math.floor(Math.random() * 60) + "m";
            const price = Math.floor(Math.random() * 300) + 100;
            
            newResults.push({
              id: `flight-${from}-${to}-${i}`,
              type: "flight",
              from: `${from} (${fromAirport})`,
              to: `${to} (${toAirport})`,
              departureTime: `${hour}:${minute < 10 ? '0' + minute : minute}`,
              arrivalTime: `${(hour + parseInt(duration)) % 24}:${minute < 10 ? '0' + minute : minute}`,
              duration,
              price,
              notes: i % 2 === 0 ? "Direct" : "1 Stop"
            });
          }
        }
        
        // Create train options
        if (type === "all" || type === "train") {
          // Only add train options for shorter distances or European cities
          const europeanCities = ["london", "paris", "berlin", "rome", "madrid", "amsterdam", "barcelona"];
          const fromLower = from.toLowerCase();
          const toLower = to.toLowerCase();
          
          const isEuropeanRoute = europeanCities.some(city => fromLower.includes(city)) && 
                                 europeanCities.some(city => toLower.includes(city));
                                 
          if (isEuropeanRoute) {
            const trainCount = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < trainCount; i++) {
              const hour = 6 + Math.floor(Math.random() * 14); // Trains between 6am and 8pm
              const minute = Math.floor(Math.random() * 60);
              const duration = Math.floor(Math.random() * 5) + 2 + "h " + Math.floor(Math.random() * 60) + "m";
              const price = Math.floor(Math.random() * 200) + 50;
              
              newResults.push({
                id: `train-${from}-${to}-${i}`,
                type: "train",
                from: `${from} Station`,
                to: `${to} Station`,
                departureTime: `${hour}:${minute < 10 ? '0' + minute : minute}`,
                arrivalTime: `${(hour + parseInt(duration)) % 24}:${minute < 10 ? '0' + minute : minute}`,
                duration,
                price,
                notes: "Eurostar"
              });
            }
          }
        }
        
        // Create bus options
        if (type === "all" || type === "bus") {
          const busCount = Math.floor(Math.random() * 2) + 1;
          for (let i = 0; i < busCount; i++) {
            const hour = 5 + Math.floor(Math.random() * 15); // Buses between 5am and 8pm
            const minute = Math.floor(Math.random() * 60);
            const duration = Math.floor(Math.random() * 8) + 4 + "h " + Math.floor(Math.random() * 60) + "m";
            const price = Math.floor(Math.random() * 100) + 20;
            
            newResults.push({
              id: `bus-${from}-${to}-${i}`,
              type: "bus",
              from: `${from} Bus Terminal`,
              to: `${to} Bus Terminal`,
              departureTime: `${hour}:${minute < 10 ? '0' + minute : minute}`,
              arrivalTime: `${(hour + parseInt(duration)) % 24}:${minute < 10 ? '0' + minute : minute}`,
              duration,
              price,
              notes: "Express"
            });
          }
        }
      }
      
      return newResults.length > 0 ? newResults : results;
    }
    
    return results;
  };
  
  const onSubmit = (data: SearchFormValues) => {
    searchTransportation(data);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Transportation</h2>
          
          <Tabs 
            defaultValue="all" 
            className="w-full" 
            value={activeTab} 
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="flight">Flights</TabsTrigger>
              <TabsTrigger value="train">Trains</TabsTrigger>
              <TabsTrigger value="bus">Buses</TabsTrigger>
              <TabsTrigger value="car">Cars & Taxis</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {filteredTransportation.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/30">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No transportation yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    Add transportation options to connect your destinations.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTransportation.map((transport) => (
                    <Card key={transport.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between">
                          <Badge className="mb-2" variant="outline">
                            {getTransportationIcon(transport.type)}
                            <span className="ml-1 capitalize">{transport.type}</span>
                          </Badge>
                          <Badge variant="secondary">
                            ${transport.price}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-left">
                            <p className="text-sm font-medium">{transport.from}</p>
                            <p className="text-xs text-muted-foreground">{transport.departureTime}</p>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <p className="text-xs text-muted-foreground">{transport.duration}</p>
                            <div className="w-16 md:w-24 h-[2px] bg-muted my-1 relative">
                              <div className="absolute right-0 top-1/2 transform translate-y-[-50%] w-1 h-1 bg-primary rounded-full" />
                            </div>
                            <p className="text-xs text-muted-foreground">{transport.notes || "Direct"}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium">{transport.to}</p>
                            <p className="text-xs text-muted-foreground">{transport.arrivalTime}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 justify-end">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removeTransportation(transport.id)}
                        >
                          Remove
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Find Transportation</h2>
          
          <Card className="mb-4">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <FormControl>
                            <Input placeholder="Departure city" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <FormControl>
                            <Input placeholder="Arrival city" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="departureDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure Date</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="flight">Flights</SelectItem>
                              <SelectItem value="train">Trains</SelectItem>
                              <SelectItem value="bus">Buses</SelectItem>
                              <SelectItem value="car">Cars & Taxis</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                          Searching...
                        </div>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {isSearching ? (
            <div className="text-center p-12">
              <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Searching for the best options...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedOptions.map((transport) => {
                const isInTrip = trip.transportation.some(t => t.id === transport.id);
                
                return (
                  <Card key={transport.id} className="card-hover">
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <Badge className="mb-2" variant="outline">
                          {getTransportationIcon(transport.type)}
                          <span className="ml-1 capitalize">{transport.type}</span>
                        </Badge>
                        <Badge variant="secondary">
                          ${transport.price}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-left">
                          <p className="text-sm font-medium">{transport.from}</p>
                          <p className="text-xs text-muted-foreground">{transport.departureTime}</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <p className="text-xs text-muted-foreground">{transport.duration}</p>
                          <div className="w-16 md:w-24 h-[2px] bg-muted my-1 relative">
                            <div className="absolute right-0 top-1/2 transform translate-y-[-50%] w-1 h-1 bg-primary rounded-full" />
                          </div>
                          <p className="text-xs text-muted-foreground">{transport.notes || "Direct"}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium">{transport.to}</p>
                          <p className="text-xs text-muted-foreground">{transport.arrivalTime}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full"
                        variant={isInTrip ? "outline" : "default"}
                        onClick={() => {
                          if (!isInTrip) {
                            addTransportation(transport);
                          } else {
                            removeTransportation(transport.id);
                          }
                        }}
                      >
                        {isInTrip ? "Remove from Trip" : "Add to Trip"}
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
