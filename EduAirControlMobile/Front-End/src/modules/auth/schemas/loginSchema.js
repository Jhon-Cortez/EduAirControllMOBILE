import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'errors.required_email')
    .email('errors.invalid_email')
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(6, 'errors.password_min'),
  companyCode: z
    .string()
    .trim()
    .min(1, 'errors.required_company_code')
    .regex(/^[A-Z]{3}-\d{4}$/, 'errors.invalid_company_code'),
})