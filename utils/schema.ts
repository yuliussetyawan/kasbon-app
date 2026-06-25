// utils/schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email gak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi'),
})

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email gak valid'),
  password: z
    .string()
    .min(6, 'Password kependekan, minimal 6 karakter ya'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
