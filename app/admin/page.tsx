"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminOrdersTable from "@/components/admin-orders-table"
import AdminOrderDetails from "@/components/admin-order-details"
import AdminStats from "@/components/admin-stats"

interface Order {
  id: string
  student_name: string
  student_id: string
  email: string
  order_date: string
  total_amount: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at: string
  order_items: any[]
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Fetch orders from API
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/orders")
      const result = await response.json()

      if (result.success && result.data) {
        setOrders(result.data)
        setFilteredOrders(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage and track all meal preorders</p>
        </div>

        {/* Stats */}
        <AdminStats orders={orders} />

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by student name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button onClick={fetchOrders} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <Card className="p-8 text-center">
                <p className="text-slate-600">Loading orders...</p>
              </Card>
            ) : (
              <AdminOrdersTable
                orders={filteredOrders}
                selectedOrder={selectedOrder}
                onSelectOrder={setSelectedOrder}
              />
            )}
          </div>

          {/* Order Details Panel */}
          <div>
            {selectedOrder ? (
              <AdminOrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="pt-6">
                  <p className="text-center text-slate-600">Select an order to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
