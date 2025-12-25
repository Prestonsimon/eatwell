import React from 'react';
import { Calendar, Recycle, Tag, MapPin, Leaf, Droplets, ExternalLink } from 'lucide-react';
import { ResourceDefinition } from '../types';

interface ResourcesProps {
  onViewResource: (resource: ResourceDefinition) => void;
}

export const Resources: React.FC<ResourcesProps> = ({ onViewResource }) => {
  const resources: ResourceDefinition[] = [
    {
      title: "Seasonal Produce Guide",
      description: "Learn what's in season to maximize flavor and minimize transport emissions. Eating seasonally is one of the easiest ways to reduce your carbon footprint.",
      icon: Calendar,
      color: "bg-orange-100 text-orange-600",
      content: {
        intro: "Eating seasonally means consuming foods that are harvested at the same time of year you are eating them. This simple shift in habit connects you with the natural cycle of the earth and often results in fresher, tastier, and more nutritious meals.",
        sections: [
          {
            title: "Why Eat Seasonally?",
            body: "Produce that is in season is typically harvested at its peak ripeness, meaning it has more time to develop flavors and nutrients on the vine. \n\nFurthermore, seasonal food is often local food. When you buy out of season, that produce has likely been shipped from the other hemisphere, contributing significantly to greenhouse gas emissions through transport and cold storage."
          },
          {
            title: "Spring & Summer Highlights",
            body: "Spring is the time for tender greens like spinach, lettuce, and arugula. Look out for asparagus, peas, and radishes. \n\nSummer brings a bounty of color: tomatoes, peppers, zucchini, berries, stone fruits (peaches, plums), and corn are at their absolute best."
          },
          {
            title: "Fall & Winter Highlights",
            body: "As the weather cools, root vegetables take center stage. Carrots, sweet potatoes, beets, and parsnips are sweet and hearty. \n\nWinter is perfect for citrus fruits, hearty kale, collard greens, and winter squashes like butternut and acorn."
          }
        ]
      }
    },
    {
      title: "Zero Waste Kitchen",
      description: "Practical tips to reduce food waste, store ingredients properly to last longer, and compost effectively at home.",
      icon: Recycle,
      color: "bg-emerald-100 text-emerald-600",
      content: {
        intro: "The zero waste kitchen isn't about perfection; it's about making better choices. Roughly one-third of all food produced in the world for human consumption gets lost or wasted. We can change that, starting at home.",
        sections: [
          {
            title: "Shop Smart",
            body: "It starts before you cook. Check your pantry before you shop to avoid buying duplicates. Make a list and stick to it. Avoid impulse buys that you might not get around to eating."
          },
          {
            title: "Storage Solutions",
            body: "Learn to store your produce correctly. \n\n- Keep potatoes and onions separate; onions make potatoes sprout faster.\n- Store herbs like flowers: in a glass of water in the fridge.\n- Keep ethylene-producing fruits (bananas, apples) away from ethylene-sensitive veggies."
          },
          {
            title: "Love Your Leftovers",
            body: "Get creative with scraps. Vegetable peels can make a delicious stock. Stale bread makes excellent croutons or breadcrumbs. Overripe fruit is perfect for smoothies or baking."
          }
        ]
      }
    },
    {
      title: "Understanding Eco-Labels",
      description: "Decode certifications like Organic, Fair Trade, and Rainforest Alliance to make informed choices at the grocery store.",
      icon: Tag,
      color: "bg-blue-100 text-blue-600",
      content: {
        intro: "Grocery store aisles are filled with seals and certifications. It can be overwhelming to know what they all mean and which ones genuinely represent sustainable practices.",
        sections: [
          {
            title: "USDA Organic",
            body: "This seal indicates that the food was grown without synthetic fertilizers, sewage sludge, irradiation, or genetic engineering. It emphasizes farming practices that cycle resources, promote ecological balance, and conserve biodiversity."
          },
          {
            title: "Fair Trade Certified",
            body: "This certification focuses on the people behind the food. It ensures that farmers and workers were paid fair wages and worked in safe conditions. It also includes environmental standards restricting agrochemicals and GMOs."
          },
          {
            title: "Rainforest Alliance",
            body: "The green frog seal means a farm, forest, or tourism enterprise has been audited to meet standards that require environmental, social, and economic sustainability. It focuses heavily on biodiversity conservation."
          }
        ]
      }
    },
    {
      title: "Local Sourcing 101",
      description: "How to find and support local farmers markets and CSAs. Shortening the supply chain supports your local economy.",
      icon: MapPin,
      color: "bg-red-100 text-red-600",
      content: {
        intro: "Local sourcing is about closing the gap between the farm and your fork. It builds community, supports local economies, and guarantees freshness.",
        sections: [
          {
            title: "Farmers Markets",
            body: "Farmers markets are the best way to meet the people growing your food. You can ask questions about their farming practices directly. Bring cash and reusable bags!"
          },
          {
            title: "Community Supported Agriculture (CSA)",
            body: "A CSA is a subscription to a farm. You pay upfront for a share of the harvest, and receive a box of produce weekly. It shares the risk and reward of farming with the consumer and provides farmers with capital early in the season."
          },
          {
            title: "Benefits of Local",
            body: "Local food doesn't have to travel thousands of miles, reducing carbon emissions. It also preserves genetic diversity, as small local farms often grow heirloom varieties that large industrial farms do not."
          }
        ]
      }
    },
    {
      title: "Plant-Based Proteins",
      description: "A complete guide to getting enough protein without relying on meat, featuring lentils, beans, tofu, and more.",
      icon: Leaf,
      color: "bg-green-100 text-green-600",
      content: {
        intro: "Shifting towards plant-based proteins is one of the most impactful things you can do for the planet. But many people worry: will I get enough protein?",
        sections: [
          {
            title: "Legumes: The Powerhouses",
            body: "Lentils, chickpeas, black beans, and kidney beans are excellent sources of protein and fiber. They are soil-enriching crops that require far less water than livestock."
          },
          {
            title: "Soy Products",
            body: "Tofu, tempeh, and edamame are complete proteins, meaning they contain all nine essential amino acids. Tempeh is fermented, making it great for gut health."
          },
          {
            title: "Nuts and Seeds",
            body: "Hemp seeds, chia seeds, almonds, and walnuts pack a punch. They are great for snacking or adding texture to salads and oatmeal. Quinoa is another complete protein that cooks like a grain but is technically a seed."
          }
        ]
      }
    },
    {
      title: "Water Conservation",
      description: "Discover which foods have the highest water footprint and how to cook with water efficiency in mind.",
      icon: Droplets,
      color: "bg-cyan-100 text-cyan-600",
      content: {
        intro: "Fresh water is a finite resource. Agriculture accounts for about 70% of global freshwater withdrawals. Our food choices play a huge role in water conservation.",
        sections: [
          {
            title: "High vs. Low Water Footprint",
            body: "Beef has one of the highest water footprints (approx. 15,000 liters per kg). In contrast, vegetables like tomatoes or lettuce require a fraction of that. Nuts like almonds can be water-intensive, so moderation is key."
          },
          {
            title: "Cooking Methods",
            body: "Steaming vegetables uses less water (and retains more nutrients) than boiling. If you do boil, save the water! It's full of vitamins and can be used as a base for soups or to water plants once cooled."
          },
          {
            title: "Dietary Choices",
            body: "Generally, a plant-forward diet saves water. Reducing food waste is also critical—when we throw away food, we throw away all the water used to grow it."
          }
        ]
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Sustainability Resources</h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Deepen your knowledge about sustainable eating with our curated guides, tools, and educational materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource, idx) => (
          <div 
            key={idx} 
            onClick={() => onViewResource(resource)}
            className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${resource.color} transition-transform group-hover:scale-110 duration-300`}>
              <resource.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-emerald-600 transition-colors">
              {resource.title}
            </h3>
            <p className="text-stone-500 mb-6 flex-grow leading-relaxed">
              {resource.description}
            </p>
            <div className="pt-6 border-t border-stone-100 mt-auto">
              <button className="flex items-center text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors">
                Read Guide <ExternalLink size={14} className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-stone-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Have a resource to share?</h3>
          <p className="text-stone-300 mb-8 max-w-xl mx-auto">
            We are always looking for new studies, articles, and tips to help our community eat better for the planet.
          </p>
          <a 
            href="https://tally.so/r/3xpgRd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
          >
            Submit a Resource
          </a>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};