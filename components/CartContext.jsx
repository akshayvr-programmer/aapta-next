'use client'

import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addToCart(product) {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function removeFromCart(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.length
  const totalPrice = items.reduce((sum, i) => sum + i.price, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
