import { HttpContext } from '@adonisjs/core/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>, allowedRoles: string[]) {
    const user = auth.user
    if (!user || !allowedRoles.includes(user.role)) {
      return response.forbidden({ message: 'Você não tem permissão para esta ação.' })
    }
    return next()
  }
}