/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import CheckoutsController from '#controllers/checkouts_controller'
import RefundsController from '#controllers/refunds_controller'

router
  .group(() => {
    router
      .group(() => {
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router.post('checkout', [CheckoutsController, 'handle'])
    router.post('refund/:id', [RefundsController, 'handle'])
  })
  .prefix('/api/v1')
