const Router = require('koa-router')
const { unset } = require('lodash')

const { Admin } = require('../../../../modules/admin')
const { LoginValidator } = require('../../../../validators/login')
const { generateToken } = require('../../../../core/util')

const router = new Router({
  prefix: '/v1/backend/security/account'
})

/**
 * 登录
 */
router.post('/login', async ctx => {
  const v = await new LoginValidator().validate(ctx)
  const token = await verify(v.get('body.account'), v.get('body.password'))
  ctx.body = {
    code: '200',
    msg: ['登录成功'],
    token
  }
})

/**
 * 验证账号并生成token
 * @param account
 * @param password
 * @returns {Promise<*>}
 */
const verify = async(account, password) => {
  const user = await Admin.verifyAccountPassword(account, password)
  const userInfo = user.dataValues
  userInfo.loginTime = new Date()
  unset(userInfo, 'password')
  return generateToken(userInfo)
}

module.exports = router
