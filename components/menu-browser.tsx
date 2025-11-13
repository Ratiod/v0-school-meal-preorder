"use client"

import { useState } from "react"
import { MealCard } from "./meal-card"
import { MEALS_BY_CATEGORY } from "@/lib/meal-data"

interface MenuBrowserProps {
  onAddToCart: (meal: any) => void
}

export function MenuBrowser({ onAddToCart }: MenuBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Object.keys(MEALS_BY_CATEGORY)
  const mealsToDisplay = selectedCategory
    ? MEALS_BY_CATEGORY[selectedCategory]
    : Object.values(MEALS_BY_CATEGORY).flat()

  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Browse Meals</h2>
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 lg:px-4 py-2 rounded-full font-medium transition-colors text-sm lg:text-base whitespace-nowrap flex-shrink-0 lg:flex-shrink ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 lg:px-4 py-2 rounded-full font-medium transition-colors text-sm lg:text-base whitespace-nowrap flex-shrink-0 lg:flex-shrink ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        {mealsToDisplay.map((meal) => (
          <MealCard key={meal.id} meal={meal} onAddToCart={() => onAddToCart(meal)} />
        ))}
      </div>
    </div>
  )
}
