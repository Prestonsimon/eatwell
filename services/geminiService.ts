import { Recipe, DailyPlan } from "../types"; // Added DailyPlan to imports

// --- 1. Generate Individual Recipes ---
export const generateRecipes = async (prompt: string, imageBase64?: string): Promise<Recipe[]> => {
  try {
    const response = await fetch("/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageBase64 })
    });

    if (!response.ok) throw new Error("Server responded with an error");
    
    const data = await response.json();

    // Standardize the response to always return an array
    const recipes = Array.isArray(data) ? data : (data.recipes || []);

    return recipes;
  } catch (error) {
    console.error("Recipe Fetch Error:", error);
    return []; 
  }
};

// --- 2. Generate full 7 day meal plan ---
export const generateMealPlan = async (): Promise<DailyPlan[]> => {
  const prompt = `Create a 7-day healthy and sustainable meal plan. 
  For each day, provide Breakfast, Lunch, Snack, and Dinner. 
  Requirements: High protein, low calorie, easy to prepare, and eco-friendly ingredients. 
  IMPORTANT: Return ONLY a raw JSON array of 7 objects. 
  Be concise with instructions. Use bullet points. Do not include introductory text.
  Focyus on speed and accuracy
  Each object must have this structure: 
  { 
    "day": "Monday", 
    "breakfast": { "title": "...", "ingredients": [...], "instructions": [...], "calories": 400, "difficulty": "Easy", "sustainabilityScore": 8, "tags": ["High Protein"], "description": "...", "cookingTime": "15 mins", "ecoTip": "..." },
    "lunch": { ... },
    "snack": { ... },
    "dinner": { ... }
  }`;
   
  try {
    // Note: Calling the standard recipe endpoint but passing the meal plan prompt
    const response = await fetch("/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) throw new Error("Model overloaded or server error");

    const data = await response.json();
    
    // Safety checks to ensure the data matches the DailyPlan[] structure
    if (Array.isArray(data)) {
      return data as DailyPlan[];
    }
    
    if (data.plan && Array.isArray(data.plan)) {
      return data.plan as DailyPlan[];
    }

    console.error("API did not return a valid meal plan array:", data);
    return [];
  } catch (error) {
    console.error("Meal Plan Fetch Error:", error);
    return [];
  }
};