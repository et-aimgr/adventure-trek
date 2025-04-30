
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { transportationOptions } from "@/data/sampleData";
import { useTrip } from "@/context/TripContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaneTakeoff, Train, Bus, Car, MapPin } from "lucide-react";
import { Transportation } from "@/types";

export default function WaysMode() {
  const { trip, addTransportation, removeTransportation } = useTrip();
  const [activeTab, setActiveTab] = useState("all");
  
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
                            <p className="text-xs text-muted-foreground">Direct</p>
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
          <h2 className="text-2xl font-bold tracking-tight">Available Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transportationOptions.map((transport) => {
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
                        <p className="text-xs text-muted-foreground">Direct</p>
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
        </div>
      </div>
    </div>
  );
}
