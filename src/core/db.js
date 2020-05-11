const { Sequelize } = require('sequelize')

const { dbName, port, host, user, password } = require('../config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  timezone: '+08:00',
  define: {
    paranoid: true, // 不删除数据库条目，但将新添加的属性deletedAt设置为当前日期（删除完成时）
    underscored: true, // 将自动设置所有属性的字段参数为下划线命名方式
    scopes: {
      bh: {
        attributes: {
          exclude: ['updatedAt', 'deletedAt', 'createdAt']
        }
      }
    }
  },
  // https://stackoverflow.com/questions/47367893/sequelize-reads-datetime-in-utc-only
  // 查询时设置返回的是日期格式，如：2020-05-08
  dialectOptions: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    useUTC: false, // for reading from database
    dateStrings: true,
    typeCast: (field, next) => { // for reading from database
      if (field.type === 'DATETIME') {
        return field.string()
      }
      return next()
    }
  }
})

sequelize.sync({
  force: false // 是否自动删除原料表，重新创建新的表
})

module.exports = { sequelize }
