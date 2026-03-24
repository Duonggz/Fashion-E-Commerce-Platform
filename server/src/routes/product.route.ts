import { FastifyInstance } from "fastify"
import Product from "../models/Product"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "tmdt", public_id: Date.now() + "-" + filename },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    ).end(buffer)
  })
}

export async function productRoutes(fastify: FastifyInstance) {

  // GET ALL
  fastify.get("/", async () => {
    return await Product.find()
  })

  // GET BY TAG
  fastify.get("/tag/:tag", async (request) => {
    const { tag } = request.params as any
    return await Product.find({ tags: tag, active: true })
  })

  fastify.get("/:id", async (request) => {
    const { id } = request.params as any
    return await Product.findById(id)
  })

  // CREATE PRODUCT
  fastify.post("/", async (request) => {
    const parts = request.parts()
    let name = "", description = "", imageUrl = ""
    let price = 0, tags: string[] = [], sizes: any[] = []

    for await (const part of parts) {
      if (part.type === "file") {
        const buffer = await part.toBuffer()
        imageUrl = await uploadToCloudinary(buffer, part.filename)
      }
      if (part.type === "field") {
        if (part.fieldname === "name") name = part.value as string
        if (part.fieldname === "price") price = Number(part.value)
        if (part.fieldname === "description") description = part.value as string
        if (part.fieldname === "tags") tags = JSON.parse(part.value as string)
        if (part.fieldname === "sizes") sizes = JSON.parse(part.value as string)
      }
    }

    return await Product.create({ name, price, image: imageUrl, description, tags, sizes, active: true })
  })

  // DELETE PRODUCT
  fastify.delete("/:id", async (request) => {
    const { id } = request.params as any
    await Product.findByIdAndDelete(id)
    return { message: "Product deleted" }
  })

  // TOGGLE HIDE / SHOW
  fastify.put("/toggle/:id", async (request) => {
    const { id } = request.params as any
    const product = await Product.findById(id)
    if (!product) return { message: "Product not found" }
    product.active = !product.active
    await product.save()
    return product
  })

  // EDIT PRODUCT
  fastify.put("/:id", async (request) => {
    const { id } = request.params as any
    const parts = request.parts()
    let name = "", description = "", imageUrl = ""
    let price = 0, tags: string[] = [], sizes: any[] = [], active = true

    for await (const part of parts) {
      if (part.type === "file") {
        const buffer = await part.toBuffer()
        imageUrl = await uploadToCloudinary(buffer, part.filename)
      }
      if (part.type === "field") {
        if (part.fieldname === "name") name = part.value as string
        if (part.fieldname === "price") price = Number(part.value)
        if (part.fieldname === "description") description = part.value as string
        if (part.fieldname === "tags") tags = JSON.parse(part.value as string)
        if (part.fieldname === "sizes") sizes = JSON.parse(part.value as string)
        if (part.fieldname === "active") active = part.value === "true"
      }
    }

    const updateData: any = { name, price, description, tags, sizes, active }
    if (imageUrl) updateData.image = imageUrl

    return await Product.findByIdAndUpdate(id, updateData, { new: true })
  })

  // SEARCH
  fastify.get("/search", async (request) => {
    const { keyword } = request.query as { keyword: string }
    if (!keyword) return []
    return await Product.find({
      $or: [{ name: { $regex: keyword, $options: "i" } }]
    }).limit(20)
  })
}