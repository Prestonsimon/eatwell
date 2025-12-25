import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for structured recipe output
const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      cookingTime: { type: Type.STRING },
      difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
      calories: { type: Type.INTEGER },
      servings: { type: Type.INTEGER, description: "The approximate number of servings this recipe makes." },
      sustainabilityScore: { 
        type: Type.INTEGER, 
        description: "A score from 1 to 10 indicating how environmentally friendly this recipe is (10 is best)." 
      },
      ecoTip: { 
        type: Type.STRING, 
        description: "A short sentence explaining why this meal is sustainable or how to make it greener." 
      },
      ingredients: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      instructions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["title", "description", "cookingTime", "sustainabilityScore", "ingredients", "instructions", "ecoTip", "servings", "calories", "difficulty"],
  },
};

export const generateRecipes = async (
  prompt: string, 
  imageBase64?: string
): Promise<Recipe[]> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG for simplicity from the file input handler
          data: imageBase64
        }
      });
      parts.push({
        text: "Analyze these ingredients/food items. " + prompt
      });
    } else {
      parts.push({ text: prompt });
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction: "You are a world-class sustainable chef and nutritionist. Your goal is to suggest modern, healthy, and eco-friendly recipes. Always provide exactly 3 distinct recipe suggestions in every response. Always include the number of servings. Always prioritize seasonal produce, low-carbon footprint ingredients, and global flavors.",
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text) as Recipe[];
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate recipes. Please try again.");
  }
};