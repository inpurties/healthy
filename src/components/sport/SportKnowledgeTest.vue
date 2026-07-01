<template>
  <div class="sport-knowledge-test">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>运动测试与数据分析</h1>
      <p>测试您的运动知识，查看运动数据，获取个性化建议</p>
    </div>

    <!-- 功能导航 -->
    <el-tabs v-model="activeTab" type="border-card" class="test-tabs">
      <!-- 运动知识测试 -->
      <el-tab-pane label="运动知识测试" name="quiz">
        <div class="quiz-section">
          <div v-if="!quizStarted" class="quiz-intro">
            <h3>运动知识测试</h3>
            <p>测试您对运动知识的了解程度，共10道题目</p>
            <el-button type="primary" @click="startQuiz">开始测试</el-button>
          </div>
          
          <div v-else-if="!quizFinished" class="quiz-content">
            <div class="progress-info">
              <span>第 {{ currentQuestionIndex + 1 }} 题 / 共 {{ quizQuestions.length }} 题</span>
              <el-progress :percentage="(currentQuestionIndex + 1) / quizQuestions.length * 100" />
            </div>
            
            <div class="question-card">
              <h3>{{ currentQuestion.question }}</h3>
              <div class="options">
                <el-radio-group v-model="selectedAnswer">
                  <el-radio 
                    v-for="(option, index) in currentQuestion.options" 
                    :key="index" 
                    :label="index"
                    class="option-item"
                  >
                    {{ option }}
                  </el-radio>
                </el-radio-group>
              </div>
              
              <div class="question-actions">
                <el-button @click="previousQuestion" :disabled="currentQuestionIndex === 0">
                  上一题
                </el-button>
                <el-button type="primary" @click="nextQuestion" v-if="currentQuestionIndex < quizQuestions.length - 1">
                  下一题
                </el-button>
                <el-button type="success" @click="finishQuiz" v-else>
                  完成测试
                </el-button>
              </div>
            </div>
          </div>
          
          <div v-else class="quiz-result">
            <h3>测试结果</h3>
            <div class="result-summary">
              <el-card>
                <div class="score-display">
                  <h2>得分：{{ quizScore }} / {{ quizQuestions.length }}</h2>
                  <p>正确率：{{ (quizScore / quizQuestions.length * 100).toFixed(1) }}%</p>
                </div>
                <div class="score-level">
                  <el-tag :type="getScoreLevel().type">{{ getScoreLevel().text }}</el-tag>
                </div>
              </el-card>
            </div>
            
            <div class="question-review">
              <h4>题目回顾：</h4>
              <div v-for="(question, index) in quizQuestions" :key="index" class="review-item">
                <p><strong>第{{ index + 1 }}题：</strong>{{ question.question }}</p>
                <p>您的答案：{{ question.options[userAnswers[index]] }}</p>
                <p>正确答案：{{ question.options[question.correctAnswer] }}</p>
                <el-tag :type="userAnswers[index] === question.correctAnswer ? 'success' : 'danger'">
                  {{ userAnswers[index] === question.correctAnswer ? '正确' : '错误' }}
                </el-tag>
              </div>
            </div>
            
            <el-button type="primary" @click="restartQuiz">重新测试</el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 运动数据展示 -->
      <el-tab-pane label="运动数据" name="data">
        <div class="data-section">
          <h3>运动数据统计</h3>
          
          <el-row :gutter="20" class="data-cards">
            <el-col :span="8">
              <el-card>
                <div class="data-item">
                  <h4>总运动次数</h4>
                  <div class="data-value">852{{ sportStats.totalSessions }}</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card>
                <div class="data-item">
                  <h4>总消耗卡路里</h4>
                  <div class="data-value">23{{ sportStats.totalCalories }} kcal</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card>
                <div class="data-item">
                  <h4>平均心率</h4>
                  <div class="data-value">9{{ sportStats.avgHeartRate }} bpm</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          
          <!-- <el-button type="primary" @click="loadSportData">刷新数据</el-button> -->
        </div>
      </el-tab-pane>

      <!-- API接口测试 -->
      <!-- <el-tab-pane label="API测试" name="api">
        <div class="api-section">
          <h3>API接口测试</h3>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card>
                <div slot="header">
                  <span>运动知识API</span>
                </div>
                <el-button @click="testCategoriesApi">测试分类接口</el-button>
                <el-button @click="testArticlesApi">测试文章接口</el-button>
                <div v-if="apiResults.categories" class="api-result">
                  <h4>分类数据：</h4>
                  <pre>{{ apiResults.categories }}</pre>
                </div>
                <div v-if="apiResults.articles" class="api-result">
                  <h4>文章数据：</h4>
                  <pre>{{ apiResults.articles }}</pre>
                </div>
              </el-card>
            </el-col>
            
            <el-col :span="12">
              <el-card>
                <div slot="header">
                  <span>运动数据API</span>
                </div>
                <el-button @click="testSportDataApi">测试运动数据接口</el-button>
                <div v-if="apiResults.sportData" class="api-result">
                  <h4>运动数据：</h4>
                  <pre>{{ apiResults.sportData }}</pre>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane> -->

      <!-- 运动建议 -->
      <el-tab-pane label="运动建议" name="advice">
        <div class="advice-section">
          <h3>个性化运动建议</h3>
          
          <el-card v-for="(advice, index) in sportAdvice" :key="index" class="advice-card">
            <div slot="header">
              <span>{{ advice.title }}</span>
            </div>
            <p>{{ advice.content }}</p>
            <el-tag :type="advice.type">{{ advice.category }}</el-tag>
          </el-card>
          
          <el-button type="primary" @click="generateAdvice">生成新建议</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'SportKnowledgeTest',
  data() {
    return {
      activeTab: 'quiz',
      // 测试相关
      quizStarted: false,
      quizFinished: false,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      userAnswers: [],
      quizScore: 0,
      
      // 运动数据
      sportStats: {
        totalSessions: 0,
        totalCalories: 0,
        avgHeartRate: 0
      },
      
      // API测试结果
      apiResults: {
        categories: null,
        articles: null,
        sportData: null
      },
      
      // 运动建议
      sportAdvice: [
        {
          title: '有氧运动建议',
          content: '建议每周进行3-5次有氧运动，每次30-60分钟，心率控制在最大心率的60-80%。',
          category: '有氧运动',
          type: 'primary'
        },
        {
          title: '力量训练建议',
          content: '每周进行2-3次力量训练，重点训练大肌群，每组8-12次，3-4组。',
          category: '力量训练',
          type: 'success'
        },
        {
          title: '柔韧性训练',
          content: '每天进行10-15分钟的拉伸运动，提高身体柔韧性，预防运动损伤。',
          category: '柔韧性',
          type: 'warning'
        }
      ],
      
      // 测试题目
      quizQuestions: [
        {
          question: '以下哪种运动属于有氧运动？',
          options: ['举重', '慢跑', '短跑', '跳高'],
          correctAnswer: 1
        },
        {
          question: '运动时心率应该控制在什么范围？',
          options: ['50-80次/分钟', '120-180次/分钟', '200-250次/分钟', '80-120次/分钟'],
          correctAnswer: 1
        },
        {
          question: '运动前应该做什么准备？',
          options: ['直接开始运动', '热身5-10分钟', '吃饱饭', '喝大量水'],
          correctAnswer: 1
        },
        {
          question: '以下哪个不是运动的好处？',
          options: ['增强心肺功能', '提高免疫力', '增加体重', '改善睡眠'],
          correctAnswer: 2
        },
        {
          question: '运动后应该做什么？',
          options: ['立即洗澡', '放松拉伸', '立即进食', '立即睡觉'],
          correctAnswer: 1
        },
        {
          question: '每周建议运动几次？',
          options: ['1-2次', '3-5次', '6-7次', '不需要运动'],
          correctAnswer: 1
        },
        {
          question: '运动时应该注意什么？',
          options: ['运动强度越大越好', '循序渐进', '不需要休息', '空腹运动'],
          correctAnswer: 1
        },
        {
          question: '以下哪种运动适合初学者？',
          options: ['马拉松', '快走', '举重', '拳击'],
          correctAnswer: 1
        },
        {
          question: '运动时出现什么情况应该停止？',
          options: ['轻微出汗', '心跳加快', '胸痛或呼吸困难', '感觉疲劳'],
          correctAnswer: 2
        },
        {
          question: '运动后补充什么最重要？',
          options: ['蛋白质', '碳水化合物', '水分', '维生素'],
          correctAnswer: 2
        }
      ]
    }
  },
  computed: {
    currentQuestion() {
      return this.quizQuestions[this.currentQuestionIndex]
    }
  },
  methods: {
    // 测试相关方法
    startQuiz() {
      this.quizStarted = true
      this.quizFinished = false
      this.currentQuestionIndex = 0
      this.userAnswers = new Array(this.quizQuestions.length).fill(null)
      this.selectedAnswer = null
    },
    
    nextQuestion() {
      if (this.selectedAnswer !== null) {
        this.userAnswers[this.currentQuestionIndex] = this.selectedAnswer
        if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
          this.currentQuestionIndex++
          this.selectedAnswer = this.userAnswers[this.currentQuestionIndex]
        }
      } else {
        this.$message.warning('请选择一个答案')
      }
    },
    
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
        this.selectedAnswer = this.userAnswers[this.currentQuestionIndex]
      }
    },
    
    finishQuiz() {
      if (this.selectedAnswer !== null) {
        this.userAnswers[this.currentQuestionIndex] = this.selectedAnswer
        this.calculateScore()
        this.quizFinished = true
      } else {
        this.$message.warning('请选择一个答案')
      }
    },
    
    calculateScore() {
      this.quizScore = 0
      for (let i = 0; i < this.quizQuestions.length; i++) {
        if (this.userAnswers[i] === this.quizQuestions[i].correctAnswer) {
          this.quizScore++
        }
      }
    },
    
    getScoreLevel() {
      const percentage = this.quizScore / this.quizQuestions.length
      if (percentage >= 0.8) return { text: '优秀', type: 'success' }
      if (percentage >= 0.6) return { text: '良好', type: 'primary' }
      if (percentage >= 0.4) return { text: '一般', type: 'warning' }
      return { text: '需要加强', type: 'danger' }
    },
    
    restartQuiz() {
      this.quizStarted = false
      this.quizFinished = false
      this.currentQuestionIndex = 0
      this.selectedAnswer = null
      this.userAnswers = []
      this.quizScore = 0
    },
    
    // 数据相关方法
    async loadSportData() {
      try {
        const response = await this.$http.get('/api/sport/list')
        if (response.data && response.data.length > 0) {
          const data = response.data
          this.sportStats.totalSessions = data.length
          this.sportStats.totalCalories = data.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0)
          this.sportStats.avgHeartRate = Math.round(
            data.reduce((sum, item) => sum + (item.heartRateAvg || 0), 0) / data.length
          )
        }
      } catch (error) {
        console.error('加载运动数据失败:', error)
        this.$message.error('加载运动数据失败')
      }
    },
    
    // API测试方法
    async testCategoriesApi() {
      try {
        const response = await this.$http.get('/api/sport-knowledge/categories')
        this.apiResults.categories = JSON.stringify(response.data, null, 2)
        this.$message.success('分类接口测试成功')
      } catch (error) {
        this.apiResults.categories = '错误: ' + error.message
        this.$message.error('分类接口测试失败')
      }
    },
    
    async testArticlesApi() {
      try {
        const response = await this.$http.get('/api/sport-knowledge/articles')
        this.apiResults.articles = JSON.stringify(response.data, null, 2)
        this.$message.success('文章接口测试成功')
      } catch (error) {
        this.apiResults.articles = '错误: ' + error.message
        this.$message.error('文章接口测试失败')
      }
    },
    
    async testSportDataApi() {
      try {
        const response = await this.$http.get('/api/sport/list')
        this.apiResults.sportData = JSON.stringify(response.data, null, 2)
        this.$message.success('运动数据接口测试成功')
      } catch (error) {
        this.apiResults.sportData = '错误: ' + error.message
        this.$message.error('运动数据接口测试失败')
      }
    },
    
    // 建议相关方法
    generateAdvice() {
      const adviceList = [
        {
          title: '有氧运动建议',
          content: '建议每周进行3-5次有氧运动，每次30-60分钟，心率控制在最大心率的60-80%。',
          category: '有氧运动',
          type: 'primary'
        },
        {
          title: '力量训练建议',
          content: '每周进行2-3次力量训练，重点训练大肌群，每组8-12次，3-4组。',
          category: '力量训练',
          type: 'success'
        },
        {
          title: '柔韧性训练',
          content: '每天进行10-15分钟的拉伸运动，提高身体柔韧性，预防运动损伤。',
          category: '柔韧性',
          type: 'warning'
        },
        {
          title: '营养补充建议',
          content: '运动前后适量补充蛋白质和碳水化合物，帮助肌肉恢复和能量补充。',
          category: '营养',
          type: 'info'
        },
        {
          title: '休息恢复建议',
          content: '保证充足的睡眠，给身体足够的恢复时间，避免过度训练。',
          category: '恢复',
          type: 'success'
        }
      ]
      
      // 随机选择3个建议
      const shuffled = adviceList.sort(() => 0.5 - Math.random())
      this.sportAdvice = shuffled.slice(0, 3)
      this.$message.success('已生成新的运动建议')
    }
  },
  
  mounted() {
    // 页面加载时自动加载运动数据
    this.loadSportData()
  }
}
</script>

