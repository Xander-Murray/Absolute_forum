import { createContext, useContext, useEffect, useState } from "react";

const UiSettingsContext = createContext(null);

const defaultSettings = {
  theme: "dark", // "dark" | "light" | "purple"
  showContent: true,
  showImage: true,
};

export const UiSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("uiSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.error("Failed to load UI settings:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("uiSettings", JSON.stringify(settings));
    } catch (err) {
      console.error("Failed to save UI settings:", err);
    }
  }, [settings]);

  const updateSettings = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  return (
    <UiSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UiSettingsContext.Provider>
  );
};

export const useUiSettings = () => {
  const ctx = useContext(UiSettingsContext);
  if (!ctx) {
    throw new Error("useUiSettings must be used within UiSettingsProvider");
  }
  return ctx;
};
