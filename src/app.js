const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const catchError = require('./core/exception')
const InitManager = require('./core/init')

const app = new Koa()

// error handler
onerror(app)
app.use(catchError)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(process.cwd() + '/public'))
app.use(views(process.cwd() + '/src/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// request log
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(morgan('dev'))
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }))
}

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

// init config、router、httpException
InitManager.initCore(app)

module.exports = app
