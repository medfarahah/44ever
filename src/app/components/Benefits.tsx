import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Sun, Moon, Shield, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const benefits = [
  {
    icon: Sun,
    title: "Radiant Glow",
    description: "Reveals your skin's natural luminosity with a soft, lit-from-within radiance."
  },
  {
    icon: Shield,
    title: "Protection",
    description: "Guards against environmental aggressors and oxidative stress throughout the day."
  },
  {
    icon: Moon,
    title: "Night Renewal",
    description: "Supports skin's natural repair process while you sleep for morning freshness."
  },
  {
    icon: Zap,
    title: "Instant Hydration",
    description: "Delivers deep, lasting moisture that plumps and smooths fine lines immediately."
  }
];

export function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="benefits" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 bg-[#2D2A26] text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A88B5C] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A88B5C] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-24 items-center">
          {/* Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
              TRANSFORMATIVE RESULTS
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 sm:mb-10 md:mb-12 leading-tight">
              Experience the
              <br />
              <span className="italic">Lumière Difference</span>
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex gap-4 sm:gap-6 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#A88B5C]/20 flex items-center justify-center group-hover:bg-[#A88B5C] transition-colors duration-500">
                      <Icon size={18} className="sm:w-5 sm:h-5 text-[#A88B5C] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl mb-1 sm:mb-2">{benefit.title}</h3>
                      <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20"
            >
              <div className="text-xs sm:text-sm text-white/60">
                *Results based on 8-week clinical study with 127 participants
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <ImageWithFallback
                src="/images/WhatsApp Image 2026-01-09 at 12.28.59 (2).jpeg"
                alt="Beauty and elegance"
                className="w-full h-auto rounded-sm"
              />
              <div className="absolute inset-0 border border-[#A88B5C]/30 rounded-sm m-4" />
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 bg-white text-[#2D2A26] p-4 sm:p-6 md:p-8 shadow-2xl"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">96%</div>
              <div className="text-[10px] sm:text-xs tracking-wider text-[#5C5852]">
                SAW VISIBLE<br />IMPROVEMENTS
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 bg-[#A88B5C] text-white p-4 sm:p-6 md:p-8 shadow-2xl"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">2 wks</div>
              <div className="text-[10px] sm:text-xs tracking-wider">
                FIRST VISIBLE<br />RESULTS
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
