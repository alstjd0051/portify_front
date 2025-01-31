"use client";

import { ThemeToggle } from "@/components/widget/layout/theme-toggle";
import { Button } from "@/components/shared/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function Header() {
  return (
    <header className="sticky px-10 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <p className="text-xl font-bold">Portify</p>
        </Link>

        <nav className="flex items-center space-x-6">
          <Button variant="outline" onClick={() => signOut()}>
            로그아웃
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
