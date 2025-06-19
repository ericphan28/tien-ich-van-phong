"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={logout}
      className="text-xs sm:text-sm px-2 sm:px-3"
    >
      <span className="hidden sm:inline">Đăng Xuất</span>
      <span className="sm:hidden">Xuất</span>
    </Button>
  );
}
