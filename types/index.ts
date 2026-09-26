import { variantImageType } from "@/src/db/schema";
import z from "zod";


// User

export interface userWithDataType {
    id: number;
    phone: string | null;
    wilaya_id: number | null;
    commune_id: number | null;
    address: string | null;
    postal: string | null;
    user_id: string | null;
    user: {
        id: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string;
        emailVerified: boolean;
        role: string | null;
        banned: boolean | null;
        banReason: string | null;
        banExpires: Date | null;
    } | null;
}




export type ActionResult<T = void> =
    | { success: true, data?: any }
    | { success: false, error: string }


export interface AttributeWithValuesType {
    id: number;
    title: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    values: {
        id: number;
        attribute_id: number | null;
        value: string;
    }[];
}


export interface AttributesObjectsWithValues {
    [key: number]: VaraintValuesWithData[] & { id?: number }
}


// Product

export interface PorductWithDetailsType {
    title: string;
    desc: string | null;
    id: number;
    status: boolean | null;
    meta_url_key: string;
    meta_title: string;
    meta_desc: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    category_id: number | null;
    collection_id: number | null;
    featured: boolean | null;
    variants: {
        id: number;
        status: boolean | null;
        default: boolean | null;
        sku: string;
        product_id: number | null;
        stock: number | null;
        track_stock: boolean | null;
        price: string;
        buy_price: string;
        promo_price: string | null;
        on_promo: boolean | null;
        values: {
            variant_id: number | null;
            values: VariantValues | null;
            id: number;
            product_id: number | null;
        }[];
        images: {
            id: number;
            url: string;
            order: number | null;
            product_id: number | null;
            variant_id: number | null;
        }[];
    }[];
}

// Product Variant
export interface VaraintValuesWithData {
    id: number;
    product_id: number | null;
    variant_id: number | null;
    attribute_id: number | null;
    value_id: number | null;
    attribute: {
        id: number;
        title: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    } | null;
    value: {
        id: number;
        attribute_id: number | null;
        value: string;
    } | null;
}

export interface VariantWithValuesImagesType {
    id: number;
    status: boolean | null;
    default: boolean | null;
    product_id: number | null;
    sku: string;
    stock: number | null;
    track_stock: boolean | null;
    price: string;
    buy_price: string;
    promo_price: string | null;
    on_promo: boolean | null;
    values: {
        id: number;
        product_id: number | null;
        variant_id: number | null;
        values: {
            [key: number]: number;
        } | null;
    }[];
    images: {
        id: number;
        order: number | null;
        product_id: number | null;
        variant_id: number | null;
        url: string;
    }[];
}




export interface VariantValues {
    [key: number]: number;
}
export interface productValues {
    [key: number]: number[]
}




// Shipping

export interface shippingProviderWithZonesType {
    id: number;
    wilaya_id: number | null;
    commune_id: number | null;
    address: string | null;
    postal: string | null;
    status: boolean | null;
    title: string | null;
    phone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    zones: {
        id: number;
        wilaya_id: number | null;
        type: string | null;
        price: number;
        commune_id: number | null;
        address: string | null;
        postal: string | null;
        status: boolean | null;
        provider_id: number | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[];
}


export interface WilayasWithCommunesType {
    id: number;
    name: string | null;
    code: number | null;
    ar_name: string | null;
    communes: {
        id: number;
        name: string | null;
        ar_name: string | null;
        wilaya_id: number | null;
        post_code: number | null;
    }[];
}


export interface CartProductVariantType {
    id: number;
    status: boolean | null;
    default: boolean | null;
    product_id: number | null;
    sku: string;
    stock: number | null;
    track_stock: boolean | null;
    price: string;
    buy_price: string;
    promo_price: string | null;
    on_promo: boolean | null;
    qty: number | null;
    product: {
        id: number;
        title: string;
        desc: string | null;
        status: boolean | null;
        meta_url_key: string;
        meta_title: string;
        meta_desc: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        category_id: number | null;
        collection_id: number | null;
        featured: boolean | null;
    } | null;
    values: {
        id: number;
        product_id: number | null;
        variant_id: number | null;
        values: VariantValues | null;
    }[];
    thumbnails: {
        id: number;
        order: number | null;
        product_id: number | null;
        variant_id: number | null;
        url: string;
    }[];
}

// Orders
// Cart
export type SingleCartItemType =  {title: string, qty: number} & VariantWithValuesImagesType;
export interface CartItemsType {
    items: SingleCartItemType[]
    itemsLoaded: boolean,
    isOpen: boolean
    add: (item: SingleCartItemType) => void,
    remove: (id: number) => void,
    changeQty: (id: number, qty: number) => void
    open: () => void
    close: () => void,
    reset: () => void
}


// Form schemas
export const providerFromSchema = z.object({
    title: z.string().min(2).max(32),
    phone: z.string().length(10),
    wilaya_id: z.number(),
    commune_id: z.number(),
    address: z.string().max(255),
    postal: z.string().max(5),
    status: z.boolean(),
})


export const shippingZoneFromSchema = z.object({
    type: z.string().min(2).max(32),
    price: z.number(),
    wilaya_id: z.number(),
    commune_id: z.number(),
    address: z.string().max(255),
    postal: z.string().max(5),
    status: z.boolean(),
    provider_id: z.number()
})

export const OrderFormScema = z.object({
    name: z.string().min(2).max(32),
    phone: z.string().length(10),
    wilaya_id: z.number(),
    commune_id: z.number(),
    address: z.string().max(255),
    postal: z.string().max(5),
    note: z.string(),
    zone_id: z.number().optional(),
    user_id: z.string().optional(),
    guest_order: z.boolean()
})


