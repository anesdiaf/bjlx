import { defineRelations } from "drizzle-orm";
import { attribute, attributeValues, category, product, productVariant, variantThumbnail } from "./db/schema";



export const relations = defineRelations({ product, productVariant,variantThumbnail , category, attribute, attributeValues }, (r) => ({
    attribute: {
        values: r.many.attributeValues(),
    },
    attributeValues: {
        attribute: r.one.attribute({
            from: r.attributeValues.attribute_id,
            to: r.attribute.id,
        }),
    },
    product: {
        variants: r.many.productVariant(),
    },
    productVariant: {
        product: r.one.product({
            from: r.productVariant.product_id,
            to: r.product.id
        }),
        thumbnails: r.many.variantThumbnail()

    },
    variantThumbnail: {
        variant: r.one.productVariant({
            from: r.variantThumbnail.variant_id,
            to: r.productVariant.id
        })
    }
}));