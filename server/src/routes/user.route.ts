import { FastifyInstance } from "fastify"
import User from "../models/User"

export async function userRoutes(fastify: FastifyInstance){

  // REGISTER
  fastify.post("/register", async (request:any)=>{

    const user = await User.create(request.body)

    return user

  })


  // LOGIN
  fastify.post("/login", async (request:any)=>{

    const { username,password } = request.body

    const user = await User.findOne({ username,password })

    if(!user){

      return { error:"Invalid login" }

    }

    return user

  })

  fastify.put("/update/:id", async (req:any)=>{

    const { id } = req.params

    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new:true }
    )

    return user

  })

}