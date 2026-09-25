import { CartItemsType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const createCartStore = () => {
    return create<CartItemsType>()(
        persist(
            (set) => ({
                items: [],
                isOpen: false,
                add: (item) =>
                    set((state) => ({
                        items: [...state.items, item],
                    })),

                remove: (id) =>
                    set((state) => ({
                        items: state.items.filter((i) => i.id !== id),
                    })),

                changeQty: (id, qty) =>
                    set((state) => ({
                        items: state.items.map((item) =>
                            item.id === id
                                ? { ...item, qty }
                                : item
                        ),
                    })),
                open: () => set(state => ({ ...state, isOpen: true })),
                close: () => set(state => ({ ...state, isOpen: false }))
            }),
            {
                name: "cart-storage",
                partialize: (state) => ({
                    items: state.items
                }),
            }
        )
    )
} 