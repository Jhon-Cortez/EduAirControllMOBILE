import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, 'errors.name_short'),
  email: z
    .string()
    .trim()
    .min(1, 'errors.required_email')
    .email('errors.invalid_email')
    .transform((v) => v.trim().toLowerCase()),
  companyCode: z
    .string()
    .trim()
    .min(1, 'errors.required_company_code')
    .regex(/^[A-Z]{3}-\d{4}$/, 'errors.invalid_company_code'),
  password: z
    .string()
    .min(8, 'errors.password_min')
    .regex(/[A-Z]/, 'errors.uppercase_required'),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'errors.password_match',
  path: ['confirmPassword'],
})

export default RegisterSchema