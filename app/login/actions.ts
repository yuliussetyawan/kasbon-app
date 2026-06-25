'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getCasualErrorMessage } from '@/utils/error-handler'
import { loginSchema } from '@/utils/schema'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Form gak valid'
    redirect('/login?error=' + encodeURIComponent(firstError))
  }

  const { email, password } = parsed.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const errorMessage = getCasualErrorMessage(error.message)
    redirect('/login?error=' + encodeURIComponent(errorMessage))
  }

  redirect('/')
}