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
import { MealPlanView } from './components/MealPlanView';
import { ViewState, Recipe, ResourceDefinition, DailyPlan } from './types';
import { UtensilsCrossed, Menu, X, Loader2 } from 'lucide-react';
import { generateRecipes, generateMealPlan } from './services/geminiService';
import ReactGA from "react-ga4";

const App: React.FC = () => {
  // --- 1. State Declarations ---
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<DailyPlan[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceDefinition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Weekly Planner Workspace state
  const [weeklyPlanner, setWeeklyPlanner] = useState<{
    [key: string]: { breakfast?: Recipe; lunch?: Recipe; dinner?: Recipe; snack?: Recipe }
  }>({
    Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {}, Saturday: {}, Sunday: {}
  });

  // Saved recipes state (Local Storage)
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('eatwell-saved-recipes');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('eatwell-saved-recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  // --- 2. Analytics ---
  useEffect(() => {
    const gaId = (import.meta as any).env.VITE_GA_ID;
    if (gaId) {
      ReactGA.initialize(gaId);
      ReactGA.send({ hitType: "pageview", page: "/home", title: "Home Page" });
    }
  }, []);

  // --- 3. Navigation ---
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

  // --- 4. Handlers ---
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
      setError("Oops, something went wrong. Please check your ingredients and try again.");
    } finally {
      setLoading(false);
    }
  };

  // DASHBOARD HANDLER: Generates 3 options for a specific meal type
  const handleGenerateMealPlan = async (type?: string) => {
    setLoading(true);
    setError(null);
    try {
      // If a type is provided (e.g. 'breakfast'), generate 3 individual recipes for the dashboard
      if (type && typeof type === 'string') {
        const prompt = `Generate 3 distinct, high-protein, sustainable ${type} recipes. Focus on seasonal ingredients and low waste.`;
        const data = await generateRecipes(prompt);
        if (data && data.length > 0) {
          setRecipes(data);
        }
      } else {
        // Fallback to the full 5-day plan generator if no type is passed
        const plan = await generateMealPlan();
        if (plan && plan.length > 0) {
          setCurrentMealPlan(plan);
          navigateTo(ViewState.MEAL_PLAN);
        }
      }
    } catch (err) {
      setError("AI model is currently busy. Try again in a minute.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToPlan = (day: string, mealType: string, recipe: Recipe) => {
    setWeeklyPlanner(prev => ({
      ...prev,
      [day]: { ...prev[day], [mealType]: recipe }
    }));
    // Optional: notify the user or navigate to a planner view
  };

  const handleToggleSave = (recipe: Recipe) => {
    setSavedRecipes((prev) => {
      const isAlreadySaved = prev.some((r) => r.title === recipe.title);
      return isAlreadySaved 
        ? prev.filter((r) => r.title !== recipe.title) 
        : [...prev, recipe];
    });
  };

  const handleSaveAllRecipes = (newRecipes: Recipe[]) => {
    setSavedRecipes((prev) => {
      const existingTitles = new Set(prev.map(r => r.title));
      const uniqueNew = newRecipes.filter(r => !existingTitles.has(r.title));
      return [...prev, ...uniqueNew];
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <div className="flex lg:flex-1">
            <button onClick={() => navigateTo(ViewState.HOME)} className="flex items-center gap-2 group">
              <div className="bg-stone-900 text-white p-1.5 rounded-lg group-hover:bg-emerald-600 transition-colors">
                <UtensilsCrossed size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-stone-900">eatwell<span className="text-emerald-600">.world</span></span>
            </button>
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
        </nav>
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
            onGenerateMealPlan={handleGenerateMealPlan}
            onSaveToPlan={handleSaveToPlan}
            weeklyPlanner={weeklyPlanner}
            isLoading={loading}
            error={error}
          />
        )}

        {view === ViewState.MEAL_PLAN && !loading && currentMealPlan.length > 0 && (
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
          <SavedRecipes recipes={savedRecipes} onViewRecipe={handleViewRecipe} onGoToKitchen={() => navigateTo(ViewState.KITCHEN)} />
        )}
        {view === ViewState.MANIFESTO && <Manifesto onBack={() => navigateTo(ViewState.HOME)} />}
        {view === ViewState.PRIVACY && <PrivacyPolicy onBack={() => navigateTo(ViewState.HOME)} />}
        {view === ViewState.TERMS && <TermsOfService onBack={() => navigateTo(ViewState.HOME)} />}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-xs">
          &copy; 2026 Eatwell World. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;