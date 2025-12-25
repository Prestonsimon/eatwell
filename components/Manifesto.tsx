import React from 'react';
import { ArrowLeft, Globe, Heart, Leaf, Zap, Sprout } from 'lucide-react';

interface ManifestoProps {
  onBack: () => void;
}

export const Manifesto: React.FC<ManifestoProps> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-semibold mb-12 transition-colors"
      >
        <div className="bg-white p-2 rounded-full border border-stone-200 group-hover:border-emerald-200 shadow-sm">
          <ArrowLeft size={20} />
        </div>
        Back to Home
      </button>

      {/* Hero Section of Manifesto */}
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>
        <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Mission</span>
        <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-8 tracking-tight">
          The Eatwell <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Manifesto</span>
        </h1>
        <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-light">
          We believe that every meal is a step towards the world we all deserve to live in. 
          Nourishing our bodies and healing our planet are not separate missions—they are one and the same.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="bg-white p-10 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Leaf size={120} />
          </div>
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <Leaf size={28} />
          </div>
          <h3 className="text-2xl font-bold text-stone-900 mb-4">Nature is the Ultimate Chef</h3>
          <p className="text-stone-600 leading-relaxed text-lg">
            We prioritize whole, seasonal, and plant-forward ingredients not just because they are sustainable, but because they taste better. We believe in reconnecting with the rhythms of the earth through the food on our plates.
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} />
          </div>
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
            <Zap size={28} />
          </div>
          <h3 className="text-2xl font-bold text-stone-900 mb-4">Technology for Good</h3>
          <p className="text-stone-600 leading-relaxed text-lg">
            Artificial Intelligence shouldn't replace the joy of cooking; it should empower it. We use technology to solve the "what's for dinner?" dilemma, reduce household food waste, and make sustainable choices accessible to everyone.
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={120} />
          </div>
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Globe size={28} />
          </div>
          <h3 className="text-2xl font-bold text-stone-900 mb-4">Global Flavor, Local Footprint</h3>
          <p className="text-stone-600 leading-relaxed text-lg">
            We celebrate the diversity of global cuisine while advocating for local sourcing. Exploring the world through taste shouldn't cost the earth. We find creative ways to bring global flavors to your table using ingredients grown near you.
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Heart size={120} />
          </div>
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
            <Heart size={28} />
          </div>
          <h3 className="text-2xl font-bold text-stone-900 mb-4">Progress Over Perfection</h3>
          <p className="text-stone-600 leading-relaxed text-lg">
            Zero waste is a goal, not a requirement for entry. We believe that millions of people cooking imperfectly sustainable meals is better than a handful doing it perfectly. Small changes in our daily habits add up to massive global impact.
          </p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-stone-900 text-stone-300 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
        <div className="relative z-10">
          <Sprout size={48} className="mx-auto text-emerald-500 mb-8" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Join the Movement</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-stone-400">
            Eatwell.world isn't just a tool; it's a community of conscious eaters. 
            Together, we are redefining the future of food, one delicious recipe at a time.
          </p>
          <div className="inline-block border-t border-stone-700 pt-8 mt-4">
            <p className="font-display text-2xl text-white italic">Eatwell</p>
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mb-20"></div>
      </div>
    </div>
  );
};