import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { Prisma, Gym } from '@prisma/client'
import { randomUUID } from 'crypto'
import { FindManyNearByParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId)

    if (!gym) return null

    return gym
  }

  async create({
    id,
    title,
    description,
    phone,
    latitude,
    longitude,
  }: Prisma.GymCreateInput) {
    const gym = {
      id: id ?? randomUUID(),
      title,
      description: description ?? null,
      phone: phone ?? null,
      latitude: new Prisma.Decimal(latitude.toString()),
      longitude: new Prisma.Decimal(longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearByParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }
}
