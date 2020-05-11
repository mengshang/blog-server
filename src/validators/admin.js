const { Rule, LinValidator } = require('../core/lin-validator-v2')

const { Admin } = require('../modules/admin')

class AdminValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
      new Rule('isLength', '管理员名称至少3个字符，最多32个字符', { min: 3, max: 32 })
    ]
    this.password = [
      new Rule('isLength', '密码至少6个字符，最多32个字符', { min: 6, max: 32 })
    ]
    this.confirmPassword = this.password
  }

  validatePassword(vals) {
    const password = vals.body.password
    const confirmPassword = vals.body.confirmPassword
    if (password !== confirmPassword) {
      throw new global.errs.Password()
    }
  }

  // 验证账号是否存在
  async verifyAccount(vals) {
    const account = await Admin.findOne({
      where: {
        account: vals
      },
      attributes: ['account']
    })
    console.log('账号', account)
    if (account) {
      throw new global.errs.Account()
    }
  }
}

module.exports = {
  AdminValidator
}
