import { NextResponse } from "next/server"
import { MEALS_BY_CATEGORY } from "@/lib/meal-data"

export async function GET() {
  try {
    // Return all meals flattened from categories
    const allMeals = Object.values(MEALS_BY_CATEGORY).flat()

    return NextResponse.json({
      success: true,
      data: allMeals,
      count: allMeals.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch meals" }, { status: 500 })
  }
}
