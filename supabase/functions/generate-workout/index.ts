
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
- Feel free to include time-based exercises like Planks, Wall Sit, Wall Balls when appropriate.
- Feel free to include distance-based exercises like Running, Rowing, Ski Erg, Skipping, Indoor Bike, Assault Bike, Bike when appropriate.
- Feel free to include weight+distance+time exercises like Sled Push, Sled Pull, Weighted Carry when appropriate.
- Each exercise should have 3 sets.
- For weight-based exercises: Reps should be between 8 and 15, weight should initially be 0.
- For time-based exercises: Include a "duration" field in seconds (typically 30-120 seconds), and set reps to 1.
- For distance-based exercises: Include both "duration" field in seconds and "distance" field in meters, and set reps to 1.
- For weight+distance+time exercises: Include "weight", "duration" in seconds, and "distance" in meters fields, and set reps to 1.
- For bodyweight exercises without weight: Set weight to 0, reps between 8 and 20.
- **CRITICAL: Use ONLY standard, recognizable exercise names. Do NOT add any creative, fantasy, or Norse-themed modifications to exercise names.** Examples of correct exercise names: "Bench Press", "Squat", "Deadlift", "Push-ups", "Pull-ups", "Bicep Curls", "Overhead Press", "Lunges", "Plank", "Running", "Rowing", "Ski Erg", "Skipping", "Wall Balls", "Bike", "Sled Push", "Sled Pull", "Weighted Carry", etc.
- Keep exercise names simple, standard, and exactly as they would appear in any fitness app or gym.
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Check rate limits
    const { data: rateLimitData, error: rateLimitError } = await supabaseClient.rpc(
      'check_workout_generation_rate_limit',
      { p_user_id: user.id }
    );

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      return new Response(JSON.stringify({ error: 'Rate limit check failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!rateLimitData.allowed) {
      const message = rateLimitData.hourly_count >= rateLimitData.hourly_limit
        ? `Rate limit exceeded: ${rateLimitData.hourly_limit} generations per hour. Try again in a few minutes.`
        : `Daily limit exceeded: ${rateLimitData.daily_limit} generations per day. Try again tomorrow.`;
      
      return new Response(JSON.stringify({ 
        error: message,
        limits: rateLimitData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      });
    }

    const body = await req.json();
    const equipment = body?.equipment;
    const focusArea = body?.focusArea || 'Full Body';

    // INPUT VALIDATION
    // Validate equipment is an array
    if (equipment && !Array.isArray(equipment)) {
      return new Response(JSON.stringify({ error: 'Equipment must be an array' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Validate equipment length limit
    if (equipment && equipment.length > 20) {
      return new Response(JSON.stringify({ error: 'Maximum 20 equipment items allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Validate each equipment item
    if (equipment) {
      for (const item of equipment) {
        if (typeof item !== 'string' || item.length > 50 || item.trim().length === 0) {
          return new Response(JSON.stringify({ error: 'Invalid equipment item' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }
      }
    }

    // Validate focus area
    const validFocusAreas = ['Full Body', 'Upper Body', 'Lower Body', 'Push', 'Pull', 'Legs'];
    if (focusArea && !validFocusAreas.includes(focusArea)) {
      return new Response(JSON.stringify({ error: 'Invalid focus area. Must be one of: ' + validFocusAreas.join(', ') }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const equipmentList = Array.isArray(equipment) && equipment.length > 0 ? equipment.join(', ') : 'Bodyweight';
    const finalPrompt = PROMPT_TEMPLATE(equipmentList, focusArea);

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
...
      }
    }

    // Log successful generation request
    await supabaseClient
      .from('workout_generation_requests')
      .insert({ 
        user_id: user.id,
        success: true 
      });

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
