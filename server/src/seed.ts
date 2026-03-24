import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import Admin from "./models/Admin"

dotenv.config()

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL!)

  // 🧨 XÓA ADMIN CŨ
  await Admin.deleteMany({})

  const hashed = await bcrypt.hash("123456", 10)

  await Admin.create({
    username: "admin",
    password: hashed
  })

  console.log("Admin created")
  process.exit()
}

run()