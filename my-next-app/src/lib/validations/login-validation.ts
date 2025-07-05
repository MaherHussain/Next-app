import { z } from 'zod'

export const LoginFormSchema = z.object({
    email: z.string()
        .email({ message: "Invalid email address" })
        .trim(),
    password: z.string()
        .min(1, { message: "Password is required" }),
})

export type LoginFormData = z.infer<typeof LoginFormSchema>

export type LoginFormState =
    | {
        errors?: {
            email?: string[]
            password?: string[]
        }
        message?: string
    }
    | undefined 