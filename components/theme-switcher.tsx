"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const ICON_SIZE = 16;

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
      title={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
    >
      {theme === "light" ? (
        <Sun
          size={ICON_SIZE}
          className="text-muted-foreground hover:text-foreground transition-colors"
        />
      ) : (
        <Moon
          size={ICON_SIZE}
          className="text-muted-foreground hover:text-foreground transition-colors"
        />
      )}
    </Button>
  );
};

export { ThemeSwitcher };
