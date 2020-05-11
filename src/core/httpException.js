class HttpException extends Error {
  constructor(msg = '服务器异常', status = 400, errorCode = '10000') {
    super()
    this.status = status
    this.errorCode = errorCode
    this.msg = msg
  }
}

class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.status = 400
    this.msg = msg || '参数错误'
    this.errorCode = errorCode || '10000'
  }
}

class Success extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.status = 200
    this.msg = msg || '操作成功'
    this.errorCode = errorCode || '200'
  }
}

class Forbbiden extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || '10006'
    this.status = 403
  }
}

class Account extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '账号已存在'
    this.errorCode = errorCode || '10007'
    this.status = 403
  }
}

class Password extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '两次密码不一致'
    this.errorCode = errorCode || '10008'
    this.status = 400
  }
}

class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '授权失败'
    this.errorCode = errorCode || 10004
    this.status = 401
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  Forbbiden,
  Account,
  Password,
  AuthFailed
}
