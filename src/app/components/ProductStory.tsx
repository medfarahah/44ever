import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ProductStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="story" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-24 items-center">
          {/* Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
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

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
              OUR PHILOSOPHY
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 text-[#2D2A26] leading-tight">
              Where Nature Meets
              <br />
              <span className="italic">Innovation</span>
            </h2>
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

            <motion.div
              className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-[#D4C9B3]"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-px flex-1 bg-[#A88B5C]/30" />
                <div className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">EST. 2018</div>
                <div className="h-px flex-1 bg-[#A88B5C]/30" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
