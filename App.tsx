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
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <main className="flex-grow">
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
        
        {view === ViewState.RESOURCE_DETAILS && selectedResource && (
          <ResourceDetails 
            resource={selectedResource} 
            onBack={() => navigateTo(ViewState.HOME)} 
          />
        )}

        {view === ViewState.RECIPE_DETAILS && selectedRecipe && (
          <RecipeDetails 
            recipe={selectedRecipe} 
            onBack={() => navigateTo(ViewState.KITCHEN)} 
          />
        )}

        {/* Legal Pages */}
        {view === ViewState.PRIVACY && <PrivacyPolicy onBack={() => navigateTo(ViewState.HOME)} />}
        {view === ViewState.TERMS && <TermsOfService onBack={() => navigateTo(ViewState.HOME)} />}
        {view === ViewState.MANIFESTO && <Manifesto onBack={() => navigateTo(ViewState.HOME)} />}
      </main>

      {/* Your Footer here */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo Group */}
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="text-emerald-600" size={20} />
              <span className="font-bold text-stone-900">Eatwell</span>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-6 text-sm text-stone-500">
              <button onClick={() => navigateTo(ViewState.PRIVACY)} className="hover:text-emerald-600">Privacy</button>
              <button onClick={() => navigateTo(ViewState.TERMS)} className="hover:text-emerald-600">Terms</button>
              <button onClick={() => navigateTo(ViewState.MANIFESTO)} className="hover:text-emerald-600">Manifesto</button>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => navigateTo(ViewState.HOME)} 
              className="px-6 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              Explore More
            </button>

          </div>
          <p className="mt-8 text-xs text-stone-400">© 2026 Eatwell AI. Sustainable cooking for all.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;