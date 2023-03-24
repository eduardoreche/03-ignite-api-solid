import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const repository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(repository)

    await repository.create({
      name: 'John Done',
      email: 'john.doe@tests.com',
      password_hash: await hash('aaa123', 6),
    })

    const { user } = await sut.execute({
      email: 'john.doe@tests.com',
      password: 'aaa123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate', async () => {
    const repository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(repository)

    expect(() =>
      sut.execute({
        email: 'john.doe@tests.com',
        password: 'aaa123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate', async () => {
    const repository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(repository)

    await repository.create({
      name: 'John Done',
      email: 'john.doe@tests.com',
      password_hash: await hash('aaa123', 6),
    })

    expect(() =>
      sut.execute({
        email: 'john.doe@tests.com',
        password: 'bbb123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
