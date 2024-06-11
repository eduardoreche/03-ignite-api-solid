import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance, role: 'ADMIN' | 'MEMBER' = 'MEMBER') {
  const email = 'johndoe@tests.com'
  const password = '123456'

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email,
      password_hash: await hash('123456', 6),
      role,
    }
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email, password
  })

  const { token } = authResponse.body

  return { token }
}
