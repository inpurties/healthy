// 运动科普模块 API 服务
// API接口封装：统一管理运动科普模块的所有后端数据交互
// axios实例配置：创建专门用于运动科普模块的HTTP客户端
import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:9000/api/sport-knowledge',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加 token 等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// 运动科普 API 服务
export const sportKnowledgeApi = {
  
  // 获取所有分类
  getCategories() {
    return api.get('/categories')
  },
  
  // 根据父分类ID获取子分类
  getCategoriesByParentId(parentId) {
    return api.get(`/categories/children/${parentId}`)
  },
  
  // 分页获取文章列表
  getArticles(params = {}) {
    const { categoryId, pageNum = 1, pageSize = 10 } = params
    let url = `/articles?pageNum=${pageNum}&pageSize=${pageSize}`
    if (categoryId) {
      url += `&categoryId=${categoryId}`
    }
    return api.get(url)
  },
  
  // 获取文章详情
  getArticleDetail(id) {
    return api.get(`/articles/${id}`)
  },
  
  // 获取推荐文章
  getFeaturedArticles(limit = 5) {
    return api.get(`/articles/featured?limit=${limit}`)
  },
  
  // 根据标签搜索文章
  searchArticles(params = {}) {
    const { tag, pageNum = 1, pageSize = 10 } = params
    return api.get(`/articles/search?tag=${tag}&pageNum=${pageNum}&pageSize=${pageSize}`)
  },
  
  // 文章点赞
  likeArticle(id) {
    return api.post(`/articles/${id}/like`)
  },
}

export default sportKnowledgeApi