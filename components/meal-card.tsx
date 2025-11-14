"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Flame, Heart } from 'lucide-react'
import { useState, useEffect } from "react"

interface MealCardProps {
  meal: {
    id: string
    name: string
    description: string
    price: number
    category: string
    calories: number
    image: string
  }
  onAddToCart: () => void
}

export function MealCard({ meal, onAddToCart }: MealCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [studentEmail, setStudentEmail] = useState("")

  useEffect(() => {
    // Get student email from checkout form if available
    const cartData = sessionStorage.getItem("cartData")
    if (cartData) {
      try {
        const data = JSON.parse(cartData)
        setStudentEmail(data.email || "")
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  const handleToggleFavorite = async () => {
    if (!studentEmail) {
      // Store favorite locally if no email available
      setIsFavorite(!isFavorite)
      return
    }

    try {
      if (isFavorite) {
        await fetch(`/api/favorites?email=${studentEmail}&mealId=${meal.id}`, {
          method: "DELETE",
        })
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentEmail,
            mealId: meal.id,
          }),
        })
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img src={meal.image || "/placeholder.svg"} alt={meal.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium flex items-center gap-1">
          <Flame className="w-3 h-3" />
          <span>{meal.calories}</span>
        </div>
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 left-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>
      <div className="p-3 lg:p-4">
        <h3 className="font-semibold text-base lg:text-lg mb-1 lg:mb-2 line-clamp-2">{meal.name}</h3>
        <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4 line-clamp-2">{meal.description}</p>
        <div className="flex justify-between items-center gap-2">
          <span className="text-base lg:text-lg font-bold text-primary">RM {meal.price.toFixed(2)}</span>
          <Button onClick={onAddToCart} size="sm" className="gap-1 lg:gap-2 text-xs lg:text-sm">
            <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
