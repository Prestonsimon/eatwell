import React, { useState, useRef } from 'react';
import { Recipe } from '../types';
import { 
  Sparkles, Camera, Search, Loader2, X, 
  ChevronRight, Calendar, Flame, ShoppingBag, 
  UtensilsCrossed, Leaf, Zap 
} from 'lucide-react';
import { RecipeCard } from './RecipeCard';

interface AiKitchenProps {
  recipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
  onGenerate: (prompt: string, imageBase64?: string) => void;
  onGenerateMealPlan: (type: string) => void;
  onSaveToPlan: (day: string, mealType: string, recipe: Recipe) => void;
  weeklyPlanner: any;
  isLoading: boolean;
  error: string | null;
}

export const AiKitchen: React.FC<AiKitchenProps> = ({ 
  recipes, onViewRecipe, onGenerate, onGenerateMealPlan, onSaveToPlan, isLoading, error 
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the data:image/jpeg;base64, prefix for the API
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-stone-900">
              <Sparkles size={18} className="text-emerald-600" /> AI Kitchen
            </h3>
            
            {selectedImage && (
              <div className="relative mb-4 rounded-xl overflow-hidden h-40 border border-stone-100">
                <img 
                  src={`data:image/jpeg;base64,${selectedImage}`} 
                  className="w-full h-full object-cover" 
                  alt="Upload preview"
                />
                <button 
                  onClick={() => setSelectedImage(null)} 
                  className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-white text-stone-600"
                >
                  <X size={14}/>
                </button>
              </div>
            )}

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="List your ingredients (e.g., 'Salmon, kale, lemon')..."
              className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm min-h-[120px] transition-all"
            />
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-stone-200 text-stone-600 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-xs font-bold"
              >
                <Camera size={16} /> {selectedImage ? 'Change' : 'Add Photo'}
              </button>
              <button 
                onClick={() => onGenerate(inputText, selectedImage || undefined)}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 p-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-emerald-600 disabled:bg-stone-300 transition-all text-xs shadow-lg"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16}/> : <Search size={16}/>} Generate
              </button>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>

          {/* MEAL PLAN GENERATORS */}
          <div className="bg-stone-900 p-6 rounded-3xl text-white shadow-xl">
            <div className="mb-6">
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-emerald-400 mb-1">Weekly Meal Plans</h3>
              <p className="text-[10px] text-stone-400">Generate 3 recipe options per category</p>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Breakfasts', type: 'breakfast', icon: <Zap size={16}/> },
                { label: 'Lunches', type: 'lunch', icon: <ShoppingBag size={16}/> },
                { label: 'Dinners', type: 'dinner', icon: <UtensilsCrossed size={16}/> },
                { label: 'Snacks', type: 'snack', icon: <Leaf size={16}/> },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => onGenerateMealPlan(btn.type)}
                  className="w-full flex items-center justify-between p-4 bg-stone-800/50 hover:bg-emerald-600/20 border border-stone-700 hover:border-emerald-500/50 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500">{btn.icon}</span>
                    <span className="font-semibold text-sm">{btn.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-stone-500 group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN: Recipe Cards Grid */}
        <div className="lg:col-span-8">
          {error && (
            <div className="bg-orange-50 text-orange-800 p-4 rounded-2xl mb-6 text-sm border border-orange-100">
              {error}
            </div>
          )}

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard 
                  key={`${recipe.title}-${index}`} 
                  recipe={recipe} 
                  onViewRecipe={onViewRecipe}
                  onSaveToPlan={onSaveToPlan}
                  onToggleSave={() => {}} // Pass actual function if you have it in App.tsx
                />
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[2rem] p-12 text-stone-400">
               <div className="bg-stone-100 p-6 rounded-full mb-6 text-stone-300">
                 <Zap size={48}/>
               </div>
               <h4 className="text-stone-900 font-bold mb-2">Ready to cook?</h4>
               <p className="text-center text-sm max-w-xs">
                 Upload a photo of your fridge or select a meal category to generate custom recipes.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};