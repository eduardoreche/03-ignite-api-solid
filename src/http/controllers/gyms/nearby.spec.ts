
//@vitest-environment prisma

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Gym (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to find gyms nearby', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    const gyms = [
      {
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -25.4382506,
        longitude: -49.2508548,
      },
      {
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -25.5297236,
        longitude: -49.1184029,
      },
    ]

    for (const gym of gyms) {
      await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send(gym)
    }

    const response = await request(app.server)
      .post('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -25.4382506,
        longitude: -49.2508548,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])

  })
})
