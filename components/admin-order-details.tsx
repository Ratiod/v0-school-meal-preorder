"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Bell } from 'lucide-react'

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
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(order.status)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          status: newStatus,
        }),
      })

      if (response.ok) {
        setCurrentStatus(newStatus)
        alert("Order status updated successfully")
      } else {
        alert("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Error updating order status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSendNotification = async () => {
    setIsSendingNotification(true)
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          studentEmail: order.email,
          message: `Your order #${order.id} is ready for pickup!`,
        }),
      })

      if (response.ok) {
        alert(`Notification sent to ${order.student_name}`)
      } else {
        alert("Failed to send notification")
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      alert("Error sending notification")
    } finally {
      setIsSendingNotification(false)
    }
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
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 disabled:opacity-50"
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

          <div className="pt-4 border-t border-slate-200">
            <Button
              onClick={handleSendNotification}
              disabled={isSendingNotification}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Bell className="w-4 h-4" />
              {isSendingNotification ? "Sending..." : "Send Food Ready Alert"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
