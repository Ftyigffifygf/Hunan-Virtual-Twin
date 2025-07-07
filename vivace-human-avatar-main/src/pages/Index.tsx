
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Activity, MessageCircle, User, Settings } from "lucide-react";
import { PersonalProfile } from "@/components/PersonalProfile";
import { VitalSigns } from "@/components/VitalSigns";
import { HealthDashboard } from "@/components/HealthDashboard";
import { DigitalTwin3D } from "@/components/DigitalTwin3D";
import { HealthChat } from "@/components/HealthChat";
import { PredictiveAnalytics } from "@/components/PredictiveAnalytics";

const Index = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [vitalSigns, setVitalSigns] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-8 w-8 text-red-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Digital Twin Health
                </h1>
                <p className="text-sm text-gray-600">Human-Powered Personal Health Simulation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                System Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Vitals</span>
            </TabsTrigger>
            <TabsTrigger value="twin" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">3D Twin</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Health Chat</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <HealthDashboard userProfile={userProfile} vitalSigns={vitalSigns} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <PersonalProfile onProfileUpdate={setUserProfile} />
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <VitalSigns onVitalsUpdate={setVitalSigns} />
          </TabsContent>

          <TabsContent value="twin" className="space-y-6">
            <DigitalTwin3D userProfile={userProfile} vitalSigns={vitalSigns} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AIHealthChat userProfile={userProfile} vitalSigns={vitalSigns} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <PredictiveAnalytics userProfile={userProfile} vitalSigns={vitalSigns} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
