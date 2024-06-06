import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitute: z.number().refine(value => {
      return Math.abs(value) <= 180
    })
  })

  const { latitude, longitute } = registerBodySchema.parse(request.body)

  const nearbyGymUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await nearbyGymUseCase.execute({ userLatitude: latitude, userLongitude: longitute })

  return reply.status(200).send({
    gyms
  })
}
