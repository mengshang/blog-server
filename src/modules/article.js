const { Sequelize, Model, Op } = require('sequelize')

const { sequelize } = require('../core/db')

class Article extends Model {
  /**
   * 获取文章列表
   * @param title       文章标题
   * @param currentPage 当前页
   * @param size        每页条目
   * @param exclude
   * @returns {Promise<{total: *, size: *, list: *, currentPage: *}>}
   */
  async getArticleList(title = '', currentPage = 1, size = 10, exclude = ['deletedAt']) {
    const offset = (currentPage - 1) * parseInt(size)
    const list = await Article.findAndCountAll({
      where: {
        articleTitle: {
          [Op.like]: `%${title}%`
        }
      },
      order: [['id', 'DESC']],
      attributes: { exclude: exclude },
      offset: parseInt(offset),
      limit: parseInt(size)
    })
    return {
      list: list.rows,
      total: list.count.toString(),
      currentPage,
      size
    }
  }

  /**
   * 根据文章标题查询文章
   * @param articleTitle
   * @returns {Promise<boolean>}
   */
  async getArticleByTitle(articleTitle = '') {
    const article = await Article.findOne({
      where: {
        articleTitle
      },
      attribute: ['articleTitle']
    })
    return article
  }

  /**
   * 查询文章详情
   * @param id
   * @returns {Promise<void>}
   */
  async getArticleById(id) {
    const article = await Article.findOne({
      where: {
        id: parseInt(id)
      },
      attributes: { exclude: ['articleAuthor', 'articleAuthorId', 'articleLikeCount', 'articleCommentCount', 'articleViews', 'createdAt', 'updatedAt', 'deletedAt'] }
    })
    return article
  }

  /**
   * 修改文章
   * @param id  文章id
   * @param articleInfo 前端提交的文章信息
   * @returns {Promise<boolean>}
   */
  async putArticle(id = '', articleInfo) {
    const hasArticle = await Article.findOne({
      where: {
        id: parseInt(id)
      },
      attribute: ['id']
    })
    if (!hasArticle) {
      return false
    }
    await Article.update({ ...articleInfo }, {
      where: {
        id: parseInt(id)
      }
    })
    return true
  }

  /**
   * 删除文章
   * @param id
   * @returns {Promise<void>}
   */
  async deleteArticle(id = '') {
    const article = await Article.destroy({
      where: {
        id: parseInt(id)
      }
    })
    return article
  }

  /**
   * 开启、关闭评论
   * @param id
   * @param value
   * @returns {Promise<boolean>}
   */
  async openOrCloseComment(id, value) {
    const info = await Article.update({ openComment: value }, { where: { id: parseInt(id) } })
    return !!info[0]
  }

  /**
   * 是否设置为推荐
   * @param id
   * @param value
   * @returns {Promise<boolean>}
   */
  async setRecommend(id, value) {
    const info = await Article.update({ recommend: value }, { where: { id: parseInt(id) } })
    return !!info[0]
  }

  /**
   * 设置文章置顶
   * @param id
   * @param value
   * @returns {Promise<boolean>}
   */
  async setArticleTop(id, value) {
    const info = await Article.update({ articleTop: value }, { where: { id: parseInt(id) } })
    return !!info[0]
  }

  /**
   * 发布文章
   * @param id
   * @param value
   * @returns {Promise<boolean>}
   */
  async setArticleRelease(id, value) {
    const info = await Article.update({ articleRelease: value }, { where: { id: parseInt(id) } })
    return !!info[0]
  }
}

Article.init({
  articleTitle: {
    type: Sequelize.STRING(32),
    unique: true,
    comment: '文章标题'
  },
  articleAuthor: {
    type: Sequelize.STRING(32),
    comment: '文章作者'
  },
  openComment: {
    type: Sequelize.BOOLEAN,
    defaultValue: 1,
    comment: '是否开启评论, 0:关闭 1:开启'
  },
  recommend: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
    comment: '是否设为推荐文章，0:关闭 1:开启'
  },
  articleViews: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    comment: '文章浏览量'
  },
  articleCommentCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    comment: '文章评论量'
  },
  articleLikeCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    comment: '喜欢量'
  },
  articleAuthorId: {
    type: Sequelize.INTEGER,
    comment: '文章作者id'
  },
  articleSummary: {
    type: Sequelize.TEXT,
    comment: '文章摘要'
  },
  articleContent: {
    type: Sequelize.TEXT,
    comment: '文章内容'
  },
  articleTop: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
    comment: '是否置顶, 0:不置顶 1:置顶'
  },
  articleRelease: {
    type: Sequelize.BOOLEAN,
    defaultValue: 1,
    comment: '是否发布，0:不发布 1:发布'
  }
}, {
  tableName: 'article',
  sequelize
})

module.exports = { Article }
