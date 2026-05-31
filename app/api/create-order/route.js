import Razorpay from 'razorpay'

export async function POST(request) {
  try {
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const { amount } = await request.json()

    const order = await razorpay.orders.create({
      amount:   amount * 100,
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
    })

    return Response.json({ orderId: order.id })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
