
//@vitest-environment prisma

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app'

describe('Authenticate (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refrsh token', async () => {
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

    const cookies = authResponse.get('Set-Cookie') as string[]

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String)
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])

  })
})
