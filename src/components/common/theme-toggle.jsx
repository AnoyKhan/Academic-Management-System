import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
