import React from 'react';
import { Recipe, ViewState } from '../types';
import { Bookmark, Utensils, ArrowRight } from 'lucide-react';

interface SavedRecipesProps {
  recipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
  onGoToKitchen: () => void;
}

export const SavedRecipes: React.FC<SavedRecipesProps> = ({ recipes, onViewRecipe, onGoToKitchen }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fadeIn">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 mb-2">My Saved Recipes</h1>
          <p className="text-stone-500">Your personal collection of sustainable meals.</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl">
          <Bookmark className="text-emerald-600" size={32} />
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200">
          <Utensils size={48} className="mx-auto text-stone-300 mb-4" />
          <h3 className="text-xl font-semibold text-stone-900 mb-2">Your kitchen is empty</h3>
          <p className="text-stone-500 mb-8 max-w-xs mx-auto">Head to the AI Kitchen to generate and save your favorite recipes.</p>
          <button 
            onClick={onGoToKitchen}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-500 transition-all"
          >
            Start Cooking <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <div 
              key={index}
              onClick={() => onViewRecipe(recipe)}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {recipe.difficulty}
                  </span>
                  <span className="text-stone-400 text-xs font-medium">{recipe.cookingTime}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-600 transition-colors mb-2">
                  {recipe.title}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2 mb-6">
                  {recipe.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-tighter">
                    Eco Score: {recipe.sustainabilityScore}/10
                  </span>
                  <ArrowRight size={18} className="text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};