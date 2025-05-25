
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Webhook received:', body)
    
    // Extract form data (format may vary based on source)
    const formData = {
      name: body.name || body.full_name || body['Full Name'] || body['name'],
      email: body.email || body['Email'] || body['email'],
      city: body.city || body['City'] || body['city']
    }
    
    console.log('Extracted form data:', formData)
    
    if (!formData.name || !formData.email || !formData.city) {
      throw new Error('Missing required fields: name, email, city')
    }
    
    // Forward to weather automation function
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    console.log('Forwarding to weather automation...')
    const weatherResponse = await fetch(
      `${supabaseUrl}/functions/v1/weather-automation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify(formData)
      }
    )
    
    const weatherData = await weatherResponse.json()
    console.log('Weather automation response:', weatherData)
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Weather report processed successfully',
        data: weatherData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
    
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
