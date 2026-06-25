import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.email('Format email gak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi'),
})

export const signupSchema = z.object({
  email: z.email('Format email gak valid'),
  password: z
    .string()
    .min(6, 'Password kependekan, minimal 6 karakter ya'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>

// Debt schemas
export const debtTypeSchema = z.enum(
  ['owed_to_me', 'i_owe'],
  'Tipe wajib "owed_to_me" atau "i_owe"'
)

export const createDebtSchema = z.object({
  type: debtTypeSchema,
  counterpart_name: z
    .string()
    .min(1, 'Nama orang wajib diisi')
    .max(100, 'Nama kepanjangan, maksimal 100 karakter'),
  amount: z
    .number()
    .int('Jumlah harus bilangan bulat')
    .positive('Jumlah harus lebih dari 0'),
  note: z
    .string()
    .max(200, 'Catatan kepanjangan, maksimal 200 karakter')
    .nullable()
    .optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .nullable()
    .optional(),
})

export const updateDebtSchema = createDebtSchema.partial().extend({
  settled_at: z
    .iso
    .datetime('Format tanggal gak valid')
    .nullable()
    .optional(),
})

export const debtFilterSchema = z.object({
  status: z.enum(['all', 'belum', 'lunas']).optional().default('all'),
  type: z.enum(['all', 'owed_to_me', 'i_owe']).optional().default('all'),
})

export type CreateDebtInput = z.infer<typeof createDebtSchema>
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>
export type DebtFilterInput = z.infer<typeof debtFilterSchema>
