import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, AlertCircle } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D2A26] via-[#3A3630] to-[#2D2A26] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-sm border border-[#A88B5C]/20 p-8 sm:p-10 rounded-lg shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl sm:text-4xl tracking-[0.2em] text-[#A88B5C] mb-2">
              FOREVER
            </div>
            <div className="text-sm text-white/60 tracking-wider">ADMIN PANEL</div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm text-white/80 mb-2 flex items-center gap-2">
                <User size={16} />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-[#A88B5C]/30 text-white placeholder:text-white/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2 flex items-center gap-2">
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-[#A88B5C]/30 text-white placeholder:text-white/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                placeholder="Enter password"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors touch-manipulation rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50 text-center">
              Demo: username: <span className="text-[#A88B5C]">admin</span> / password: <span className="text-[#A88B5C]">admin123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

