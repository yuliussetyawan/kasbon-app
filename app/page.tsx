// app/page.tsx
import { logout } from "./actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  return (
    <main className='container mx-auto p-4 max-w-2xl'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Kasbon</h1>

        <form action={logout}>
          <Button
            variant='ghost'
            size='sm'
            type='submit'
            className='text-muted-foreground hover:text-foreground'
          >
            <LogOut className='h-4 w-4 mr-2' />
            Keluar
          </Button>
        </form>
      </div>

    </main>
  );
}
