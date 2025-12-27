export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { prompt, imageBase64 } = await request.json();
    
    // Cloudflare Functions use env.VARIABLE_NAME
    const API_KEY = env.GEMINI_API_KEY; 
    const MODEL = "gemini-2.0-flash"; // Using the stable 2025 version
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    // Reconstruct the exact payload from your original service
    const contents = {
      parts: imageBase64 
        ? [
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            { text: "Analyze these ingredients/food items. " + prompt }
          ]
        : [{ text: prompt }]
    };

    const generationConfig = {
      systemInstruction: {
        parts: [{ text: "You are a world-class sustainable chef and nutritionist. Suggest 3 distinct eco-friendly recipes in JSON format." }]
      },
      responseMimeType: "application/json",
      // Note: We pass the schema here to ensure structured output
      responseSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            cookingTime: { type: "string" },
            difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
            calories: { type: "integer" },
            servings: { type: "integer" },
            sustainabilityScore: { type: "integer" },
            ecoTip: { type: "string" },
            ingredients: { type: "array", items: { type: "string" } },
            instructions: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } }
          },
          required: ["title", "description", "cookingTime", "ingredients", "instructions", "ecoTip"]
        }
      }
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, generationConfig })
    });

    const result = await response.json();
    
    // Extract just the text content to send back to the frontend
    const textOutput = result.candidates[0].content.parts[0].text;
    
    return new Response(textOutput, {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}