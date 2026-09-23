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
}));