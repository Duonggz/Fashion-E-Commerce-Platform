import { FastifyInstance } from "fastify"
import Order from "../models/Order"
import Product from "../models/Product"

export default async function sepayRoutes(app: FastifyInstance) {
  app.post("/payment-webhook", async (req: any) => {
    try {
      console.log("SEPAY WEBHOOK:", req.body)

      const { content } = req.body

      if (!content) {
        console.log("Webhook không có content")
        return { success: false }
      }

      const match = content.match(/ORDER\d+VNS/)

      if (!match) {
        console.log("OrderId not found in content:", content)
        return { success: false }
      }

      const orderId = match[0]
      console.log("MATCHED ORDER ID:", orderId)

      const order = await Order.findOne({ orderId })

      if (!order) {
        console.log("Order not found:", orderId)
        return { success: false }
      }

      if (order.status === "paid") {
        console.log("Order already paid:", orderId)
        return { success: true }
      }

      const { transferAmount } = req.body
      if (!transferAmount || transferAmount < (order.totalPrice ?? 0)) {
        console.log(`Sai số tiền | Cần: ${order.totalPrice} | Nhận: ${transferAmount}`)
        return { success: false }
      }

      for (const item of order.items) {
        const product = await Product.findById(item.productId)

        if (!product) {
          console.log("Product not found:", item.productId)
          continue
        }

        const sizeIndex = product.sizes.findIndex(
          (s: any) => s.size === item.size
        )

        if (sizeIndex === -1) {
          console.log("Size not found:", item.size, "in product:", product.name)
          continue
        }

        const current = product.sizes[sizeIndex].quantity || 0
        const qty = item.quantity || 0

        if (current < qty) {
          console.log(`HET HANG | Product: ${product.name} | Size: ${item.size} | Còn: ${current} | Cần: ${qty}`)
          order.status = "out_of_stock"
          await order.save()
          return { success: false }
        }

        const newQty = current - qty

        console.log(
          `TRU KHO | Product: ${product.name} | Size: ${item.size} | Current: ${current} | Minus: ${qty} | New: ${newQty}`
        )

        product.sizes[sizeIndex].quantity = newQty
        await product.save()
      } // ← đóng for

      order.status = "paid"
      await order.save()

      console.log("ORDER PAID:", orderId)

      return { success: true }
    } catch (error) {
      console.log("SEPAY WEBHOOK ERROR:", error)
      return { success: false }
    }
  })
}