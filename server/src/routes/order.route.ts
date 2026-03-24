import { FastifyInstance } from "fastify"
import Order from "../models/Order"
import { createVietQR } from "../services/vietqr.service"

export default async function orderRoutes(app: FastifyInstance) {

    app.get("/order-status/:orderId", async(req:any)=>{

        const order = await Order.findOne({
        orderId:req.params.orderId
        })

        if(!order) return {status:"not_found"}

        if (
          order.status === "pending" &&
          order.expireAt &&
          new Date() > order.expireAt
        ) {
          order.status = "expired"
          await order.save()
        }

        return {
        status:order.status
        }

    })

  app.post("/checkout", async (req: any, reply) => {

    try {

      const { items, user, totalPrice } = req.body

      // validate cart
      if (!items || items.length === 0) {
        return reply.code(400).send({
          error: "Cart is empty"
        })
      }

      const orderId = "ORDER" + Date.now() + "VNS"

      const expireAt = new Date(Date.now() + 5 * 60 * 1000)

      const order = await Order.create({

        orderId,

        userId: user?._id || null,

        items,

        totalPrice,

        paymentContent: orderId,

        status:"pending",

        expireAt,

        customerInfo:{
        fullname:user?.fullname,
        phone:user?.phone,
        address:user?.address,
        email:user?.email
        }

        })

      const qr = createVietQR(orderId, totalPrice)

      return {
        order,
        qr
      }

    } catch (err) {

      console.log("CHECKOUT ERROR:", err)

      return reply.code(500).send({
        error: "Checkout failed"
      })

    }

  })

  // ADMIN - lấy tất cả đơn hàng

  app.get("/admin/orders", async () => {

    const orders = await Order.find().sort({createdAt:-1})

    return orders

  })


  // ADMIN - xác nhận thanh toán

  app.put("/admin/orders/:id/pay", async (req:any) => {

    const order = await Order.findByIdAndUpdate(

      req.params.id,

      { status: "paid" },

      { new: true }

    )

    return order

  })

  app.put("/admin/orders/:id/ship", async (req: any) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "shipping" },
      { new: true }
    )
    return order
  })

}