import React, { useState, useRef } from 'react';
import { Camera, Search, Loader2, Sparkles, X, Leaf, Calendar } from 'lucide-react'; 
import { RecipeCard } from './RecipeCard';
import { Recipe } from '../types';

interface AiKitchenProps {
  recipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
  onGenerate: (prompt: string, imageBase64?: string) => void;
  onGenerateMealPlan: () => void; 
  isLoading: boolean;
  error: string | null;
}

export const AiKitchen: React.FC<AiKitchenProps> = ({ 
  recipes, 
  onViewRecipe, 
  onGenerate,
  onGenerateMealPlan, 
  isLoading, 
  error 
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setSelectedImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateClick = () => {
    const finalPrompt = inputText.trim() || "Suggest sustainable recipes based on current seasonal ingredients.";
    onGenerate(finalPrompt, selectedImage || undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Your AI Sustainable Kitchen</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Tell us what you have, or upload a photo of your fridge contents. 
        </p>
      </div>

      {/* Main Input Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-16 border border-stone-100 max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          
          {selectedImage && (
            <div className="relative w-full h-48 bg-stone-100 rounded-xl overflow-hidden mb-2">
              <img 
                src={`data:image/jpeg;base64,${selectedImage}`} 
                alt="Selected ingredients" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={clearImage}
                className="absolute top-4 right-4 bg-white/90 text-stone-800 p-2 rounded-full shadow-sm hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Desktop Sidebar Layout */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left: Input Area */}
            <div className="flex-grow relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type ingredients (e.g. carrots, ginger, oats) or dietary goals..."
                className="w-full h-full min-h-[200px] p-6 pr-12 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-lg"
              />
              <Sparkles className="absolute top-6 right-6 text-emerald-400 opacity-50" />
            </div>

            {/* Right: Action Sidebar */}
            <div className="flex flex-col gap-3 min-w-[240px]">
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 font-semibold transition-all ${
                  selectedImage ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Camera size={20} />
                <span>{selectedImage ? 'Change Photo' : 'Add Photo'}</span>
              </button>
              
              <button 
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-200/50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                <span>Generate Recipes</span>
              </button>

              <div className="h-px bg-stone-100 my-2" />

              <button
                onClick={onGenerateMealPlan}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-1 px-6 py-4 bg-white text-emerald-700 border-2 border-emerald-100 rounded-xl font-bold hover:bg-emerald-50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span>5-Day Work Week</span>
                </div>
                <span className="text-[10px] text-emerald-600/70 font-medium uppercase tracking-wider">Plan Mon - Fri</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center mb-8 max-w-2xl mx-auto border border-red-100">
          {error}
        </div>
      )}

      {/* Results Grid */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} onViewRecipe={onViewRecipe} />
          ))}
        </div>
      )}

      {/* Empty State / Features */}
      {!isLoading && recipes.length === 0 && !error && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
            <div className="p-6 bg-white rounded-2xl border border-stone-100 text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={24} />
              </div>
              <h4 className="font-bold text-stone-900 mb-2">Snap your Fridge</h4>
              <p className="text-sm text-stone-500">Upload a photo and let AI identify your ingredients.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-stone-100 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf size={24} />
              </div>
              <h4 className="font-bold text-stone-900 mb-2">Eco-Friendly</h4>
              <p className="text-sm text-stone-500">Prioritizing low-carbon, plant-forward meal suggestions.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-stone-100 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} />
              </div>
              <h4 className="font-bold text-stone-900 mb-2">Quick Planning</h4>
              <p className="text-sm text-stone-500">Get a balanced 5-day work week schedule in seconds.</p>
            </div>
          </div>
      )}
    </div>
  );
};