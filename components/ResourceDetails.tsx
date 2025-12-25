import React from 'react';
import { ResourceDefinition } from '../types';
import { ArrowLeft } from 'lucide-react';

interface ResourceDetailsProps {
  resource: ResourceDefinition;
  onBack: () => void;
}

export const ResourceDetails: React.FC<ResourceDetailsProps> = ({ resource, onBack }) => {
  const Icon = resource.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-semibold mb-8 transition-colors"
      >
        <div className="bg-white p-2 rounded-full border border-stone-200 group-hover:border-emerald-200 shadow-sm">
          <ArrowLeft size={20} />
        </div>
        Back to Resources
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        {/* Header */}
        <div className={`p-8 md:p-12 ${resource.color.replace('text-', 'bg-').replace('100', '50')} border-b border-stone-100`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm ${resource.color}`}>
            <Icon size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">{resource.title}</h1>
          <p className="text-lg text-stone-600 max-w-2xl leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
          <div className="prose prose-stone prose-lg max-w-none">
            <p className="text-xl text-stone-800 leading-relaxed mb-10 font-medium">
              {resource.content.intro}
            </p>

            {resource.content.sections.map((section, idx) => (
              <div key={idx} className="mb-10 last:mb-0">
                <h3 className="text-2xl font-bold text-stone-900 mb-4">{section.title}</h3>
                <p className="text-stone-600 leading-7 whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Call to Action */}
          <div className="mt-16 pt-8 border-t border-stone-100">
             <div className="bg-stone-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-3">
                  <button onClick={onBack} className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
                    Explore More
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};