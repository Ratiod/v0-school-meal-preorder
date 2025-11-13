"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  student_name: string
  student_id: string
  order_date: string
  total_amount: number
  status: string
  created_at: string
  order_items: any[]
}

interface AdminOrdersTableProps {
  orders: Order[]
  selectedOrder: Order | null
  onSelectOrder: (order: Order) => void
}

export default function AdminOrdersTable({ orders, selectedOrder, onSelectOrder }: AdminOrdersTableProps) {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.pending
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center text-slate-600 py-8">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-900">Student</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-900">Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-900">Items</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-900">Amount</th>
                  <th className="px-4 py-2 text-center font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-2 text-center font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                      selectedOrder?.id === order.id ? "bg-orange-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{order.student_name}</p>
                        <p className="text-xs text-slate-600">{order.student_id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-700">{order.order_items?.length || 0}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      RM {order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant={selectedOrder?.id === order.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelectOrder(order)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
