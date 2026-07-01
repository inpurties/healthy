<template>
  <div class="sport-knowledge">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>运动科普</h1>
      <p>科学运动，健康生活</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <p>加载中...</p>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav" v-else>
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane 
          v-for="category in categories" 
          :key="category.id"
          :label="category.categoryName" 
          :name="category.id.toString()">
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 文章列表 -->
    <div class="articles-section">
      <h2>{{ getCategoryTitle() }}</h2>
      
      <!-- 文章网格 -->
      <div v-if="articles.length > 0" class="articles-grid">
        <div 
          v-for="article in articles" 
          :key="article.id" 
          class="article-card"
          @click="viewArticle(article.id)">
          
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            
            <div class="article-meta">
              <span class="author">{{ article.author }}</span>
              <!-- <span class="reading-time">{{ article.readingTime }}此</span> -->
              <span class="stats">浏览: {{ article.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <p>暂无文章数据</p>
        <el-button type="primary" @click="loadData">重新加载</el-button>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="totalArticles > pageSize">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalArticles"
          layout="total, prev, pager, next">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { sportKnowledgeApi } from '../../api/sportKnowledge'

export default {
  name: 'SportKnowledgeSimple',
  data() {
    return {
      // 分类相关
      categories: [],
      activeCategory: 'all',
      
      // 文章相关
      articles: [],
      totalArticles: 0,
      currentPage: 1,
      pageSize: 12,
      
      // 状态
      loading: false
    }
  },
  
  created() {
    this.loadData()
  },
  
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        await this.loadCategories()
        await this.loadArticles()
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败，请检查后端服务是否启动')
      } finally {
        this.loading = false
      }
    },
    
    // 加载分类
    async loadCategories() {
      try {
        const response = await sportKnowledgeApi.getCategories()
        if (response.code === 200) {
          this.categories = response.data || []
        }
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    },
    
    // 加载文章列表
    async loadArticles() {
      try {
        const categoryId = this.activeCategory === 'all' ? null : parseInt(this.activeCategory)
        const response = await sportKnowledgeApi.getArticles({
          categoryId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        
        if (response.code === 200) {
          this.articles = response.data.articles || []
          this.totalArticles = response.data.total || 0
        }
      } catch (error) {
        console.error('加载文章失败:', error)
      }
    },
    
    // 分类切换
    handleCategoryChange() {
      this.currentPage = 1
      this.loadArticles()
    },
    
    // 分页切换
    handlePageChange(page) {
      this.currentPage = page
      this.loadArticles()
    },
    
    // 查看文章详情
    viewArticle(id) {
      this.$router.push(`/sport-knowledge/article/${id}`)
    },
    
    // 获取分类标题
    getCategoryTitle() {
      if (this.activeCategory === 'all') {
        return '全部文章'
      }
      const category = this.categories.find(c => c.id.toString() === this.activeCategory)
      return category ? category.categoryName : '文章列表'
    }
  }
}
</script>

<style scoped>
.sport-knowledge {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #409EFF;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 16px;
}

.loading-container {
  text-align: center;
  padding: 50px;
  color: #666;
}

.category-nav {
  margin-bottom: 30px;
}

.articles-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.article-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.article-title {
  color: #333;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
}

.article-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 50px;
}

.pagination-container {
  text-align: center;
  margin-top: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sport-knowledge {
    padding: 10px;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>