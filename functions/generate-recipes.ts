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

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;

    const payload = {
      contents: {
        parts: imageBase64 
          ? [
              { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
              { text: "Analyze these ingredients/food items. " + prompt }
            ]
          : [{ text: prompt }]
      },
      generationConfig: {
        systemInstruction: {
          parts: [{ text: "You are a world-class sustainable chef. Return exactly 3 recipes in JSON format." }]
        },
        responseMimeType: "application/json"
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