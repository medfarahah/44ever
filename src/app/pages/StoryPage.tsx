import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

export function StoryPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Our Story - FOREVER Luxury Skincare | Crafted with Excellence"
        description="Discover the story behind FOREVER luxury skincare. Learn about our commitment to premium ingredients, cutting-edge science, and timeless beauty."
        keywords="forever skincare story, luxury beauty brand, premium cosmetics history, skincare philosophy"
      />
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

        {/* Story Content */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
                OUR PHILOSOPHY
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 text-[#2D2A26] leading-tight">
                Where Nature Meets <span className="italic">Innovation</span>
              </h1>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-24 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  <ImageWithFallback
                    src="/images/face-mask.jpg"
                    alt="Luxury skincare ingredients"
                    className="w-full h-auto rounded-sm"
                  />
                  <div className="absolute inset-0 border border-[#A88B5C]/20 rounded-sm -m-4" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-[#5C5852] leading-relaxed">
                  <p>
                    Born from a reverence for nature's ancient wisdom and modern scientific innovation,
                    Lumière represents the pinnacle of botanical luxury.
                  </p>
                  <p>
                    Each drop of our Elixir de Jeunesse is a testament to years of research,
                    combining rare plant extracts sourced from pristine environments around the globe
                    with breakthrough skincare technology.
                  </p>
                  <p>
                    We believe that true beauty radiates from within, enhanced by products that honor
                    both your skin and the earth. Our commitment to sustainability and efficacy ensures
                    that every application is a moment of transformative self-care.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="inline-block px-6 sm:px-10 md:px-12 py-4 sm:py-6 border-2 border-[#A88B5C]">
                <div className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C] mb-2">
                  EST. 2018
                </div>
                <div className="text-xs sm:text-sm md:text-base text-[#2D2A26]">
                  Crafting luxury skincare with passion and precision
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
