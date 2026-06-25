import Link from "next/link";
import { signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SignupPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const errorMessage = searchParams?.error as string | undefined;

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Daftar Akun Baru</CardTitle>
          <CardDescription>
            Bikin akun buat mulai catat utangmu.
          </CardDescription>
        </CardHeader>

        <form>
          <CardContent className='space-y-4'>
            {errorMessage && (
              <div className='text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md'>
                {errorMessage}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='email@kamu.com'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <PasswordInput
                id='password'
                name='password'
                placeholder='Minimal 6 karakter'
                required
                minLength={6}
              />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-4'>
            <Button className='w-full' formAction={signup}>
              Daftar Sekarang
            </Button>

            <div className='text-center text-sm text-muted-foreground'>
              Udah punya akun?{" "}
              <Link href='/login' className='underline hover:text-primary'>
                Masuk aja
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
