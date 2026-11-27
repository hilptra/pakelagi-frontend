"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { getPublicWhatsAppSetting } from "@/services/setting-service";
import type { WhatsAppSetting } from "@/types/setting";

interface SettingsContextValue {
  whatsappNumber: string | null;
  whatsappUrl: string | null;
  loading: boolean;
  error: boolean;
  refreshSettings: () => Promise<void>;
  getCustomWhatsAppUrl: (messageText?: string, overrideNumber?: string | null) => string | null;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<WhatsAppSetting>({
    whatsapp_number: null,
    whatsapp_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getPublicWhatsAppSetting();
      setSetting(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getCustomWhatsAppUrl = useCallback(
    (messageText?: string, overrideNumber?: string | null): string | null => {
      const targetPhone = (overrideNumber || setting.whatsapp_number)?.replace(/[^0-9]/g, "");
      if (!targetPhone) return null;

      if (!messageText) {
        return `https://wa.me/${targetPhone}`;
      }

      return `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`;
    },
    [setting.whatsapp_number]
  );

  return (
    <SettingsContext.Provider
      value={{
        whatsappNumber: setting.whatsapp_number,
        whatsappUrl: setting.whatsapp_url,
        loading,
        error,
        refreshSettings: fetchSettings,
        getCustomWhatsAppUrl,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

