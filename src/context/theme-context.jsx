import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme-context-value";

const THEME_KEY = "ams-theme";

const getInitialTheme = () => {
  const persisted = localStorage.getItem(THEME_KEY);
  if (persisted === "light" || persisted === "dark") {
    return persisted;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((previous) => (previous === "dark" ? "light" : "dark"));
      },
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
