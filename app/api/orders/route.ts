import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Validate required fields
    if (!body.studentName || !body.studentId || !body.email || !body.date || !body.items) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Insert order into database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          student_name: body.studentName,
          student_id: body.studentId,
          email: body.email,
          order_date: body.date,
          pickup_time: body.pickupTime || "lunch",
          notes: body.notes || "",
          total_amount: body.total,
          status: "pending",
          user_id: body.userId || null,
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = body.items.map((item: any) => ({
      order_id: order.id,
      meal_id: item.id,
      meal_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json({
      success: true,
      message: "Order submitted successfully",
      data: order,
    })
  } catch (error) {
    console.error("Order submission error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders?.length || 0,
    })
  } catch (error) {
    console.error("Fetch orders error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
