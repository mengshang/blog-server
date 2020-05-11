const Router = require('koa-router')
const { unset } = require('lodash')

const { Admin } = require('../../../../modules/admin')
const { AdminValidator } = require('../../../../validators/admin')
const { Auth } = require('../../../../core/auth')
const { success } = require('../../../../core/helper')

const router = new Router({
  prefix: '/v1/backend/security/admin'
})

/**
 * 获取管理员列表
 */
router.get('/', new Auth().token, async ctx => {
  const { account, current, size } = ctx.request.query
  const adminList = await new Admin().getAccount(account, current, size)
  ctx.body = {
    code: '200',
    data: {
      msg: ['操作成功'],
      ...adminList
    }
  }
})

/**
 * 添加管理员
 */
router.post('/', new Auth().token, async ctx => {
  const v = await new AdminValidator().validate(ctx)
  await new AdminValidator().verifyAccount(v.get('body.account'))
  const account = { ...v.get('body') }
  unset(account.confirmPassword)
  await Admin.create(account)
  success()
})

/**
 * 修改管理员
 */
router.put('/:id', new Auth().token, async ctx => {
  const v = await new AdminValidator().validate(ctx)
  const id = ctx.params.id
  const admin = await new Admin().putAdmin(id, v.get('body'))
  if (admin) {
    success()
  } else {
    ctx.body = {
      msg: ['账号不存在'],
      code: '10009'
    }
  }
})

/**
 * 删除管理员
 */
router.delete('/:id', new Auth().token, async ctx => {
  const admin = await new Admin().deleteAdmin(ctx.params.id)
  if (admin) {
    success()
  } else {
    ctx.body = {
      msg: ['账号不存在'],
      code: '100010'
    }
  }
})

module.exports = router
