"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const SimpleThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
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
        <Sun className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }  const toggleTheme = () => {
    // Add transition class for smooth theme switch
    document.body.classList.add('theme-transitioning');
    
    // Switch theme
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    
    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 350); // Slightly longer for modules page
  };
  const getIcon = () => {
    return resolvedTheme === 'dark' ? 
      <Moon className="h-4 w-4 transition-all duration-300" /> : 
      <Sun className="h-4 w-4 transition-all duration-300" />;
  };

  const getLabel = () => {
    return resolvedTheme === 'dark' ? 'Dark' : 'Light';
  };  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 hover:bg-accent transition-[background-color,transform] duration-300 hover:scale-105"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Current: ${getLabel()}. Click to switch.`}
    >
      {getIcon()}
    </Button>
  );
};

export { SimpleThemeToggle };
