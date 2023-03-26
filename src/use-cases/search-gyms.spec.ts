import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'

import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepo: GymsRepository
let sut: SearchGymsUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    gymsRepo = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepo)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepo.create({
      title: 'JS Gym',
      latitude: -24.0292392,
      longitude: -49.9938312,
      description: null,
      phone: null,
    })

    await gymsRepo.create({
      title: 'TS Gym',
      latitude: -24.0292392,
      longitude: -49.9938312,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      query: 'JS',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JS Gym' })])
  })

  it('should be able to search for paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepo.create({
        title: `JS Gym ${i}`,
        latitude: -24.0292392,
        longitude: -49.9938312,
        description: null,
        phone: null,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JS',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS Gym 21' }),
      expect.objectContaining({ title: 'JS Gym 22' }),
    ])
  })
})
