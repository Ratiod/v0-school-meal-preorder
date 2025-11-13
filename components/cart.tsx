"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CartItem } from "./cart-item"
import { useRouter } from "next/navigation"

interface CartProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  showCheckoutButton?: boolean
}

export function Cart({ items, onUpdateQuantity, onRemove, showCheckoutButton = true }: CartProps) {
  const router = useRouter()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <Card className="p-4 lg:p-6 sticky top-24 lg:sticky lg:top-24 lg:w-96">
      <h2 className="text-lg lg:text-xl font-semibold mb-4 hidden lg:block">Shopping Cart</h2>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-6 lg:py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-3 max-h-64 lg:max-h-96 overflow-y-auto mb-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />
            ))}
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <div className="flex justify-between items-center mb-2 text-sm lg:text-base">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>RM {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-base lg:text-lg">
              <span>Total:</span>
              <span className="text-primary">RM {total.toFixed(2)}</span>
            </div>
          </div>

          {showCheckoutButton && (
            <Button onClick={handleCheckout} className="w-full" size="lg">
              Checkout
            </Button>
          )}
        </>
      )}
    </Card>
  )
}
