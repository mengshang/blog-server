const jwt = require('jsonwebtoken')

class Auth {
  get token() {
    return async(ctx, next) => {
      let errMsg = 'token不合法'
      const authorization = ctx.request.headers.authorization
      let decode = {}

      if (!authorization) {
        errMsg = '请登录'
        throw new global.errs.Forbbiden(errMsg)
      }

      try {
        decode = jwt.verify(authorization, global.config.security.secretKey)
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new global.errs.Forbbiden(errMsg)
        } else if (error.name === 'TokenExpiredError') {
          errMsg = 'token已过期'
          throw new global.errs.Forbbiden(errMsg)
        }
      }
      ctx.user = {
        uid: decode.id,
        account: decode.account
      }
      await next()
    }
  }
}

module.exports = { Auth }
