
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Heart, Brain, Activity } from "lucide-react";
import { toast } from "sonner";

interface AIHealthChatProps {
  userProfile: any;
  vitalSigns: any;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIHealthChat = ({ userProfile, vitalSigns }: AIHealthChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Health Assistant. I can help you understand your health data, provide personalized recommendations, and answer questions about your Digital Twin. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      question: "How's my heart doing?",
      icon: Heart,
      color: "text-red-500"
    },
    {
      question: "What happens if I eat pizza and sleep for 3 hours?",
      icon: Activity,
      color: "text-orange-500"
    },
    {
      question: "How can I improve my lung health?",
      icon: Brain,
      color: "text-blue-500"
    },
    {
      question: "What's my current health score?",
      icon: Activity,
      color: "text-green-500"
    }
  ];

  // Simulate AI responses based on health data
  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('heart')) {
      if (vitalSigns?.heartRate) {
        const hr = parseInt(vitalSigns.heartRate);
        if (hr >= 60 && hr <= 100) {
          return `Your heart is doing great! With a heart rate of ${hr} BPM, you're within the normal range. Your cardiovascular system appears healthy. Keep up with regular exercise and a balanced diet to maintain this excellent heart health.`;
        } else if (hr > 100) {
          return `Your heart rate is currently elevated at ${hr} BPM. This could be due to stress, caffeine, exercise, or other factors. Consider relaxation techniques like deep breathing or meditation. If this persists, consult with a healthcare provider.`;
        } else {
          return `Your heart rate is ${hr} BPM, which is on the lower side. This could be normal if you're very fit, but if you're experiencing symptoms like dizziness or fatigue, please consult a healthcare professional.`;
        }
      }
      return "I don't have your current heart rate data. Please add your vital signs so I can give you personalized heart health insights!";
    }
    
    if (lowerQuestion.includes('pizza') && lowerQuestion.includes('sleep')) {
      return `Eating pizza before sleeping for only 3 hours would likely impact your health negatively. Here's what might happen:

🍕 **Digestive Impact**: Heavy, fatty foods like pizza can disrupt sleep quality and cause indigestion.

😴 **Sleep Deprivation**: 3 hours is far below the recommended 7-9 hours, leading to:
- Increased stress hormones
- Weakened immune system
- Poor cognitive function
- Increased appetite the next day

**Better alternatives**: 
- Eat lighter meals 2-3 hours before bed
- Aim for 7-9 hours of sleep
- If you must eat late, choose easily digestible foods

Your body deserves better care! 💪`;
    }
    
    if (lowerQuestion.includes('lung') || lowerQuestion.includes('breathing')) {
      const advice = `Here are evidence-based ways to improve your lung health:

🫁 **Exercise Regularly**: 
- Cardio exercises strengthen respiratory muscles
- Swimming is particularly beneficial
- Start with 30 minutes, 3x per week

🌬️ **Breathing Exercises**:
- Practice diaphragmatic breathing
- Try the 4-7-8 technique (inhale 4, hold 7, exhale 8)
- Yoga and meditation help

🏠 **Environment**:
- Keep air clean (air purifiers help)
- Avoid smoking and secondhand smoke
- Add plants to improve air quality

💧 **Stay Hydrated**: Water helps thin mucus in lungs`;

      if (vitalSigns?.spO2) {
        return `${advice}\n\n📊 Your current blood oxygen is ${vitalSigns.spO2}%, which is ${parseFloat(vitalSigns.spO2) >= 95 ? 'excellent' : 'below optimal'}!`;
      }
      
      return advice;
    }
    
    if (lowerQuestion.includes('health score') || lowerQuestion.includes('overall')) {
      let score = 70;
      const factors = [];
      
      if (vitalSigns?.heartRate) {
        const hr = parseInt(vitalSigns.heartRate);
        if (hr >= 60 && hr <= 100) {
          score += 10;
          factors.push("✅ Heart rate normal");
        } else {
          score -= 5;
          factors.push("⚠️ Heart rate needs attention");
        }
      }
      
      if (vitalSigns?.spO2) {
        const spo2 = parseFloat(vitalSigns.spO2);
        if (spo2 >= 95) {
          score += 10;
          factors.push("✅ Blood oxygen excellent");
        } else {
          score -= 10;
          factors.push("⚠️ Blood oxygen low");
        }
      }
      
      if (vitalSigns?.sleepDuration) {
        const sleep = parseFloat(vitalSigns.sleepDuration);
        if (sleep >= 7 && sleep <= 9) {
          score += 10;
          factors.push("✅ Sleep duration optimal");
        } else {
          score -= 5;
          factors.push("⚠️ Sleep needs improvement");
        }
      }
      
      const finalScore = Math.min(100, Math.max(0, score));
      
      return `📊 **Your Current Health Score: ${finalScore}/100**

${factors.join('\n')}

${finalScore >= 80 ? '🎉 Excellent health! Keep up the great work!' : 
  finalScore >= 70 ? '👍 Good health with room for improvement.' : 
  '⚠️ Your health needs attention. Consider consulting healthcare professionals.'}`;
    }
    
    // Default responses for other questions
    const responses = [
      `Based on your current data, I can see that ${userProfile?.name ? `${userProfile.name}, ` : ''}you're taking great steps towards monitoring your health. ${vitalSigns ? 'Your vital signs show valuable insights about your current wellbeing.' : 'Adding your vital signs would help me provide more personalized advice.'}`,
      
      `That's a great question! With the data I have access to, I can help you understand your health patterns and provide evidence-based recommendations. ${!userProfile ? 'Setting up your profile would help me give more personalized responses.' : ''}`,
      
      `I'm here to help you understand your Digital Twin data and provide health insights. ${vitalSigns && userProfile ? 'Your current health metrics look good overall!' : 'Complete your profile and add vital signs for detailed analysis.'}`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(newMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      toast.success("AI response generated!");
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setNewMessage(question);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Chat Interface */}
      <div className="lg:col-span-3">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span>AI Health Assistant</span>
              <Badge className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'ai' && (
                          <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-4 w-4 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                          <div className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="flex space-x-2 mt-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me about your health..."
                className="flex-1 bg-white/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isTyping || !newMessage.trim()}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Questions & Info */}
      <div className="space-y-4">
        {/* Quick Questions */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickQuestions.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3 hover:bg-blue-50"
                onClick={() => handleQuickQuestion(item.question)}
              >
                <item.icon className={`h-4 w-4 mr-2 ${item.color}`} />
                <span className="text-xs">{item.question}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">🤖 AI Capabilities</h3>
            <ul className="space-y-1 text-xs opacity-90">
              <li>• Health data analysis</li>
              <li>• Personalized recommendations</li>
              <li>• Risk assessment</li>
              <li>• Lifestyle guidance</li>
              <li>• Symptom evaluation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Health Status */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm">Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span>Profile Complete:</span>
              <Badge variant={userProfile ? "default" : "secondary"}>
                {userProfile ? "✅ Yes" : "❌ No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Vitals Connected:</span>
              <Badge variant={vitalSigns ? "default" : "secondary"}>
                {vitalSigns ? "✅ Yes" : "❌ No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>AI Ready:</span>
              <Badge className="bg-green-100 text-green-800">
                ✅ Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
