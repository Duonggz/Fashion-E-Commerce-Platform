import { FastifyRequest, FastifyReply } from "fastify"
import jwt from "jsonwebtoken"

export async function verifyAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({
      message: "Unauthorized"
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (err) {
    return reply.status(401).send({
      message: "Invalid token"
    })
  }
}
