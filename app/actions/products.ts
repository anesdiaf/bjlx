"use server"

import { db } from "@/src";
import { product, productInsertType, productVariant, productVariantValues, producVariantInsertType, producVariantType } from "@/src/db/schema";
import { disk } from "@/src/fs";
import { ActionResult } from "@/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";






// Products
export const createProduct = async (formData: FormData): Promise<ActionResult> => {
    try {

        const productObject: { [k: string]: any } = Object.fromEntries(formData);
        productObject.status = productObject.status === "on" ? true : false
        productObject.featured = productObject.featured === "on" ? true : false


        // make urlkey lower-case
        productObject.meta_url_key = productObject.meta_url_key.toString().toLowerCase()

        // remove actionID
        const actionIdKey = Object.keys(productObject).find(k => k.startsWith('$ACTION_ID'))
        actionIdKey && delete productObject[actionIdKey]


        // handle sql query
        const query = await db.insert(product).values(productObject as productInsertType).returning({ productID: product.id })


        return { success: true, data: query[0].productID }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création du produit" }
    }
}



export const editProduct = async (formData: FormData, id: number): Promise<ActionResult> => {

    try {


        const productObject: { [k: string]: any } = Object.fromEntries(formData);
        productObject.status = productObject.status === "on" ? true : false
        productObject.featured = productObject.featured === "on" ? true : false

        // make urlkey lower-case
        productObject.meta_url_key = productObject.meta_url_key.toString().toLowerCase()

        // remove actionID
        const actionIdKey = Object.keys(productObject).find(k => k.startsWith('$ACTION_ID'))
        actionIdKey && delete productObject[actionIdKey]


        // handle sql query
        //const query = await db.insert(product).values(productObject).returning({ productID: product.id })

        console.log(productObject.category_id);

        await db.update(product).set(productObject).where(eq(product.id, id))


        revalidatePath(`/admin/products/edit/${id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la modification du produit" }
    }
}



export const deleteProduct = async (id: number): Promise<ActionResult> => {

    try {
        // handle sql query
        await db.delete(product).where(eq(product.id, id))

        // revalidate path
        revalidatePath("/admin/products")

        return { success: true }

    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de produit" }
    }
}





// Variants
export const getVariant = async (id: number): Promise<producVariantType | undefined> => {


    try {
        const variant = await db.query.productVariant.findFirst({
            where: {
                id
            }
        });

        return variant;
    } catch (err) {
        return undefined
    }


}

export const createVariant = async (formData: FormData, productId: number): Promise<ActionResult> => {

    try {

        const variantObject: { [k: string]: any } = Object.fromEntries(formData);
        variantObject.track_stock = variantObject.track_stock === "on" ? true : false
        variantObject.on_promo = variantObject.on_promo === "on" ? true : false
        variantObject.default = variantObject.default === "on" ? true : false
        variantObject.status = variantObject.status === "on" ? true : false
        variantObject.price = Number(variantObject.price)
        variantObject.buy_price = Number(variantObject.buy_price)
        variantObject.promo_price = Number(variantObject.promo_price)
        variantObject.stock = Number(variantObject.stock)

        // remove actionID
        const actionIdKey = Object.keys(variantObject).find(k => k.startsWith('$ACTION_ID'))
        actionIdKey && delete variantObject[actionIdKey]


        // set productId
        variantObject.product_id = productId


        // handle sql query
        await db.insert(productVariant).values(variantObject as producVariantInsertType)

        revalidatePath(`/admin/products/edit/${productId}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création de la variante" }
    }
}

export const editVariant = async (formData: FormData, productId: number, variantId: number): Promise<ActionResult> => {

    try {

        const variantObject: { [k: string]: any } = Object.fromEntries(formData);
        variantObject.track_stock = variantObject.track_stock === "on" ? true : false
        variantObject.on_promo = variantObject.on_promo === "on" ? true : false
        variantObject.default = variantObject.default === "on" ? true : false
        variantObject.status = variantObject.status === "on" ? true : false
        variantObject.price = Number(variantObject.price)
        variantObject.buy_price = Number(variantObject.buy_price)
        variantObject.promo_price = Number(variantObject.promo_price)
        variantObject.stock = Number(variantObject.stock)

        // remove actionID
        const actionIdKey = Object.keys(variantObject).find(k => k.startsWith('$ACTION_ID'))
        actionIdKey && delete variantObject[actionIdKey]


        // set productId
        variantObject.product_id = productId


        // handle sql query
        await db.update(productVariant).set(variantObject).where(eq(productVariant.id, variantId))

        revalidatePath(`/admin/products/edit/${productId}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création de la variante" }
    }
}



export const deleteVariant = async (id: number, productId: number): Promise<ActionResult> => {

    try {
        // handle sql query
        await db.delete(productVariant).where(eq(productVariant.id, id))

        // revalidate path
        revalidatePath(`/admin/products/edit/${productId}`)

        return { success: true }

    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de produit" }
    }
}

export const setVariantValue = async (attribute_id: number, value_id: number, product_id: number, variant_id: number): Promise<ActionResult> => {
    try {

        const valueExists = await db.select().from(productVariantValues).where(and(
            eq(productVariantValues.variant_id, variant_id),
            eq(productVariantValues.attribute_id, attribute_id)
        ))

        if (valueExists.length !== 0) {
            await db.update(productVariantValues).set({
                attribute_id, product_id, value_id, variant_id
            }).where(and(
                eq(productVariantValues.variant_id, variant_id),
                eq(productVariantValues.attribute_id, attribute_id)
            ))
        } else {
            await db.insert(productVariantValues)
                .values({ attribute_id, value_id, product_id, variant_id })
        }

        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création du produit" }
    }
}



export const deleteVariantValue = async (attribute_id: number, variant_id: number, product_id: number): Promise<ActionResult> => {

    try {
        // handle sql query
        await db.delete(productVariantValues).where(and(
            eq(productVariantValues.variant_id, variant_id),
            eq(productVariantValues.attribute_id, attribute_id)
        ))

        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }

    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de produit" }
    }
}



// Images

export const createVariantImage = async (location: string, blob: Blob, variant_id: number, product_id: number): Promise<ActionResult> => {
    try {

        const key = location;

        const buffer = Buffer.from(await blob.arrayBuffer())

        await disk.put(key, buffer)


        // Should store key variant_id product_id and order, and check for order first

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de produit" }
    }
}