export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { prompt, imageBase64 } = await request.json();
    
    // Check if the key even exists in the environment
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from Cloudflare environment variables.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

    const payload = {
      // 1. System Instruction is its own top-level property
      system_instruction: {
        parts: [{ 
          text: "You are a world-class sustainable chef and nutritionist. Always suggest 3 distinct healthy recipes in JSON format. Prioritize seasonal and eco-friendly ingredients." 
        }]
      },
      // 2. The user's prompt and image
      contents: [
        {
          parts: imageBase64 
            ? [
                { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
                { text: "Analyze these ingredients: " + prompt }
              ]
            : [{ text: prompt }]
        }
      ],
      // 3. Config only handles the "how", not the "what"
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // ERROR HANDLING: If Google returns an error, pass it through to your logs
    if (result.error) {
      return new Response(JSON.stringify({ error: result.error.message }), { status: 400 });
    }

    let textOutput = result.candidates[0].content.parts[0].text;
    
    // CLEANING: Strip markdown if Gemini sends it (very common)
    textOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();

    return new Response(textOutput, {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    // This will now show up in your Cloudflare Log Stream!
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}