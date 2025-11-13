"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { CheckoutForm } from "@/components/checkout-form"
import { ChevronLeft } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const [orderConfirmed, setOrderConfirmed] = useState(false)

  const handleOrderComplete = (orderData: any) => {
    setOrderConfirmed(true)
    console.log("Order submitted:", orderData)
  }

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <Card className="max-w-md w-full p-6 lg:p-8 text-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-sm lg:text-base text-muted-foreground mb-6">
            Your meal preorder has been successfully submitted. You will receive a confirmation email shortly.
          </p>
          <Button onClick={() => router.push("/")} className="w-full">
            Back to Menu
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6 lg:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4 gap-2">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="text-2xl lg:text-3xl font-bold">Order Review</h1>
        </div>

        <CheckoutForm onOrderComplete={handleOrderComplete} />
      </div>
    </div>
  )
}
