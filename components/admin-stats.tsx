import { Card, CardContent } from "@/components/ui/card"

interface AdminStatsProps {
  orders: any[]
}

export default function AdminStats({ orders }: AdminStatsProps) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const completedOrders = orders.filter((order) => order.status === "completed").length

  const stats = [
    { label: "Total Orders", value: totalOrders, bgColor: "bg-blue-100", textColor: "text-blue-900" },
    { label: "Pending", value: pendingOrders, bgColor: "bg-yellow-100", textColor: "text-yellow-900" },
    { label: "Completed", value: completedOrders, bgColor: "bg-green-100", textColor: "text-green-900" },
    {
      label: "Total Revenue",
      value: `RM ${totalRevenue.toFixed(2)}`,
      bgColor: "bg-purple-100",
      textColor: "text-purple-900",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className={stat.bgColor}>
          <CardContent className="pt-6">
            <p className={`text-sm font-medium ${stat.textColor} mb-1`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
