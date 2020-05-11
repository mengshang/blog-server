const Router = require('koa-router')

const { Auth } = require('../../../../core/auth')
const { Article } = require('../../../../modules/article')
const { ArticleValidator } = require('../../../../validators/article')
const { success } = require('../../../../core/helper')

const router = new Router({
  prefix: '/v1/backend/article'
})

/**
 * 获取文章列表
 */
router.get('/', new Auth().token, async ctx => {
  const { articleTitle, current, size } = ctx.request.query
  ctx.body = { articleTitle, current, size }
  const { list, total, currentPage } = await new Article().getArticleList(articleTitle, current, size, ['articleContent', 'deletedAt', 'articleSummary'])

  ctx.body = {
    code: '200',
    data: {
      list,
      msg: ['操作成功'],
      total,
      currentPage
    }
  }
})

/**
 * 获取文章详情
 */
router.get('/:articleId', new Auth().token, async ctx => {
  const articleId = ctx.params.articleId
  const article = await new Article().getArticleById(articleId)
  ctx.body = {
    code: '200',
    data: { ...article.dataValues }
  }
})

/**
 * 添加文章
 */
router.post('/', new Auth().token, async ctx => {
  const v = await new ArticleValidator().validate(ctx)
  const article = await new Article().getArticleByTitle(v.get('body.articleTitle'))
  if (article) {
    ctx.body = {
      msg: ['文章已存在'],
      code: '10011'
    }
    return
  }
  const articleInfo = v.get('body')
  articleInfo.articleAuthor = ctx.user.account
  articleInfo.articleAuthorId = ctx.user.uid
  Article.create(articleInfo)
  success()
})

/**
 * 修改文章
 */
router.put('/:articleId', new Auth().token, async ctx => {
  const v = await new ArticleValidator().validate(ctx)
  const articleId = ctx.params.articleId
  const artitcleInfo = v.get('body')
  artitcleInfo.articleAuthor = ctx.user.account
  artitcleInfo.articleAuthorId = ctx.user.uid
  const add = await new Article().putArticle(articleId, artitcleInfo)
  if (add) {
    success()
  } else {
    ctx.body = {
      msg: ['修改文章失败'],
      code: '10012'
    }
  }
})

/**
 * 删除文章
 */
router.delete('/:articleId', new Auth().token, async ctx => {
  const articleId = ctx.params.articleId
  const del = await new Article().deleteArticle(articleId)
  if (del) {
    success()
  } else {
    ctx.body = {
      msg: ['删除失败'],
      code: '10013'
    }
  }
})

/**
 * 开启/关闭评论
 */
router.put('/openComment/:articleId', new Auth().token, async ctx => {
  const articleId = ctx.params.articleId
  const value = ctx.request.body.OnOrOff ? 1 : 0
  const info = await new Article().openOrCloseComment(articleId, value)
  if (info) {
    success()
  } else {
    ctx.body = {
      code: '10013',
      msg: ['操作失败']
    }
  }
})

/**
 * 是否设置为推荐文章
 */
router.put('/recommend/:articleId', new Auth().token, async ctx => {
  const articleId = ctx.params.articleId
  const value = ctx.request.body.OnOrOff ? 1 : 0
  const info = await new Article().setRecommend(articleId, value)
  if (info) {
    success()
  } else {
    ctx.body = {
      code: '10013',
      msg: ['操作失败']
    }
  }
})

/**
 * 设置文章置顶
 */
router.put('/article-top/:articleId', new Auth().token, async ctx => {
  const articleId = ctx.params.articleId
  const value = ctx.request.body.OnOrOff ? 1 : 0
  const info = await new Article().setArticleTop(articleId, value)
  if (info) {
    success()
  } else {
    ctx.body = {
      code: '10013',
      msg: ['操作失败']
    }
  }
})

/**
 * 发布文章
 */
router.put('/article-release/:articleId', new Auth().token, async ctx => {
  const articleId = ctx.params.articleId
  const value = ctx.request.body.OnOrOff ? 1 : 0
  const info = await new Article().setArticleRelease(articleId, value)
  if (info) {
    success()
  } else {
    ctx.body = {
      code: '10013',
      msg: ['操作失败']
    }
  }
})

module.exports = router
