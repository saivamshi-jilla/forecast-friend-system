
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateEmail } from "../utils/validation";
import { Mail, User, MapPin, Send, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherFormProps {
  onSubmit: (data: { name: string; email: string; city: string }) => void;
  isLoading: boolean;
}

export const WeatherForm = ({ onSubmit, isLoading }: WeatherFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    city: "",
  });
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    if (field === "email") {
      if (value) {
        const isValid = validateEmail(value);
        setEmailValid(isValid);
        console.log("Email validation:", value, "is valid:", isValid);
      } else {
        setEmailValid(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: "",
      email: "",
      city: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="bg-black/40 border-cyan-500/50 backdrop-blur-sm shadow-2xl animate-fadeIn">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center gap-2">
          <Zap className="text-cyan-400" size={24} />
          INITIATE WEATHER SCAN
        </CardTitle>
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="text-cyan-300 text-sm">NEURAL INTERFACE ACTIVE</span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-cyan-300 flex items-center gap-2">
              <User size={16} className="text-cyan-400" />
              IDENTITY VECTOR
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn(
                "bg-black/50 border-cyan-500/50 text-cyan-100 placeholder-cyan-600 transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400",
                errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              placeholder="Enter your full identity designation"
            />
            {errors.name && (
              <p className="text-sm text-red-400 animate-fadeIn flex items-center gap-1">
                <span className="text-red-400">⚠</span> {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-cyan-300 flex items-center gap-2">
              <Mail size={16} className="text-cyan-400" />
              COMMUNICATION CHANNEL
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={cn(
                  "bg-black/50 border-cyan-500/50 text-cyan-100 placeholder-cyan-600 transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 pr-10",
                  errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500",
                  emailValid === true && "border-green-500 focus:border-green-500 shadow-green-500/20 shadow-lg",
                  emailValid === false && formData.email && "border-red-500 shadow-red-500/20 shadow-lg"
                )}
                placeholder="Enter secure communication channel"
              />
              {emailValid !== null && formData.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailValid ? (
                    <span className="text-green-400 text-lg animate-pulse">✓</span>
                  ) : (
                    <span className="text-red-400 text-lg animate-pulse">✗</span>
                  )}
                </div>
              )}
            </div>
            {errors.email && (
              <p className="text-sm text-red-400 animate-fadeIn flex items-center gap-1">
                <span className="text-red-400">⚠</span> {errors.email}
              </p>
            )}
            {emailValid === false && formData.email && !errors.email && (
              <p className="text-sm text-red-400 animate-fadeIn flex items-center gap-1">
                <span className="text-red-400">⚠</span> Invalid communication format detected
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-cyan-300 flex items-center gap-2">
              <MapPin size={16} className="text-cyan-400" />
              TARGET COORDINATES
            </Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={cn(
                "bg-black/50 border-cyan-500/50 text-cyan-100 placeholder-cyan-600 transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400",
                errors.city && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              placeholder="Enter target location"
            />
            {errors.city && (
              <p className="text-sm text-red-400 animate-fadeIn flex items-center gap-1">
                <span className="text-red-400">⚠</span> {errors.city}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || emailValid === false}
            className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-black font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-cyan-500/25"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                <span className="text-lg">SCANNING ATMOSPHERE...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send size={20} />
                <span className="text-lg">EXECUTE WEATHER SCAN</span>
                <Zap size={20} />
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
