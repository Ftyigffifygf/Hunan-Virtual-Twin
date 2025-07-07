
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Brain, 
  Wind, 
  Activity, 
  Eye, 
  RotateCcw,
  Zap
} from "lucide-react";

interface DigitalTwin3DProps {
  userProfile: any;
  vitalSigns: any;
}

export const DigitalTwin3D = ({ userProfile, vitalSigns }: DigitalTwin3DProps) => {
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  
  // Organ health calculations
  const getOrganHealth = (organ: string) => {
    let health = 75; // Base health
    
    switch (organ) {
      case 'heart':
        if (vitalSigns?.heartRate) {
          const hr = parseInt(vitalSigns.heartRate);
          if (hr >= 60 && hr <= 100) health = 90;
          else if (hr > 100) health = 60;
          else health = 70;
        }
        break;
      case 'lungs':
        if (vitalSigns?.spO2) {
          const spo2 = parseFloat(vitalSigns.spO2);
          if (spo2 >= 95) health = 90;
          else health = 60;
        }
        break;
      case 'brain':
        if (vitalSigns?.sleepDuration) {
          const sleep = parseFloat(vitalSigns.sleepDuration);
          if (sleep >= 7 && sleep <= 9) health = 95;
          else health = 70;
        }
        break;
    }
    
    return health;
  };

  const organs = [
    {
      name: 'Heart',
      icon: Heart,
      health: getOrganHealth('heart'),
      status: vitalSigns?.heartRate ? `${vitalSigns.heartRate} BPM` : 'No data',
      color: 'text-red-500',
      description: 'Cardiovascular system health and heart rate monitoring'
    },
    {
      name: 'Lungs',
      icon: Wind,
      health: getOrganHealth('lungs'),
      status: vitalSigns?.spO2 ? `${vitalSigns.spO2}% SpO2` : 'No data',
      color: 'text-blue-500',
      description: 'Respiratory system and blood oxygen levels'
    },
    {
      name: 'Brain',
      icon: Brain,
      health: getOrganHealth('brain'),
      status: vitalSigns?.sleepDuration ? `${vitalSigns.sleepDuration}h sleep` : 'No data',
      color: 'text-purple-500',
      description: 'Neurological health and cognitive function'
    }
  ];

  const resetView = () => {
    setSelectedOrgan(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Health Status Overview */}
      <div className="lg:col-span-2">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span>Digital Twin Health Monitor</span>
              </CardTitle>
              <Button
                onClick={resetView}
                size="sm"
                variant="outline"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!userProfile && !vitalSigns ? (
              <div className="flex items-center justify-center h-96 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
                <div className="text-center">
                  <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Connect your profile and vitals to see your Digital Twin</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vitalSigns && (
                    <>
                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <Heart className="h-8 w-8 mx-auto text-red-500 mb-2 animate-pulse" />
                        <div className="text-2xl font-bold text-red-700">
                          {vitalSigns.heartRate || '--'}
                        </div>
                        <div className="text-sm text-red-600">BPM</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Wind className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                        <div className="text-2xl font-bold text-blue-700">
                          {vitalSigns.spO2 || '--'}%
                        </div>
                        <div className="text-sm text-blue-600">SpO2</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <Brain className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                        <div className="text-2xl font-bold text-purple-700">
                          {vitalSigns.sleepDuration || '--'}h
                        </div>
                        <div className="text-sm text-purple-600">Sleep</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Detailed Organ Information */}
                {selectedOrgan && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      {(() => {
                        const organ = organs.find(o => o.name.toLowerCase() === selectedOrgan);
                        if (!organ) return null;
                        return (
                          <div className="flex items-start space-x-4">
                            <organ.icon className={`h-12 w-12 ${organ.color} flex-shrink-0`} />
                            <div>
                              <h3 className="font-semibold text-lg mb-2">{organ.name} Health</h3>
                              <p className="text-gray-700 mb-3">{organ.description}</p>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">Health Score:</span>
                                  <Badge className={
                                    organ.health >= 80 
                                      ? "text-green-700 border-green-300" 
                                      : organ.health >= 60 
                                      ? "text-yellow-700 border-yellow-300"
                                      : "text-red-700 border-red-300"
                                  }>
                                    {organ.health}%
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Current: {organ.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Real-time health monitoring dashboard</p>
              <p className="text-xs mt-1">
                🟢 Digital Twin active - monitoring your health metrics
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organ Health Panel */}
      <div className="space-y-4">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Activity className="h-4 w-4 text-green-600" />
              <span>Organ Health Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {organs.map((organ, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedOrgan === organ.name.toLowerCase() 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOrgan(
                  selectedOrgan === organ.name.toLowerCase() 
                    ? null 
                    : organ.name.toLowerCase()
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <organ.icon className={`h-4 w-4 ${organ.color}`} />
                    <span className="font-medium text-sm">{organ.name}</span>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      organ.health >= 80 
                        ? "text-green-700 border-green-300" 
                        : organ.health >= 60 
                        ? "text-yellow-700 border-yellow-300"
                        : "text-red-700 border-red-300"
                    }
                  >
                    {organ.health}%
                  </Badge>
                </div>
                <Progress value={organ.health} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">{organ.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Twin Statistics */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {organs.reduce((acc, organ) => acc + organ.health, 0) / organs.length}%
              </div>
              <div className="text-sm opacity-90">Overall Health</div>
              <div className="text-xs opacity-75 mt-2">
                Based on current vital signs and profile data
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Status */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Digital Twin Status:</span>
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </Badge>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
