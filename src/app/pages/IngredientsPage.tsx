import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, Droplets, Sparkles, Flower2 } from "lucide-react";
import { Footer } from "../components/Footer";

const ingredients = [
  {
    icon: Leaf,
    name: "Saffron Extract",
    description: "Precious threads of Crocus sativus, harvested at dawn for maximum potency. Brightens and evens skin tone.",
    percentage: "5%"
  },
  {
    icon: Droplets,
    name: "Rose Otto Oil",
    description: "Distilled from 60,000 roses to create one ounce. Deeply hydrates and soothes sensitive skin.",
    percentage: "8%"
  },
  {
    icon: Sparkles,
    name: "24K Gold Particles",
    description: "Microscopic gold flakes enhance cellular renewal and provide luminous radiance.",
    percentage: "0.5%"
  },
  {
    icon: Flower2,
    name: "Lotus Flower",
    description: "Sacred bloom extract that protects against environmental stressors and promotes elasticity.",
    percentage: "12%"
  }
];

export function IngredientsPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3] min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-white via-[#FFF8E7]/90 to-white backdrop-blur-sm border-b border-[#A88B5C]/20 px-4 sm:px-6 md:px-12 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#A88B5C] hover:text-[#8F7A52] transition-colors touch-manipulation"
          >
            <ArrowLeft size={20} />
            <span className="text-sm sm:text-base">Back to Home</span>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C] hover:text-[#8F7A52] transition-colors touch-manipulation"
          >
            FOREVER
          </motion.button>
        </div>
      </nav>

      {/* Ingredients Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
              BOTANICAL EXCELLENCE
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 text-[#2D2A26] leading-tight">
              Precious <span className="italic">Ingredients</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#5C5852] max-w-2xl mx-auto px-4">
              Each ingredient is carefully sourced from its native habitat, 
              ensuring the highest quality and efficacy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-12">
            {ingredients.map((ingredient, index) => {
              const Icon = ingredient.icon;
              return (
                <motion.div
                  key={ingredient.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-white to-[#FFF8E7]/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 border border-[#A88B5C]/20 hover:border-[#A88B5C]/50 transition-all duration-500 hover:shadow-lg">
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className="p-2 sm:p-3 bg-[#A88B5C]/10 text-[#A88B5C] group-hover:bg-[#A88B5C] group-hover:text-white transition-colors duration-500">
                        <Icon size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-xl sm:text-2xl text-[#A88B5C]">{ingredient.percentage}</div>
                    </div>
                    <h3 className="text-xl sm:text-2xl mb-3 sm:mb-4 text-[#2D2A26]">{ingredient.name}</h3>
                    <p className="text-sm sm:text-base text-[#5C5852] leading-relaxed">
                      {ingredient.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center px-4"
          >
            <div className="inline-block px-6 sm:px-10 md:px-12 py-4 sm:py-6 border-2 border-[#A88B5C]">
              <div className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C] mb-2">
                OUR PROMISE
              </div>
              <div className="text-xs sm:text-sm md:text-base text-[#2D2A26]">
                Cruelty-Free • Vegan • Sustainable • Clinically Tested
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
