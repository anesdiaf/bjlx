"use server"

import { db } from "@/src";
import { orderStatus } from "@/src/db/schema";
import { ActionResult, OrderFormScema } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";





export const createOrderStatus = async (data: { title: string, order: number, default: boolean }): Promise<ActionResult> => {
    try {

        await db.insert(orderStatus).values({
            title: data.title,
            order: data.order,
            default: data.default
        })


        revalidatePath("/admin/settings")

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création du statut de la commande" }
    }
}


export const editOrderStatus = async (id: number, data: { title: string, order?: number, default: boolean }): Promise<ActionResult> => {
    try {


        await db.update(orderStatus)
            .set({
                title: data.title,
                order: data.order,
                default: data.default
            })
            .where(eq(orderStatus.id, id))


        revalidatePath("/admin/settings")
        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la modification du statut de la commande" }
    }
}

export const deleteOrderStatus = async (id: number): Promise<ActionResult> => {
    try {

        await db.delete(orderStatus).where(eq(orderStatus.id, id))


        revalidatePath("/admin/settings")
        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression du statut de la commande" }
    }
}





export const createQuickOrder = async (orderData: z.infer<typeof OrderFormScema>): Promise<ActionResult> => {
    try {

        // Get default order status id

        // Create order and retrieve id
        //const orderID = await db.insert()

        // Create order item

        // Create order info

        // Create order creation instance in order history


        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Échec de l'enregistrement des informations utilisateur" }
    }
}