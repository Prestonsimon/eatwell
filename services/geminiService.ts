import { Recipe } from "../types";

export const generateRecipes = async (prompt: string, imageBase64?: string): Promise<Recipe[]> => {
  try {
    const response = await fetch("/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageBase64 })
    });

    const data = await response.json();

    // If data is an error object or not an array, return an empty array
    if (!Array.isArray(data)) {
      console.error("API did not return an array:", data);
      return []; 
    }

    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    return []; // Always return an array to prevent .slice() crashes
  }
};