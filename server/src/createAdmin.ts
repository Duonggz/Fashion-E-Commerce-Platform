import dotenv from "dotenv"
import { connectDB } from "./plugins/db"
import Admin from "./models/Admin"
import bcrypt from "bcryptjs"

dotenv.config()

async function createAdmin() {
  await connectDB()
  
  const existing = await Admin.findOne({ username: "admin" })
  if (existing) {
    console.log("Admin đã tồn tại!")
    process.exit(0)
  }

  const hashed = await bcrypt.hash("admin123", 10)
  await Admin.create({ username: "admin", password: hashed })
  console.log("Tạo admin thành công! username: admin, password: admin123")
  process.exit(0)
}

createAdmin()