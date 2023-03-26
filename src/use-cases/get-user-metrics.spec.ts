import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'

import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInRepo: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInRepo = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInRepo)
  })
  it('should be able to get user check-ins count from metrics', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepo.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toBe(22)
  })
})
