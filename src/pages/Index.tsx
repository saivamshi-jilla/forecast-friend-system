
import { useState } from "react";
import { WeatherForm } from "../components/WeatherForm";
import { WeatherResult } from "../components/WeatherResult";
import { Cloud, Sun, CloudRain } from "lucide-react";

export interface WeatherData {
  name: string;
  email: string;
  city: string;
  temperature: number;
  condition: string;
  aqi: number;
  timestamp: string;
}

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: { name: string; email: string; city: string }) => {
    setIsLoading(true);
    console.log("Form submitted:", formData);
    
    // Simulate API call for now - this will be replaced with actual weather API integration
    setTimeout(() => {
      const mockWeatherData: WeatherData = {
        ...formData,
        temperature: Math.floor(Math.random() * 30) + 5, // Random temp between 5-35°C
        condition: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
        aqi: Math.floor(Math.random() * 150) + 50, // Random AQI between 50-200
        timestamp: new Date().toISOString(),
      };
      setWeatherData(mockWeatherData);
      setIsLoading(false);
    }, 2000);
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
