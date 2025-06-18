"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Constants
const ICON_SIZE = 16;

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
    
    // Remove no-transition class after component mounts to enable smooth transitions
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Return a skeleton that matches the actual button to prevent layout shift
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9 opacity-50">
        <Sun size={16} className="text-muted-foreground" />
      </Button>
    );
  }

  const handleThemeChange = (value: string) => {
    // Add smooth transition effect
    document.documentElement.style.transition = 'color-scheme 0.3s ease';
    setTheme(value);
    
    // Reset transition after change
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  };
  
  // Determine the current effective theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  const getThemeIcon = () => {
    if (theme === "system") {
      return (
        <Monitor
          size={ICON_SIZE}
          className="text-muted-foreground hover:text-foreground transition-colors"
        />
      );
    }
    
    if (effectiveTheme === "dark") {
      return (
        <Moon
          size={ICON_SIZE}
          className="text-muted-foreground hover:text-foreground transition-colors"
        />
      );
    }
    
    return (
      <Sun
        size={ICON_SIZE}
        className="text-muted-foreground hover:text-foreground transition-colors"
      />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-9 h-9 hover:bg-accent transition-colors"
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-40" 
        align="end"
        sideOffset={4}
      >
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={handleThemeChange}
        >
          <DropdownMenuRadioItem 
            value="light" 
            className="flex items-center gap-2 cursor-pointer"
          >
            <Sun size={ICON_SIZE} className="text-muted-foreground" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            value="dark" 
            className="flex items-center gap-2 cursor-pointer"
          >
            <Moon size={ICON_SIZE} className="text-muted-foreground" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            value="system" 
            className="flex items-center gap-2 cursor-pointer"
          >
            <Monitor size={ICON_SIZE} className="text-muted-foreground" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
