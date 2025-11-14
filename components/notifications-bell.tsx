"use client"

import { useEffect, useState } from "react"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Notification {
  id: number
  message: string
  is_read: boolean
  created_at: string
}

interface NotificationsBellProps {
  studentEmail?: string
}

export function NotificationsBell({ studentEmail }: NotificationsBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!studentEmail) return

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?email=${studentEmail}`)
        const data = await response.json()
        if (data.success && data.data) {
          setNotifications(data.data)
          const unread = data.data.filter((n: Notification) => !n.is_read).length
          setUnreadCount(unread)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [studentEmail])

  if (!studentEmail) return null

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="relative gap-1 lg:gap-2"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {unreadCount}
          </span>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Food Ready Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="text-sm p-2 rounded border border-border hover:bg-accent transition-colors"
                  >
                    <p>{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
