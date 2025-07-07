
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, Thermometer, Droplets, Moon, Utensils } from "lucide-react";
import { toast } from "sonner";

interface VitalSignsProps {
  onVitalsUpdate: (vitals: any) => void;
}

export const VitalSigns = ({ onVitalsUpdate }: VitalSignsProps) => {
  const [vitals, setVitals] = useState({
    heartRate: "",
    bloodPressure: "",
    bloodSugar: "",
    spO2: "",
    respiratoryRate: "",
    bodyTemperature: "",
    caloriesConsumed: "",
    waterIntake: "",
    activityLevel: "",
    sleepDuration: "",
    exerciseType: "",
    exerciseDuration: ""
  });

  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate real-time data
  const simulateVitals = () => {
    setIsSimulating(true);
    const simulatedVitals = {
      heartRate: (60 + Math.random() * 40).toFixed(0),
      bloodPressure: `${(110 + Math.random() * 30).toFixed(0)}/${(70 + Math.random() * 20).toFixed(0)}`,
      bloodSugar: (80 + Math.random() * 40).toFixed(0),
      spO2: (95 + Math.random() * 5).toFixed(1),
      respiratoryRate: (12 + Math.random() * 8).toFixed(0),
      bodyTemperature: (36.1 + Math.random() * 1.5).toFixed(1),
      caloriesConsumed: (1500 + Math.random() * 1000).toFixed(0),
      waterIntake: (1.5 + Math.random() * 2).toFixed(1),
      activityLevel: Math.random() > 0.5 ? "Medium" : "High",
      sleepDuration: (6 + Math.random() * 3).toFixed(1),
      exerciseType: "Walking",
      exerciseDuration: (20 + Math.random() * 40).toFixed(0)
    };

    setVitals(simulatedVitals);
    onVitalsUpdate(simulatedVitals);
    toast.success("Simulated vital signs generated!");
    setIsSimulating(false);
  };

  const handleManualUpdate = () => {
    onVitalsUpdate(vitals);
    toast.success("Vital signs updated successfully!");
  };

  const getHeartRateStatus = (hr: string) => {
    const rate = parseInt(hr);
    if (rate < 60) return { status: "Low", color: "text-blue-600" };
    if (rate > 100) return { status: "High", color: "text-red-600" };
    return { status: "Normal", color: "text-green-600" };
  };

  const getSpO2Status = (spo2: string) => {
    const value = parseFloat(spo2);
    if (value < 95) return { status: "Low", color: "text-red-600" };
    return { status: "Normal", color: "text-green-600" };
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={simulateVitals}
          disabled={isSimulating}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Activity className="h-4 w-4 mr-2" />
          {isSimulating ? "Simulating..." : "Simulate Real-Time Data"}
        </Button>
        <Button 
          onClick={handleManualUpdate}
          variant="outline"
          className="flex-1"
        >
          Save Manual Input
        </Button>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Heart Rate */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Heart Rate</span>
              </div>
              {vitals.heartRate && (
                <Badge className={getHeartRateStatus(vitals.heartRate).color}>
                  {getHeartRateStatus(vitals.heartRate).status}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                type="number"
                value={vitals.heartRate}
                onChange={(e) => setVitals(prev => ({ ...prev, heartRate: e.target.value }))}
                placeholder="Enter BPM"
                className="bg-white/50"
              />
              <div className="text-lg font-semibold text-center">
                {vitals.heartRate ? `${vitals.heartRate} BPM` : "-- BPM"}
              </div>
              {vitals.heartRate && (
                <Progress value={Math.min(parseInt(vitals.heartRate), 120)} className="h-2" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Blood Pressure */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Activity className="h-4 w-4 text-blue-500" />
              <span>Blood Pressure</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                value={vitals.bloodPressure}
                onChange={(e) => setVitals(prev => ({ ...prev, bloodPressure: e.target.value }))}
                placeholder="120/80"
                className="bg-white/50"
              />
              <div className="text-lg font-semibold text-center">
                {vitals.bloodPressure ? `${vitals.bloodPressure} mmHg` : "-- mmHg"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SpO2 */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-cyan-500" />
                <span>Blood Oxygen</span>
              </div>
              {vitals.spO2 && (
                <Badge className={getSpO2Status(vitals.spO2).color}>
                  {getSpO2Status(vitals.spO2).status}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                type="number"
                value={vitals.spO2}
                onChange={(e) => setVitals(prev => ({ ...prev, spO2: e.target.value }))}
                placeholder="98.5"
                className="bg-white/50"
              />
              <div className="text-lg font-semibold text-center">
                {vitals.spO2 ? `${vitals.spO2}%` : "--%"}
              </div>
              {vitals.spO2 && (
                <Progress value={parseFloat(vitals.spO2)} className="h-2" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Body Temperature */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span>Temperature</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                type="number"
                step="0.1"
                value={vitals.bodyTemperature}
                onChange={(e) => setVitals(prev => ({ ...prev, bodyTemperature: e.target.value }))}
                placeholder="36.5"
                className="bg-white/50"
              />
              <div className="text-lg font-semibold text-center">
                {vitals.bodyTemperature ? `${vitals.bodyTemperature}°C` : "--°C"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Duration */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Moon className="h-4 w-4 text-purple-500" />
              <span>Sleep</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                type="number"
                step="0.5"
                value={vitals.sleepDuration}
                onChange={(e) => setVitals(prev => ({ ...prev, sleepDuration: e.target.value }))}
                placeholder="8.0"
                className="bg-white/50"
              />
              <div className="text-lg font-semibold text-center">
                {vitals.sleepDuration ? `${vitals.sleepDuration} hrs` : "-- hrs"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Utensils className="h-4 w-4 text-green-500" />
              <span>Calories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                type="number"
                value={vitals.caloriesConsumed}
                onChange={(e) => setVitals(prev => ({ ...prev, caloriesConsumed: e.target.value }))}
                placeholder="2000"
                className="bg-white/50"
              />
              <div className="text-lg font-semibold text-center">
                {vitals.caloriesConsumed ? `${vitals.caloriesConsumed} kcal` : "-- kcal"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm">Activity & Exercise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Activity Level</Label>
              <Select onValueChange={(value) => setVitals(prev => ({ ...prev, activityLevel: value }))}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Exercise Type</Label>
                <Input
                  value={vitals.exerciseType}
                  onChange={(e) => setVitals(prev => ({ ...prev, exerciseType: e.target.value }))}
                  placeholder="Running"
                  className="bg-white/50"
                />
              </div>
              <div>
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={vitals.exerciseDuration}
                  onChange={(e) => setVitals(prev => ({ ...prev, exerciseDuration: e.target.value }))}
                  placeholder="30"
                  className="bg-white/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm">Additional Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Blood Sugar (mg/dL)</Label>
              <Input
                type="number"
                value={vitals.bloodSugar}
                onChange={(e) => setVitals(prev => ({ ...prev, bloodSugar: e.target.value }))}
                placeholder="100"
                className="bg-white/50"
              />
            </div>
            <div>
              <Label>Water Intake (L)</Label>
              <Input
                type="number"
                step="0.1"
                value={vitals.waterIntake}
                onChange={(e) => setVitals(prev => ({ ...prev, waterIntake: e.target.value }))}
                placeholder="2.5"
                className="bg-white/50"
              />
            </div>
            <div>
              <Label>Respiratory Rate</Label>
              <Input
                type="number"
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                placeholder="16"
                className="bg-white/50"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
