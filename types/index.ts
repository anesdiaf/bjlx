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
    }[];
    images: {
        id: number;
        order: number | null;
        product_id: number | null;
        variant_id: number | null;
        url: string;
    }[];
}

