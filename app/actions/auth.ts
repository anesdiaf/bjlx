"use server"

import { auth } from "@/lib/auth";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";




export const RegisterUser = async (name: string, email: string, password: string): Promise<ActionResult> => {
    try {

        const res = await auth.api.createUser({
            body: {
                name,
                email,
                password,
                role: "user"
            }
        })

        revalidatePath("/register")
        revalidatePath("/")
        return { success: true, data: res.user }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création du compte utilisateur" }
    }
}


export const LoginUser = async (email: string, password: string): Promise<ActionResult> => {
    try {

        const res = await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })

        revalidatePath("/login")
        revalidatePath("/")
        return { success: true, data: res.user }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return { success: false, error: "" }
    }
}