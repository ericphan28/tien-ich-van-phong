"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="flex gap-1.5 sm:gap-2">
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Hey, {user.email}!</span>
      <span className="text-xs text-muted-foreground block sm:hidden">
        {user.email?.split('@')[0]}
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-1.5 sm:gap-2">
      <Button asChild size="sm" variant="outline" className="text-xs sm:text-sm px-2 sm:px-3">
        <Link href="/auth/login">
          <span className="hidden sm:inline">Đăng Nhập</span>
          <span className="sm:hidden">Đăng Nhập</span>
        </Link>
      </Button>
      <Button asChild size="sm" variant="outline" className="text-xs sm:text-sm px-2 sm:px-3">
        <Link href="/auth/sign-up">
          <span className="hidden sm:inline">Đăng Ký</span>
          <span className="sm:hidden">Đăng Ký</span>
        </Link>
      </Button>
    </div>
  );
}
