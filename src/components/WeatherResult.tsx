
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Thermometer, Eye, Wind, Mail, CheckCircle, XCircle, Sparkles } from "lucide-react";
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
    if (aqi <= 50) return "text-green-600 bg-green-100";
    if (aqi <= 100) return "text-yellow-600 bg-yellow-100";
    if (aqi <= 150) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    return "Unhealthy";
  };

  return (
    <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0 animate-fadeIn">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Weather Report for {data.name}
        </CardTitle>
        <p className="text-gray-600">Here's your personalized weather summary!</p>
        
        {/* Email Validation Status */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <Mail size={16} className="text-gray-500" />
          {data.emailValid ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle size={16} />
              <span className="text-sm">Email sent successfully</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <XCircle size={16} />
              <span className="text-sm">Invalid email format</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-2">{getWeatherIcon(data.condition)}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{data.city}</h3>
          <p className="text-gray-600">{new Date(data.timestamp).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
            <Thermometer className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-2xl font-bold text-blue-600">{data.temperature}°C</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
            <Eye className="text-gray-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Condition</p>
              <p className="text-xl font-semibold text-gray-800">{data.condition}</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 flex items-center gap-3">
            <Wind className="text-green-600" size={24} />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Air Quality Index</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-gray-800">{data.aqi}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAQIColor(data.aqi)}`}>
                  {getAQIStatus(data.aqi)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Commentary Section */}
        {data.aiCommentary && (
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-purple-600" size={20} />
              <h4 className="font-semibold text-purple-800">AI Weather Insights</h4>
            </div>
            <p className="text-purple-700 text-sm italic">{data.aiCommentary}</p>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Summary Email Preview:</h4>
          <div className="text-sm text-gray-700 space-y-2 bg-white p-3 rounded border-l-4 border-blue-500">
            <p><strong>Hi {data.name},</strong></p>
            <p>Thanks for submitting your details.</p>
            <p>Here's the current weather for <strong>{data.city}</strong>:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Temperature: <strong>{data.temperature}°C</strong></li>
              <li>Condition: <strong>{data.condition}</strong></li>
              <li>AQI: <strong>{data.aqi} ({getAQIStatus(data.aqi)})</strong></li>
            </ul>
            {data.aiCommentary && (
              <p className="italic text-purple-600">{data.aiCommentary}</p>
            )}
            <p>Stay safe and take care!</p>
            <p><strong>Thanks,<br />AI Weather Reporter</strong></p>
          </div>
        </div>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full flex items-center gap-2 hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Get Another Report
        </Button>
      </CardContent>
    </Card>
  );
};
