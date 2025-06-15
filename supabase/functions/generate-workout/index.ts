
import 'https://deno.land/x/xhr@0.1.0/mod.ts'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { OpenAI } from "https://deno.land/x/openai@v4.52.7/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const openai = new OpenAI({ apiKey: openAIApiKey });

const PROMPT = `
You are a world-class fitness expert and personal trainer.
Generate a complete workout plan for a user.
The response MUST be a valid JSON object ONLY. Do not include any other text or markdown formatting.
The JSON object should have the following structure:
{
  "name": "Workout Name",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": [
        { "reps": 8, "weight": 60 },
        { "reps": 8, "weight": 60 },
        { "reps": 8, "weight": 60 }
      ]
    }
  ]
}
- Generate a creative and motivational workout name.
- Include 4 to 6 exercises for a balanced, full-body workout.
- Each exercise should have 3 sets.
- Reps should be between 8 and 15.
- Suggest a reasonable starting weight in kilograms (kg) for a beginner to intermediate lifter.
- Use common and recognizable exercise names.
`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!openAIApiKey) {
        throw new Error("OPENAI_API_KEY is not set in Supabase secrets.");
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: 'Generate a new full-body workout for me.' },
      ],
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error("No content received from OpenAI.");
    }
    
    const workoutJson = JSON.parse(content);

    return new Response(JSON.stringify(workoutJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error generating workout:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
