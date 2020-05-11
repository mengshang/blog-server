const Router = require('koa-router')
const requireDirectory = require('require-directory')

class InitManager {
  static initCore(app) {
    InitManager.app = app
    InitManager.loadHttpException()
    InitManager.loadConfig()
    InitManager.initLoadRouter()
  }

  // 加载错误
  static loadHttpException() {
    global.errs = require('./httpException')
  }

  // 加载配置
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/src/config'
    global.config = require(configPath)
  }

  // 加载路由
  static initLoadRouter() {
    const apiDirectory = `${process.cwd()}/src/routes`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
}

module.exports = InitManager
