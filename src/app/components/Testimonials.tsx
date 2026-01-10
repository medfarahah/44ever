import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sophia Laurent",
    location: "Paris, France",
    rating: 5,
    text: "This elixir has transformed my skincare routine. The texture is divine, and my skin has never looked more radiant. Truly a luxurious experience."
  },
  {
    name: "Isabella Chen",
    location: "Hong Kong",
    rating: 5,
    text: "After just two weeks, I noticed a visible difference in my skin's luminosity. The blend of botanicals is simply exquisite. Worth every penny."
  },
  {
    name: "Amélie Dubois",
    location: "Monaco",
    rating: 5,
    text: "The attention to detail in every aspect of this product is remarkable. From the ingredients to the packaging, it's pure elegance."
  }
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFF8E7]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
            CLIENT TESTIMONIALS
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 text-[#2D2A26] leading-tight">
            Beloved by <span className="italic">Connoisseurs</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#5C5852] max-w-2xl mx-auto px-4">
            Join thousands who have discovered the transformative power of Lumière.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-gradient-to-br from-white to-[#FFF8E7]/50 p-6 sm:p-8 md:p-10 hover:shadow-xl transition-shadow duration-500 border border-[#A88B5C]/10"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4 sm:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="sm:w-4 sm:h-4 fill-[#A88B5C] text-[#A88B5C]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm sm:text-base text-[#5C5852] leading-relaxed mb-6 sm:mb-8 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="pt-4 sm:pt-6 border-t border-[#D4C9B3]/30">
                <div className="text-sm sm:text-base text-[#2D2A26] mb-1">{testimonial.name}</div>
                <div className="text-xs sm:text-sm text-[#A88B5C]">{testimonial.location}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16 md:mt-20 px-4"
        >
          <div className="inline-block bg-gradient-to-br from-white to-[#FFF8E7]/80 px-6 sm:px-10 md:px-12 py-10 sm:py-14 md:py-16 shadow-lg max-w-2xl w-full border border-[#A88B5C]/20">
            <h3 className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-[#2D2A26]">
              Begin Your Journey
            </h3>
            <p className="text-sm sm:text-base text-[#5C5852] mb-6 sm:mb-8 leading-relaxed">
              Experience the transformative power of botanical luxury. 
              Limited availability - reserve yours today.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-[#A88B5C] text-white tracking-wider text-xs sm:text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation w-full sm:w-auto"
            >
              SHOP ELIXIR - $385
            </motion.button>
            <div className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-[#5C5852]">
              Complimentary shipping on all orders
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
