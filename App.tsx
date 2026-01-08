import './index.css';

import React, { useState, useEffect } from 'react';
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
import { SavedRecipes } from './components/SavedRecipes';
import ReactGA from "react-ga4";

const App: React.FC = () => {
  // --- 1. State Declarations ---
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceDefinition | null>(null);
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // -- Saved recipes state ---
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    //check if browser has saved recipes from a previous session
   try {
    const saved = localStorage.getItem('eatwell-saved-Recipes');
    const parsed = saved ? JSON.parse(saved) : [];
    // 🛡️ Safety Check: If it's not an array, return empty array
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
});

  // --- Auto save to Browser Storage ---
  useEffect(() => {
  localStorage.setItem('eatwell-saved-Recipes', JSON.stringify(savedRecipes));
}, [savedRecipes]);

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
    } catch (err: any) {
      // Track when AI fails
      if (err.message?.includes("overloaded") || (err.toString().includes("overloaded"))) {
        setError("Our AI chefs are currently overwhelmed with orders! Please try again in a few moments.");
      } else {
        setError("Oops something went wrong. Please check your ingredients and try again.");
      }
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

  const handleToggleSave = (recipe: Recipe) => {
      setSavedRecipes((prev) => {
        const isAlreadSaved = prev.some((r) => r.title === recipe.title);
        if (isAlreadSaved) {
          // Remove it (unsave)
          return prev.filter((r) => r.title !== recipe.title);
        } else {
          // Add it (save)
          return [...prev, recipe];
        }
      });

    // Track in analytics
    ReactGA.event({
      category: "User Actions",
      action: "Toggled Save Recipe",
      label: recipe.title
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 flex flex-col">
      
      {/* Navigation - Exact Design Match */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 transition-all">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo(ViewState.HOME); }} className="-m-1.5 p-1.5 flex items-center gap-2 group">
              <div className="bg-stone-900 text-white p-1.5 rounded-lg group-hover:bg-emerald-600 transition-colors">
                <UtensilsCrossed size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">eatwell<span className="text-emerald-600">.world</span></span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <button onClick={() => navigateTo(ViewState.HOME)} className={`text-sm font-semibold leading-6 ${view === ViewState.HOME ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600 transition-colors'}`}>Home</button>
            <button onClick={() => navigateTo(ViewState.KITCHEN)} className={`text-sm font-semibold leading-6 ${view === ViewState.KITCHEN || view === ViewState.RECIPE_DETAILS ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600 transition-colors'}`}>AI Kitchen</button>
            <button onClick={() => navigateTo(ViewState.RESOURCES)} className={`text-sm font-semibold leading-6 ${view === ViewState.RESOURCES || view === ViewState.RESOURCE_DETAILS ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600 transition-colors'}`}>Resources</button>
            <button
              onClick={() => navigateTo(ViewState.SAVED_RECIPES)}
              className={`text-sm font-semibold leading-6 flex items-center gap-2 ${view === ViewState.SAVED_RECIPES ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600 transition-colors'}`}
            >
              Saved ({savedRecipes.length})
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
             <button className="text-sm font-semibold leading-6 text-stone-900 flex items-center gap-2">
                <Globe size={16} /> EN
             </button>
          </div>
        </nav>
        
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-xl py-6 px-4 flex flex-col gap-4">
            <button onClick={() => navigateTo(ViewState.HOME)} className="text-base font-semibold text-stone-900 py-2 text-left">Home</button>
            <button onClick={() => navigateTo(ViewState.KITCHEN)} className="text-base font-semibold text-stone-900 py-2 text-left">AI Kitchen</button>
            <button onClick={() => navigateTo(ViewState.RESOURCES)} className="text-base font-semibold text-stone-900 py-2 text-left">Resources</button>
          <button onClick={() => navigateTo(ViewState.SAVED_RECIPES)} className="text-base font-semibold text-stone-900 py-2 text-left">Saved ({SavedRecipes.length})</button>
          </div>
        )}
      </header>

      <main className="pt-20 flex-grow">
        {view === ViewState.HOME && (
          <Hero 
            onStart={() => navigateTo(ViewState.KITCHEN)} 
            onViewManifesto={() => navigateTo(ViewState.MANIFESTO)} 
          />
        )}
        
        {view === ViewState.KITCHEN && (
          <AiKitchen 
            recipes={recipes} 
            onViewRecipe={handleViewRecipe}
            onGenerate={handleGenerate}
            isLoading={loading}
            error={error}
          />
        )}

        {view === ViewState.RESOURCES && <Resources onViewResource={handleViewResource} />}

        {view === ViewState.RESOURCE_DETAILS && selectedResource && (
          <ResourceDetails 
            resource={selectedResource} 
            onBack={() => navigateTo(ViewState.RESOURCES)} 
          />
        )}

        {view === ViewState.SAVED_RECIPES && (
          <SavedRecipes
        recipes={savedRecipes}
        onViewRecipe={handleViewRecipe}
        onGoToKitchen={() => navigateTo(ViewState.KITCHEN)}
      />
        )}
        {/*update RECIPE_DETAILS to INCLUDE SAVED FUNCTIONALITY*/}
        {view === ViewState.RECIPE_DETAILS && selectedRecipe && (
          <RecipeDetails 
            recipe={selectedRecipe}
            onBack={() => navigateTo(ViewState.KITCHEN)}
            onSave={() => handleToggleSave(selectedRecipe)}
            isSaved={savedRecipes.some((r) => r.title === selectedRecipe.title)}
          />
        )}

        {view === ViewState.MANIFESTO && <Manifesto onBack={() => navigateTo(ViewState.HOME)} />}
        {view === ViewState.PRIVACY && <PrivacyPolicy onBack={() => navigateTo(ViewState.HOME)} />}
        {view === ViewState.TERMS && <TermsOfService onBack={() => navigateTo(ViewState.HOME)} />}
      </main>

      {/* Footer - Exact Design Match */}
      <footer className="bg-stone-900 text-stone-400 py-12 mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
             <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 text-white mb-4">
                  <UtensilsCrossed size={20} />
                  <span className="font-bold text-xl">eatwell.world</span>
                </div>
                <p className="text-sm leading-6">
                  Empowering humans to eat healthier for themselves and the planet through AI.
                </p>
             </div>
             <div>
                <h3 className="text-white font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-sm">
                   <li><button onClick={() => navigateTo(ViewState.KITCHEN)} className="hover:text-emerald-400 text-left">Kitchen AI</button></li>
                   <li><button onClick={() => navigateTo(ViewState.RESOURCES)} className="hover:text-emerald-400 text-left">Resources</button></li>
                </ul>
             </div>
             <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                   <li><button onClick={() => navigateTo(ViewState.MANIFESTO)} className="hover:text-emerald-400 text-left">About Us</button></li>
                </ul>
             </div>
             <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                   <li><button onClick={() => navigateTo(ViewState.PRIVACY)} className="hover:text-emerald-400 text-left">Privacy Policy</button></li>
                   <li><button onClick={() => navigateTo(ViewState.TERMS)} className="hover:text-emerald-400 text-left">Terms of Service</button></li>
                </ul>
             </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center text-xs">
            &copy; 2026 Eatwell World. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;