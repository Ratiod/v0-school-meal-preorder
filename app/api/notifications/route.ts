import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    if (!body.orderId || !body.studentEmail || !body.message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase.from("notifications").insert([
      {
        order_id: body.orderId,
        student_email: body.studentEmail,
        message: body.message,
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Notification error:", error)
    return NextResponse.json({ success: false, error: "Failed to create notification" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentEmail = searchParams.get("email")

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("student_email", studentEmail)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Fetch notifications error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}
