import { z } from 'zod'

export const RegisterFormSchema = z.object({
    partnerName: z.string()
        .min(2, { message: "Partner name must be at least 2 characters" })
        .max(50, { message: "Partner name must be less than 50 characters" })
        .trim(),
    restaurantName: z.string()
        .min(2, { message: "Restaurant name must be at least 2 characters" })
        .max(100, { message: "Restaurant name must be less than 100 characters" })
        .trim(),
    restaurantAddress: z.string()
        .min(5, { message: "Restaurant address must be at least 5 characters" })
        .max(200, { message: "Restaurant address must be less than 200 characters" })
        .trim(),
    email: z.string()
        .email({ message: "Invalid email address" })
        .trim(),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(50, { message: "Password must be less than 50 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        }),
})

export type RegisterFormData = z.infer<typeof RegisterFormSchema>

export type RegisterFormState =
    | {
        errors?: {
            partnerName?: string[]
            restaurantName?: string[]
            restaurantAddress?: string[]
            email?: string[]
            password?: string[]
        }
        message?: string
    }
    | undefined 