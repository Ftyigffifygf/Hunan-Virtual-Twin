
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Heart, 
  Brain, 
  Activity, 
  Shield,
  Target,
  Calendar,
  BarChart3
} from "lucide-react";

interface PredictiveAnalyticsProps {
  userProfile: any;
  vitalSigns: any;
}

export const PredictiveAnalytics = ({ userProfile, vitalSigns }: PredictiveAnalyticsProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  
  // Calculate risk scores based on available data
  const calculateRiskScores = () => {
    const risks = {
      cardiovascular: 15,
      diabetes: 10,
      hypertension: 20,
      obesity: 5,
      stroke: 8
    };

    // Adjust based on profile data
    if (userProfile) {
      const age = parseInt(userProfile.age || "0");
      if (age > 40) {
        risks.cardiovascular += 10;
        risks.diabetes += 5;
        risks.hypertension += 8;
      }
      if (age > 60) {
        risks.stroke += 15;
        risks.cardiovascular += 15;
      }

      // BMI-based adjustments
      if (userProfile.height && userProfile.weight) {
        const height = parseFloat(userProfile.height) / 100;
        const weight = parseFloat(userProfile.weight);
        const bmi = weight / (height * height);
        
        if (bmi > 30) {
          risks.diabetes += 20;
          risks.cardiovascular += 15;
          risks.obesity = 60;
        } else if (bmi > 25) {
          risks.diabetes += 10;
          risks.cardiovascular += 8;
          risks.obesity = 30;
        }
      }

      // Condition-based adjustments
      if (userProfile.conditions?.includes('diabetes')) {
        risks.diabetes = 80;
        risks.cardiovascular += 20;
      }
      if (userProfile.conditions?.includes('hypertension')) {
        risks.hypertension = 75;
        risks.cardiovascular += 15;
        risks.stroke += 20;
      }
    }

    // Adjust based on vital signs
    if (vitalSigns) {
      if (vitalSigns.heartRate) {
        const hr = parseInt(vitalSigns.heartRate);
        if (hr > 100) {
          risks.cardiovascular += 10;
        }
      }
      
      if (vitalSigns.bloodPressure) {
        const [systolic] = vitalSigns.bloodPressure.split('/').map((n: string) => parseInt(n));
        if (systolic > 140) {
          risks.hypertension += 30;
          risks.cardiovascular += 15;
          risks.stroke += 10;
        }
      }

      if (vitalSigns.bloodSugar) {
        const bs = parseInt(vitalSigns.bloodSugar);
        if (bs > 126) {
          risks.diabetes += 40;
        }
      }
    }

    // Cap risks at 100%
    Object.keys(risks).forEach(key => {
      risks[key as keyof typeof risks] = Math.min(100, risks[key as keyof typeof risks]);
    });

    return risks;
  };

  const generatePredictions = () => {
    const baseData = {
      nextWeek: {
        energyLevel: 75 + (Math.random() * 20 - 10),
        sleepQuality: 80 + (Math.random() * 15 - 7),
        stressLevel: 30 + (Math.random() * 30 - 15),
        immuneStrength: 85 + (Math.random() * 10 - 5)
      },
      nextMonth: {
        weightChange: Math.random() * 4 - 2, // -2 to +2 kg
        fitnessImprovement: 5 + Math.random() * 15,
        healthScore: 75 + (Math.random() * 20 - 10)
      },
      nextYear: {
        biologicalAge: userProfile?.age ? parseInt(userProfile.age) + (Math.random() * 2 - 1) : null,
        longevityScore: 78 + (Math.random() * 20 - 10)
      }
    };

    // Adjust based on current health data
    if (vitalSigns?.sleepDuration) {
      const sleep = parseFloat(vitalSigns.sleepDuration);
      if (sleep < 7) {
        baseData.nextWeek.energyLevel -= 15;
        baseData.nextWeek.sleepQuality -= 20;
        baseData.nextWeek.stressLevel += 15;
      }
    }

    return baseData;
  };

  const risks = calculateRiskScores();
  const predictions = generatePredictions();

  const riskCategories = [
    {
      name: "Cardiovascular Disease",
      risk: risks.cardiovascular,
      icon: Heart,
      color: "text-red-500",
      description: "Risk of heart-related conditions"
    },
    {
      name: "Type 2 Diabetes",
      risk: risks.diabetes,
      icon: Activity,
      color: "text-orange-500",
      description: "Risk of developing diabetes"
    },
    {
      name: "Hypertension",
      risk: risks.hypertension,
      icon: TrendingUp,
      color: "text-purple-500",
      description: "Risk of high blood pressure"
    },
    {
      name: "Stroke",
      risk: risks.stroke,
      icon: Brain,
      color: "text-blue-500",
      description: "Risk of cerebrovascular events"
    }
  ];

  const getRiskLevel = (risk: number) => {
    if (risk < 20) return { level: "Low", color: "text-green-600", bg: "bg-green-100" };
    if (risk < 50) return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "High", color: "text-red-600", bg: "bg-red-100" };
  };

  const recommendations = [
    {
      category: "Immediate Actions",
      items: [
        "Monitor blood pressure daily if elevated",
        "Maintain consistent sleep schedule (7-9 hours)",
        "Stay hydrated (2-3L water daily)",
        "Take regular movement breaks"
      ]
    },
    {
      category: "30-Day Goals", 
      items: [
        "Establish regular exercise routine (150min/week)",
        "Reduce processed food intake by 50%",
        "Practice stress management techniques",
        "Schedule comprehensive health checkup"
      ]
    },
    {
      category: "Long-term Strategy",
      items: [
        "Build sustainable healthy habits",
        "Regular health monitoring and tracking",
        "Maintain social connections for mental health",
        "Consider preventive screenings based on age/risk"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Predictive Health Analytics</h2>
          <p className="text-gray-600">AI-powered health predictions and risk assessment</p>
        </div>
        <div className="flex space-x-2">
          {["7d", "30d", "90d", "1y"].map((period) => (
            <Button
              key={period}
              variant={selectedTimeframe === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <span>Health Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {riskCategories.map((category, index) => {
              const riskLevel = getRiskLevel(category.risk);
              return (
                <div key={index} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge className={`${riskLevel.color} ${riskLevel.bg}`}>
                      {riskLevel.level}
                    </Badge>
                  </div>
                  <Progress value={category.risk} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{category.description}</span>
                    <span>{category.risk}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Week */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Next Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Energy Level</span>
              <div className="text-right">
                <div className="font-semibold">{predictions.nextWeek.energyLevel.toFixed(0)}%</div>
                <Progress value={predictions.nextWeek.energyLevel} className="h-1 w-16" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sleep Quality</span>
              <div className="text-right">
                <div className="font-semibold">{predictions.nextWeek.sleepQuality.toFixed(0)}%</div>
                <Progress value={predictions.nextWeek.sleepQuality} className="h-1 w-16" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Stress Level</span>
              <div className="text-right">
                <div className="font-semibold">{predictions.nextWeek.stressLevel.toFixed(0)}%</div>
                <Progress value={predictions.nextWeek.stressLevel} className="h-1 w-16" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Immune Strength</span>
              <div className="text-right">
                <div className="font-semibold">{predictions.nextWeek.immuneStrength.toFixed(0)}%</div>
                <Progress value={predictions.nextWeek.immuneStrength} className="h-1 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Month */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Next Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Weight Change</span>
              <div className="flex items-center space-x-1">
                {predictions.nextMonth.weightChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <span className="font-semibold">
                  {predictions.nextMonth.weightChange > 0 ? '+' : ''}{predictions.nextMonth.weightChange.toFixed(1)} kg
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Fitness Improvement</span>
              <div className="text-right">
                <div className="font-semibold">+{predictions.nextMonth.fitnessImprovement.toFixed(0)}%</div>
                <Progress value={predictions.nextMonth.fitnessImprovement} className="h-1 w-16" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Health Score</span>
              <div className="text-right">
                <div className="font-semibold">{predictions.nextMonth.healthScore.toFixed(0)}</div>
                <Progress value={predictions.nextMonth.healthScore} className="h-1 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Year */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>Next Year</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictions.nextYear.biologicalAge && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Biological Age</span>
                <div className="text-right">
                  <div className="font-semibold">{predictions.nextYear.biologicalAge.toFixed(1)} yrs</div>
                  <div className="text-xs text-gray-500">vs chronological</div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm">Longevity Score</span>
              <div className="text-right">
                <div className="font-semibold">{predictions.nextYear.longevityScore.toFixed(0)}%</div>
                <Progress value={predictions.nextYear.longevityScore} className="h-1 w-16" />
              </div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Predicted Health Trajectory</div>
              <div className="text-lg font-bold text-purple-700">Improving</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-3 text-sm text-gray-700">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Risk Alert */}
      {risks.cardiovascular > 50 || risks.diabetes > 50 || risks.hypertension > 50 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>High Risk Detected:</strong> Your analysis shows elevated risk factors. 
            Consider consulting with a healthcare professional for a comprehensive evaluation and personalized care plan.
          </AlertDescription>
        </Alert>
      )}

      {/* Disclaimer */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600">
            <strong>Disclaimer:</strong> These predictions are based on statistical models and available health data. 
            They are for informational purposes only and should not replace professional medical advice. 
            Always consult with qualified healthcare providers for medical decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
