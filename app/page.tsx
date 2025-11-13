"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MenuBrowser } from "@/components/menu-browser"
import { Cart } from "@/components/cart"

export default function Page() {
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    const savedCart = sessionStorage.getItem("cartItems")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems))
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    sessionStorage.setItem("cartTotal", JSON.stringify(total))
  }, [cartItems])

  const addToCart = (meal) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === meal.id)
      if (existing) {
        return prev.map((item) => (item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...meal, quantity: 1 }]
    })
  }

  const removeFromCart = (mealId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== mealId))
  }

  const updateQuantity = (mealId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(mealId)
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === mealId ? { ...item, quantity } : item)))
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header cartCount={cartItems.length} onCartClick={() => setShowCart(!showCart)} />
      <main className="flex-1 w-full">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 container mx-auto px-4 py-6 lg:py-8 lg:pr-0">
            <MenuBrowser onAddToCart={addToCart} />
          </div>
          {/* Cart drawer on mobile, sidebar on desktop */}
          {showCart && (
            <div className="fixed inset-0 top-16 z-40 lg:relative lg:inset-auto lg:top-auto lg:col-span-1 lg:block bg-black/50 lg:bg-transparent">
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-md lg:max-w-none lg:relative lg:bg-transparent lg:bg-none bg-background rounded-l-lg lg:rounded-none shadow-lg lg:shadow-none">
                <div className="p-4 lg:p-6 sticky top-0 bg-background lg:bg-transparent">
                  <div className="flex justify-between items-center mb-4 lg:mb-0">
                    <h2 className="text-lg font-semibold lg:hidden">Shopping Cart</h2>
                    <button
                      onClick={() => setShowCart(false)}
                      className="lg:hidden text-2xl font-bold text-foreground hover:text-muted-foreground"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-120px)] px-4 lg:px-0">
                  <Cart
                    items={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    showCheckoutButton={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
