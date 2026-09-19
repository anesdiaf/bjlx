import { boolean, decimal, integer, jsonb, text, timestamp, varchar } from "drizzle-orm/pg-core/columns";
import { pgTable } from "drizzle-orm/pg-core/table";
import { user } from "./auth-schema";
import { index, uniqueIndex } from "drizzle-orm/pg-core";
import { table } from "console";
import { defineRelations } from "drizzle-orm";


export const carousel = pgTable("carousel", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    enabled: boolean().default(true).notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp()
})

export const carouselImage = pgTable("carousel_image", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    carousel_id: integer().references(() => carousel.id),
    image: text(),
    file: text(),
    lang: varchar({ length: 2 }),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp()
}, (table) => [
    index("carousel_id_idx").on(table.carousel_id)
])


export const wilaya = pgTable("wilaya", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    code: integer(),
    name: varchar({ length: 255 }),
    ar_name: varchar({ length: 255 }),
})

export type wilayaType = typeof wilaya.$inferSelect;

export const commune = pgTable("commune", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    post_code: integer(),
    name: varchar({ length: 255 }),
    ar_name: varchar({ length: 255 }),
    wilaya_id: integer().references(() => wilaya.id)
}, (table) => [
    index("wilaya_id_idx").on(table.wilaya_id)
])

export type communeType = typeof commune.$inferSelect;

export const userInfo = pgTable("user_info", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: text().references(() => user.id).unique(),
    address: varchar({ length: 255 }),
    postal: varchar({ length: 5 }),
    phone: varchar({ length: 10 }),
    wilaya_id: integer().references(() => wilaya.id),
    commune_id: integer().references(() => commune.id)
}, (table) => [
    uniqueIndex("user_id_idx").on(table.user_id)
])

export type userDataType = typeof userInfo.$inferSelect;


export const category = pgTable("category", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 64 }).notNull(),
    status: boolean().default(true).notNull(),
    desc: text(),
    meta_url_key: varchar({ length: 255 }).unique().notNull(),
    meta_title: varchar({ length: 64 }).notNull(),
    meta_desc: text().notNull(),
    thumbnail: text(),
    image: text(),
    order: integer().notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().$onUpdate(() => new Date())
}, (table) => [
    uniqueIndex("meta_url_key_idx").on(table.meta_url_key)
])

export type categoryType = typeof category.$inferSelect;
export type categoryInsertType = typeof category.$inferInsert;



export const attribute = pgTable("attribute", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().$onUpdate(() => new Date())
})

export type attributeType = typeof attribute.$inferSelect;

export const attributeValues = pgTable("attribute_values", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    attribute_id: integer().references(() => attribute.id, { onDelete: "cascade" }),
    value: varchar({ length: 255 }).notNull(),
})


export type attributeValuesType = typeof attributeValues.$inferSelect;


export type attributeWithValuesType = attributeType & {
    values: attributeValuesType[]
}

export const collection = pgTable("collection", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 64 }).notNull(),
    desc: text().notNull(),
    meta_url_key: varchar({ length: 255 }).unique().notNull(),
    meta_title: varchar({ length: 64 }).notNull(),
    meta_desc: text().notNull(),
    thumbnail: text(),
    image: text(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().$onUpdate(() => new Date())
})


export const product = pgTable("product", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    desc: text(),
    category_id: integer().references(() => category.id),
    collection_id: integer().references(() => collection.id),
    status: boolean(),
    featured: boolean().default(false),
    meta_url_key: varchar({ length: 255 }).unique().notNull(),
    meta_title: varchar({ length: 255 }).notNull(),
    meta_desc: text().notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().$onUpdate(() => new Date())
}, (table) => [
    index("product_category_idx").on(table.category_id),
    index("product_collection_idx").on(table.collection_id),
    index("product_status_idx").on(table.status),
])

export type productType = typeof product.$inferSelect;
export type productInsertType = typeof product.$inferInsert;


export const productVariant = pgTable("product_variant", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    product_id: integer().references(() => product.id, { onDelete: "cascade" }),
    sku: varchar({ length: 255 }).notNull(),
    stock: integer().default(0),
    track_stock: boolean().default(false),
    price: decimal().notNull(),
    buy_price: decimal().notNull(),
    promo_price: decimal(),
    on_promo: boolean().default(false),
    status: boolean().default(true),
    default: boolean(),
}, (table) => [
    index("variant_product_id_idx").on(table.product_id),
    index("variant_status_idx").on(table.status)
])

export type producVariantType = typeof productVariant.$inferSelect;
export type producVariantInsertType = typeof productVariant.$inferInsert;

export const variantImage = pgTable("variant_image", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    product_id: integer().references(() => product.id, { onDelete: "cascade" }),
    variant_id: integer().references(() => productVariant.id, { onDelete: "cascade" }),
    url: text().notNull(),
    order: integer()
}, (table) => [
    index("product_image_id_idx").on(table.product_id),
    index("variant_image_id_idx").on(table.variant_id)
])


export type variantImageType = typeof variantImage.$inferSelect;

export const variantThumbnail = pgTable("variant_thumbnail", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    product_id: integer().references(() => product.id, { onDelete: "cascade" }),
    variant_id: integer().references(() => productVariant.id, { onDelete: "cascade" }),
    url: text().notNull(),
    order: integer()
}, (table) => [
    index("product_thumbnail_id_idx").on(table.product_id),
    index("variant_thumbnail_id_idx").on(table.variant_id)
])

export type variantThumbnailType = typeof variantThumbnail.$inferSelect;

// After creating the product base when creating a variant i show attributes, when an attribute value (i.e: Red, XL, Special Box....) the variant is linked directly to attribute because the value is linked to that attribute -> See attributeValues table
export const productVariantValues = pgTable("product_variant_values", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    product_id: integer().references(() => product.id, { onDelete: "cascade" }),
    variant_id: integer().references(() => productVariant.id, { onDelete: "cascade" }),
    attribute_id: integer().references(() => attribute.id, { onDelete: "set null" }),
    value_id: integer().references(() => attributeValues.id, { onDelete: "set null" })
}, (table) => [
    index("product_value_id_idx").on(table.product_id),
    index("variant_id_idx").on(table.variant_id),
    index("variant_attribute_id_idx").on(table.attribute_id),
    index("value_id_idx").on(table.value_id)
])

export type productVariantValuesType = typeof productVariantValues.$inferSelect;
