"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  student_name: string
  student_id: string
  email: string
  order_date: string
  pickup_time: string
  total_amount: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at: string
  notes: string
  order_items: Array<{
    meal_name: string
    quantity: number
    price: number
  }>
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*)
        `,
        )
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6 lg:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Menu
            </Button>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-2">Track your meal orders and check their status</p>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading orders...</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
            <Link href="/">
              <Button>Browse Meals</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedOrder?.id === order.id ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-lg font-semibold">{new Date(order.order_date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Pickup: {order.pickup_time === "break" ? "Break Time" : "Lunch Time"}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="text-xs font-medium capitalize">{order.status}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.order_items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.meal_name} x{item.quantity}
                          </span>
                          <span className="font-medium">RM{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary">RM{order.total_amount.toFixed(2)}</span>
                    </div>

                    {order.status === "cancelled" && (
                      <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-sm">
                        This order has been cancelled. The item may be out of stock.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              {selectedOrder ? (
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedOrder.status)}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        <span className="text-sm font-medium capitalize">{selectedOrder.status}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                      <p className="font-medium">{new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pickup Time</p>
                      <p className="font-medium">
                        {selectedOrder.pickup_time === "break" ? "Break Time" : "Lunch Time"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Student Name</p>
                      <p className="font-medium">{selectedOrder.student_name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Student ID</p>
                      <p className="font-medium">{selectedOrder.student_id}</p>
                    </div>

                    {selectedOrder.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm bg-muted p-2 rounded">{selectedOrder.notes}</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">
                          RM{selectedOrder.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Select an order to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
