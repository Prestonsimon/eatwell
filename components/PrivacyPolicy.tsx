import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-semibold mb-8 transition-colors"
      >
        <div className="bg-white p-2 rounded-full border border-stone-200 group-hover:border-emerald-200 shadow-sm">
          <ArrowLeft size={20} />
        </div>
        Back to Home
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 border-b border-stone-100 pb-8">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <h1 className="text-3xl font-bold text-stone-900">Privacy Policy</h1>
        </div>

        <div className="prose prose-stone max-w-none text-stone-600">
          <p className="text-sm text-stone-400 mb-6">Last Updated: May 15, 2025</p>

          <p className="mb-6">
            At <strong>eatwell.world</strong> ("we," "our," or "us"), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and AI-powered services.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">1. Information We Collect</h3>
          <p className="mb-4">
            We collect information that you voluntarily provide to us when using our services:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>User Inputs:</strong> Ingredients, dietary preferences, and text prompts you enter into our AI Kitchen.</li>
            <li><strong>Images:</strong> Photos of food items or refrigerator contents that you upload for analysis.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website, such as recipes viewed and time spent on pages.</li>
          </ul>

          <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">2. How We Use Your Information</h3>
          <p className="mb-4">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>AI Analysis:</strong> To analyze your uploaded images and text inputs using third-party AI models (e.g., Google Gemini) to generate relevant recipes.</li>
            <li><strong>Service Improvement:</strong> To improve the accuracy of our recipe generation and sustainability scores.</li>
            <li><strong>Communication:</strong> To respond to your inquiries or support requests.</li>
          </ul>

          <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">3. Third-Party Services</h3>
          <p className="mb-4">
            We utilize third-party AI providers to process your requests. When you use the "Generate Recipes" feature:
          </p>
          <p className="mb-4">
            Your text prompts and image data are transmitted securely to our AI partners (including Google) for processing. These providers are bound by their own privacy policies and data protection agreements. We do not sell your personal data to advertisers.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">4. Data Security</h3>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the Internet is 100% secure.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">5. Cookies</h3>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on our service and hold certain information to enhance your user experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">6. Changes to This Policy</h3>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-8 mb-4">7. Contact Us</h3>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at: <br/>
            <span className="text-emerald-600 font-semibold">privacy@eatwell.world</span>
          </p>
        </div>
      </div>
    </div>
  );
};