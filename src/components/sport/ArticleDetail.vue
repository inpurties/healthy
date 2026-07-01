<template>
  <div class="article-detail">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" icon="el-icon-arrow-left">返回列表</el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-loading-spinner></el-loading-spinner>
      <p>加载中...</p>
    </div>

    <!-- 文章内容 -->
    <div v-else-if="article" class="article-container">
      <!-- 文章头部 -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <h2 class="article-subtitle" v-if="article.subtitle">{{ article.subtitle }}</h2>
        
        <div class="article-meta">
          <div class="meta-left">
            <span class="author">
              <i class="el-icon-user"></i>
              {{ article.author }}
            </span>
            <span class="publish-time">
              <i class="el-icon-time"></i>
              {{ formatDate(article.publishedAt) }}
            </span>
            <span class="reading-time">
              <i class="el-icon-document"></i>
              预计阅读 {{ article.readingTime }} 分钟
            </span>
          </div>
          
          <div class="meta-right">
            <el-tag :type="getDifficultyType(article.difficultyLevel)" size="medium">
              {{ getDifficultyText(article.difficultyLevel) }}
            </el-tag>
          </div>
        </div>

        <!-- 文章标签 -->
        <div class="article-tags" v-if="article.tags">
          <el-tag 
            v-for="tag in getTagList(article.tags)" 
            :key="tag" 
            size="small"
            @click="searchByTag(tag)">
            {{ tag }}
          </el-tag>
        </div>

        <!-- 文章统计 -->
        <div class="article-stats">
          <span class="stat-item">
            <i class="el-icon-view"></i>
            {{ article.viewCount }} 次阅读
          </span>
          <span class="stat-item">
            <i class="el-icon-star-off"></i>
            {{ article.likeCount }} 人点赞
          </span>
        </div>
      </div>

      <!-- 文章封面 -->
      <div class="article-cover" v-if="article.coverImage">
        <img :src="article.coverImage" :alt="article.title">
      </div>

      <!-- 文章摘要 -->
      <div class="article-summary" v-if="article.summary">
        <div class="summary-box">
          <h3>内容摘要</h3>
          <p>{{ article.summary }}</p>
        </div>
      </div>

      <!-- 文章正文 -->
      <div class="article-content">
        <div v-html="article.content"></div>
      </div>

      <!-- 文章底部操作 -->
      <div class="article-actions">
        <el-button 
          type="primary" 
          @click="likeArticle" 
          :loading="liking"
          icon="el-icon-star-off">
          {{ article.likeCount }} 点赞
        </el-button>
        <el-button @click="shareArticle" icon="el-icon-share">分享</el-button>
        <el-button @click="goBack" icon="el-icon-arrow-left">返回列表</el-button>
      </div>

      <!-- 相关推荐 -->
      <div class="related-articles" v-if="relatedArticles.length > 0">
        <h3>相关推荐</h3>
        <div class="related-grid">
          <div 
            v-for="related in relatedArticles" 
            :key="related.id"
            class="related-card"
            @click="viewRelatedArticle(related.id)">
            <div class="related-image">
              <img :src="related.coverImage || '/default-cover.jpg'" :alt="related.title">
            </div>
            <div class="related-content">
              <h4>{{ related.title }}</h4>
              <p>{{ related.summary }}</p>
              <div class="related-meta">
                <span>{{ related.author }}</span>
                <span>{{ related.readingTime }}分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-state">
      <el-empty description="文章不存在或已被删除">
        <el-button type="primary" @click="goBack">返回列表</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script>
import { sportKnowledgeApi } from '../../api/sportKnowledge'

