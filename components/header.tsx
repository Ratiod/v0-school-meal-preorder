"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 lg:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm lg:text-lg">M</span>
          </div>
          <h1 className="text-lg lg:text-2xl font-bold text-foreground truncate">School Meals</h1>
        </div>
        <Button
          onClick={onCartClick}
          variant="outline"
          size="sm"
          className="relative bg-transparent flex-shrink-0 gap-1 lg:gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
