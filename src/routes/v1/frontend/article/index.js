const Router = require('koa-router')

const router = new Router({
  prefix: '/v1/frontend/article'
})

/**
 * 获取文章列表
 */
router.get('/', ctx => {

})

module.exports = router
