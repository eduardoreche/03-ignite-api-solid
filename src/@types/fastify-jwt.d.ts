import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
    },
    user: {
      role: 'ADMIN' | 'MEMBER',
      sub: string,
    } // user type is return type of `request.user` object
  }
}
