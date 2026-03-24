

import { FastifyInstance } from "fastify"
import Order from "../models/Order"
import Product from "../models/Product"

export default async function paymentRoutes(app: FastifyInstance) {

  app.post("/payment-webhook", async (req:any) => {

    const { content } = req.body

    if(!content) return { success:false }

    console.log("BANK CONTENT:",content)

    const order = await Order.findOne({
      orderId:content
    })

    if(!order) return { success:false }

    if(order.status === "paid") return { success:true }

    // trừ stock

    for(const item of order.items){

      const product = await Product.findById(item.productId)

      if(!product) continue

      const sizeIndex = product.sizes.findIndex(
        (s:any)=> s.size === item.size
      )

      if(sizeIndex !== -1){

        const currentQty = product.sizes[sizeIndex].quantity || 0
        const orderQty = item.quantity || 0

        product.sizes[sizeIndex].quantity = currentQty - orderQty

      }

      await product.save()

    }

    order.status = "paid"

    await order.save()

    return { success:true }

  })

} 