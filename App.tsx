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
import { SavedRecipes } from './components/SavedRecipes';
import { MealPlanView } from './components/MealPlanView'; // Added import
import { ViewState, Recipe, ResourceDefinition, DailyPlan } from './types';
import { UtensilsCrossed, Menu, X, Globe } from 'lucide-react';
import { generateRecipes, generateMealPlan } from './services/geminiService'; // Added import
import ReactGA from "react-ga4";

const App: React.FC = () => {
  // --- 1. State Declarations ---
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<DailyPlan[]>([]); // Consolidated state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceDefinition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // -- Saved recipes state with fail-safe initialization ---
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('eatwell-saved-Recipes');
      const parsed = saved ? JSON.parse(saved) : [];
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
    const gaId = (import.meta as any).env.VITE_GA_ID;
    if (gaId) {
      ReactGA.initialize(gaId);
      ReactGA.send({ hitType: "pageview", page: "/home", title: "Home Page" });
    }
  }, []);

  // --- 3. Navigation Logic ---
  const navigateTo = (newView: ViewState) => {
    setView(newView);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);

    ReactGA.send({ 
      hitType: "pageview", 
      page: `/${newView.toLowerCase().replace('_', '-')}`,
      title: newView 
    });
  };

  // --- 4. Handler Logic ---
  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    navigateTo(ViewState.RECIPE_DETAILS);
  };

  const handleViewResource = (resource: ResourceDefinition) => {
    setSelectedResource(resource);
    navigateTo(ViewState.RESOURCE_DETAILS);
  };

  const handleGenerate = async (prompt: string, imageBase64?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateRecipes(prompt, imageBase64);
      if (data && data.length > 0) {
        setRecipes(data);
      }
    } catch (err: any) {
      const errorMsg = err.message || err.toString();
      if (errorMsg.includes("overloaded")) {
        setError("Our AI chefs are currently overwhelmed! Please try again in a few moments.");
      } else {
        setError("Oops, something went wrong. Please check your ingredients and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMealPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateMealPlan();
      if (plan && plan.length > 0) {
        setCurrentMealPlan(plan);
        navigateTo(ViewState.MEAL_PLAN);
      } else {
        setError("Failed to generate plan. Please try again.");
      }
    } catch (err) {
      setError("AI model is currently busy. Try again in a minute.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllRecipes = (newRecipes: Recipe[]) => {
    setSavedRecipes((prev) => {
      const existingTitles = new Set(prev.map(r => r.title));
      const uniqueNew = newRecipes.filter(r => !existingTitles.has(r.title));
      return [...prev, ...uniqueNew];
    });
    alert(`${newRecipes.length} recipes added to your kitchen!`);
  };

  const handleToggleSave = (recipe: Recipe) => {
    setSavedRecipes((prev) => {
      const isAlreadySaved = prev.some((r) => r.title === recipe.title);
      if (isAlreadySaved) {
        return prev.filter((r) => r.title !== recipe.title);
      } else {
        return [...prev, recipe];
      }
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo(ViewState.HOME); }} className="flex items-center gap-2 group">
              <div className="bg-stone-900 text-white p-1.5 rounded-lg group-hover:bg-emerald-600 transition-colors">
                <UtensilsCrossed size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">eatwell<span className="text-emerald-600">.world</span></span>
            </a>
          </div>
          
          <div className="flex lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2.5 text-stone-700">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12 items-center">
            <button onClick={() => navigateTo(ViewState.HOME)} className={`text-sm font-semibold ${view === ViewState.HOME ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600'}`}>Home</button>
            <button onClick={() => navigateTo(ViewState.KITCHEN)} className={`text-sm font-semibold ${view === ViewState.KITCHEN || view === ViewState.RECIPE_DETAILS ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600'}`}>AI Kitchen</button>
            <button onClick={() => navigateTo(ViewState.RESOURCES)} className={`text-sm font-semibold ${view === ViewState.RESOURCES ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600'}`}>Resources</button>
            <button onClick={() => navigateTo(ViewState.SAVED_RECIPES)} className={`text-sm font-semibold ${view === ViewState.SAVED_RECIPES ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600'}`}>Saved ({savedRecipes.length})</button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <Globe size={16} /> EN
            </button>
          </div>
        </nav>
        
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 py-6 px-4 flex flex-col gap-4">
            <button onClick={() => navigateTo(ViewState.HOME)} className="text-base font-semibold text-left">Home</button>
            <button onClick={() => navigateTo(ViewState.KITCHEN)} className="text-base font-semibold text-left">AI Kitchen</button>
            <button onClick={() => navigateTo(ViewState.RESOURCES)} className="text-base font-semibold text-left">Resources</button>
            <button onClick={() => navigateTo(ViewState.SAVED_RECIPES)} className="text-base font-semibold text-left">Saved ({savedRecipes.length})</button>
          </div>
        )}
      </header>

      {/* Main View Router */}
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
            onGenerateMealPlan={handleGenerateMealPlan} // Added connection
            isLoading={loading}
            error={error}
          />
        )}

        {view === ViewState.MEAL_PLAN && currentMealPlan.length > 0 && (
          <MealPlanView 
            plan={currentMealPlan}
            onViewRecipe={handleViewRecipe}
            onSaveAll={handleSaveAllRecipes}
            onBack={() => navigateTo(ViewState.KITCHEN)}
          />
        )}

        {view === ViewState.RECIPE_DETAILS && selectedRecipe && (
          <RecipeDetails 
            recipe={selectedRecipe}
            onBack={() => navigateTo(ViewState.KITCHEN)}
            onSave={() => handleToggleSave(selectedRecipe)}
            isSaved={savedRecipes.some((r) => r.title === selectedRecipe.title)}
          />
        )}

        {view === ViewState.RESOURCES && <Resources onViewResource={handleViewResource} />}

        {view === ViewState.RESOURCE_DETAILS && selectedResource && (
          <ResourceDetails resource={selectedResource} onBack={() => navigateTo(ViewState.RESOURCES)} />
        )}

        {view === ViewState.SAVED_RECIPES && (
          <SavedRecipes
            recipes={savedRecipes}
            onViewRecipe={handleViewRecipe}
            onGoToKitchen={() => navigateTo(ViewState.KITCHEN)}
          />
        )}

        {view === ViewState.MANIFESTO && <Manifesto onBack={() => navigateTo(ViewState.HOME)} />}
        {view === ViewState.PRIVACY && <PrivacyPolicy onBack={() => navigateTo(ViewState.HOME)} />}
        {view === ViewState.TERMS && <TermsOfService onBack={() => navigateTo(ViewState.HOME)} />}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-xs">
          &copy; 2026 Eatwell World. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;