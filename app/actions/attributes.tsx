"use server"

import { db } from "@/src"
import { attribute } from "@/src/db/schema"
import { ActionResult } from "@/types"


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