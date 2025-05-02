
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripProvider } from "@/context/TripContext";
import Header from "@/components/Header";
import PlacesMode from "@/components/PlacesMode";
import WaysMode from "@/components/WaysMode";
import AmazeMode from "@/components/AmazeMode";
import EatsMode from "@/components/EatsMode";
import { MapPin, Plane, Sparkles, Utensils } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("places");

  return (
    <TripProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container py-8">
          <Tabs 
            defaultValue="places" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-8 border-b">
              <TabsList className="grid grid-cols-4 w-full max-w-md bg-transparent border-0 shadow-none">
                <TabsTrigger value="places" className="flex flex-col gap-1 py-3 px-4 border-0">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs">Places</span>
                </TabsTrigger>
                <TabsTrigger value="ways" className="flex flex-col gap-1 py-3 px-4 border-0">
                  <Plane className="h-5 w-5" />
                  <span className="text-xs">Ways</span>
                </TabsTrigger>
                <TabsTrigger value="amaze" className="flex flex-col gap-1 py-3 px-4 border-0">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs">Amaze</span>
                </TabsTrigger>
                <TabsTrigger value="eats" className="flex flex-col gap-1 py-3 px-4 border-0">
                  <Utensils className="h-5 w-5" />
                  <span className="text-xs">Eats</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="places" className="mt-0">
              <PlacesMode />
            </TabsContent>
            
            <TabsContent value="ways" className="mt-0">
              <WaysMode />
            </TabsContent>
            
            <TabsContent value="amaze" className="mt-0">
              <AmazeMode />
            </TabsContent>
            
            <TabsContent value="eats" className="mt-0">
              <EatsMode />
            </TabsContent>
          </Tabs>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Family Trip Navigator - Plan your multi-city trips together
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Help</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </TripProvider>
  );
};

export default Index;
