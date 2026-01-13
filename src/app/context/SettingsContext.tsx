import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { settingsAPI } from '../services/api';

interface Settings {
  storeName: string;
  email: string;
  phone: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  storeName: 'FOREVER',
  email: 'admin@forever.com',
  phone: '+1 (555) 123-4567',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setSettings({
        storeName: data.storeName || defaultSettings.storeName,
        email: data.email || defaultSettings.email,
        phone: data.phone || defaultSettings.phone,
      });
    } catch (error: any) {
      console.error('Failed to fetch settings:', error);
      // If 404, the endpoint might not be deployed yet - use defaults
      if (error?.message?.includes('404') || error?.message?.includes('Not Found')) {
        console.warn('Settings API endpoint not found, using defaults');
      }
      // Use defaults on error
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
