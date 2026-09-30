"use server"

import { db } from "@/src";
import { order, orderHistory, OrderInfo, orderItem, orderStatus, productVariant } from "@/src/db/schema";
import { ActionResult, OrderFormScema, SingleCartItemType, VariantWithValuesImagesType } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";




export const getOrderStatus = async (id: number): Promise<ActionResult> => {
    try {

        const order_status = await db.query.orderStatus.findFirst({
            where: {
                id
            }
        })


        return { success: true, data: order_status }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la récupération des données d'état de la commande" }
    }
}

export const getOrderStatuses = async (): Promise<ActionResult> => {
    try {

        const order_statuses = await db.query.orderStatus.findMany({
            orderBy: {
                order: 'asc'
            }
        })


        return { success: true, data: order_statuses }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la récupération des données d'état de la commande" }
    }
}

export const createOrderStatus = async (data: { title: string, order: number, icon?: string, color?: string, default: boolean }): Promise<ActionResult> => {
    try {

        await db.insert(orderStatus).values({
            title: data.title,
            order: data.order,
            icon: data.icon,
            color: data.color,
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


export const editOrderStatus = async (id: number, data: { title: string, order?: number, icon?: string, color?: string, default: boolean }): Promise<ActionResult> => {
    try {

        console.log(data.color);

        await db.update(orderStatus)
            .set({
                title: data.title,
                order: data.order,
                icon: data.icon,
                color: data.color,
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


export const createOrder = async (orderData: z.infer<typeof OrderFormScema>, items: SingleCartItemType[]): Promise<ActionResult> => {
    try {

        const { user_id, guest_order, zone_id, note, name, commune_id, wilaya_id, address, postal, phone } = orderData;

        // Get default order status id
        const defaultOrderStatus = await db.query.orderStatus.findFirst({
            where: {
                default: true
            }
        });

        const status_id = defaultOrderStatus?.id!;

        // Get Delivery Zone Data
        const zone = await db.query.shippingZone.findFirst({
            where: {
                id: orderData.zone_id
            }
        });



        // Generate an order number
        const order_number = new Date().getTime().toString() + (Math.floor(Math.random() * 9) + 1).toString();


        // Calculations

        const zonePrice = zone?.price!;
        let orderSubtotal = 0;
        let orderDiscount = 0;
        let orderTotal = 0;

        items.forEach(item => {

            orderSubtotal += item.price * item.qty;
            orderDiscount += item.on_promo ? (item.price - item.promo_price) : 0;
        })

        orderTotal = (orderSubtotal - orderDiscount) + zonePrice;


        console.log("orderSubtotal", orderSubtotal);
        console.log("orderDiscount", orderDiscount);
        console.log("orderTotal", orderTotal);



        //Create order and retrieve id
        const result = await db.insert(order)
            .values({
                status_id,
                order_number,
                user_id,
                guest: guest_order,
                zone_id,
                note: note,
                subtotal: orderSubtotal,
                discount: orderDiscount,
                shipping_cost: zonePrice,
                total: orderTotal
            })
            .returning({ id: order.id })


        const order_id = result[0].id


        // Create order items

        items.forEach(async (item) => {
            const itemPrice = item.on_promo ? item.promo_price : item.price;
            await db.insert(orderItem).values({
                order_id,
                product_id: item.product_id,
                variant_id: item.id,
                promo: item.on_promo,
                qty: 1,
                buy_price: Number(item.buy_price),
                price: itemPrice,
                total: zone!.price! + itemPrice!
            })

            // Handle product quantity
            if (item.track_stock) {
                await db.update(productVariant).set({ stock: item.stock! - 1 })
            }

        })


        // Create order info

        await db.insert(OrderInfo).values({
            order_id,
            name,
            phone,
            wilaya_id,
            commune_id,
            address,
            postal,
        })

        // Create order creation instance in order history
        await db.insert(orderHistory).values({
            order_id,
            status_id,
            note: "Commande créée"
        })


        revalidatePath('/admin/orders')
        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création de la commande" }
    }
}


export const createQuickOrder = async (orderData: z.infer<typeof OrderFormScema>, item: VariantWithValuesImagesType): Promise<ActionResult> => {
    try {

        const { user_id, guest_order, zone_id, note, name, commune_id, wilaya_id, address, postal, phone } = orderData;

        // Get default order status id
        const defaultOrderStatus = await db.query.orderStatus.findFirst({
            where: {
                default: true
            }
        });

        const status_id = defaultOrderStatus?.id!;

        // Get Delivery Zone Data
        const zone = await db.query.shippingZone.findFirst({
            where: {
                id: orderData.zone_id
            }
        });



        // Generate an order number
        const order_number = new Date().getTime().toString() + (Math.floor(Math.random() * 9) + 1).toString();


        // Calculations
        const itemPrice = item.on_promo ? item.promo_price : item.price;
        const zonePrice = zone?.price!;
        const discount = item.on_promo ? (item.price - item.promo_price) : 0;
        const total = zonePrice + itemPrice!;


        //Create order and retrieve id
        const result = await db.insert(order)
            .values({
                status_id,
                order_number,
                user_id,
                guest: guest_order,
                zone_id,
                note: note,
                subtotal: itemPrice,
                discount,
                shipping_cost: zonePrice,
                total
            })
            .returning({ id: order.id })


        const order_id = result[0].id


        // Create order item
        await db.insert(orderItem).values({
            order_id,
            product_id: item.product_id,
            variant_id: item.id,
            promo: item.on_promo,
            qty: 1,
            buy_price: Number(item.buy_price),
            price: itemPrice,
            total: zone!.price! + itemPrice!
        })

        // Create order info

        await db.insert(OrderInfo).values({
            order_id,
            name,
            phone,
            wilaya_id,
            commune_id,
            address,
            postal,
        })

        // Create order creation instance in order history

        await db.insert(orderHistory).values({
            order_id,
            status_id,
            note: "Commande créée"
        })

        // Handle product quantity
        if (item.track_stock) {
            await db.update(productVariant).set({ stock: item.stock! - 1 })
        }

        revalidatePath('/admin/orders')
        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la création de la commande" }
    }
}


export const deleteOrder = async (id: number): Promise<ActionResult> => {

    try {
        // Delete order
        await db.delete(order).where(eq(order.id, id))


        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de la commande" }
    }

}


export const updateOrderStatus = async (order_id: number, status_id: number, note?: string): Promise<ActionResult> => {

    try {
        // Update order
        await db.update(order).set({
            status_id
        }).where(eq(order.id, order_id))

        // Record Instance
        await db.insert(orderHistory).values({
            order_id,
            status_id,
            note
        })

        revalidatePath(`/admin/orders/manage/${order_id}`)
        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Erreur lors de la suppression de la commande" }
    }

}