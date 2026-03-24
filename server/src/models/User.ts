import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

  username: String,

  fullname: String,

  password: String,

  phone: String,

  email: String,

  address: String

})

export default mongoose.model("User", userSchema)