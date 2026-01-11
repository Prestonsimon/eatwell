import { Recipe, DailyPlan } from "../types";

// --- 1. Generate Individual Recipes (Shared logic for all AI calls) ---
export const generateRecipes = async (prompt: string, imageBase64?: string): Promise<Recipe[]> => {
  try {
    const response = await fetch("/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageBase64 })
    });

    if (!response.ok) throw new Error("Server responded with an error");
    
    const data = await response.json();

    // Handle different possible JSON structures from AI
    const rawRecipes = Array.isArray(data) ? data : (data.recipes || data.plan || data.meals || []);

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

// --- 2. Dashboard Helper: Generate 3 specific meals for the Weekly Planner ---
// This aligns with your App.tsx handleGenerateMealPlan(type)
export const generateMealPlan = async (type: string): Promise<Recipe[]> => {
  const prompt = `Generate 3 distinct and creative ${type} recipes for a weekly meal plan.
  The recipes should be sustainable, high-protein, and easy to prepare.
  Return the results as a JSON array of 3 objects.`;
  
  // We reuse the robust logic in generateRecipes
  return await generateRecipes(prompt);
};