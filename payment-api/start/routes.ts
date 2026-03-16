/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import CheckoutsController from '#controllers/checkouts_controller'
import RefundsController from '#controllers/refunds_controller'
import { middleware } from './kernel.ts'

router
  .group(() => {
    router.post('refund/:id', [RefundsController])
      .use(middleware.role(['ADMIN', 'FINANCE']))
    router.post('checkout', [CheckoutsController])
      .use(middleware.role(['ADMIN', 'MANAGER', 'FINANCE', 'USER']))
  })
  .prefix('/api/v1')
