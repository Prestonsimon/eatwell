import React, { useState, useRef } from 'react';
import { Camera, Search, Loader2, Sparkles, X, Leaf } from 'lucide-react';
import { RecipeCard } from './RecipeCard';
import { Recipe } from '../types';

interface AiKitchenProps {
  onGenerate: (prompt: string, image?: string) => Promise<void>;
  onViewRecipe: (recipe: Recipe) => void;
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
}

export const AiKitchen: React.FC<AiKitchenProps> = ({ 
  recipes, 
  onViewRecipe, 
  onGenerate, 
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

  // ✅ FIXED: This now just calls the "Boss" (App.tsx)
  const handleGenerateClick = async () => {
    if (!inputText && !selectedImage) return;
    
    // We send the data up to App.tsx, which handles the loading, 
    // the API call, and the Google Analytics event.
    const prompt = inputText || "Suggest exactly 3 sustainable recipes based on these ingredients.";
    await onGenerate(prompt, selectedImage || undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Your AI Sustainable Kitchen</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Tell us what you have, or upload a photo of your fridge contents. 
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-16 border border-stone-100 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          
          {selectedImage && (
            <div className="relative w-full h-48 sm:h-64 bg-stone-100 rounded-xl overflow-hidden mb-2 group">
              <img 
                src={`data:image/jpeg;base64,${selectedImage}`} 
                alt="Selected ingredients" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <button 
                  onClick={clearImage}
                  className="bg-white/90 text-stone-800 px-4 py-2 rounded-full font-medium shadow-sm hover:bg-white hover:text-red-600 transition-colors flex items-center gap-2"
                >
                  <X size={16} /> Remove Image
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type ingredients..."
                className="w-full h-full min-h-[120px] md:min-h-[80px] p-4 pr-12 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <Sparkles className="absolute top-4 right-4 text-emerald-400 opacity-50" />
            </div>

            <div className="flex flex-row md:flex-col gap-3 min-w-[200px]">
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 font-semibold transition-all ${selectedImage ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-600'}`}
              >
                <Camera size={20} />
                <span className="text-sm">Add Photo</span>
              </button>
              
              <button 
                onClick={handleGenerateClick} // ✅ Use the new simplified click handler
                disabled={isLoading || (!inputText && !selectedImage)}
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 text-white rounded-xl font-bold transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                <span>Generate Recipes</span>
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

      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} onViewRecipe={onViewRecipe} />
          ))}
        </div>
      )}

      {!isLoading && recipes.length === 0 && !error && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
            <div className="p-6 bg-white rounded-2xl border border-stone-100 text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={24} />
              </div>
              <h4 className="font-bold text-stone-900 mb-2">Snap your Fridge</h4>
              <p className="text-sm text-stone-500">Take a photo of your open fridge or pantry shelf. AI identifies ingredients automatically.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-stone-100 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf size={24} />
              </div>
              <h4 className="font-bold text-stone-900 mb-2">Sustainable Swaps</h4>
              <p className="text-sm text-stone-500">We prioritize low-carbon ingredients and suggest eco-friendly alternatives.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-stone-100 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} />
              </div>
              <h4 className="font-bold text-stone-900 mb-2">Chef Quality</h4>
              <p className="text-sm text-stone-500">Recipes crafted to be nutritionally balanced and restaurant-quality delicious.</p>
            </div>
          </div>
      )}
    </div>
  );
};