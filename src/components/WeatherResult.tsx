
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Thermometer, Eye, Wind, Mail, CheckCircle, XCircle, Sparkles, Zap, Database, Shield } from "lucide-react";
import { WeatherData } from "../pages/Index";

interface WeatherResultProps {
  data: WeatherData;
  onReset: () => void;
}

export const WeatherResult = ({ data, onReset }: WeatherResultProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return "☀️";
      case "cloudy":
      case "overcast":
        return "☁️";
      case "partly cloudy":
        return "⛅";
      case "rainy":
      case "rain":
        return "🌧️";
      case "snow":
        return "❄️";
      default:
        return "🌤️";
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-400 bg-green-900/30 border-green-500";
    if (aqi <= 100) return "text-yellow-400 bg-yellow-900/30 border-yellow-500";
    if (aqi <= 150) return "text-orange-400 bg-orange-900/30 border-orange-500";
    return "text-red-400 bg-red-900/30 border-red-500";
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return "OPTIMAL";
    if (aqi <= 100) return "MODERATE";
    if (aqi <= 150) return "CAUTION";
    return "HAZARDOUS";
  };

  return (
    <Card className="bg-black/40 border-cyan-500/50 backdrop-blur-sm shadow-2xl animate-fadeIn">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          ATMOSPHERIC ANALYSIS: {data.name}
        </CardTitle>
        <div className="flex justify-center items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-cyan-400" />
            <span className="text-cyan-300 text-sm">DATA ACQUIRED</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-400" />
            <span className="text-green-300 text-sm">SECURE CHANNEL</span>
          </div>
        </div>
        
        {/* Email Status */}
        <div className="flex items-center justify-center gap-2 mt-4 p-3 rounded-lg bg-black/30 border border-cyan-500/30">
          <Mail size={16} className="text-cyan-400" />
          {data.emailValid ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={16} />
              <span className="text-sm font-semibold">TRANSMISSION SUCCESSFUL</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400">
              <XCircle size={16} />
              <span className="text-sm font-semibold">CHANNEL CORRUPTED</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Display */}
        <div className="text-center">
          <div className="text-7xl mb-4 filter drop-shadow-lg">{getWeatherIcon(data.condition)}</div>
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            {data.city}
          </h3>
          <div className="flex justify-center items-center gap-2 text-cyan-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>{new Date(data.timestamp).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-lg p-4 border border-cyan-500/30 flex items-center gap-3">
            <Thermometer className="text-cyan-400" size={28} />
            <div>
              <p className="text-sm text-cyan-300 uppercase tracking-wide">TEMPERATURE</p>
              <p className="text-3xl font-bold text-cyan-100">{data.temperature}°C</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/40 to-gray-900/40 rounded-lg p-4 border border-purple-500/30 flex items-center gap-3">
            <Eye className="text-purple-400" size={28} />
            <div>
              <p className="text-sm text-purple-300 uppercase tracking-wide">CONDITIONS</p>
              <p className="text-xl font-semibold text-purple-100">{data.condition}</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className={`rounded-lg p-4 border flex items-center gap-3 ${getAQIColor(data.aqi)}`}>
            <Wind size={28} />
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wide opacity-90">AIR QUALITY INDEX</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold">{data.aqi}</p>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/30 border">
                  {getAQIStatus(data.aqi)}
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: 'currentColor'}}></div>
            </div>
          </div>
        </div>

        {/* AI Commentary */}
        {data.aiCommentary && (
          <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-lg p-4 border border-pink-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-pink-400" size={20} />
              <h4 className="font-bold text-pink-300 uppercase tracking-wide">AI NEURAL ANALYSIS</h4>
              <Zap className="text-pink-400" size={16} />
            </div>
            <p className="text-pink-100 text-sm italic leading-relaxed">{data.aiCommentary}</p>
          </div>
        )}

        {/* Email Preview */}
        <div className="bg-black/30 rounded-lg p-4 border border-gray-500/30">
          <h4 className="font-bold text-gray-300 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Mail size={16} />
            TRANSMISSION PREVIEW
          </h4>
          <div className="text-sm text-gray-300 space-y-2 bg-black/50 p-4 rounded border-l-4 border-cyan-500">
            <p><strong className="text-cyan-400">SUBJECT:</strong> Weather Analysis Complete - {data.city}</p>
            <p><strong className="text-cyan-400">TO:</strong> {data.name} &lt;{data.email}&gt;</p>
            <div className="border-t border-gray-600 pt-2 mt-3">
              <p><strong className="text-cyan-400">Hi {data.name},</strong></p>
              <p>Your atmospheric scan has been completed.</p>
              <p><strong>Target Location:</strong> {data.city}</p>
              <ul className="list-none space-y-1 ml-2 mt-2">
                <li>🌡️ Temperature: <strong>{data.temperature}°C</strong></li>
                <li>🌤️ Condition: <strong>{data.condition}</strong></li>
                <li>💨 AQI: <strong>{data.aqi} ({getAQIStatus(data.aqi)})</strong></li>
              </ul>
              {data.aiCommentary && (
                <p className="italic text-purple-300 mt-2 p-2 bg-purple-900/20 rounded">
                  🤖 AI Insight: {data.aiCommentary}
                </p>
              )}
              <p className="mt-3">Stay vigilant and weather-aware!</p>
              <p><strong className="text-cyan-400">—NEXUS WEATHER SYSTEM</strong></p>
            </div>
          </div>
        </div>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full flex items-center gap-2 bg-black/50 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 py-3"
        >
          <ArrowLeft size={16} />
          INITIATE NEW SCAN
          <Zap size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};
