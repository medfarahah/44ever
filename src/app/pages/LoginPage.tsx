import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Footer } from "../components/Footer";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#FFF8E7] to-[#F5E6D3] min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-white via-[#FFF8E7]/90 to-white backdrop-blur-sm border-b border-[#A88B5C]/20 px-4 sm:px-6 md:px-12 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#A88B5C] hover:text-[#8F7A52] transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm sm:text-base">Back to Home</span>
          </Link>
          <Link to="/" className="text-lg sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] text-[#A88B5C] hover:text-[#8F7A52] transition-colors">
            FOREVER
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-[#A88B5C]/20 p-8 sm:p-10 rounded-lg shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-3xl sm:text-4xl tracking-[0.2em] text-[#A88B5C] mb-2">
                FOREVER
              </div>
              <div className="text-sm text-[#5C5852] tracking-wider">Sign In to Your Account</div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 text-red-600 text-sm rounded"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}

              <div>
                <label className="block text-sm text-[#2D2A26] mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#A88B5C]/30 text-[#2D2A26] placeholder:text-[#5C5852]/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm text-[#2D2A26] mb-2 flex items-center gap-2">
                  <Lock size={16} />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#A88B5C]/30 text-[#2D2A26] placeholder:text-[#5C5852]/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                  placeholder="Enter your password"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 pt-6 border-t border-[#A88B5C]/10 text-center">
              <p className="text-sm text-[#5C5852]">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#A88B5C] hover:text-[#8F7A52] font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
