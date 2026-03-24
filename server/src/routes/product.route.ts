import { FastifyInstance } from "fastify"
import Product from "../models/Product"
import fs from "fs"
import path from "path"

export async function productRoutes(fastify: FastifyInstance) {

  // GET ALL
  fastify.get("/", async () => {
    return await Product.find()
  })

  // GET BY TAG (chỉ lấy sản phẩm active)
  fastify.get("/tag/:tag", async (request) => {

    const { tag } = request.params as any

    return await Product.find({
      tags: tag,
      active: true
    })

  })

  fastify.get("/:id", async (request) => {

  const { id } = request.params as any

  return await Product.findById(id)

  })

  // CREATE PRODUCT
  fastify.post("/", async (request) => {

    const parts = request.parts()

    let name = ""
    let price = 0
    let description = ""
    let tags: string[] = []
    let sizes: any[] = []
    let imageUrl = ""

    for await (const part of parts) {

      if (part.type === "file") {

        const filename = Date.now() + "-" + part.filename
        const filepath = path.join("uploads", filename)

        const buffer = await part.toBuffer()

        fs.writeFileSync(filepath, buffer)

        imageUrl = `http://localhost:3000/uploads/${filename}`

      }

      if (part.type === "field") {

        if (part.fieldname === "name") name = part.value as string
        if (part.fieldname === "price") price = Number(part.value)
        if (part.fieldname === "description") description = part.value as string
        if (part.fieldname === "tags") tags = JSON.parse(part.value as string)
        if (part.fieldname === "sizes") sizes = JSON.parse(part.value as string)

      }

    }

    const product = await Product.create({
      name,
      price,
      image: imageUrl,
      description,
      tags,
      sizes,
      active: true
    })

    return product

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

    if (!product) {
      return { message: "Product not found" }
    }

    product.active = !product.active

    await product.save()

    return product

  })

    // EDIT PRODUCT
    fastify.put("/:id", async (request) => {

  const { id } = request.params as any

  const parts = request.parts()

  let name = ""
  let price = 0
  let description = ""
  let tags: string[] = []
  let sizes: any[] = []
  let imageUrl = ""
  let active = true

  for await (const part of parts) {

    if (part.type === "file") {

      const filename = Date.now() + "-" + part.filename
      const filepath = path.join("uploads", filename)

      const buffer = await part.toBuffer()

      fs.writeFileSync(filepath, buffer)

      imageUrl = `http://localhost:3000/uploads/${filename}`

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

  const updateData: any = {
    name,
    price,
    description,
    tags,
    sizes,
    active
  }

  if (imageUrl) {
    updateData.image = imageUrl
  }

  const product = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  )

  return product

})

fastify.get("/search", async (request, reply) => {
  const { keyword } = request.query as { keyword:string }
  if(!keyword) return []
  const products = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } }
    ]

  })
  .limit(20)
  return products
})

}

