"use server"

import { db } from "@/src";
import { userInfo } from "@/src/db/schema";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";




export async function updateUserInfo(formData: FormData): Promise<ActionResult> {
    try {
        const userID = formData.get("userID")?.toString()
        const phone = formData.get("phone")?.toString()
        const address = formData.get("address")?.toString()
        const postal = formData.get("postal")?.toString()
        const wilaya = formData.get("wilaya")?.toString()
        const commune = formData.get("commune")?.toString()

        if (!userID) {
            return { success: false, error: "ID utilisateur manquant" }
        }

        const wilayaId = wilaya ? Number(wilaya) : null
        const communeId = commune ? Number(commune) : null

        if (wilaya && Number.isNaN(wilayaId)) {
            return { success: false, error: "Wilaya invalide" }
        }
        if (commune && Number.isNaN(communeId)) {
            return { success: false, error: "Commune invalide" }
        }

        // Already exists
        await db.insert(userInfo)
            .values({
                user_id: userID,
                phone,
                address,
                postal,
                wilaya_id: wilayaId,
                commune_id: communeId
            })
            .onConflictDoUpdate({
                target: userInfo.user_id, // requires a unique constraint on user_id
                set: { phone, address, postal, wilaya_id: wilayaId, commune_id: communeId },
            })

            revalidatePath("/account")
        
        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Échec de l'enregistrement des informations utilisateur" }
    }
} 