import mongoose from "mongoose"

const sizeSchema = new mongoose.Schema({
  size: String,
  quantity: Number
})

const productSchema = new mongoose.Schema({
  name: String,

  price: Number,

  image: String,

  description: String,

  tags: [String], // Nam, Nu, Unisex

  sizes: [sizeSchema], // size + quantity

  active: { type: Boolean, default: true }

}, { timestamps: true })

export default mongoose.model("Product", productSchema)