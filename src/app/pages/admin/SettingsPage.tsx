import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Save, Bell, Lock, User, Mail, Globe, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { settingsAPI } from "../../services/api";
import { useSettings } from "../../context/SettingsContext";

export function SettingsPage() {
  const { settings: contextSettings, refreshSettings } = useSettings();
  const [settings, setSettings] = useState({
    storeName: contextSettings.storeName,
    email: contextSettings.email,
    phone: contextSettings.phone,
    notifications: true,
    emailNotifications: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Update local state when context settings change
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      storeName: contextSettings.storeName,
      email: contextSettings.email,
      phone: contextSettings.phone,
    }));
  }, [contextSettings]);

  const [apiConfig, setApiConfig] = useState({
    apiUrl: '',
    status: 'checking' as 'checking' | 'connected' | 'error',
    lastChecked: null as Date | null
  });

  // Get current API URL
  useEffect(() => {
    const currentApiUrl = import.meta.env.DEV 
      ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
      : '/api';
    
    setApiConfig(prev => ({ ...prev, apiUrl: currentApiUrl }));
    checkApiConnection(currentApiUrl);
  }, []);

  const checkApiConnection = async (url: string) => {
    setApiConfig(prev => ({ ...prev, status: 'checking' }));
    
    try {
      const testUrl = url.endsWith('/health') ? url : `${url}/health`;
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setApiConfig(prev => ({
          ...prev,
          status: 'connected',
          lastChecked: new Date()
        }));
      } else {
        setApiConfig(prev => ({
          ...prev,
          status: 'error',
          lastChecked: new Date()
        }));
      }
    } catch (error) {
      setApiConfig(prev => ({
        ...prev,
        status: 'error',
        lastChecked: new Date()
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await settingsAPI.update({
        storeName: settings.storeName,
        email: settings.email,
        phone: settings.phone,
      });
      
      // Refresh settings in context to update frontend
      await refreshSettings();
      
      setSaveMessage({ type: 'success', text: 'Settings saved successfully! Changes will be reflected on the customer-facing site.' });
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save settings. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
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

      {/* API Configuration */}
      <div className="bg-white p-6 rounded-lg border border-[#A88B5C]/10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="text-[#A88B5C]" size={24} />
          <h2 className="text-xl font-bold text-[#2D2A26]">API Configuration</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#2D2A26] mb-2">API Base URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={apiConfig.apiUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-[#A88B5C]/20 rounded-lg bg-gray-50 text-[#5C5852]"
                title="API URL is set via VITE_API_URL environment variable"
              />
              <button
                onClick={() => checkApiConnection(apiConfig.apiUrl)}
                disabled={apiConfig.status === 'checking'}
                className="px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Test API connection"
              >
                <RefreshCw size={16} className={apiConfig.status === 'checking' ? 'animate-spin' : ''} />
                Test
              </button>
            </div>
            <p className="text-xs text-[#5C5852] mt-1">
              This URL is configured via the VITE_API_URL environment variable. To change it, update the environment variable in your deployment platform (Vercel, Railway, etc.) and redeploy.
            </p>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {apiConfig.status === 'checking' && (
                <>
                  <RefreshCw size={18} className="text-[#A88B5C] animate-spin" />
                  <span className="text-sm text-[#5C5852]">Checking connection...</span>
                </>
              )}
              {apiConfig.status === 'connected' && (
                <>
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="text-sm text-green-600 font-medium">API Connected</span>
                </>
              )}
              {apiConfig.status === 'error' && (
                <>
                  <XCircle size={18} className="text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Connection Failed</span>
                </>
              )}
            </div>
            {apiConfig.lastChecked && (
              <span className="text-xs text-[#5C5852] ml-auto">
                Last checked: {apiConfig.lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">💡 How to Change API URL:</p>
            <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
              <li>In Vercel: Settings → Environment Variables → Edit VITE_API_URL</li>
              <li>In Railway: Variables tab → Edit VITE_API_URL</li>
              <li>After changing, redeploy your application</li>
            </ul>
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

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="text-sm">{saveMessage.text}</p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} className={isSaving ? 'animate-spin' : ''} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}