export default {
  name: 'ArticleDetail',
  data() {
    return {
      article: null,
      relatedArticles: [],
      loading: false,
      liking: false
    }
  },
  
  created() {
    this.loadArticle()
  },
  
  watch: {
    '$route'() {
      // 路由变化时重新加载文章
      this.loadArticle()
    }
  },
  
  methods: {
    // 加载文章详情
    async loadArticle() {
      const articleId = this.$route.params.id
      if (!articleId) {
        this.$message.error('文章ID无效')
        this.goBack()
        return
      }
      
      this.loading = true
      try {
        const response = await sportKnowledgeApi.getArticleDetail(articleId)
        if (response.code === 200) {
          this.article = response.data
          // 加载相关文章
          this.loadRelatedArticles()
        } else {
          this.$message.error(response.msg || '加载文章失败')
        }
      } catch (error) {
        this.$message.error('加载文章失败')
        console.error('加载文章失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 加载相关文章
    async loadRelatedArticles() {
      if (!this.article || !this.article.categoryId) return
      
      try {
        const response = await sportKnowledgeApi.getArticles({
          categoryId: this.article.categoryId,
          pageNum: 1,
          pageSize: 4
        })
        if (response.code === 200) {
          // 过滤掉当前文章
          this.relatedArticles = (response.data.articles || [])
            .filter(article => article.id !== this.article.id)
            .slice(0, 3)
        }
      } catch (error) {
        console.error('加载相关文章失败:', error)
      }
    },
    
    // 点赞文章
    async likeArticle() {
      if (!this.article) return
      
      this.liking = true
      try {
        const response = await sportKnowledgeApi.likeArticle(this.article.id)
        if (response.code === 200) {
          this.article.likeCount += 1
          this.$message.success('点赞成功！')
        } else {
          this.$message.error(response.msg || '点赞失败')
        }
      } catch (error) {
        this.$message.error('点赞失败')
        console.error('点赞失败:', error)
      } finally {
        this.liking = false
      }
    },
    
    // 分享文章
    // Navigator.share() API
    shareArticle() {
      const url = window.location.href
      if (navigator.share) {
        navigator.share({
          title: this.article.title,
          text: this.article.summary,
          url: url
        })
      } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(url).then(() => {
          this.$message.success('链接已复制到剪贴板')
        }).catch(() => {
          this.$message.info('请手动复制链接：' + url)
        })
      }
    },
    
    // 标签搜索
    searchByTag(tag) {
      this.$router.push({
        path: '/Introduction',
        query: { search: tag }
      })
    },
    
    // 查看相关文章
    viewRelatedArticle(id) {
      this.$router.push(`/sport-knowledge/article/${id}`)
    },
    
    // 返回列表
    goBack() {
      this.$router.go(-1)
    },
    
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    // 获取难度文本
    getDifficultyText(level) {
      const texts = { 1: '入门', 2: '初级', 3: '中级', 4: '高级' }
      return texts[level] || '入门'
    },
    
    // 获取难度类型
    getDifficultyType(level) {
      const types = { 1: 'success', 2: 'info', 3: 'warning', 4: 'danger' }
      return types[level] || 'success'
    },
    
    // 获取标签列表
    getTagList(tags) {
      return tags ? tags.split(',').filter(tag => tag.trim()) : []
    }
  }
}
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  min-height: 100vh;
}

.back-button {
  margin-bottom: 20px;
}

.loading-container {
  text-align: center;
  padding: 100px;
  color: #666;
}

.article-container {
  line-height: 1.8;
}

.article-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.3;
}

.article-subtitle {
  font-size: 20px;
  color: #666;
  font-weight: 400;
  margin-bottom: 20px;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.meta-left {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
  flex-wrap: wrap;
}

.meta-left span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.article-tags {
  margin-bottom: 15px;
}

.article-tags .el-tag {
  margin-right: 8px;
  margin-bottom: 5px;
  cursor: pointer;
}

.article-stats {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.article-cover {
  margin-bottom: 30px;
  text-align: center;
}

.article-cover img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.article-summary {
  margin-bottom: 30px;
}

.summary-box {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.summary-box h3 {
  color: #409EFF;
  margin-bottom: 10px;
  font-size: 16px;
}

.summary-box p {
  color: #666;
  margin: 0;
}

.article-content {
  margin-bottom: 40px;
  font-size: 16px;
  color: #333;
}

/* 文章内容样式 */
.article-content >>> h1,
.article-content >>> h2,
.article-content >>> h3,
.article-content >>> h4,
.article-content >>> h5,
.article-content >>> h6 {
  color: #333;
  margin: 30px 0 15px 0;
  font-weight: 600;
}

.article-content >>> h2 {
  font-size: 24px;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 10px;
}

.article-content >>> h3 {
  font-size: 20px;
}

.article-content >>> p {
  margin-bottom: 15px;
  text-align: justify;
}

.article-content >>> ul,
.article-content >>> ol {
  margin: 15px 0;
  padding-left: 30px;
}

.article-content >>> li {
  margin-bottom: 8px;
}

.article-content >>> blockquote {
  background: #f8f9fa;
  border-left: 4px solid #409EFF;
  padding: 15px 20px;
  margin: 20px 0;
  color: #666;
}

.article-content >>> code {
  background: #f1f2f3;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #e74c3c;
}

.article-content >>> pre {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 15px 0;
}

.article-actions {
  text-align: center;
  padding: 30px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 40px;
}

.article-actions .el-button {
  margin: 0 10px;
}

.related-articles {
  margin-top: 40px;
}

.related-articles h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 20px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.related-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.related-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.related-image {
  height: 120px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-content {
  padding: 15px;
}

.related-content h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 16px;
  line-height: 1.4;
}

.related-content p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}

.error-state {
  text-align: center;
  padding: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-detail {
    padding: 10px;
  }
  
  .article-title {
    font-size: 24px;
  }
  
  .article-subtitle {
    font-size: 18px;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .meta-left {
    flex-direction: column;
    gap: 10px;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
  
  .article-actions .el-button {
    margin: 5px;
  }
}
</style>