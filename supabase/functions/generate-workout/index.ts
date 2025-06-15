
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

const PROMPT_TEMPLATE = (equipmentList: string, focusArea: string) => `
You are a world-class fitness expert and personal trainer with a passion for Norse mythology.
Generate a complete workout plan for a user based on the equipment they have available and their desired focus area.
The user has the following equipment: ${equipmentList}.
The user wants to focus on: ${focusArea}. If the focus is 'Full Body', create a balanced workout.
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
- Generate a highly creative, epic, and unique viking-themed workout name. The name should be motivational and reflect the available equipment and focus area.
- **AVOID REPETITIVE NAMES**. Be original and do not use generic templates.
- Draw inspiration from a wide range of Norse mythology figures (e.g., gods, giants, monsters), places (e.g., Asgard, Midgard, Valhalla), and artifacts (e.g., Mjölnir, Gungnir).
- For example, you could create names like "Fenrir's Frenzy", "The Bifröst Bridge Builder", or "Einherjar's Endurance", but DO NOT use these exact examples.
- Include 4 to 6 exercises for a balanced workout targeting the specified focus area, using ONLY the provided equipment. If the focus is 'Full Body', provide a full body workout.
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
    const focusArea = body?.focusArea || 'Full Body';
    const equipmentList = Array.isArray(equipment) && equipment.length > 0 ? equipment.join(', ') : 'Bodyweight';
    const finalPrompt = PROMPT_TEMPLATE(equipmentList, focusArea);
    
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
        { role: 'user', content: `Generate a new viking-themed workout for me with a focus on ${focusArea}, using only the following equipment: ${equipmentList}.` },
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
