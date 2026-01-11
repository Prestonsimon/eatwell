import React, { useState } from 'react';
import { Recipe } from '../types';
import { 
  Printer, 
  Calendar, 
  Save, 
  Flame, 
  Zap, 
  ShoppingBag, 
  Copy, 
  Check, 
  ArrowLeft,
  CheckCircle2,
  UtensilsCrossed,
  Leaf
} from 'lucide-react';

interface MealPlanViewProps {
  // Updated to match the weeklyPlanner object structure from App.tsx
  planner: {
    [key: string]: { breakfast?: Recipe; lunch?: Recipe; dinner?: Recipe; snack?: Recipe }
  };
  onViewRecipe: (recipe: Recipe) => void;
  onSaveAll: (recipes: Recipe[]) => void;
  onBack: () => void;
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({ planner, onViewRecipe, onSaveAll, onBack }) => {
  const [copied, setCopied] = useState(false);
  const days = Object.keys(planner);

  const getActiveRecipes = (): Recipe[] => {
    return Object.values(planner).flatMap(day => 
      [day.breakfast, day.lunch, day.dinner, day.snack].filter((r): r is Recipe => Boolean(r && r.title))
    );
  };

  const handleSaveFullPlan = () => {
    onSaveAll(getActiveRecipes());
  };

  const handlePrint = () => window.print();

  const getShoppingList = (): string[] => {
    const cleanIngredient = (text: string): string => {
      return text
        .replace(/\d+\/\d+|\d+(\.\d+)?/g, '') 
        .replace(/\b(grams|g|kg|ml|l|oz|lb|cups|cup|tbsp|tsp|tablespoons|teaspoons|cloves|clove|pinch|handful|small|large|medium|can|cans|bottles|of|packed|to taste)\b/gi, '')
        .replace(/\([^)]*\)/g, '')
        .trim()
        .toLowerCase();
    };

    const allIngredients = getActiveRecipes().flatMap(recipe => recipe.ingredients || []);

    const cleanedList = allIngredients
      .filter((item): item is string => Boolean(item))
      .map((item: string) => cleanIngredient(item))
      .filter((item: string) => item.length > 2);

    return Array.from(new Set(cleanedList)).sort((a, b) => a.localeCompare(b));
  };

  const copyToClipboard = () => {
    const list = getShoppingList();
    const textToCopy = `🛒 MY WEEKLY SHOPPING LIST\n\n${list.map(item => `[ ] ${item.charAt(0).toUpperCase() + item.slice(1)}`).join('\n')}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  const currentShoppingList = getShoppingList();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <button onClick={onBack} className="text-emerald-600 font-semibold text-sm mb-2 hover:underline no-print flex items-center gap-1">
             <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-stone-900 mb-2 flex items-center gap-3">
            <Calendar className="text-emerald-600" /> Weekly Planner
          </h1>
          <p className="text-stone-500">Your personalized 7-day sustainable meal schedule.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-white text-stone-700 px-6 py-3 rounded-full font-bold border border-stone-200 hover:bg-stone-50 transition-all no-print shadow-sm">
            <Printer size={20} /> Export PDF
          </button>
          <button onClick={handleSaveFullPlan} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg no-print">
            <Save size={20} /> Save All to Recipe Book
          </button>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-16">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-stone-900 text-white py-3 text-center font-bold uppercase tracking-widest text-[10px]">
              {day}
            </div>
            <div className="p-3 space-y-4 flex-grow">
              {[
                { label: 'Breakfast', recipe: planner[day].breakfast, color: 'bg-orange-50 text-orange-700', icon: <Zap size={10}/> },
                { label: 'Lunch', recipe: planner[day].lunch, color: 'bg-blue-50 text-blue-700', icon: <UtensilsCrossed size={10}/> },
                { label: 'Dinner', recipe: planner[day].dinner, color: 'bg-emerald-50 text-emerald-700', icon: <ShoppingBag size={10}/> },
                { label: 'Snack', recipe: planner[day].snack, color: 'bg-purple-50 text-purple-700', icon: <Leaf size={10}/> },
              ].map((meal, mIdx) => (
                <div 
                  key={`${day}-${mIdx}`} 
                  className={`p-2 rounded-xl transition-all ${meal.recipe ? 'cursor-pointer hover:bg-stone-50 border border-transparent hover:border-stone-100' : 'opacity-40 border border-dashed border-stone-200'}`}
                  onClick={() => meal.recipe && onViewRecipe(meal.recipe)}
                >
                  <div className={`text-[9px] font-bold uppercase mb-1 px-1.5 py-0.5 rounded w-max ${meal.color}`}>
                    {meal.label}
                  </div>
                  <h4 className="font-bold text-stone-800 text-[11px] leading-tight line-clamp-2">
                    {meal.recipe?.title || "Empty"}
                  </h4>
                  {meal.recipe && (
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-stone-400 font-medium">
                       <span className="flex items-center gap-0.5"><Flame size={10}/> {meal.recipe.calories}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Shopping List */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-stone-100 pb-4 gap-4">
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
            <ShoppingBag className="text-emerald-600" /> Weekly Shopping List
          </h2>
          <div className="flex items-center gap-2 no-print">
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${
                copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-stone-600 border-stone-200'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy List'}
            </button>
          </div>
        </div>

        {currentShoppingList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
            {currentShoppingList.map((item, idx) => (
              <div key={`shop-${idx}`} className="flex items-start gap-3 group border-b border-stone-50 pb-2">
                <div className="mt-1 w-4 h-4 border-2 border-stone-200 rounded flex-shrink-0" />
                <span className="text-stone-700 capitalize text-sm">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-400 text-center py-8 italic">Add recipes to your plan to generate a shopping list.</p>
        )}
        
        <div className="mt-10 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm no-print">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <p>This list combined ingredients from all 7 days and removed measurement quantities.</p>
        </div>
      </div>
    </div>
  );
};