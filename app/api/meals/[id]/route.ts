import { NextResponse } from "next/server"
import { MEALS_BY_CATEGORY } from "@/lib/meal-data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Find meal by ID across all categories
    const allMeals = Object.values(MEALS_BY_CATEGORY).flat()
    const meal = allMeals.find((m) => m.id === id)

    if (!meal) {
      return NextResponse.json({ success: false, error: "Meal not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: meal,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch meal" }, { status: 500 })
  }
}
