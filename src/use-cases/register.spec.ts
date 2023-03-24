import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(repository)

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@tests.com',
      password: 'aaa123',
    })

    const isPasswordCorrectlyHashed = await compare(
      'aaa123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(repository)

    const email = 'jonh.doe@tests.com'

    await registerUseCase.execute({
      name: 'Jonh Doe',
      email,
      password: 'aaa123',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'Jonh Doe',
        email,
        password: 'aaa123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(repository)

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@tests.com',
      password: 'aaa123',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
