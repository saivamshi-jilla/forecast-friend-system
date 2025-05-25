
import { useState } from "react";
import { WeatherForm } from "../components/WeatherForm";
import { WeatherResult } from "../components/WeatherResult";
import { Cloud, Sun, CloudRain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WeatherData {
  id?: string;
  name: string;
  email: string;
  city: string;
  temperature: number;
  condition: string;
  aqi: number;
  timestamp: string;
  aiCommentary?: string;
  emailValid?: boolean;
}

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (formData: { name: string; email: string; city: string }) => {
    setIsLoading(true);
    console.log("Form submitted:", formData);
    
    try {
      // Call the edge function for weather automation
      const { data, error } = await supabase.functions.invoke('weather-automation', {
        body: formData
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Weather data fetch failed');
      }

      const result = data.data;
      
      const weatherResult: WeatherData = {
        id: result.id,
        name: formData.name,
        email: formData.email,
        city: formData.city,
        temperature: result.temperature,
        condition: result.condition,
        aqi: result.aqi,
        timestamp: new Date().toISOString(),
        aiCommentary: result.aiCommentary,
        emailValid: result.emailValid
      };

      setWeatherData(weatherResult);
      
      toast({
        title: "Weather Report Generated!",
        description: "Check your email for the full weather summary.",
      });

    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setWeatherData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 opacity-20 animate-float">
        <Sun size={80} className="text-yellow-300" />
      </div>
      <div className="absolute top-32 right-20 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <Cloud size={60} className="text-white" />
      </div>
      <div className="absolute bottom-20 left-1/4 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <CloudRain size={70} className="text-blue-200" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🌤️ AI Weather Reporter
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Get personalized weather reports with air quality information delivered straight to your inbox
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {!weatherData ? (
            <WeatherForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          ) : (
            <WeatherResult data={weatherData} onReset={resetForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
