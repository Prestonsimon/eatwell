import { Recipe, DailyPlan } from "../types";

// --- 1. Generate Individual Recipes (The "Three Cards" View) ---
export const generateRecipes = async (prompt: string, imageBase64?: string): Promise<Recipe[]> => {
  try {
    const response = await fetch("/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageBase64 })
    });

    if (!response.ok) throw new Error("Server responded with an error");
    
    const data = await response.json();

    // Find the array (Gemini might return a raw array or { recipes: [...] })
    const rawRecipes = Array.isArray(data) ? data : (data.recipes || data.plan || []);

    // Sanitize each recipe to prevent "undefined" errors in the UI
    return rawRecipes.map((recipe: any) => ({
      title: recipe.title || "Untitled Recipe",
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      calories: recipe.calories || 0,
      cookingTime: recipe.cookingTime || "20 mins",
      difficulty: recipe.difficulty || "Easy",
      description: recipe.description || "",
      sustainabilityScore: recipe.sustainabilityScore || 10,
      tags: Array.isArray(recipe.tags) ? recipe.tags : [],
      ecoTip: recipe.ecoTip || ""
    })) as Recipe[];

  } catch (error) {
    console.error("Recipe Fetch Error:", error);
    return []; 
  }
};

// --- 2. Generate Full 5-Day Meal Plan ---
export const generateMealPlan = async (): Promise<DailyPlan[]> => {
  const prompt = `Create a 5-day work week meal plan (Monday to Friday).
For each day: Breakfast, Lunch, Snack, Dinner. 
Focus: High protein, low calorie, sustainable, low waste. 
IMPORTANT: Return ONLY raw JSON array of 5 objects, no extra text. 
Keep instructions very short (max 2 sentences per meal).`;

  try {
    const response = await fetch("/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) throw new Error("Model overloaded or server error");

    const data = await response.json();
    
    const rawPlan = Array.isArray(data) ? data : (data.plan || data.meals || data.weeklyPlan || []);

    if (!Array.isArray(rawPlan) || rawPlan.length === 0) {
      console.error("API did not return a valid meal plan array:", data);
      return [];
    }

    return rawPlan.map((day: any) => {
      const createPlaceholder = (title: string) => ({
        title: title,
        ingredients: [],
        instructions: ["Recipe details pending..."],
        calories: 0,
        difficulty: "Easy",
        sustainabilityScore: 10,
        tags: ["Planned"],
        description: "",
        cookingTime: "15 mins",
        ecoTip: "Eat fresh!"
      });

      return {
        day: day.day || "Work Day",
        breakfast: day.breakfast || createPlaceholder("Healthy Breakfast"),
        lunch: day.lunch || createPlaceholder("Balanced Lunch"),
        snack: day.snack || createPlaceholder("Quick Snack"),
        dinner: day.dinner || createPlaceholder("Nutritious Dinner")
      };
    }) as DailyPlan[];

  } catch (error) {
    console.error("Meal Plan Fetch Error:", error);
    return [];
  }
};