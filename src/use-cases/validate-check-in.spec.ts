import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidateError } from './errors/late-check-in-validation-error'

let checkInRepo: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validade CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInRepo = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepo)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInRepo.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepo.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an unexistent check-in', async () => {
    await expect(() =>
      sut.execute({ checkInId: 'invalid-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2022, 2, 11, 8, 40, 0))

    const createdCheckIn = await checkInRepo.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })

    const twentyOneMinutes = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutes)

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidateError)
  })
})
