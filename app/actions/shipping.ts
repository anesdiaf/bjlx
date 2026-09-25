"use server"

import { db } from "@/src";
import { commune, shippingProvider, shippingZone, wilaya } from "@/src/db/schema";
import { ActionResult, providerFromSchema, shippingZoneFromSchema } from "@/types"
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import * as z from "zod"


export const getWilayas = async (): Promise<ActionResult> => {

    try {

        const wilayas = await db.select().from(wilaya)

        return { success: true, data: wilayas }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err);
        }

        return { success: false, error: "Erreur lors de la récupération des wilayas" }
    }
}

export const getWilayaCommunes = async (id: number): Promise<ActionResult> => {


    try {

        const communes = await db.select().from(commune).where(eq(commune.wilaya_id, id))

        return { success: true, data: communes }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err);
        }

        return { success: false, error: "Erreur lors de la récupération des communes de la wilaya" }
    }
}


export const createProvider = async (data: z.infer<typeof providerFromSchema>): Promise<ActionResult> => {
    try {

        await db.insert(shippingProvider).values(data)


        revalidatePath("/admin/shipping")

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err);
        }

        return { success: false, error: "Erreur lors de la création du prestataire d'expédition" }
    }
}



export const deleteProvider = async (id:number): Promise<ActionResult> => {
    try {

        await db.delete(shippingProvider).where(eq(shippingProvider.id,id))


        revalidatePath("/admin/shipping")

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err);
        }

        return { success: false, error: "Erreur lors de la suppression du transporteur" }
    }
}


export const getShippingZonesByWilaya = async (wilaya_id: number): Promise<ActionResult> => {
    try {

        const shippingZones = await db.select().from(shippingZone).where(eq(shippingZone.wilaya_id, wilaya_id))


        return { success: true, data: shippingZones }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err);
        }

        return { success: false, error: "Erreur lors de la récupération de la zone d'expédition à l'aide de l'identifiant de la commune" }
    }
}

export const createShippingZone = async (data: z.infer<typeof shippingZoneFromSchema>): Promise<ActionResult> => {
    try {

        await db.insert(shippingZone).values(data)


        revalidatePath(`/admin/shipping/edit/${data.provider_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err);
        }

        return { success: false, error: "Erreur lors de la création de la zone d'expédition" }
    }
}

export const deleteShippingZone = async (id:number, provider_id: number): Promise<ActionResult> => {
    try {

        await db.delete(shippingZone).where(eq(shippingZone.id,id))


        revalidatePath(`/admin/shipping/edit/${provider_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err);
        }

        return { success: false, error: "Erreur lors de la suppression de la zone d'expédition" }
    }
}