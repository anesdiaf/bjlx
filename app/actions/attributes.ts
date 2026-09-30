"use server"

import { db } from "@/src"
import { attribute } from "@/src/db/schema"
import { ActionResult } from "@/types"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"



export const getAttributes = async () => {
    try {

        // handle sql query
        const attributes = await db.query.attribute.findMany({
            with: {
                values: true
            }
        })

        return { success: true, data: attributes }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors du chargement des données d'attributs" }
    }
}

export const createAttribute = async (title: string): Promise<ActionResult> => {
    try {

        // handle sql query
        const query = await db.insert(attribute).values({ title }).returning({ attribueID: attribute.id })

        return { success: true, data: query[0].attribueID }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création de l'attribute" }
    }
}


export const deleteCategory = async (id: number): Promise<ActionResult> => {

    try {
        // handle sql query
        await db.delete(attribute).where(eq(attribute.id, id))

        // revalidate path
        revalidatePath("/admin/attributes")
        
        return { success: true }

    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de l'attribute" }
    }
}