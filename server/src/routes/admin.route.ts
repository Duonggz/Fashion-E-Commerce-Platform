import { FastifyInstance } from "fastify"
import Admin from "../models/Admin"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Product from "../models/Product"
import { verifyAdmin } from "../middleware/auth"

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.post("/login", async (request, reply) => {
    try {
      const { username, password } = request.body as any

      const admin = await Admin.findOne({ username })
      if (!admin) {
        return reply.status(400).send({ message: "Admin not found" })
      }

      const isMatch = await bcrypt.compare(password, admin.password)
      if (!isMatch) {
        return reply.status(400).send({ message: "Wrong password" })
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "1d" })

      return { token }

    } catch (err) {
      console.error("LOGIN ERROR:", err)
      return reply.status(500).send({ message: "Internal server error" })
    }
  })
  
fastify.get(
  "/products",
  { preHandler: verifyAdmin },
  async (request, reply) => {

    const products = await Product.find()

    return reply.send(products)

  }
) 
}
