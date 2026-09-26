import { CartItemsType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const createCartStore = () => {
    return create<CartItemsType>()(
        persist(
            (set, get, store) => ({
                items: [],
                itemsLoaded: false,
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
                open: () => set({ isOpen: true }),
                close: () => set({ isOpen: false }),
                reset: () => set(store.getInitialState())
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