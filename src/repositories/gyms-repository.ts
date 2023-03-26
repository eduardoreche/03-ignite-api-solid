import { Prisma, Gym } from '@prisma/client'

export interface FindManyNearByParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(gymId: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearByParams): Promise<Gym[]>
}
