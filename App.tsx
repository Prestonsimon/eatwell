import React, { useState } from 'react';
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

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceDefinition | null>(null);

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    navigateTo(ViewState.RECIPE_DETAILS);
  };

  const handleViewResource = (resource: ResourceDefinition) => {
    setSelectedResource(resource);
    navigateTo(ViewState.RESOURCE_DETAILS);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Navigation */}
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
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <button onClick={() => navigateTo(ViewState.HOME)} className={`text-sm font-semibold leading-6 ${view === ViewState.HOME ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600 transition-colors'}`}>Home</button>
            <button onClick={() => navigateTo(ViewState.KITCHEN)} className={`text-sm font-semibold leading-6 ${view === ViewState.KITCHEN || view === ViewState.RECIPE_DETAILS ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600 transition-colors'}`}>AI Kitchen</button>
            <button onClick={() => navigateTo(ViewState.RESOURCES)} className={`text-sm font-semibold leading-6 ${view === ViewState.RESOURCES || view === ViewState.RESOURCE_DETAILS ? 'text-emerald-600' : 'text-stone-900 hover:text-emerald-600 transition-colors'}`}>Resources</button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
             <button className="text-sm font-semibold leading-6 text-stone-900 flex items-center gap-2">
                <Globe size={16} /> EN
             </button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-xl py-6 px-4 flex flex-col gap-4">
            <button onClick={() => navigateTo(ViewState.HOME)} className="text-base font-semibold text-stone-900 py-2 text-left">Home</button>
            <button onClick={() => navigateTo(ViewState.KITCHEN)} className="text-base font-semibold text-stone-900 py-2 text-left">AI Kitchen</button>
            <button onClick={() => navigateTo(ViewState.RESOURCES)} className="text-base font-semibold text-stone-900 py-2 text-left">Resources</button>
          </div>
        )}
      </header>

      <main className="pt-20">
        {view === ViewState.HOME && (
          <Hero 
            onStart={() => navigateTo(ViewState.KITCHEN)} 
            onViewManifesto={() => navigateTo(ViewState.MANIFESTO)} 
          />
        )}
        
        {view === ViewState.KITCHEN && (
          <AiKitchen 
            recipes={recipes} 
            setRecipes={setRecipes} 
            onViewRecipe={handleViewRecipe}
          />
        )}

        {view === ViewState.RECIPE_DETAILS && selectedRecipe && (
          <RecipeDetails 
            recipe={selectedRecipe} 
            onBack={() => navigateTo(ViewState.KITCHEN)} 
          />
        )}

        {view === ViewState.RESOURCES && (
          <Resources onViewResource={handleViewResource} />
        )}

        {view === ViewState.RESOURCE_DETAILS && selectedResource && (
          <ResourceDetails 
            resource={selectedResource} 
            onBack={() => navigateTo(ViewState.RESOURCES)} 
          />
        )}

        {view === ViewState.MANIFESTO && (
          <Manifesto onBack={() => navigateTo(ViewState.HOME)} />
        )}

        {view === ViewState.PRIVACY && (
          <PrivacyPolicy onBack={() => navigateTo(ViewState.HOME)} />
        )}

        {view === ViewState.TERMS && (
          <TermsOfService onBack={() => navigateTo(ViewState.HOME)} />
        )}
      </main>

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
            &copy; 2025 Eatwell World. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;