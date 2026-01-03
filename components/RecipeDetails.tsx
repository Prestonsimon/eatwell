import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import { Clock, BarChart, Leaf, ArrowLeft, Flame, Copy, Check, Users, Plus, Minus } from 'lucide-react';

interface RecipeDetailsProps {
  recipe: Recipe;
  onBack: () => void;
}

/**
 * Utility to scale numeric values in a string based on a multiplier.
 * Handles integers, decimals, and simple fractions (e.g., 1/2).
 */
const scaleQuantity = (text: string, multiplier: number): string => {
  // Regex matches: 
  // 1. Fractions like 1/2, 3/4
  // 2. Decimals like 1.5, 0.75
  // 3. Integers like 1, 2, 10
  const numberRegex = /(\d+\/\d+|\d+\.\d+|\d+)/g;

  return text.replace(numberRegex, (match) => {
    let value: number;
    if (match.includes('/')) {
      const [num, den] = match.split('/').map(Number);
      value = num / den;
    } else {
      value = parseFloat(match);
    }

    const scaled = value * multiplier;
    
    // Format the number:
    // If it's a whole number, return as is.
    // Otherwise, limit to 2 decimal places and remove trailing zeros.
    return Number(scaled.toFixed(2)).toString();
  });
};

export const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [currentServings, setCurrentServings] = useState(recipe.servings || 2);

  const multiplier = useMemo(() => {
    const base = recipe.servings || 2;
    return currentServings / base;
  }, [currentServings, recipe.servings]);

  const handleCopyIngredients = () => {
    const scaledList = recipe.ingredients.map(ing => scaleQuantity(ing, multiplier)).join('\n');
    navigator.clipboard.writeText(scaledList).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleIngredient = (idx: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(idx)) {
      newChecked.delete(idx);
    } else {
      newChecked.add(idx);
    }
    setCheckedIngredients(newChecked);
  };

  const adjustServings = (delta: number) => {
    setCurrentServings(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-semibold mb-8 transition-colors"
      >
        <div className="bg-white p-2 rounded-full border border-stone-200 group-hover:border-emerald-200 shadow-sm">
          <ArrowLeft size={20} />
        </div>
        Back to Kitchen
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        {/* Header Section */}
        <div className="bg-stone-900 text-white p-8 md:p-12 relative overflow-hidden">
           {/* Abstract BG */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-900/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
           
           <div className="relative z-10">
             <div className="flex gap-2 mb-6">
                {recipe.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs font-bold tracking-wider uppercase px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                    {tag}
                  </span>
                ))}
             </div>
             <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight font-display">{recipe.title}</h1>
             <p className="text-stone-300 text-lg leading-relaxed max-w-2xl mb-8">
               {recipe.description}
             </p>

             <div className="flex flex-wrap gap-6 md:gap-12 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                   <Clock className="text-emerald-400" size={24} />
                   <div>
                     <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">Time</p>
                     <p className="font-semibold">{recipe.cookingTime}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <BarChart className="text-orange-400" size={24} />
                   <div>
                     <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">Difficulty</p>
                     <p className="font-semibold">{recipe.difficulty}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <Flame className="text-red-400" size={24} />
                   <div>
                     <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">Calories</p>
                     <p className="font-semibold">{Math.round(recipe.calories * multiplier)} kcal</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <Leaf className="text-emerald-500" size={24} />
                   <div>
                     <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">Eco Score</p>
                     <p className="font-semibold text-emerald-400">{recipe.sustainabilityScore}/10</p>
                   </div>
                </div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
           {/* Sidebar / Ingredients */}
           <div className="md:col-span-4 bg-stone-50 p-8 border-r border-stone-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-stone-900">Ingredients</h3>
                <span className="text-xs font-normal text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">{(recipe?.ingredients || []).length} items</span>
              </div>

              {/* Interactive Servings Control */}
              <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Adjust Portions</span>
                  <Users size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => adjustServings(-1)}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-stone-800">{currentServings}</span>
                    <span className="block text-[10px] text-stone-500 font-medium">Servings</span>
                  </div>
                  <button 
                    onClick={() => adjustServings(1)}
                    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleCopyIngredients}
                className={`w-full mb-6 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all duration-200 ${
                  copied 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                  : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied Scaled List</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Ingredients</span>
                  </>
                )}
              </button>

              <ul className="space-y-4">
                {/* 🛡️ Guard: Ensure ingredients is an array before mapping */}
                {(recipe?.ingredients || []).length > 0 ? (
                  recipe.ingredients.map((ingredient, idx) => (
                  <li 
                    key={idx}
                    onClick={() => toggleIngredient && toggleIngredient(idx)}
                    className="flex items-start gap-3 text-stone-700 pb-3 border-b border-stone-100 last:border-0 cursor-pointer group/item transition-colors"
                  >
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                      checkedIngredients.has(idx) 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-stone-300 group-hover/item:border-emerald-400 bg-white'
                    }`}>
                      {checkedIngredients.has(idx) && <Check size={14} strokeWidth={3} />}
                    </div>

                    {/* 🛡️ Guard: Ensure ingredient string exists before scaling */}
                    <span className={`leading-snug transition-all ${checkedIngredients?.has(idx) ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                      {ingredient ? scaleQuantity(ingredient, multiplier) : "Unknown Ingredient"}
                    </span>
                  </li>
                ))
                ) : (
                  /*Fallback if Ingredients are missing */
                  <li className="text-stone-400 italic py-4">
                    No ingredients available for this recipe.
                  </li>
                )}
              </ul>

              <div className="mt-8 bg-emerald-100/50 p-6 rounded-2xl border border-emerald-100">
                <div className="flex items-start gap-3 mb-2">
                  <Leaf className="text-emerald-600 mt-1" size={20} />
                  <h4 className="font-bold text-emerald-800">Top Tip</h4>
                </div>
                <p className="text-sm text-emerald-800/80 leading-relaxed italic">
                  "{recipe.ecoTip}"
                </p>
              </div>
           </div>

           {/* Main Content / Instructions */}
           <div className="md:col-span-8 p-8 md:p-12">
              <h3 className="text-2xl font-bold text-stone-900 mb-8">Instructions</h3>
              <div className="space-y-8">
                {/* 🛡️ Defensive Check: Ensure instructions exist and are an array */}
                {(recipe?.instructions || []).length > 0 ? (
                  recipe.instructions.map((step, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-stone-100 text-stone-900 font-bold flex items-center justify-center border-2 border-transparent group-hover:border-emerald-500 group-hover:text-emerald-600 transition-all">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-lg text-stone-800 leading-relaxed pt-1">
                        {step}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                /* Fallback UI: Shows if instructions are missing instead of crashing */
                <div className="p-4 bg-stone-50 rounded-lg text-stone-500 italic">
                  Instructions are not available for this recipe.
                </div>
              )}
              </div>
              
              <div className="mt-16 pt-8 border-t border-stone-100 flex items-center justify-between">
                 <div className="text-stone-500 text-sm">
                   Enjoy and eat well! 🌱
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};