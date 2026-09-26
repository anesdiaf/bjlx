'use client'

import { CartItemsType } from '@/types'
import { type ReactNode, createContext, useState, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { createCartStore } from './cart-store'


export type CartStoreApi = ReturnType<typeof createCartStore>

export const CartStoreContext = createContext<CartStoreApi | undefined>(undefined)

export interface CartStoreProviderProps {
  children: ReactNode
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  const [store] = useState(() => createCartStore())

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "cart-storage") {
        store.persist.rehydrate();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [store]);

  useEffect(() => {
    const unsub = store.persist.onFinishHydration(() => {
      store.setState({
        itemsLoaded: true,
      });
    });

    if (store.persist.hasHydrated()) {
      store.setState({
        itemsLoaded: true,
      });
    }

    return unsub;
  }, [store]);

  return <CartStoreContext.Provider value={store}>{children}</CartStoreContext.Provider>
}

export const useCartStore = <T,>(selector: (store: CartItemsType) => T): T => {
  const cartStoreContext = useContext(CartStoreContext)
  if (!cartStoreContext) {
    throw new Error(`useCartStore must be used within CartStoreProvider`)
  }

  return useStore(cartStoreContext, selector)
}