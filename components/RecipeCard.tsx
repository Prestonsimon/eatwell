import React, { useState } from 'react';
import { Recipe } from '../types';
import { Clock, BarChart, Leaf, ChevronRight, Flame, Copy, Check, Plus, Bookmark } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: (recipe: Recipe) => void;
  onSaveToPlan: (day: string, mealType: string, recipe: Recipe) => void; // Added
  onToggleSave: (recipe: Recipe) => void; // Added for the Recipe Book
  isSaved?: boolean; // Added to show state
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onViewRecipe, 
  onSaveToPlan, 
  onToggleSave,
  isSaved = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');

  const handleCopyIngredients = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ingredientList = recipe.ingredients.join('\n');
    navigator.clipboard.writeText(ingredientList).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAddToPlan = (mealType: string) => {
    if (!selectedDay) {
      alert("Please select a day first!");
      return;
    }
    onSaveToPlan(selectedDay, mealType.toLowerCase(), recipe);
    setSelectedDay(''); // Reset after adding
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full">
      <div className={`h-2 w-full ${
        (recipe.sustainabilityScore || 0) >= 8 ? 'bg-emerald-500' : 
        (recipe.sustainabilityScore || 0) >= 5 ? 'bg-yellow-500' : 'bg-orange-500'
      }`} />
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 flex-wrap">
            {(recipe?.tags || []).slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-stone-100 text-stone-600 rounded-md">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">
            <Leaf size={12} />
            <span>{recipe?.sustainabilityScore || 0}/10</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-stone-800 mb-2 leading-tight group-hover:text-emerald-700 transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-stone-500 text-sm mb-6 line-clamp-2">
          {recipe.description}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6 border-y border-stone-50 py-3">
          <div className="flex flex-col items-center border-r border-stone-100">
            <Clock size={14} className="text-stone-400 mb-1" />
            <span className="text-[10px] font-bold text-stone-700 uppercase">{recipe.cookingTime}</span>
          </div>
          <div className="flex flex-col items-center border-r border-stone-100">
            <BarChart size={14} className="text-stone-400 mb-1" />
            <span className="text-[10px] font-bold text-stone-700 uppercase">{recipe.difficulty}</span>
          </div>
          <div className="flex flex-col items-center">
            <Flame size={14} className="text-stone-400 mb-1" />
            <span className="text-[10px] font-bold text-stone-700 uppercase">{recipe.calories} kcal</span>
          </div>
        </div>

        {/* Planner Actions */}
        <div className="bg-stone-50 p-4 rounded-xl mb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 mb-1">
            <Plus size={14} className="text-emerald-600" /> ADD TO WEEKLY PLAN
          </div>
          
          <div className="flex flex-col gap-2">
            <select 
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-white border border-stone-200 p-2 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Choose Day...</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                <button
                  key={type}
                  disabled={!selectedDay}
                  onClick={() => handleAddToPlan(type)}
                  className="bg-white border border-stone-200 p-2 rounded-lg text-[10px] font-bold text-stone-600 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50 disabled:hover:border-stone-200 disabled:hover:text-stone-600 transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3">
            <div className="flex gap-2">
              <button 
                onClick={() => onToggleSave(recipe)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSaved 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? 'Saved' : 'Save Book'}
              </button>
              
              <button 
                onClick={handleCopyIngredients}
                className="px-3 py-2 rounded-xl border border-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                title="Copy Ingredients"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </button>
            </div>

            <button 
              onClick={() => onViewRecipe(recipe)}
              className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-sm"
            >
              View Full Recipe <ChevronRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};