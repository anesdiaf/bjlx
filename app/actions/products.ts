"use server"

import { db } from "@/src";
import { product, productInsertType, productVariant, productVariantValues, producVariantInsertType, producVariantType, variantImage, variantThumbnail } from "@/src/db/schema";
import { disk } from "@/src/fs";
import { ActionResult, VariantValues } from "@/types";
import { and, eq, like, SQL, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";






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



export const getProduct = async (id: number) => {
    try {
        const productDetails = await db.query.product.findFirst({
            where: {
                id
            }
        })

        return { success: true, data: productDetails }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors du chargement des données produit" }
    }

}

export const getProductVariant = async (product_id: number, values: VariantValues) => {

    let isSuccess = false;
    let id:number;
    try {

        const variant = await db.select().from(productVariantValues).where(sql`${JSON.stringify(values)}::jsonb @> ${productVariantValues.values}`)

        console.log("variant", variant);

        isSuccess = variant[0] ? true : false

        id = variant[0] ? variant[0].variant_id! : 0
        //return { success: true, data: id }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log("getProductVariant", err.message);
        }
        return { success: false, error: "Erreur lors du chargement des données produit" }
    }


    if (isSuccess) {
        revalidatePath(`/products/${product_id}?variant=${id!}`)
        redirect(`/products/${product_id}?variant=${id!}`)
    } else {
        revalidatePath(`/products/${product_id}`)
        redirect(`/products/${product_id}`)
    }
}

export const getProductDetailed = async (id: number) => {

    try {
        const detailedProduct = await db.query.product.findFirst({
            where: {
                id,
                variants: true
            },
            with: {
                variants: {
                    with: {
                        images: true,
                        values: true
                    }
                }
            }
        })

        return { success: true, data: detailedProduct }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors du chargement des données produit" }
    }
}

export const getFeaturedProducts = async () => {
    try {
        const featuredProducts = await db.query.product.findMany({
            where: {
                featured: true,
            },
            with: {
                variants: {
                    where: {
                        default: true
                    },
                    with: {
                        thumbnails: true
                    }
                }
            }
        })

        return { success: true, data: featuredProducts }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors du chargement des produits en vedette" }
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
        return { success: false, error: "Erreur lors de la modification de la variante" }
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
        return { success: false, error: "Erreur lors de la suppression de la variante" }
    }
}

export const setVariantValue = async (product_id: number, variant_id: number, values: VariantValues): Promise<ActionResult> => {
    try {

        const valueExists = await db.select().from(productVariantValues).where(eq(productVariantValues.variant_id, variant_id))

        if (valueExists.length !== 0) {
            await db.update(productVariantValues).set({
                product_id, variant_id, values
            }).where(eq(productVariantValues.variant_id, variant_id))
        } else {
            await db.insert(productVariantValues).values({ product_id, variant_id, values })
        }

        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la définition de la valeur de l'attribut de variante" }
    }
}




// Images

export const createVariantImage = async (location: string, order: number, blob: Blob, variant_id: number, product_id: number): Promise<ActionResult> => {
    try {

        const key = location;

        const buffer = Buffer.from(await blob.arrayBuffer())

        // Creating file in FS
        await disk.put(key, buffer)

        // Store Image Data in DB
        await db.insert(variantImage).values({
            url: key,
            order,
            variant_id,
            product_id
        })

        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la définition de l'image de la variante" }
    }
}

export const editVariantImage = async (id: number, order: number, product_id: number): Promise<ActionResult> => {
    try {

        // Delelte data from DB
        await db.update(variantImage).set({
            order
        }).where(eq(variantImage.id, id))


        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la modification de l'image de la variante" }
    }
}

export const deleteVariantImage = async (id: number, key: string, product_id: number): Promise<ActionResult> => {
    try {


        // Delete the file
        await disk.delete(key)

        // Delelte data from DB
        await db.delete(variantImage).where(eq(variantImage.id, id))


        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de l'image de la variante" }
    }
}

// Thumbnails

export const createVariantThumbnail = async (location: string, order: number, blob: Blob, variant_id: number, product_id: number): Promise<ActionResult> => {
    try {

        const key = location;

        const buffer = Buffer.from(await blob.arrayBuffer())

        // Creating file in FS
        await disk.put(key, buffer)

        // Store Image Data in DB
        await db.insert(variantThumbnail).values({
            url: key,
            order,
            variant_id,
            product_id
        })

        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la définition de la vignette de la variante" }
    }
}

export const editVariantThumbnail = async (id: number, order: number, product_id: number): Promise<ActionResult> => {
    try {

        // Delelte data from DB
        await db.update(variantThumbnail).set({
            order
        }).where(eq(variantThumbnail.id, id))


        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la modification de la vignette de la variante" }
    }
}

export const deleteVariantThumbnail = async (id: number, key: string, product_id: number): Promise<ActionResult> => {
    try {


        // Delete the file
        await disk.delete(key)

        // Delelte data from DB
        await db.delete(variantThumbnail).where(eq(variantThumbnail.id, id))


        // revalidate path
        revalidatePath(`/admin/products/edit/${product_id}`)

        return { success: true }
    } catch (err) {
        if (err instanceof Error) {
            // TypeScript now knows 'error' is an Error object
            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de l'image de la variante" }
    }
}