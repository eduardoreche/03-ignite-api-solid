import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'

import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepo: GymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    gymsRepo = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepo)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepo.create({
      title: 'Near Gym',
      latitude: -25.4382506,
      longitude: -49.2508548,
      description: null,
      phone: null,
    })

    await gymsRepo.create({
      title: 'Far Gym',
      latitude: -25.5297236,
      longitude: -49.1184029,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      userLatitude: -25.4335288,
      userLongitude: -49.2606404,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
