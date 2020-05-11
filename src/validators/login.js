const { Rule, LinValidator } = require('../core/lin-validator-v2')

class LoginValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
      new Rule('isLength', '请输入账号', { min: 1 })
    ]
    this.password = [
      new Rule('isLength', '请输入密码', { min: 1 })
    ]
  }
}

module.exports = { LoginValidator }
