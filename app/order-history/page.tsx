"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Download, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from "next/link"

interface Order {
  id: number
  student_name: string
  student_id: string
  email: string
  order_date: string
  pickup_time: string
  total_amount: number
  status: string
  created_at: string
  order_items: Array<{
    meal_name: string
    quantity: number
    price: number
  }>
}

export default function OrderHistoryPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [studentEmail, setStudentEmail] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders")
      const data = await response.json()
      if (data.success) {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReorderFavorite = (order: Order) => {
    // Save favorite items to sessionStorage for quick reorder
    const cartItems = order.order_items.map((item) => ({
      id: item.meal_name,
      name: item.meal_name,
      quantity: item.quantity,
      price: item.price,
    }))
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems))
    sessionStorage.setItem("cartTotal", JSON.stringify(order.total_amount))
    router.push("/")
  }

  const handleDownloadReceipt = (order: Order) => {
    const receiptContent = `
ORDER RECEIPT
====================
Order ID: ${order.id}
Student Name: ${order.student_name}
Student ID: ${order.student_id}
Email: ${order.email}
Order Date: ${new Date(order.order_date).toLocaleDateString()}
Pickup Time: ${order.pickup_time === "break" ? "Break Time" : "Lunch Time"}
Status: ${order.status.toUpperCase()}

ITEMS ORDERED:
${order.order_items.map((item) => `- ${item.meal_name} x${item.quantity} @ RM${item.price.toFixed(2)} = RM${(item.price * item.quantity).toFixed(2)}`).join("\n")}

Total Amount: RM${order.total_amount.toFixed(2)}
====================
Generated: ${new Date().toLocaleString()}
    `

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(receiptContent))
    element.setAttribute("download", `receipt-${order.id}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-6 lg:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6 lg:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-2">View and manage your past orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link href="/">
              <Button>Start Ordering</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List Column */}
            <div className="lg:col-span-1 space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className={`p-4 cursor-pointer transition-colors ${selectedOrder?.id === order.id ? "border-2 border-primary bg-primary/5" : "hover:border-primary/50"}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">Order #{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 capitalize">
                      {order.status}
                    </span>
                  </div>
                  <p className="font-bold text-primary">RM{order.total_amount.toFixed(2)}</p>
                </Card>
              ))}
            </div>

            {/* Order Details Column */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Details</h2>

                  {/* Order Info */}
                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student Name:</span>
                      <span className="font-semibold">{selectedOrder.student_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student ID:</span>
                      <span className="font-semibold">{selectedOrder.student_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup Time:</span>
                      <span className="font-semibold capitalize">
                        {selectedOrder.pickup_time === "break" ? "Break Time" : "Lunch Time"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-semibold capitalize">{selectedOrder.status}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Items Ordered</h3>
                    <div className="space-y-2">
                      {selectedOrder.order_items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.meal_name} x{item.quantity}
                          </span>
                          <span className="font-semibold">RM{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">RM{selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => handleDownloadReceipt(selectedOrder)}
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download Receipt</span>
                    </Button>
                    <Button className="flex-1 gap-2" onClick={() => handleReorderFavorite(selectedOrder)}>
                      <Heart className="w-4 h-4" />
                      <span className="hidden sm:inline">Reorder</span>
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center">
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
