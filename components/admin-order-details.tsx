"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  student_name: string
  student_id: string
  email: string
  order_date: string
  notes: string
  total_amount: number
  status: string
  created_at: string
  order_items: any[]
}

interface AdminOrderDetailsProps {
  order: Order
  onClose: () => void
}

export default function AdminOrderDetails({ order, onClose }: AdminOrderDetailsProps) {
  const handleStatusChange = async (newStatus: string) => {
    // This can be implemented to update order status via API
    console.log("Update order status to:", newStatus)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Order Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 pb-4 border-b border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-600">Order ID:</span>
              <span className="font-medium text-slate-900">{order.id.substring(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Student:</span>
              <span className="font-medium text-slate-900">{order.student_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Student ID:</span>
              <span className="font-medium text-slate-900">{order.student_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Email:</span>
              <span className="font-medium text-slate-900 text-sm break-all">{order.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Order Date:</span>
              <span className="font-medium text-slate-900">{new Date(order.order_date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-2 pb-4 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-900">Items</p>
            {order.order_items && order.order_items.length > 0 ? (
              <div className="space-y-2">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm bg-slate-50 p-2 rounded">
                    <div>
                      <p className="font-medium text-slate-900">{item.meal_name}</p>
                      <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-slate-900">RM {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">No items</p>
            )}
          </div>

          <div className="space-y-2 pb-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total:</span>
              <span className="text-xl font-bold text-orange-600">RM {order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Status</p>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {order.notes && (
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-900">Notes</p>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
