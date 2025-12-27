import { Recipe } from "../types";

export const generateRecipes = async (
  prompt: string, 
  imageBase64?: string
): Promise<Recipe[]> => {
  try {
    const response = await fetch("/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageBase64 })
    });

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();
    return data; // This will now be your clean Recipe array
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to generate recipes.");
  }
};