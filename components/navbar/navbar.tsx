'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Moon, Sun } from 'lucide-react'
import { logout } from '@/app/actions'

export function Navbar() {
  const { setTheme } = useTheme()

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between h-12 px-4 max-w-2xl">
        <h1 className="text-lg font-bold">Kasbon</h1>

        <div className="flex items-center gap-1">
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
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Terang
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Gelap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                Ikut sistem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logout */}
          <form action={logout}>
            <Button
              variant="ghost"
              size="icon-sm"
              type="submit"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Keluar</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
