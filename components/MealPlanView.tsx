import React, { useState } from 'react';
import { DailyPlan, Recipe } from '../types';
import { 
  Printer, 
  Calendar, 
  Save, 
  Flame, 
  Zap, 
  ShoppingBag, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowLeft 
} from 'lucide-react';

interface MealPlanViewProps {
  plan: DailyPlan[];
  onViewRecipe: (recipe: Recipe) => void;
  onSaveAll: (recipes: Recipe[]) => void;
  onBack: () => void;
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({ plan, onViewRecipe, onSaveAll, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleSaveFullPlan = () => {
    const allRecipes = plan.flatMap(d => [d.breakfast, d.lunch, d.snack, d.dinner]);
    onSaveAll(allRecipes);
  };

  const handlePrint = () => {
    window.print(); 
  };

  // Logic to combine all ingredients into a unique list with type safety
  const getShoppingList = () => {
    const allIngredients = plan.flatMap(day => [
      ...(day.breakfast?.ingredients || []),
      ...(day.lunch?.ingredients || []),
      ...(day.snack?.ingredients || []),
      ...(day.dinner?.ingredients || [])
    ]);

    return Array.from(new Set(allIngredients.map(i => i?.toLowerCase().trim())))
      .filter((item): item is string => Boolean(item)) 
      .sort((a, b) => a.localeCompare(b));
  };

  // Function to format and copy the list to clipboard
  const copyToClipboard = () => {
    const list = getShoppingList();
    const textToCopy = `🛒 MY SHOPPING LIST\n\n${list.map(item => `[ ] ${item.charAt(0).toUpperCase() + item.slice(1)}`).join('\n')}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <button 
            onClick={onBack}
            className="text-emerald-600 font-semibold text-sm mb-2 hover:underline no-print flex items-center gap-1"
          >
             <ArrowLeft size={14} /> Back to Kitchen
          </button>
          <h1 className="text-4xl font-bold text-stone-900 mb-2 flex items-center gap-3">
            <Calendar className="text-emerald-600" /> 5-Day Work Week
          </h1>
          <p className="text-stone-500">Your high-protein, sustainable fuel for Monday through Friday.</p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-stone-700 px-6 py-3 rounded-full font-bold border border-stone-200 hover:bg-stone-50 transition-all no-print shadow-sm"
          >
            <Printer size={20} /> Export PDF
          </button>
          
          <button 
            onClick={handleSaveFullPlan}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50 no-print"
          >
            <Save size={20} /> Save All Recipes
          </button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
        {plan.map((dayPlan, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-stone-900 text-white py-3 text-center font-bold uppercase tracking-widest text-xs">
              {dayPlan.day}
            </div>
            <div className="p-4 space-y-6 flex-grow">
              {[
                { label: 'Breakfast', recipe: dayPlan.breakfast, color: 'bg-orange-50 text-orange-700' },
                { label: 'Lunch', recipe: dayPlan.lunch, color: 'bg-blue-50 text-blue-700' },
                { label: 'Snack', recipe: dayPlan.snack, color: 'bg-purple-50 text-purple-700' },
                { label: 'Dinner', recipe: dayPlan.dinner, color: 'bg-emerald-50 text-emerald-700' },
              ].map((meal, mIdx) => (
                <div key={mIdx} className="group cursor-pointer"
                // Only trigger if recipe exists
                onClick={() => meal.recipe && onViewRecipe(meal.recipe)}
                >
                  <div className={`text-[10px] font-bold uppercase mb-1 px-2 py-0.5 rounded w-max ${meal.color}`}>
      {meal.label}
    </div>
    <h4 className="font-bold text-stone-800 group-hover:text-emerald-600 transition-colors line-clamp-2 text-sm leading-tight">
      {/* Fallback to "Recipe Pending" if title is missing */}
      {meal.recipe?.title || "Recipe Selection"}
    </h4>
    <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400 font-medium">
      <span className="flex items-center gap-1"><Flame size={10}/> {meal.recipe?.calories || 0} kcal</span>
      <span className="flex items-center gap-1"><Zap size={10}/> {meal.recipe?.cookingTime || '15 min'}</span>
    </div>
  </div>
))}
            </div>
          </div>
        ))}
      </div>

      {/* Shopping List Section */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-stone-100 pb-4 gap-4">
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
            <ShoppingBag className="text-emerald-600" /> 
            Weekly Shopping List
          </h2>
          
          <div className="flex items-center gap-2 no-print">
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${
                copied 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy List'}
            </button>
            <span className="text-sm text-stone-500 font-medium bg-stone-100 px-3 py-1 rounded-full">
              {getShoppingList().length} Items
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
          {getShoppingList().map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 group border-b border-stone-50 pb-2">
              <div className="mt-1 w-4 h-4 border-2 border-stone-200 rounded flex-shrink-0 group-hover:border-emerald-500 transition-colors cursor-pointer" />
              <span className="text-stone-700 capitalize text-sm group-hover:text-stone-900 transition-colors">
                {item}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-10 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm no-print">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <p>List is automatically de-duplicated. Copy the list for your notes app or print for the store.</p>
        </div>
      </div>

      {/* Print-only Footer */}
      <div className="hidden print:block mt-12 text-center text-stone-400 text-xs">
        Generated by eatwell.world • Your Sustainable 5-Day Meal Plan
      </div>
    </div>
  );
};