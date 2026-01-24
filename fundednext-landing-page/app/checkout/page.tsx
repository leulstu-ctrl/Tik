"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CreditCard, Bitcoin } from "lucide-react"

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const plan = searchParams.get("plan")
    const size = searchParams.get("size")
    const price = searchParams.get("price")

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [cryptoCoin, setCryptoCoin] = useState("")
    const [network, setNetwork] = useState("")
    const [showWarning, setShowWarning] = useState(false)

    // Step 1: Email
    if (step === 1) {
        return (
            <div className="max-w-md mx-auto space-y-6">
                 <div className="text-center">
                    <h2 className="text-2xl font-bold">Let&apos;s get started</h2>
                    <p className="text-slate-400">Enter your email to continue</p>
                </div>
                <Card className="bg-slate-900 border-slate-800 text-slate-50">
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => {
                                if(email) setStep(2)
                            }}
                        >
                            Next
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Step 2: Payment Method
    if (step === 2) {
         return (
            <div className="max-w-2xl mx-auto space-y-6">
                 <h2 className="text-2xl font-bold text-center">Select Payment Method</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { id: "card", label: "Credit Card", icon: CreditCard },
                        { id: "crypto", label: "Cryptocurrency", icon: Bitcoin },
                    ].map((m) => (
                        <Card
                            key={m.id}
                            className={`cursor-pointer transition-all text-slate-50 ${paymentMethod === m.id ? "border-indigo-500 bg-indigo-500/10" : "bg-slate-900 border-slate-800 hover:border-slate-700"}`}
                            onClick={() => setPaymentMethod(m.id)}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <m.icon className="h-8 w-8 text-indigo-400" />
                                <span className="font-bold text-lg">{m.label}</span>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
                 <div className="flex justify-between">
                     <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                     <Button
                        disabled={!paymentMethod}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => {
                            if (paymentMethod === "crypto") setStep(3)
                            else alert("Only Crypto flow is fully implemented in this demo.")
                        }}
                    >
                        Next
                    </Button>
                 </div>
            </div>
         )
    }

    // Step 3: Crypto Details
    if (step === 3 && paymentMethod === "crypto") {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-center">Crypto Payment</h2>

                <Card className="bg-slate-900 border-slate-800 text-slate-50">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>Plan</span>
                            <span className="font-bold">{plan} - {size}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Total</span>
                            <span className="font-bold text-indigo-400">${price}</span>
                        </div>
                    </CardContent>
                </Card>

                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Cryptocurrency</Label>
                        <select
                            className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-50"
                            value={cryptoCoin}
                            onChange={(e) => setCryptoCoin(e.target.value)}
                        >
                            <option value="">Select Coin</option>
                            <option value="USDT">Tether (USDT)</option>
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                        </select>
                    </div>

                    {cryptoCoin && (
                         <div className="space-y-2">
                            <Label>Select Network</Label>
                            <select
                                className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-50"
                                value={network}
                                onChange={(e) => setNetwork(e.target.value)}
                            >
                                <option value="">Select Network</option>
                                <option value="TRC20">TRON (TRC20)</option>
                                <option value="ERC20">Ethereum (ERC20)</option>
                                <option value="BSC">Binance Smart Chain (BEP20)</option>
                            </select>
                        </div>
                    )}
                 </div>

                 <div className="flex justify-between">
                     <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                     <Button
                        disabled={!network}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => setShowWarning(true)}
                    >
                        Proceed to Pay
                    </Button>
                 </div>

                 {showWarning && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                         <Card className="max-w-md w-full bg-slate-900 border-slate-800 text-slate-50">
                             <CardHeader>
                                 <CardTitle className="text-red-500 flex items-center gap-2">
                                     <AlertCircle /> Warning
                                 </CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-4">
                                 <p className="text-sm text-slate-300">
                                     Please ensure you send <strong>{cryptoCoin}</strong> via the <strong>{network}</strong> network.
                                     Sending to the wrong network will result in permanent loss of funds.
                                 </p>
                                 <div className="flex gap-2">
                                     <input type="checkbox" id="ack" className="mt-1" />
                                     <label htmlFor="ack" className="text-sm text-slate-400">I acknowledge that I have selected the correct network.</label>
                                 </div>
                                 <div className="flex justify-end gap-2 pt-4">
                                     <Button variant="ghost" onClick={() => setShowWarning(false)}>Cancel</Button>
                                     <Button
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                        onClick={async () => {
                                            try {
                                                const res = await fetch('/api/orders', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        email,
                                                        plan,
                                                        size,
                                                        amount: price,
                                                        currency: cryptoCoin,
                                                        network
                                                    })
                                                })
                                                const data = await res.json()
                                                if (data.success) {
                                                    setShowWarning(false)
                                                    setStep(4)
                                                } else {
                                                    alert("Order failed: " + data.error)
                                                }
                                            } catch {
                                                alert("Error submitting order")
                                            }
                                        }}
                                    >
                                        Proceed
                                     </Button>
                                 </div>
                             </CardContent>
                         </Card>
                     </div>
                 )}
            </div>
        )
    }

     if (step === 4) {
         return (
             <div className="text-center space-y-6 pt-12">
                 <h2 className="text-3xl font-bold text-green-500">Order Placed Successfully!</h2>
                 <p>Thank you for your purchase. Account details will be emailed to {email}.</p>
                 <Button onClick={() => router.push('/')}>Return Home</Button>
             </div>
         )
     }

    return null
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-4">
       <Suspense fallback={<div>Loading...</div>}>
         <CheckoutContent />
       </Suspense>
    </div>
  )
}
