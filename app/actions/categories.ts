"use server"

import { db } from "@/src";
import { category, categoryInsertType } from "@/src/db/schema";
import { ActionResult } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createCategory = async (formData: FormData): Promise<ActionResult> => {

    try {

        const categoryObject: {[k: string]: any} = Object.fromEntries(formData);
        categoryObject.status = categoryObject.status === "on" ? true : false

        // remove actionID
        const actionIdKey = Object.keys(categoryObject).find(k => k.startsWith('$ACTION_ID'))
        actionIdKey && delete categoryObject[actionIdKey]

        // make urlkey lower-case
        categoryObject.meta_url_key = categoryObject.meta_url_key.toString().toLowerCase()

        // handle sql query
        const query = await db.insert(category).values(categoryObject as categoryInsertType).returning({ categoryID: category.id })

        return { success: true, data: query[0].categoryID }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création de la catégorie" }
    }
}



export const deleteCategory = async (id: number): Promise<ActionResult> => {

    try {
        // handle sql query
        await db.delete(category).where(eq(category.id, id))

        // revalidate path
        revalidatePath("/admin/categories")

        return { success: true }

    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de la catégorie" }
    }
}