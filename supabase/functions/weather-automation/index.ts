
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherRequest {
  name: string;
  email: string;
  city: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  aqi: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, city }: WeatherRequest = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const emailValid = emailRegex.test(email)
    
    // Get weather data
    const weatherApiKey = Deno.env.get('WEATHER_API_KEY')
    if (!weatherApiKey) {
      throw new Error('Weather API key not configured')
    }
    
    const weatherResponse = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(city)}&aqi=yes`
    )
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data')
    }
    
    const weatherData = await weatherResponse.json()
    
    const temperature = weatherData.current.temp_c
    const condition = weatherData.current.condition.text
    const aqi = Math.round(weatherData.current.air_quality.pm2_5)
    
    // Generate AI commentary (optional)
    let aiCommentary = ""
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (openaiApiKey) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
              role: 'user',
              content: `Based on this weather data: Temperature ${temperature}°C, Condition: ${condition}, AQI: ${aqi}, provide a brief 1-2 sentence helpful comment about the weather conditions for outdoor activities.`
            }],
            max_tokens: 100,
          }),
        })
        
        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json()
          aiCommentary = openaiData.choices[0]?.message?.content || ""
        }
      } catch (error) {
        console.log('AI commentary failed:', error)
      }
    }
    
    // Store in database
    const { data: dbData, error: dbError } = await supabase
      .from('weather_reports')
      .insert({
        full_name: name,
        email: email,
        city: city,
        email_valid: emailValid,
        temperature: temperature,
        condition: condition,
        aqi: aqi,
        ai_commentary: aiCommentary
      })
      .select()
      .single()
    
    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }
    
    // Send email
    const emailApiKey = Deno.env.get('BREVO_API_KEY')
    if (emailApiKey) {
      try {
        const emailData = {
          sender: { email: "noreply@weather-app.com", name: "AI Weather Reporter" },
          to: [{ email: email, name: name }],
          subject: `Weather Report for ${city}`,
          htmlContent: `
            <h2>Hi ${name},</h2>
            <p>Thanks for submitting your details.</p>
            <p>Here's the current weather for <strong>${city}</strong>:</p>
            <ul>
              <li>Temperature: <strong>${temperature}°C</strong></li>
              <li>Condition: <strong>${condition}</strong></li>
              <li>AQI: <strong>${aqi}</strong></li>
            </ul>
            ${aiCommentary ? `<p><em>${aiCommentary}</em></p>` : ''}
            <p>Stay safe and take care!</p>
            <p><strong>Thanks,<br/>AI Weather Reporter</strong></p>
          `
        }
        
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': emailApiKey
          },
          body: JSON.stringify(emailData)
        })
      } catch (error) {
        console.log('Email sending failed:', error)
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: dbData.id,
          temperature,
          condition,
          aqi,
          aiCommentary,
          emailValid
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
    
  } catch (error) {
    console.error('Error:', error)
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
