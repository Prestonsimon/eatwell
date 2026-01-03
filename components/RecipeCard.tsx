
import React, { useState } from 'react';
import { Recipe } from '../types';
import { Clock, BarChart, Leaf, ChevronRight, Flame, Copy, Check } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onViewRecipe }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyIngredients = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ingredientList = recipe.ingredients.join('\n');
    navigator.clipboard.writeText(ingredientList).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full">
      {/* Decorative Header (Color coded by sustainability) */}
      <div className={`h-3 w-full ${
        recipe.sustainabilityScore >= 8 ? 'bg-emerald-500' : 
        recipe.sustainabilityScore >= 5 ? 'bg-yellow-500' : 'bg-orange-500'
      }`} />
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 flex-wrap">
            {(recipe?.tags || []).length > 0 && 
            recipe.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs font-semibold px-2 py-1 bg-stone-100 text-stone-600 rounded-full">
                {tag}
              </span>
            ))
            }
          </div>
          {/* Added'?' to sustainability score to prevent crash if missing */}
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold" title="Sustainability Score">
            <Leaf size={12} />
            <span>{recipe?.sustainabilityScore || 0}/10</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-stone-800 mb-2 leading-tight group-hover:text-emerald-700 transition-colors">
          {recipe.title}
        </h3>
        <p className="text-stone-500 text-sm mb-6 line-clamp-3">
          {recipe.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 border-t border-b border-stone-100 py-4">
          <div className="flex flex-col items-center justify-center text-center">
            <Clock size={16} className="text-stone-400 mb-1" />
            <span className="text-xs font-semibold text-stone-700">{recipe.cookingTime}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-l border-r border-stone-100">
            <BarChart size={16} className="text-stone-400 mb-1" />
            <span className="text-xs font-semibold text-stone-700">{recipe.difficulty}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <Flame size={16} className="text-stone-400 mb-1" />
            <span className="text-xs font-semibold text-stone-700">{recipe.calories} kcal</span>
          </div>
        </div>
        
        <div className="bg-emerald-50/50 p-3 rounded-lg mb-6">
          <p className="text-xs text-emerald-800 italic flex gap-2 items-start">
            <Leaf size={14} className="mt-0.5 flex-shrink-0" />
            "{recipe.ecoTip}"
          </p>
        </div>

        <div className="mt-auto">
             {/* Ingredients Preview */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Ingredients</h4>
                <button 
                  onClick={handleCopyIngredients}
                  className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${copied ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'}`}
                  title="Copy ingredients to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={12} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy List</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-stone-600 truncate">
                {recipe.ingredients.slice(0, 4).join(', ')} {recipe.ingredients.length > 4 && `+${recipe.ingredients.length - 4} more`}
              </p>
            </div>

            <button 
              onClick={() => onViewRecipe(recipe)}
              className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 group-hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              View Full Recipe <ChevronRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};