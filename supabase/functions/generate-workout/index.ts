
import 'https://deno.land/x/xhr@0.1.0/mod.ts'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { OpenAI } from "https://deno.land/x/openai@v4.52.7/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const openai = new OpenAI({ apiKey: openAIApiKey });

const PROMPT_TEMPLATE = (equipmentList: string) => `
You are a world-class fitness expert and personal trainer with a passion for Norse mythology.
Generate a complete workout plan for a user based on the equipment they have available.
The user has the following equipment: ${equipmentList}.
If the list is empty or only contains 'Bodyweight', generate a bodyweight-only workout.

The response MUST be a valid JSON object ONLY. Do not include any other text or markdown formatting.
The JSON object should have the following structure:
{
  "name": "Workout Name",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": [
        { "reps": 8, "weight": 0 },
        { "reps": 8, "weight": 0 },
        { "reps": 8, "weight": 0 }
      ]
    }
  ]
}
- Generate a creative and motivational viking-themed workout name that reflects the available equipment (e.g. "Thor's Thunderous Thursdays", "Loki's Leg Day", "Valhalla Back & Biceps").
- Include 4 to 6 exercises for a balanced, full-body workout, using ONLY the provided equipment.
- Each exercise should have 3 sets.
- Reps should be between 8 and 15.
- The "weight" for each set should initially be 0. The application will populate this with historical data.
- Use common and recognizable exercise names.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!openAIApiKey) {
        throw new Error("OPENAI_API_KEY is not set in Supabase secrets.");
    }

    const body = await req.json();
    const equipment = body?.equipment;
    const equipmentList = Array.isArray(equipment) && equipment.length > 0 ? equipment.join(', ') : 'Bodyweight';
    const finalPrompt = PROMPT_TEMPLATE(equipmentList);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create a Supabase client with the user's token
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: finalPrompt },
        { role: 'user', content: `Generate a new viking-themed full-body workout for me using only the following equipment: ${equipmentList}.` },
      ],
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error("No content received from OpenAI.");
    }
    
    const workoutJson = JSON.parse(content);

    // For each exercise, get the last used weight and update the plan
    for (const exercise of workoutJson.exercises) {
      const { data: lastWeight, error: rpcError } = await supabaseClient.rpc('get_last_exercise_weight', {
        p_exercise_name: exercise.name,
      });

      if (rpcError) {
        console.error(`Error fetching last weight for "${exercise.name}":`, rpcError.message);
        // If there's an error, we'll just proceed with the default weight of 0.
      }
      
      const weightToSet = lastWeight > 0 ? lastWeight : 0;

      for (const set of exercise.sets) {
        set.weight = weightToSet;
      }
    }


    return new Response(JSON.stringify(workoutJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error generating workout:', error)
    
    const errorResponse = {
      message: error.message || 'An unknown error occurred.',
      type: error.type,
    }

    return new Response(JSON.stringify({ error: errorResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
