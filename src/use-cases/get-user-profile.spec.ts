import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let repository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('GetuUerProfile Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(repository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await repository.create({
      name: 'John Done',
      email: 'john.doe@tests.com',
      password_hash: await hash('aaa123', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to get user profile with wrong id', async () => {
    await repository.create({
      name: 'John Done',
      email: 'john.doe@tests.com',
      password_hash: await hash('aaa123', 6),
    })

    expect(() =>
      sut.execute({
        userId: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
