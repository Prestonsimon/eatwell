import { Recipe } from "../types";

export const generateRecipes = async (
  prompt: string, 
  imageBase64?: string
): Promise<Recipe[]> => {
  try {
    // 1. Debug: Confirm the data exists before sending
    console.log("📤 Sending Request:", { promptLength: prompt?.length, hasImage: !!imageBase64 });

    const response = await fetch("/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageBase64 })
    });

    // 2. Enhanced Error Handling
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error: any) {
    console.error("❌ Fetch Error:", error);
    // This allows your UI to show the actual reason (e.g., "API Key invalid")
    throw new Error(error.message || "Failed to generate recipes.");
  }
};