<style scoped>
.sport-knowledge-test {
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

.test-tabs {
  margin-top: 20px;
}

/* 测试相关样式 */
.quiz-section {
  padding: 20px;
}

.quiz-intro {
  text-align: center;
  padding: 40px;
}

.quiz-content {
  max-width: 800px;
  margin: 0 auto;
}

.progress-info {
  margin-bottom: 20px;
}

.question-card {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.question-card h3 {
  margin-bottom: 20px;
  color: #333;
}

.options {
  margin-bottom: 30px;
}

.option-item {
  display: block;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.option-item:hover {
  background-color: #f5f7fa;
}

.question-actions {
  text-align: center;
}

.quiz-result {
  max-width: 800px;
  margin: 0 auto;
}

.result-summary {
  margin-bottom: 30px;
}

.score-display {
  text-align: center;
  margin-bottom: 20px;
}

.score-display h2 {
  color: #409EFF;
  margin-bottom: 10px;
}

.score-level {
  text-align: center;
}

.question-review {
  margin-top: 30px;
}

.review-item {
  background: #f9f9f9;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
}

/* 数据展示样式 */
.data-section {
  padding: 20px;
}

.data-cards {
  margin-bottom: 20px;
}

.data-item {
  text-align: center;
}

.data-item h4 {
  color: #666;
  margin-bottom: 10px;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

/* API测试样式 */
.api-section {
  padding: 20px;
}

.api-result {
  margin-top: 15px;
}

.api-result pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

/* 建议样式 */
.advice-section {
  padding: 20px;
}

.advice-card {
  margin-bottom: 20px;
}

.advice-card p {
  margin-bottom: 10px;
  line-height: 1.6;
}
</style>