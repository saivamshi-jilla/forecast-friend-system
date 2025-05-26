
import { useState } from "react";
import { WeatherForm } from "../components/WeatherForm";
import { WeatherResult } from "../components/WeatherResult";
import { AutomationPanel } from "../components/AutomationPanel";
import { Cloud, Sun, CloudRain, Zap, Settings, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const [showAutomation, setShowAutomation] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (formData: { name: string; email: string; city: string }) => {
    setIsLoading(true);
    console.log("Form submitted:", formData);
    
    try {
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
        title: "⚡ Weather Report Generated!",
        description: "Check your email for the full weather summary.",
      });

    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "🔥 System Error",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-purple-500 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 opacity-30 animate-float">
        <Sun size={80} className="text-yellow-300 filter drop-shadow-lg" />
      </div>
      <div className="absolute top-32 right-20 opacity-30 animate-float" style={{ animationDelay: '1s' }}>
        <Cloud size={60} className="text-cyan-300 filter drop-shadow-lg" />
      </div>
      <div className="absolute bottom-20 left-1/4 opacity-30 animate-float" style={{ animationDelay: '2s' }}>
        <CloudRain size={70} className="text-blue-300 filter drop-shadow-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🌩️</div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              NEXUS WEATHER
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAutomation(!showAutomation)}
              variant="outline"
              className="bg-black/50 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Automation
            </Button>
          </div>
        </div>

        {/* Main title */}
        <div className="text-center mb-8">
          <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 drop-shadow-lg animate-pulse">
            AI WEATHER NEXUS
          </h2>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            Advanced atmospheric intelligence with real-time air quality monitoring and AI-powered insights
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Database className="w-4 h-4" />
              <span className="text-sm">DATA STREAM ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm">AI ENHANCED</span>
            </div>
          </div>
        </div>

        {/* Automation Panel */}
        {showAutomation && (
          <div className="mb-8">
            <AutomationPanel />
          </div>
        )}

        {/* Main content */}
        <div className="max-w-md mx-auto">
          {!weatherData ? (
            <WeatherForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          ) : (
            <WeatherResult data={weatherData} onReset={resetForm} />
          )}
        </div>

        {/* Email troubleshooting panel */}
        <div className="mt-8 max-w-2xl mx-auto">
          <Card className="bg-black/40 border-orange-500/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-orange-400">Email Delivery Status</h3>
              </div>
              <div className="text-gray-300 space-y-2 text-sm">
                <p><strong>✅ Email System:</strong> Active and configured</p>
                <p><strong>📧 If emails aren't arriving:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                  <li>Check your spam/junk folder</li>
                  <li>Verify your email domain in Brevo dashboard</li>
                  <li>Ensure your Brevo account has sending privileges</li>
                  <li>Try with a different email address</li>
                </ul>
                <p className="text-cyan-400 mt-4">
                  <strong>Webhook URL for automation:</strong><br />
                  <code className="text-xs bg-black/50 p-1 rounded">
                    https://wqsdqsnmbvwucbmwobct.supabase.co/functions/v1/webhook-handler
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
