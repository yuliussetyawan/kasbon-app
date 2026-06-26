import Link from 'next/link'
import { login } from './actions'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SubmitButton } from '@/components/login-signup/submit-button'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const errorMessage = searchParams?.error as string | undefined

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Masuk Kasbon</CardTitle>
          <CardDescription>
            Catat utang piutang biar gak lupa.
          </CardDescription>
        </CardHeader>

        <form action={login}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@kamu.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" name="password" required />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-4">
            <SubmitButton className="w-full" loadingText="Masuk...">
              Masuk
            </SubmitButton>

            <div className="text-center text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <Link href="/signup" className="underline hover:text-primary">
                Daftar di sini
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}