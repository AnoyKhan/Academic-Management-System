import { useContext } from "react";
import { ThemeContext } from "../context/theme-context-value";

export const useTheme = () => useContext(ThemeContext);
