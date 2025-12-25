import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onViewManifesto: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart, onViewManifesto }) => {
  return (
    <div className="relative overflow-hidden bg-stone-50 py-24 sm:py-32">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-stone-600 ring-1 ring-stone-900/10 hover:ring-stone-900/20 bg-white/50 backdrop-blur-sm cursor-pointer transition-all" onClick={onViewManifesto}>
              Reimagining global nutrition with AI. <span className="font-semibold text-emerald-600"><span className="absolute inset-0" aria-hidden="true"></span>Read our manifesto <span aria-hidden="true">&rarr;</span></span>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl mb-6">
            Eat well for your body, <br/>
            <span className="text-emerald-600">and the world.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-stone-600 mb-10">
            Discover personalized, sustainable recipes tailored to your ingredients and lifestyle. Join the movement towards a healthier planet, one meal at a time.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <button
              onClick={onStart}
              className="rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              Open Your AI Kitchen <ArrowRight size={18} />
            </button>
            <button onClick={onViewManifesto} className="text-sm font-semibold leading-6 text-stone-900 flex items-center gap-1 group">
              <Globe size={16} className="text-stone-400 group-hover:text-emerald-600 transition-colors" />
              Our Mission
            </button>
          </div>
        </div>
      </div>

      {/* Stats/Social Proof */}
      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8 border-t border-stone-200 pt-12">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {[
            { id: 1, name: 'Recipes Generated', value: '10k+' },
            { id: 2, name: 'Adverts on this site', value: 'Zero' },
            { id: 3, name: 'Happy Users', value: '98%' },
          ].map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-stone-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};