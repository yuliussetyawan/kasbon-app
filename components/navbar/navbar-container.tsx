// components/navbar/navbar-container.tsx
"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Sun } from "lucide-react";
import { logout } from "@/app/actions";
import { SearchInput } from "@/components/navbar/search-input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface NavbarProps {
  onSearchChange: (value: string) => void;
}

export function Navbar({ onSearchChange }: NavbarProps) {
  const { setTheme } = useTheme();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-3 h-12 px-4 max-w-2xl justify-between">
          <h1 className="text-lg font-bold shrink-0">Kasbon</h1>

          {/* Search */}
          <div className="flex-1 max-w-xs">
            <SearchInput
              onChange={onSearchChange}
              placeholder="Cari nama..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Terang
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Gelap
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  Sistem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setLogoutOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Keluar?"
        description="Yakin mau keluar dari akun?"
        confirmText="Keluar"
        cancelText="Batal"
        onConfirm={handleLogout}
      />
    </>
  );
}
