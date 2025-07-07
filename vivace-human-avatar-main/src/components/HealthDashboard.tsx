
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Activity, Brain, Shield, TrendingUp, AlertTriangle } from "lucide-react";

interface HealthDashboardProps {
  userProfile: any;
  vitalSigns: any;
}

export const HealthDashboard = ({ userProfile, vitalSigns }: HealthDashboardProps) => {
  // Calculate health metrics
  const calculateBMI = () => {
    if (!userProfile?.height || !userProfile?.weight) return null;
    const height = parseFloat(userProfile.height) / 100; // Convert cm to m
    const weight = parseFloat(userProfile.weight);
    return (weight / (height * height)).toFixed(1);
  };

  const getBMIStatus = (bmi: string) => {
    const value = parseFloat(bmi);
    if (value < 18.5) return { status: "Underweight", color: "text-blue-600" };
    if (value < 25) return { status: "Normal", color: "text-green-600" };
    if (value < 30) return { status: "Overweight", color: "text-yellow-600" };
    return { status: "Obese", color: "text-red-600" };
  };

  const getHealthScore = () => {
    let score = 70; // Base score
    
    if (vitalSigns?.heartRate) {
      const hr = parseInt(vitalSigns.heartRate);
      if (hr >= 60 && hr <= 100) score += 10;
      else score -= 5;
    }
    
    if (vitalSigns?.spO2) {
      const spo2 = parseFloat(vitalSigns.spO2);
      if (spo2 >= 95) score += 10;
      else score -= 10;
    }
    
    if (vitalSigns?.sleepDuration) {
      const sleep = parseFloat(vitalSigns.sleepDuration);
      if (sleep >= 7 && sleep <= 9) score += 10;
      else score -= 5;
    }

    return Math.min(100, Math.max(0, score));
  };

  const generateHealthInsights = () => {
    const insights = [];
    
    if (vitalSigns?.heartRate) {
      const hr = parseInt(vitalSigns.heartRate);
      if (hr > 100) {
        insights.push({
          type: "warning",
          message: "Your heart rate is elevated. Consider relaxation techniques or consult a doctor.",
          icon: Heart
        });
      } else if (hr >= 60 && hr <= 100) {
        insights.push({
          type: "success",
          message: "Your heart rate is in the normal range. Great cardiovascular health!",
          icon: Heart
        });
      }
    }

    if (vitalSigns?.sleepDuration) {
      const sleep = parseFloat(vitalSigns.sleepDuration);
      if (sleep < 7) {
        insights.push({
          type: "warning",
          message: "You're not getting enough sleep. Aim for 7-9 hours for optimal health.",
          icon: Brain
        });
      }
    }

    const bmi = calculateBMI();
    if (bmi) {
      const bmiValue = parseFloat(bmi);
      if (bmiValue >= 18.5 && bmiValue < 25) {
        insights.push({
          type: "success",
          message: "Your BMI is in the healthy range. Keep up the good work!",
          icon: Shield
        });
      }
    }

    return insights;
  };

  const bmi = calculateBMI();
  const healthScore = getHealthScore();
  const insights = generateHealthInsights();

  if (!userProfile && !vitalSigns) {
    return (
      <div className="text-center py-12">
        <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Your Digital Twin Awaits</h3>
        <p className="text-gray-500 mb-6">
          Set up your profile and vital signs to see your personalized health dashboard
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium">Complete Profile</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-sm font-medium">Add Vital Signs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      {userProfile && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome, {userProfile.name}! 👋
                </h2>
                <p className="opacity-90">
                  Your Digital Twin is actively monitoring your health metrics
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{healthScore}</div>
                <div className="text-sm opacity-90">Health Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Score */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Health Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center mb-2">{healthScore}</div>
            <Progress value={healthScore} className="h-2 mb-2" />
            <div className="text-xs text-center text-gray-600">
              {healthScore >= 80 ? "Excellent" : healthScore >= 70 ? "Good" : "Needs Attention"}
            </div>
          </CardContent>
        </Card>

        {/* BMI */}
        {bmi && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>BMI</span>
                </div>
                <Badge className={getBMIStatus(bmi).color}>
                  {getBMIStatus(bmi).status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center mb-2">{bmi}</div>
              <div className="text-xs text-center text-gray-600">kg/m²</div>
            </CardContent>
          </Card>
        )}

        {/* Current Heart Rate */}
        {vitalSigns?.heartRate && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <span>Heart Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center mb-2">
                {vitalSigns.heartRate}
              </div>
              <div className="text-xs text-center text-gray-600">BPM</div>
            </CardContent>
          </Card>
        )}

        {/* Blood Oxygen */}
        {vitalSigns?.spO2 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-cyan-500" />
                <span>Blood Oxygen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center mb-2">
                {vitalSigns.spO2}%
              </div>
              <Progress value={parseFloat(vitalSigns.spO2)} className="h-2" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Health Insights */}
      {insights.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Health Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <Alert key={index} className={`${
                insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'
              }`}>
                <insight.icon className={`h-4 w-4 ${
                  insight.type === 'warning' ? 'text-yellow-600' : 'text-green-600'
                }`} />
                <AlertDescription className={
                  insight.type === 'warning' ? 'text-yellow-800' : 'text-green-800'
                }>
                  {insight.message}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {(userProfile || vitalSigns) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userProfile?.age && (
            <Card className="bg-white/50 backdrop-blur-sm border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{userProfile.age}</div>
                <div className="text-xs text-gray-600">Years Old</div>
              </CardContent>
            </Card>
          )}
          {vitalSigns?.sleepDuration && (
            <Card className="bg-white/50 backdrop-blur-sm border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{vitalSigns.sleepDuration}h</div>
                <div className="text-xs text-gray-600">Sleep</div>
              </CardContent>
            </Card>
          )}
          {vitalSigns?.waterIntake && (
            <Card className="bg-white/50 backdrop-blur-sm border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{vitalSigns.waterIntake}L</div>
                <div className="text-xs text-gray-600">Water</div>
              </CardContent>
            </Card>
          )}
          {vitalSigns?.caloriesConsumed && (
            <Card className="bg-white/50 backdrop-blur-sm border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{vitalSigns.caloriesConsumed}</div>
                <div className="text-xs text-gray-600">Calories</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
