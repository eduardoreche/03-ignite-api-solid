import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let repository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(async () => {
    repository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(repository)

    await repository.create({
      id: 'gym-01',
      title: 'JS Studio',
      latitude: -24.0292392,
      longitude: -49.9938312,
      description: null,
      phone: null,
    })
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'JS Studio',
      latitude: -24.0292392,
      longitude: -49.9938312,
      description: null,
      phone: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
