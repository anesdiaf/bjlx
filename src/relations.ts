import { defineRelations } from "drizzle-orm";
import { attribute, attributeValues, category, product, productVariant } from "./db/schema";



export const relations = defineRelations({ product, productVariant, category, attribute, attributeValues }, (r) => ({
    attributeValues: {
        attribute: r.one.attribute({
            from: r.attributeValues.attribute_id,
            to: r.attribute.id,
        }),
    },
    attribute: {
        values: r.many.attributeValues(),
    },
}));