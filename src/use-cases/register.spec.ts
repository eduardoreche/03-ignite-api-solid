import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

let repository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(repository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
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
    const email = 'jonh.doe@tests.com'

    await sut.execute({
      name: 'Jonh Doe',
      email,
      password: 'aaa123',
    })

    await expect(() =>
      sut.execute({
        name: 'Jonh Doe',
        email,
        password: 'aaa123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@tests.com',
      password: 'aaa123',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
