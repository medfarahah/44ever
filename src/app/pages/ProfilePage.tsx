import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, Lock, Save, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Footer } from "../components/Footer";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {}
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: (user as any).address || {}
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await authAPI.updateProfile(formData);
      updateUser(formData);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm border border-[#A88B5C]/20 rounded-lg shadow-xl p-6 sm:p-8 md:p-10"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">My Account</h1>
            <p className="text-sm text-[#5C5852]">Manage your profile and account settings</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-[#A88B5C]/20">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-[#A88B5C] border-b-2 border-[#A88B5C]"
                  : "text-[#5C5852] hover:text-[#A88B5C]"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "password"
                  ? "text-[#A88B5C] border-b-2 border-[#A88B5C]"
                  : "text-[#5C5852] hover:text-[#A88B5C]"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 text-red-600 text-sm rounded"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/50 text-green-600 text-sm rounded"
            >
              <span>{success}</span>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm text-[#2D2A26] mb-2 flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-[#A88B5C]/30 text-[#2D2A26] placeholder:text-[#5C5852]/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm text-[#2D2A26] mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-[#A88B5C]/30 text-[#5C5852] bg-[#F5F5F5] rounded cursor-not-allowed"
                />
                <p className="text-xs text-[#5C5852] mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm text-[#2D2A26] mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#A88B5C]/30 text-[#2D2A26] placeholder:text-[#5C5852]/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                  placeholder="Enter your phone number"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {isLoading ? "Saving..." : "Save Changes"}
              </motion.button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm text-[#2D2A26] mb-2 flex items-center gap-2">
                  <Lock size={16} />
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-[#A88B5C]/30 text-[#2D2A26] placeholder:text-[#5C5852]/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                  placeholder="Enter your current password"
                />
              </div>

              <div>
                <label className="block text-sm text-[#2D2A26] mb-2 flex items-center gap-2">
                  <Lock size={16} />
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-[#A88B5C]/30 text-[#2D2A26] placeholder:text-[#5C5852]/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm text-[#2D2A26] mb-2 flex items-center gap-2">
                  <Lock size={16} />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-[#A88B5C]/30 text-[#2D2A26] placeholder:text-[#5C5852]/40 focus:outline-none focus:border-[#A88B5C] transition-colors rounded"
                  placeholder="Confirm new password"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-[#A88B5C] text-white tracking-wider text-sm hover:bg-[#8F7A52] transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                {isLoading ? "Changing..." : "Change Password"}
              </motion.button>
            </form>
          )}

          {/* Logout Button */}
          <div className="mt-8 pt-8 border-t border-[#A88B5C]/20">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-6 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
