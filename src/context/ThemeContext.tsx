"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "light"; // Default to light theme

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      
      // Aplicar classes e estilos de fundo ao documento
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        applyBackgroundImage('dark');
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        applyBackgroundImage('light');
      }
    }
  }, [theme, isInitialized]);

  // Função para aplicar a imagem de fundo
  const applyBackgroundImage = (theme: Theme) => {
    const backgroundStyle = theme === 'dark' 
      ? `url("https://rna.ao/rna.ao/wp-content/uploads/2024/12/peninsula-do-Mussulo.jpg")`
      : `url("https://rna.ao/rna.ao/wp-content/uploads/2024/12/peninsula-do-Mussulo.jpg")`;
    
    // Aplicar ao body para cobrir toda a página
    document.body.style.backgroundImage = backgroundStyle;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.body.style.transition = 'background-image 0.5s ease';
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};