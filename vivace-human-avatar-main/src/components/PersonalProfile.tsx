
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface PersonalProfileProps {
  onProfileUpdate: (profile: any) => void;
}

export const PersonalProfile = ({ onProfileUpdate }: PersonalProfileProps) => {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    sex: "",
    height: "",
    weight: "",
    bloodGroup: "",
    conditions: [] as string[],
    allergies: [] as string[],
    geneticTraits: "",
    medicalHistory: ""
  });

  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  const handleSave = () => {
    if (!profile.name || !profile.age || !profile.sex) {
      toast.error("Please fill in the required fields (Name, Age, Sex)");
      return;
    }

    onProfileUpdate(profile);
    toast.success("Profile saved successfully! Your Digital Twin is now personalized.");
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setProfile(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setProfile(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                className="bg-white/50"
              />
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Enter your age"
                className="bg-white/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sex">Sex *</Label>
              <Select onValueChange={(value) => setProfile(prev => ({ ...prev, sex: value }))}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select onValueChange={(value) => setProfile(prev => ({ ...prev, bloodGroup: value }))}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                placeholder="Enter height in cm"
                className="bg-white/50"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="Enter weight in kg"
                className="bg-white/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Known Conditions</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add a medical condition"
                className="bg-white/50"
                onKeyPress={(e) => e.key === 'Enter' && addCondition()}
              />
              <Button onClick={addCondition} size="sm" className="px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.conditions.map((condition, index) => (
                <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                  {condition}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeCondition(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Allergies</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add an allergy"
                className="bg-white/50"
                onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
              />
              <Button onClick={addAllergy} size="sm" className="px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, index) => (
                <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                  {allergy}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeAllergy(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="geneticTraits">Genetic Traits (Optional)</Label>
            <Textarea
              id="geneticTraits"
              value={profile.geneticTraits}
              onChange={(e) => setProfile(prev => ({ ...prev, geneticTraits: e.target.value }))}
              placeholder="Enter any known genetic traits or family history"
              className="bg-white/50"
            />
          </div>

          <div>
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              value={profile.medicalHistory}
              onChange={(e) => setProfile(prev => ({ ...prev, medicalHistory: e.target.value }))}
              placeholder="Enter your medical history"
              className="bg-white/50"
            />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <Button 
              onClick={handleSave}
              className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Digital Twin Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
