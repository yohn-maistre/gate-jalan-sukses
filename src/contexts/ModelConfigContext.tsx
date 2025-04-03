
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModelConfig {
  model: string;
  temperature: number;
  maxOutputTokens: number;
  language: "id" | "en";
}

interface ModelConfigContextType {
  config: ModelConfig;
  updateConfig: (newConfig: Partial<ModelConfig>) => void;
  isPlayful: boolean;
  setIsPlayful: (playful: boolean) => void;
}

const defaultConfig: ModelConfig = {
  model: "gemini-pro-1.5",
  temperature: 0.7,
  maxOutputTokens: 1024,
  language: "id",
};

const ModelConfigContext = createContext<ModelConfigContextType | undefined>(undefined);

export const useModelConfig = () => {
  const context = useContext(ModelConfigContext);
  if (!context) {
    throw new Error("useModelConfig must be used within a ModelConfigProvider");
  }
  return context;
};

export const ModelConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ModelConfig>(() => {
    // Try to load from localStorage
    const savedConfig = localStorage.getItem("jalanSuksesModelConfig");
    return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
  });
  
  const [isPlayful, setIsPlayful] = useState(false);

  const updateConfig = (newConfig: Partial<ModelConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem("jalanSuksesModelConfig", JSON.stringify(updatedConfig));
  };

  return (
    <ModelConfigContext.Provider value={{ config, updateConfig, isPlayful, setIsPlayful }}>
      {children}
    </ModelConfigContext.Provider>
  );
};
