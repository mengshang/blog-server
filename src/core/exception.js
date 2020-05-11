const { HttpException } = require('./httpException')

const catchError = async(ctx, next) => {
  try {
    await next()
  } catch (error) {
    const isHttpException = error instanceof HttpException

    if (process.env === 'dev' && !isHttpException) {
      throw error
    }

    if (isHttpException) {
      ctx.body = {
        msg: typeof error.msg === 'object' ? error.msg : [error.msg],
        code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.status
    } else {
      ctx.body = {
        msg: ['we make a mistake'],
        code: 999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError
