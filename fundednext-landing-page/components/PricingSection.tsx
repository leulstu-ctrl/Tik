"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const PLANS = {
  "Stellar 2-Step": {
    sizes: [
      { value: "6K", label: "$6K", price: 59.99 },
      { value: "15K", label: "$15K", price: 119.00 },
      { value: "25K", label: "$25K", price: 199.00 },
      { value: "50K", label: "$50K", price: 299.00 },
      { value: "100K", label: "$100K", price: 519.00 },
      { value: "200K", label: "$200K", price: 999.00 },
    ],
    details: {
        maxLoss: "10%",
        profitTarget: "8% / 5%",
    }
  },
  "Stellar 1-Step": {
    sizes: [
      { value: "6K", label: "$6K", price: 59.00 },
      { value: "15K", label: "$15K", price: 119.00 },
      { value: "25K", label: "$25K", price: 199.00 },
      { value: "50K", label: "$50K", price: 299.00 },
      { value: "100K", label: "$100K", price: 519.00 },
    ],
     details: {
        maxLoss: "6%",
        profitTarget: "10%",
    }
  },
  "Stellar Lite": {
      sizes: [
        { value: "5K", label: "$5K", price: 32.00 },
        { value: "10K", label: "$10K", price: 59.00 },
        { value: "25K", label: "$25K", price: 139.00 },
        { value: "50K", label: "$50K", price: 219.00 },
      ],
       details: {
           maxLoss: "10%",
           profitTarget: "8%",
       }
  },
  "Stellar Instant": {
      sizes: [
         { value: "2K", label: "$2K", price: 200.00 },
         { value: "5K", label: "$5K", price: 500.00 },
         { value: "10K", label: "$10K", price: 1000.00 },
         { value: "20K", label: "$20K", price: 2000.00 },
      ],
       details: {
           maxLoss: "N/A",
           profitTarget: "N/A",
       }
  }
}

export function PricingSection() {
  const [planType, setPlanType] = useState("Stellar 2-Step")
  const [size, setSize] = useState("6K")
  const router = useRouter()

  const currentPlan = PLANS[planType as keyof typeof PLANS] || PLANS["Stellar 2-Step"]
  const currentSizeObj = currentPlan.sizes.find(s => s.value === size) || currentPlan.sizes[0]

  const handleStartChallenge = () => {
    const query = new URLSearchParams({
        plan: planType,
        size: size,
        price: currentSizeObj?.price.toString() || "0"
    }).toString()
    router.push(`/checkout?${query}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Choose the Best Plan</h2>
          <p className="text-slate-400">Select a trading plan that suits your trading style.</p>
        </div>

        {/* Plan Type Tabs */}
        <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(PLANS).map((type) => (
                <button
                    key={type}
                    onClick={() => {
                        setPlanType(type)
                        const newPlan = PLANS[type as keyof typeof PLANS]
                        if (newPlan.sizes.length > 0) setSize(newPlan.sizes[0].value)
                    }}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                        planType === type
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>

        {/* Account Size Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {currentPlan.sizes.map((s) => (
                <div
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                        size === s.value
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700"
                    }`}
                >
                    <div className="text-xl font-bold">{s.label}</div>
                </div>
            ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Plan Details Card */}
             <Card className="bg-slate-900 border-slate-800 text-slate-50">
                <CardHeader>
                    <CardTitle>Plan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Platform</span>
                        <span className="font-medium">MT4, MT5</span>
                    </div>
                     <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Max Loss</span>
                        <span className="font-medium">{currentPlan.details.maxLoss}</span>
                    </div>
                     <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Profit Target</span>
                        <span className="font-medium">{currentPlan.details.profitTarget}</span>
                    </div>
                </CardContent>
            </Card>

             {/* Summary & Action */}
             <Card className="bg-slate-900 border-slate-800 text-slate-50 flex flex-col justify-center items-center p-8 space-y-6">
                <div className="text-center">
                    <div className="text-slate-400 mb-2">Refundable Fee</div>
                    <div className="text-4xl font-bold text-indigo-400">${currentSizeObj?.price}</div>
                </div>
                <Button
                    size="lg"
                    className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-700 text-lg h-14"
                    onClick={handleStartChallenge}
                >
                    Start Challenge
                </Button>
            </Card>
        </div>
      </div>
    </div>
  )
}
