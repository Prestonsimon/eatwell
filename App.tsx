import './index.css';
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Hero } from './components/Hero';
import { AiKitchen } from './components/AiKitchen';
import { Resources } from './components/Resources';
import { RecipeDetails } from './components/RecipeDetails';
import { ResourceDetails } from './components/ResourceDetails';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { Manifesto } from './components/Manifesto';
import { ViewState, Recipe, ResourceDefinition } from './types';
import { UtensilsCrossed, Menu, X, Globe } from 'lucide-react';
import { generateRecipes } from './services/geminiService';
import ReactGA from "react-ga4"; // Analytics Import

function App() {
  // --- 1. State Declarations ---
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceDefinition | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- 2. Analytics Initialization ---
  useEffect(() => {
    // Vite will look for an environment variable named VITE_GA_ID
    const gaId = (import.meta as any).env.VITE_GA_ID;

    if (gaId) {
      ReactGA.initialize(gaId);
      ReactGA.send({ hitType: "pageview", page: "/home", title: "Home Page" });
    } else {
      console.warn("Google Analytics ID not found. Skipping initialization.");
    }
  }, []);

  // --- 3. Navigation & Analytics Logic ---
  const navigateTo = (newView: ViewState) => {
    setView(newView);
    setIsMenuOpen(false); // Ensure this matches your state name
    window.scrollTo(0, 0);

    // Track "Virtual" Page View
    ReactGA.send({ 
      hitType: "pageview", 
      page: `/${newView.toLowerCase().replace('_', '-')}`,
      title: newView 
    });
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    navigateTo(ViewState.RECIPE_DETAILS);

    // Track which specific recipe is being opened
    ReactGA.event({
      category: "Engagement",
      action: "Viewed Recipe Details",
      label: recipe.title
    });
  };

  const handleViewResource = (resource: ResourceDefinition) => {
    setSelectedResource(resource);
    navigateTo(ViewState.RESOURCE_DETAILS);

    // Track which resource is being opened
    ReactGA.event({
      category: "Engagement",
      action: "Viewed Resource",
      label: resource.title
    });
  };

  const handleGenerate = async (prompt: string, imageBase64?: string) => {
    // 1. Send the event to Google analytics 
    // Track that the AI was triggered for specific ingredients
    ReactGA.event({
      category: "Recipe Generation",
      action: "Ingredients Submitted",
      label: prompt, //This sends the actual text (eg kake, carrots etc
    });

    setLoading(true);
    setError(null);

    try {
      const data = await generateRecipes(prompt, imageBase64);
      
      if (data && data.length > 0) {
        setRecipes(data);
        // Track successful recipe generation
        ReactGA.event({
          category: "Recipe Generation",
          action: "Generation Success",
          value: data.length 
          // Tracks how many
        });
      }
    } catch (err) {
      // Track when AI fails
      ReactGA.event({
        category: "Recipe Generation",
        action: "Generation Error",
        label: err instanceof Error ? err.message : 'Unknown error'
      });
      setError("Failed to generate recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <main>
        {view === ViewState.HOME && <Hero onStart={() => navigateTo(ViewState.KITCHEN)} />}
        
        {view === ViewState.KITCHEN && (
          <AiKitchen 
            onGenerate={handleGenerate} 
            onViewRecipe={handleViewRecipe}
            recipes={recipes}
            isLoading={loading}
            error={error}
          />
        )}
        
        {view === ViewState.RESOURCES && selectedRecipe && (
          <RecipeDetails 
            recipe={selectedRecipe} 
            onBack={() => navigateTo(ViewState.KITCHEN)} 
          />
        )}

        {view === ViewState.RECIPE_DETAILS && selectedRecipe && (
          <RecipeDetails 
            recipe={selectedRecipe} 
            onBack={() => navigateTo(ViewState.KITCHEN)} 
          />
        )}

        {/* ... Other view conditions (Privacy, Terms, etc.) */}
      </main>

      {/* Your Footer here */}
    </div>
  );
}

export default App;