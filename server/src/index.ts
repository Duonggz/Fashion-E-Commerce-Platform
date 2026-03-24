import Fastify from "fastify"
import cors from "@fastify/cors"
import dotenv from "dotenv"
import { connectDB } from "./plugins/db"
import { adminRoutes } from "./routes/admin.route"
import { productRoutes } from "./routes/product.route"
import { userRoutes } from "./routes/user.route"
import multipart from "@fastify/multipart"
import fastifyStatic from "@fastify/static"
// import paymentRoutes from "./routes/payment.route"
import orderRoutes from "./routes/order.route"
import sepayRoutes from "./routes/sepay.route"
import path from "path"

dotenv.config()

const app = Fastify({
  bodyLimit: 20 * 1024 * 1024 // 20MB
})

// CORS
app.register(userRoutes,{ prefix:"/api/users" })

app.register(cors, {
  origin: [
    "https://tmdt1.netlify.app",
    "https://tmdt2.netlify.app"  // thay bằng URL admin thật
  ],
  methods: ["GET", "POST", "PUT", "DELETE"]
})

// upload ảnh
app.register(multipart, {
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
})

// serve ảnh
app.register(fastifyStatic, {
  root: path.join(__dirname, "../uploads"),
  prefix: "/uploads/"
})

/* app.register(paymentRoutes,{
prefix:"/api"
}) */

app.register(orderRoutes,{
  prefix:"/api"
}) 

app.register(sepayRoutes,{
  prefix:"/api"
})


// connect database
connectDB()

// routes
app.register(adminRoutes, { prefix: "/api/admin" })
app.register(productRoutes, { prefix: "/api/products" })

app.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server running at ${address}`)
})

