import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, DollarSign, Target, TrendingUp, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Apply",
    description: "Submit your franchise application and tell us about your vision"
  },
  {
    number: "02",
    title: "Review",
    description: "Our team reviews your application and schedules a consultation"
  },
  {
    number: "03",
    title: "Launch",
    description: "Complete training and open your Forever franchise location"
  }
];

const advantages = [
  {
    icon: DollarSign,
    title: "Low Initial Investment",
    description: "Competitive franchise fees with flexible financing options"
  },
  {
    icon: Target,
    title: "Proven Business Model",
    description: "Tested strategies and systems that drive success"
  },
  {
    icon: TrendingUp,
    title: "High ROI Potential",
    description: "Strong profit margins in the growing luxury skincare market"
  }
];

export function StartBusiness() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-[#2D2A26] via-[#3A3630] to-[#2D2A26] text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A88B5C] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A88B5C] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <div className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C]">
            FRANCHISE OPPORTUNITY
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 text-white leading-tight">
            Start Your <span className="italic">Business</span> Today
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-3xl mx-auto px-4">
            Join the Forever family and build a successful business in the luxury skincare industry. 
            We provide everything you need to succeed.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 sm:p-8 border border-[#A88B5C]/20 hover:border-[#A88B5C]/50 transition-all duration-500 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl sm:text-5xl font-bold text-[#A88B5C]/30">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#A88B5C]/20 flex items-center justify-center">
                    <CheckCircle className="text-[#A88B5C]" size={24} />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl mb-3 text-white">{step.title}</h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Advantages */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 sm:p-8 border border-[#A88B5C]/20 hover:border-[#A88B5C]/50 transition-all duration-500"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#A88B5C]/20 flex items-center justify-center mb-4">
                  <Icon className="text-[#A88B5C]" size={24} />
                </div>
                <h3 className="text-lg sm:text-xl mb-2 text-white">{advantage.title}</h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  {advantage.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 sm:p-12 md:p-16 border border-[#A88B5C]/30 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#A88B5C] flex items-center justify-center">
                <Rocket className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-white">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-sm sm:text-base text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Take the first step towards owning your own Forever franchise. 
              Join hundreds of successful partners who have built thriving businesses with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/franchise")}
                className="px-8 sm:px-12 py-3 sm:py-4 bg-[#A88B5C] text-white tracking-wider text-xs sm:text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation"
              >
                Apply Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/contact")}
                className="px-8 sm:px-12 py-3 sm:py-4 border-2 border-[#A88B5C] text-[#A88B5C] tracking-wider text-xs sm:text-sm hover:bg-[#A88B5C] hover:text-white transition-colors touch-manipulation"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10"
        >
          {[
            { number: "200+", label: "Franchise Partners" },
            { number: "95%", label: "Success Rate" },
            { number: "$2M+", label: "Avg. Annual Revenue" },
            { number: "24/7", label: "Support Available" }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 text-[#A88B5C] font-medium">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-white/60 tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


