import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  size: String,
  price: Number,
  quantity: Number
})

const orderSchema = new mongoose.Schema({

  orderId: String,

  userId: String,

  items: [itemSchema],

  totalPrice: Number,

  customerInfo: {
    fullname: String,
    phone: String,
    address: String,
    email: String
  },

  paymentContent: String,

  status: {
    type: String,
    default: "pending"
  },

  expireAt:{
  type:Date
  }

}, { timestamps: true })

export default mongoose.model("Order", orderSchema)