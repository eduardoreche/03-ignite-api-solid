
//@vitest-environment prisma

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app'

describe('Profile (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a user profile', async () => {
    const email = 'johndoe@tests.com'
    const password = '123456'

    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email,
        password,
      })

    const authResponse = await request(app.server).post('/sessions').send({
      email, password
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(expect.objectContaining({
      email
    }))

  })
})
