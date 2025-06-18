'use client';

import Link from 'next/link';
import { AuthButtonClient } from "@/components/auth-button-client";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";
import HelpButton from "@/components/help-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";

interface HeaderProps {
  showNavLinks?: boolean;
}

export default function Header({ showNavLinks = true }: HeaderProps) {
  return (
    <nav className="w-full backdrop-blur-md bg-background/80 border-b border-border sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-gradient-to-br from-brand to-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-white font-bold text-sm">TV</span>
              </div>
              <span className="font-bold text-foreground text-lg transition-colors duration-300">Tiện ích Văn phòng</span>
            </Link>              {showNavLinks && (
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-all duration-300">
                  Dashboard
                </Link>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-all duration-300">
                  Tính năng
                </Link>
                <Link href="#modules" className="text-muted-foreground hover:text-foreground transition-all duration-300">
                  Modules
                </Link>
                <Link href="/admin/modules" className="text-muted-foreground hover:text-foreground transition-all duration-300">
                  Quản lý
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <HelpButton />
            <SimpleThemeToggle />
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButtonClient />}
          </div>
        </div>
      </div>
    </nav>
  );
}
