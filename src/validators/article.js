const { Rule, LinValidator } = require('../core/lin-validator-v2')

const { Article } = require('../modules/article')

class ArticleValidator extends LinValidator {
  constructor() {
    super()
    this.articleTitle = [
      new Rule('isLength', '请输入文章标题', { min: 1 })
    ]
    this.articleContent = [
      new Rule('isLength', '请输入文章内容', { min: 1 })
    ]
  }
}

module.exports = { ArticleValidator }
