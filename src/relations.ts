import { defineRelations } from "drizzle-orm";
import { attribute, attributeValues, category, product, productVariant, productVariantValues, variantImage, variantThumbnail } from "./db/schema";



export const relations = defineRelations({ product, productVariant, productVariantValues, variantImage, variantThumbnail, category, attribute, attributeValues }, (r) => ({
    product: {
        variants: r.many.productVariant(),
    },
    productVariant: {
        product: r.one.product({
            from: r.productVariant.product_id,
            to: r.product.id
        }),
        values: r.many.productVariantValues(),
        images: r.many.variantImage(),
        thumbnails: r.many.variantThumbnail()
    },
    productVariantValues: {
        variant: r.one.productVariant({
            from: r.productVariantValues.variant_id,
            to: r.productVariant.id
        }),
        attribute: r.one.attribute({
            from: r.productVariantValues.attribute_id,
            to: r.attribute.id
        }),
        value: r.one.attributeValues({
            from: r.productVariantValues.value_id,
            to: r.attributeValues.id
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
        variantValues: r.many.productVariantValues()
    },
    attributeValues: {
        attribute: r.one.attribute({
            from: r.attributeValues.attribute_id,
            to: r.attribute.id,
        }),
    },
}));