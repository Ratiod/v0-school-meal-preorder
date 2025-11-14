import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    if (!body.studentEmail || !body.mealId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase.from("favorites").insert([
      {
        student_email: body.studentEmail,
        meal_id: body.mealId,
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json({ success: false, error: "Already favorited" }, { status: 400 })
    }
    console.error("Favorite error:", error)
    return NextResponse.json({ success: false, error: "Failed to add favorite" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentEmail = searchParams.get("email")
    const mealId = searchParams.get("mealId")

    const supabase = await createClient()

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("student_email", studentEmail)
      .eq("meal_id", mealId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete favorite error:", error)
    return NextResponse.json({ success: false, error: "Failed to remove favorite" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentEmail = searchParams.get("email")

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("favorites")
      .select("meal_id")
      .eq("student_email", studentEmail)

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Fetch favorites error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch favorites" }, { status: 500 })
  }
}
