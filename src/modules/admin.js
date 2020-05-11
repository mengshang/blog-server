const { Sequelize, Model, Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../core/db')

class Admin extends Model {
  /**
   * 登录验证账号
   * @param account   账号
   * @param password  密码
   * @returns {Promise<void>}
   */
  static async verifyAccountPassword(account, password) {
    const user = await Admin.findOne({ where: { account }})
    const correct = bcrypt.compareSync(password, user.password)
    if (!user) {
      throw new global.errs.AuthFailed('账号不存在')
    }
    if (!correct) {
      throw new global.errs.AuthFailed('密码不正确')
    }
    return user
  }

  /**
   * 查询管理员
   * @param account   账号
   * @param currentPage  当前页
   * @param size     每页条目
   * @returns {Promise<{total: *, adminList: *, size: *, currentPage: *}>}
   */
  async getAccount(account = '', currentPage = 1, size = 10) {
    const offset = (currentPage - 1) * parseInt(size)
    const userList = await Admin.findAndCountAll({
      where: {
        account: {
          [Op.like]: `%${account}%`
        }
      },
      attributes: ['id', 'account', 'createdAt'],
      offset: parseInt(offset),
      limit: parseInt(size)
    })
    return {
      list: userList.rows,
      total: userList.count.toString(),
      currentPage,
      size
    }
  }

  /**
   * 修改管理员
   * @param id      账号id
   * @param accountInfo 账号信息
   * @returns {Promise<boolean|<Admin | null>>}
   */
  async putAdmin(id, accountInfo) {
    const admin = await Admin.findOne({
      where: {
        id: parseInt(id)
      }
    })
    if (!admin) { return false }
    await Admin.update({
      ...accountInfo
    }, {
      where: {
        id: parseInt(id)
      }
    })
    return true
  }

  /**
   * 删除管理员
   * @param id 账号id
   * @returns {Promise<boolean>}
   */
  async deleteAdmin(id) {
    const admin = await Admin.findOne({
      where: {
        id: parseInt(id)
      }
    })
    if (!admin) { return false }
    await Admin.destroy({
      where: {
        id: parseInt(id)
      }
    })
    return true
  }
}

Admin.init({
  account: {
    type: Sequelize.STRING(32),
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    set(val) {
      const salt = bcrypt.genSaltSync(10)
      const pwd = bcrypt.hashSync(val, salt)
      this.setDataValue('password', pwd)
    }
  },
  userAvatar: Sequelize.STRING
}, {
  tableName: 'admin',
  sequelize
})

module.exports = { Admin }
