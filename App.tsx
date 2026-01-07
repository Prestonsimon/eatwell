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
    {/* --- 1. THE HEADER (Persistent) --- */}
    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => navigateTo(ViewState.HOME)}
        >
          <div className="bg-emerald-600 p-1.5 rounded-lg text-white group-hover:bg-emerald-500 transition-colors">
            <UtensilsCrossed size={20} />
          </div>
          <span className="font-bold text-xl text-stone-900 tracking-tight">Eatwell</span>
        </div>
        
        {/* Simple Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigateTo(ViewState.KITCHEN)} className="text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors">AI Kitchen</button>
          <button onClick={() => navigateTo(ViewState.MANIFESTO)} className="text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors">Manifesto</button>
          <button 
            onClick={() => navigateTo(ViewState.KITCHEN)}
            className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-stone-800 transition-all"
          >
            Start Cooking
          </button>
        </div>
      </div>
    </nav>

    {/* --- 2. THE CONTENT (Changes based on View) --- */}
    <main className="flex-grow">
      {view === ViewState.HOME && (
        <Hero 
          onStart={() => navigateTo(ViewState.KITCHEN)} 
          onViewManifesto={() => navigateTo(ViewState.MANIFESTO)} 
        />
      )}
      
      {view === ViewState.KITCHEN && (
        <AiKitchen 
          onGenerate={handleGenerate} 
          onViewRecipe={handleViewRecipe}
          recipes={recipes}
          isLoading={loading}
          error={error}
        />
      )}
      
      {/* ... Other Views (RecipeDetails, Manifesto, etc.) */}
    </main>

    {/* --- 3. THE FOOTER (Persistent & Matches Hero Style) --- */}
    <footer className="bg-white border-t border-stone-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <UtensilsCrossed className="text-emerald-600" size={24} />
              <span className="font-bold text-2xl text-stone-900">Eatwell</span>
            </div>
            <p className="text-stone-600 text-lg leading-relaxed max-w-sm">
              Discover personalized, sustainable recipes tailored to your ingredients and lifestyle. 
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-4 text-stone-600">
              <li><button onClick={() => navigateTo(ViewState.HOME)} className="hover:text-emerald-600 transition-colors">Home</button></li>
              <li><button onClick={() => navigateTo(ViewState.KITCHEN)} className="hover:text-emerald-600 transition-colors">AI Kitchen</button></li>
              <li><button onClick={() => navigateTo(ViewState.MANIFESTO)} className="hover:text-emerald-600 transition-colors">Manifesto</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4 text-stone-600">
              <li><button onClick={() => navigateTo(ViewState.PRIVACY)} className="hover:text-emerald-600 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigateTo(ViewState.TERMS)} className="hover:text-emerald-600 transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-stone-500">
            © 2026 Eatwell AI. Built for a healthier planet.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-sm text-stone-500">
              <Globe size={16} className="text-emerald-600" /> Global Initiative
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
}export default App;