
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateEmail } from "../utils/validation";
import { Mail, User, MapPin, Send } from "lucide-react";
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
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Real-time email validation
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

    // Validation
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

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0 animate-fadeIn">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <span className="text-2xl">📍</span>
          Get Your Weather Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User size={16} />
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn(
                "transition-all duration-200 focus:ring-2 focus:ring-blue-500",
                errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 animate-fadeIn">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail size={16} />
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={cn(
                  "transition-all duration-200 focus:ring-2 focus:ring-blue-500 pr-10",
                  errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500",
                  emailValid === true && "border-green-500 focus:border-green-500",
                  emailValid === false && formData.email && "border-red-500"
                )}
                placeholder="Enter your email address"
              />
              {emailValid !== null && formData.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailValid ? (
                    <span className="text-green-500 text-lg">✓</span>
                  ) : (
                    <span className="text-red-500 text-lg">✗</span>
                  )}
                </div>
              )}
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 animate-fadeIn">{errors.email}</p>
            )}
            {emailValid === false && formData.email && !errors.email && (
              <p className="text-sm text-red-600 animate-fadeIn">Please enter a valid email format</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={16} />
              City
            </Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={cn(
                "transition-all duration-200 focus:ring-2 focus:ring-blue-500",
                errors.city && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              placeholder="Enter your city"
            />
            {errors.city && (
              <p className="text-sm text-red-600 animate-fadeIn">{errors.city}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || emailValid === false}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Getting Weather Data...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send size={16} />
                Get Weather Report
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
