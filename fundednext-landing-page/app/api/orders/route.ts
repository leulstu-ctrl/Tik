import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Simulate processing
    console.log("Processing order:", body)

    // Validate required fields
    if (!body.email || !body.plan || !body.amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Mock successful order creation
    return NextResponse.json({
      success: true,
      orderId: "ORD-" + Math.floor(Math.random() * 1000000),
      message: "Order placed successfully"
    })
  } catch (_error) {
    console.error(_error)
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 500 }
    )
  }
}
