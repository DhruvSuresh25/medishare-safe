import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!image) {
      throw new Error('No image provided');
    }

    console.log('Processing medicine image for OCR...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting medicine information from packaging labels. 
Extract the following fields from the medicine image:
- drug_name: The brand/trade name of the medicine
- generic_name: The generic/salt composition
- manufacturer: The company that made it
- batch_number: Batch or lot number
- expiry_date: In YYYY-MM-DD format if possible
- mrp: Maximum retail price (just the number)

Return ONLY a valid JSON object with these fields. If a field cannot be found, use an empty string.
Example: {"drug_name":"Crocin","generic_name":"Paracetamol 500mg","manufacturer":"GSK","batch_number":"B123","expiry_date":"2025-06","mrp":"25.50"}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract medicine information from this label image. Return only JSON.'
              },
              {
                type: 'image_url',
                image_url: { url: image }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('AI Response:', content);

    // Parse JSON from response
    let extracted = {
      drug_name: '',
      generic_name: '',
      manufacturer: '',
      batch_number: '',
      expiry_date: '',
      mrp: '',
    };

    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extracted = { ...extracted, ...JSON.parse(jsonMatch[0]) };
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    return new Response(JSON.stringify(extracted), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-medicine-data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});