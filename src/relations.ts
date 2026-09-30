import { defineRelations } from "drizzle-orm";
import { attribute, attributeValues, category, commune, order, orderHistory, OrderInfo, orderItem, orderStatus, product, productVariant, productVariantValues, shippingProvider, shippingZone, userInfo, variantImage, variantThumbnail, wilaya } from "./db/schema";
import { user } from "./db/auth-schema";



export const relations = defineRelations(
    {
        product, productVariant, productVariantValues, variantImage, variantThumbnail,
        category, attribute, attributeValues,
        shippingProvider, shippingZone, wilaya, commune,
        user, userInfo,
        order, orderItem, orderStatus, OrderInfo, orderHistory
    }
    , (r) => ({
        product: {
            variants: r.many.productVariant(),
            orderItems: r.many.orderItem({
                from: r.product.id,
                to: r.orderItem.product_id
            })
        },
        productVariant: {
            product: r.one.product({
                from: r.productVariant.product_id,
                to: r.product.id
            }),
            values: r.many.productVariantValues(),
            images: r.many.variantImage(),
            thumbnails: r.many.variantThumbnail(),
            orderItems: r.many.orderItem({
                from: r.productVariant.id,
                to: r.orderItem.variant_id
            })
        },
        productVariantValues: {
            product: r.one.product({
                from: r.productVariantValues.product_id,
                to: r.product.id
            }),
            variant: r.one.productVariant({
                from: r.productVariantValues.variant_id,
                to: r.productVariant.id
            })
        },
        variantImage: {
            variant: r.one.productVariant({
                from: r.variantImage.variant_id,
                to: r.productVariant.id
            })
        },
        variantThumbnail: {
            variant: r.one.productVariant({
                from: r.variantThumbnail.variant_id,
                to: r.productVariant.id
            })
        },
        attribute: {
            values: r.many.attributeValues(),
        },
        attributeValues: {
            attribute: r.one.attribute({
                from: r.attributeValues.attribute_id,
                to: r.attribute.id,
            }),
        },
        wilaya: {
            communes: r.many.commune(),
            zones: r.many.shippingZone(),
        },
        commune: {
            wilaya: r.one.wilaya({
                from: r.commune.wilaya_id,
                to: r.wilaya.id
            }),
            zones: r.many.shippingZone(),
        },
        shippingProvider: {
            zones: r.many.shippingZone()
        },
        shippingZone: {
            shippingProvider: r.one.shippingProvider({
                from: r.shippingZone.provider_id,
                to: r.shippingProvider.id
            }),
            wilaya: r.one.wilaya({
                from: r.shippingZone.wilaya_id,
                to: r.wilaya.id
            }),
            commune: r.one.commune({
                from: r.shippingZone.commune_id,
                to: r.commune.id
            }),
        },
        userInfo: {
            user: r.one.user({
                from: r.userInfo.user_id,
                to: r.user.id
            })
        },
        order: {
            orderStatus: r.one.orderStatus({
                from: r.order.status_id,
                to: r.orderStatus.id
            }),
            items: r.many.orderItem(),
            info: r.one.OrderInfo(),
            history: r.many.orderHistory({
                from: r.order.id,
                to: r.orderHistory.order_id
            }),
            zone: r.one.shippingZone({
                from: r.order.zone_id,
                to: r.shippingZone.id
            })
        },
        orderItem: {
            order: r.one.order({
                from: r.orderItem.order_id,
                to: r.order.id
            }),
            variant: r.one.productVariant({
                from: r.orderItem.variant_id,
                to: r.productVariant.id
            }),
            product: r.one.product({
                from: r.orderItem.product_id,
                to: r.product.id
            }),
        },
        OrderInfo: {
            order: r.one.order({
                from: r.OrderInfo.order_id,
                to: r.order.id
            })
        },
        orderHistory: {
            order: r.one.order({
                from: r.orderHistory.order_id,
                to: r.order.id
            }),
            status: r.one.orderStatus({
                from: r.orderHistory.status_id,
                to: r.orderStatus.id
            })
        }
    }));