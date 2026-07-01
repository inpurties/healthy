<template>
  <div class="sport-knowledge">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>运动科普</h1>
      <p>科学运动，健康生活</p>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <el-input
        v-model="searchTag"
        placeholder="搜索运动知识标签..."
        prefix-icon="el-icon-search"
        @keyup.enter="handleSearch"
        style="width: 400px; margin-right: 10px;"
      ></el-input>
      <el-button type="primary" @click="handleSearch" icon="el-icon-search">搜索</el-button>
      <el-button @click="clearSearch" v-if="isSearching">清除搜索</el-button>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav" v-if="!isSearching">
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

    <!-- 推荐文章轮播 -->
    <div class="featured-section" v-if="!isSearching && featuredArticles.length > 0">
      <h2>推荐阅读</h2>
      <el-carousel height="300px" indicator-position="outside">
        <el-carousel-item v-for="article in featuredArticles" :key="article.id">
          <div class="featured-card" @click="viewArticle(article.id)">
            <div class="featured-image">
              <img :src="article.coverImage || '/default-cover.jpg'" :alt="article.title">
            </div>
            <div class="featured-content">
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
              <div class="featured-meta">
                <span class="author">{{ article.author }}</span>
                <span class="reading-time">{{ article.readingTime }}分钟阅读</span>
                <span class="difficulty">{{ getDifficultyText(article.difficultyLevel) }}</span>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 搜索结果提示 -->
    <div class="search-result-tip" v-if="isSearching">
      <h2>搜索结果：{{ searchTag }}</h2>
      <p>共找到 {{ totalArticles }} 篇相关文章</p>
    </div>

    <!-- 文章列表 -->
    <div class="articles-section">
      <h2 v-if="!isSearching">{{ getCategoryTitle() }}</h2>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-loading-spinner></el-loading-spinner>
        <p>加载中...</p>
      </div>

      <!-- 文章网格 -->
      <div v-else-if="articles.length > 0" class="articles-grid">
        <div 
          v-for="article in articles" 
          :key="article.id" 
          class="article-card"
          @click="viewArticle(article.id)">
          
          <div class="article-image">
            <img :src="article.coverImage || '/default-cover.jpg'" :alt="article.title">
            <div class="article-overlay">
              <el-tag :type="getDifficultyType(article.difficultyLevel)" size="small">
                {{ getDifficultyText(article.difficultyLevel) }}
              </el-tag>
            </div>
          </div>
          
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-subtitle" v-if="article.subtitle">{{ article.subtitle }}</p>
            <p class="article-summary">{{ article.summary }}</p>
            
            <div class="article-tags" v-if="article.tags">
              <el-tag 
                v-for="tag in getTagList(article.tags)" 
                :key="tag" 
                size="mini" 
                @click.stop="searchByTag(tag)">
                {{ tag }}
              </el-tag>
            </div>
            
            <div class="article-meta">
              <span class="author">
                <i class="el-icon-user"></i>
                {{ article.author }}
              </span>
              <span class="reading-time">
                <i class="el-icon-time"></i>
                {{ article.readingTime }}分钟
              </span>
              <span class="stats">
                <i class="el-icon-view"></i>
                {{ article.viewCount }}
                <i class="el-icon-star-off" style="margin-left: 10px;"></i>
                {{ article.likeCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty description="暂无相关文章">
          <el-button type="primary" @click="clearSearch" v-if="isSearching">返回浏览</el-button>
        </el-empty>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="totalArticles > pageSize">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalArticles"
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { sportKnowledgeApi } from '../../api/sportKnowledge'

export default {
  name: 'SportKnowledge',
  data() {
    return {
      // 分类相关
      categories: [],
      activeCategory: 'all',
      
      // 文章相关
      articles: [],
      featuredArticles: [],
      totalArticles: 0,
      currentPage: 1,
      pageSize: 12,
      
      // 搜索相关
      searchTag: '',
      isSearching: false,
      
      // 状态
      loading: false
    }
  },
  
  created() {
    this.initData()
  },
  
  methods: {
    // 初始化数据
    async initData() {
      await this.loadCategories()
      await this.loadFeaturedArticles()
      await this.loadArticles()
    },
    
    // 加载分类
    async loadCategories() {
      try {
        const response = await sportKnowledgeApi.getCategories()
        if (response.code === 200) {
          this.categories = response.data || []
        }
      } catch (error) {
        this.$message.error('加载分类失败')
        console.error('加载分类失败:', error)
      }
    },
    
    // 加载推荐文章
    async loadFeaturedArticles() {
      try {
        const response = await sportKnowledgeApi.getFeaturedArticles(5)
        if (response.code === 200) {
          this.featuredArticles = response.data || []
        }
      } catch (error) {
        console.error('加载推荐文章失败:', error)
      }
    },
    
    // 加载文章列表
    async loadArticles() {
      this.loading = true
      try {
        let response
        if (this.isSearching) {
          // 搜索模式
          response = await sportKnowledgeApi.searchArticles({
            tag: this.searchTag,
            pageNum: this.currentPage,
            pageSize: this.pageSize
          })
        } else {
          // 正常浏览模式
          const categoryId = this.activeCategory === 'all' ? null : parseInt(this.activeCategory)
          response = await sportKnowledgeApi.getArticles({
            categoryId,
            pageNum: this.currentPage,
            pageSize: this.pageSize
          })
        }
        
        if (response.code === 200) {
          this.articles = response.data.articles || []
          this.totalArticles = response.data.total || 0
        }
      } catch (error) {
        this.$message.error('加载文章失败')
        console.error('加载文章失败:', error)
      } finally {
        this.loading = false
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
    
    // 搜索处理
    handleSearch() {
      if (!this.searchTag.trim()) {
        this.$message.warning('请输入搜索关键词')
        return
      }
      this.isSearching = true
      this.currentPage = 1
      this.loadArticles()
    },
    
    // 清除搜索
    clearSearch() {
      this.searchTag = ''
      this.isSearching = false
      this.currentPage = 1
      this.loadArticles()
    },
    
    // 标签搜索
    searchByTag(tag) {
      this.searchTag = tag
      this.handleSearch()
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

.search-section {
  text-align: center;
  margin-bottom: 30px;
}

.category-nav {
  margin-bottom: 30px;
}

.featured-section {
  margin-bottom: 40px;
}

.featured-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.featured-card {
  display: flex;
  height: 280px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.featured-card:hover {
  transform: translateY(-5px);
}

.featured-image {
  flex: 1;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.featured-content h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 20px;
}

.featured-content p {
  color: #666;
  line-height: 1.6;
  flex: 1;
}

.featured-meta {
  display: flex;
  gap: 15px;
  color: #999;
  font-size: 14px;
}

.search-result-tip {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.search-result-tip h2 {
  color: #409EFF;
  margin-bottom: 5px;
}

.articles-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.loading-container {
  text-align: center;
  padding: 50px;
  color: #666;
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
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.article-content {
  padding: 20px;
}

.article-title {
  color: #333;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.article-subtitle {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
}

.article-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  margin-bottom: 15px;
}

.article-tags .el-tag {
  margin-right: 8px;
  margin-bottom: 5px;
  cursor: pointer;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 14px;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
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
  
  .featured-card {
    flex-direction: column;
    height: auto;
  }
  
  .search-section .el-input {
    width: 100% !important;
    margin-bottom: 10px;
  }
}
</style>