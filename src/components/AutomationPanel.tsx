
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Zap, Webhook, Database, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AutomationPanel = () => {
  const [testPayload, setTestPayload] = useState({
    name: "Test User",
    email: "test@example.com",
    city: "New York"
  });
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const { toast } = useToast();

  const webhookUrl = "https://wqsdqsnmbvwucbmwobct.supabase.co/functions/v1/webhook-handler";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "🔥 Copied!",
      description: "URL copied to clipboard",
    });
  };

  const testWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "⚡ Webhook Success!",
          description: "Test webhook executed successfully",
        });
      } else {
        throw new Error(result.error || 'Webhook failed');
      }
    } catch (error) {
      toast({
        title: "🔥 Webhook Error",
        description: `Failed to test webhook: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const n8nSetup = `{
  "method": "POST",
  "url": "${webhookUrl}",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "name": "{{$json.name}}",
    "email": "{{$json.email}}",
    "city": "{{$json.city}}"
  }
}`;

  const makeSetup = `URL: ${webhookUrl}
Method: POST
Headers: Content-Type: application/json
Body: {
  "name": "{{name}}",
  "email": "{{email}}",
  "city": "{{city}}"
}`;

  return (
    <Card className="bg-black/40 border-cyan-500/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Zap className="w-5 h-5" />
          Automation Command Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="webhook" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/50">
            <TabsTrigger value="webhook" className="text-cyan-400">Webhook</TabsTrigger>
            <TabsTrigger value="n8n" className="text-purple-400">n8n</TabsTrigger>
            <TabsTrigger value="make" className="text-pink-400">Make.com</TabsTrigger>
            <TabsTrigger value="test" className="text-green-400">Test</TabsTrigger>
          </TabsList>

          <TabsContent value="webhook" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Webhook className="w-4 h-4 text-cyan-400" />
                <Label className="text-cyan-400 font-semibold">Webhook Endpoint</Label>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  ACTIVE
                </Badge>
              </div>
              <div className="flex gap-2">
                <Input
                  value={webhookUrl}
                  readOnly
                  className="bg-black/50 border-cyan-500/50 text-cyan-300 font-mono text-xs"
                />
                <Button
                  onClick={() => copyToClipboard(webhookUrl)}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-gray-400 text-sm space-y-2">
                <p><strong>Expected Payload:</strong></p>
                <pre className="bg-black/50 p-3 rounded border border-cyan-500/30 text-cyan-300 text-xs overflow-x-auto">
{`{
  "name": "John Doe",
  "email": "john@example.com", 
  "city": "Tokyo"
}`}
                </pre>
                <p><strong>Response:</strong> Weather data + email delivery</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="n8n" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-400" />
                <Label className="text-purple-400 font-semibold">n8n Configuration</Label>
              </div>
              <div className="text-gray-400 text-sm space-y-2">
                <p><strong>1. Add HTTP Request Node</strong></p>
                <p><strong>2. Configure with these settings:</strong></p>
                <pre className="bg-black/50 p-3 rounded border border-purple-500/30 text-purple-300 text-xs overflow-x-auto">
{n8nSetup}
                </pre>
                <Button
                  onClick={() => copyToClipboard(n8nSetup)}
                  variant="outline"
                  size="sm"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Config
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="make" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-pink-400" />
                <Label className="text-pink-400 font-semibold">Make.com Configuration</Label>
              </div>
              <div className="text-gray-400 text-sm space-y-2">
                <p><strong>1. Add HTTP Module</strong></p>
                <p><strong>2. Select "Make a request"</strong></p>
                <p><strong>3. Configure:</strong></p>
                <pre className="bg-black/50 p-3 rounded border border-pink-500/30 text-pink-300 text-xs overflow-x-auto">
{makeSetup}
                </pre>
                <Button
                  onClick={() => copyToClipboard(makeSetup)}
                  variant="outline"
                  size="sm"
                  className="border-pink-500 text-pink-400 hover:bg-pink-500/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Config
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-green-400" />
                <Label className="text-green-400 font-semibold">Test Webhook</Label>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="text-gray-400">Name</Label>
                  <Input
                    value={testPayload.name}
                    onChange={(e) => setTestPayload({...testPayload, name: e.target.value})}
                    className="bg-black/50 border-green-500/50 text-green-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Email</Label>
                  <Input
                    value={testPayload.email}
                    onChange={(e) => setTestPayload({...testPayload, email: e.target.value})}
                    className="bg-black/50 border-green-500/50 text-green-300"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">City</Label>
                  <Input
                    value={testPayload.city}
                    onChange={(e) => setTestPayload({...testPayload, city: e.target.value})}
                    className="bg-black/50 border-green-500/50 text-green-300"
                  />
                </div>
              </div>
              <Button
                onClick={testWebhook}
                disabled={isTestingWebhook}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isTestingWebhook ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Testing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Execute Test
                  </div>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
