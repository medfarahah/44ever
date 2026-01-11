import { motion } from "motion/react";
import { useState } from "react";
import { Save, Bell, Lock, User, Mail } from "lucide-react";

export function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Forever",
    email: "admin@forever.com",
    phone: "+1 (555) 123-4567",
    notifications: true,
    emailNotifications: true,
  });

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Settings</h1>
        <p className="text-sm text-[#5C5852]">Manage your store settings and preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-[#A88B5C]" size={24} />
          <h2 className="text-xl font-bold text-[#2D2A26]">General Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#2D2A26] mb-2">Store Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#2D2A26] mb-2">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#2D2A26] mb-2">Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-[#A88B5C]" size={24} />
          <h2 className="text-xl font-bold text-[#2D2A26]">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[#2D2A26]">Push Notifications</div>
              <div className="text-sm text-[#5C5852]">Receive notifications for new orders</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#A88B5C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A88B5C]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[#2D2A26]">Email Notifications</div>
              <div className="text-sm text-[#5C5852]">Receive email updates</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#A88B5C]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A88B5C]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </div>
  );
}


