import React from 'react';
import { Loader2, Zap, Leaf, Utensils } from 'lucide-react';

export const MealPlanLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fadeIn">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl animate-pulse" />
        <div className="relative bg-white p-8 rounded-full shadow-xl border border-emerald-50">
          <Utensils size={48} className="text-emerald-600 animate-bounce" />
        </div>
        <Loader2 size={80} className="absolute -top-4 -left-4 text-emerald-200 animate-spin-slow" />
      </div>
      
      <h2 className="text-2xl font-bold text-stone-900 mb-3">Our AI Chef is drafting your week...</h2>
      <p className="text-stone-500 max-w-md mx-auto mb-8">
        We're calculating protein macros and sourcing sustainable ingredients for all 28 meals.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex items-center gap-3 text-sm font-medium text-stone-600 bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
          <Zap size={18} className="text-orange-500" /> Balancing high-protein ratios
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-stone-600 bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
          <Leaf size={18} className="text-emerald-500" /> Checking eco-impact scores
        </div>
      </div>
    </div>
  );
};