import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "errors.name_short"),
    email: z
        .string()
        .min(1, "errors.required_email")
        .email("errors.invalid_email"),
    password: z
        .string()
        .min(6, "errors.minLength_password"),
    confirmPassword: z
        .string()
        .min(1, "errors.required_confirmPassword")
}).refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwords_dont_match",
    path: ["confirmPassword"]
});