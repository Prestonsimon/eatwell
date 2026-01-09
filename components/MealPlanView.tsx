import React from 'react';
import { DailyPlan, Recipe } from '../types';
import { Printer, Calendar, Save, Flame, Zap } from 'lucide-react';

interface MealPlanViewProps {
  plan: DailyPlan[];
  onViewRecipe: (recipe: Recipe) => void;
  onSaveAll: (recipes: Recipe[]) => void;
  onBack: () => void;
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({ plan, onViewRecipe, onSaveAll, onBack }) => {
  
  const handleSaveFullPlan = () => {
    const allRecipes = plan.flatMap(d => [d.breakfast, d.lunch, d.snack, d.dinner]);
    onSaveAll(allRecipes);
  };

  const handlePrint = () => {
    window.print(); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 mb-2 flex items-center gap-3">
            <Calendar className="text-emerald-600" /> Weekly Plan
          </h1>
          <p className="text-stone-500">High-protein, sustainable, and easy-to-prep meals.</p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-stone-700 px-6 py-3 rounded-full font-bold border border-stone-200 hover:bg-stone-50 transition-all no-print"
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
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-6">
        {plan.map((dayPlan, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-stone-200 flex-shrink-0 min-w-[280px] shadow-sm overflow-hidden">
            <div className="bg-stone-900 text-white py-3 text-center font-bold uppercase tracking-widest text-xs">
              {dayPlan.day}
            </div>
            <div className="p-4 space-y-6">
              {[
                { label: 'Breakfast', recipe: dayPlan.breakfast, color: 'bg-orange-50 text-orange-700' },
                { label: 'Lunch', recipe: dayPlan.lunch, color: 'bg-blue-50 text-blue-700' },
                { label: 'Snack', recipe: dayPlan.snack, color: 'bg-purple-50 text-purple-700' },
                { label: 'Dinner', recipe: dayPlan.dinner, color: 'bg-emerald-50 text-emerald-700' },
              ].map((meal, mIdx) => (
                <div key={mIdx} className="group cursor-pointer" onClick={() => onViewRecipe(meal.recipe)}>
                  <div className={`text-[10px] font-bold uppercase mb-1 px-2 py-0.5 rounded w-max ${meal.color}`}>
                    {meal.label}
                  </div>
                  <h4 className="font-bold text-stone-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {meal.recipe.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400 font-medium">
                    <span className="flex items-center gap-1"><Flame size={10}/> {meal.recipe.calories} kcal</span>
                    <span className="flex items-center gap-1"><Zap size={10}/> {meal.recipe.cookingTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};