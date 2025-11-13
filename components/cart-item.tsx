"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, X } from "lucide-react"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity: number
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
        <p className="text-xs text-muted-foreground">RM {item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 bg-transparent"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="w-2.5 h-2.5" />
        </Button>
        <span className="w-5 text-center font-medium text-xs">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 bg-transparent"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="w-2.5 h-2.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1" onClick={() => onRemove(item.id)}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
