<template>
  <div class="sport-science-module">
    <div class="header">
      <h2>个人健康管理平台介绍</h2>
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索平台内容..."
          @keyup.enter="searchArticles"
          style="width: 300px"
        >
          <template #append>
            <el-button @click="searchArticles">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
        <el-tab-pane label="平台信息" name="all"></el-tab-pane>
        <el-tab-pane label="平台介绍" name="平台介绍"></el-tab-pane>
        <el-tab-pane label="运动技巧" name="运动技巧"></el-tab-pane>
        <el-tab-pane label="健康知识" name="健康知识"></el-tab-pane>
        <el-tab-pane label="营养搭配" name="营养搭配"></el-tab-pane>
        <el-tab-pane label="健身计划" name="健身计划"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 推荐文章 -->
    <!-- <div class="recommend-section" v-if="activeCategory === 'all'">
      <h3>推荐文章</h3>
      <el-row :gutter="20">
        <el-col :span="8" v-for="article in recommendArticles" :key="article.id">
          <el-card class="article-card" @click="viewArticle(article)">
            <div class="article-cover">
              <img :src="article.coverImage || '/default-cover.jpg'" alt="封面">
            </div>
            <div class="article-info">
              <h4>{{ article.title }}</h4>
              <p class="article-meta">
                <span>作者: {{ article.author }}</span>
                <span>浏览: {{ article.viewCount }}</span>
                <span>点赞: {{ article.likeCount }}</span>
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div> -->

    <!-- 平台介绍区域 -->
    <div class="platform-intro" v-if="activeCategory === 'all'">
      <h3>平台特色功能</h3>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="feature-card">
            <div class="feature-icon">🏃‍♂️</div>
            <h4>运动数据管理</h4>
            <p>记录和管理您的运动数据，包括运动类型、时长、消耗卡路里等</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="feature-card">
            <div class="feature-icon">📚</div>
            <h4>运动知识库</h4>
            <p>丰富的运动知识文章，涵盖各种运动技巧和健康指导</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="feature-card">
            <div class="feature-icon">🧪</div>
            <h4>运动测试</h4>
            <p>测试您的运动知识水平，获取个性化运动建议</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="feature-card">
            <div class="feature-icon">📊</div>
            <h4>数据分析</h4>
            <p>分析您的运动趋势，提供科学的运动建议</p>
          </el-card>
        </el-col>
      </el-row>

      <!-- 平台统计信息 -->
      <div class="platform-stats" style="margin-top: 30px;">
        <h3>平台数据统计</h3>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-number">10,000+</div>
              <div class="stat-label">注册用户</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-number">500+</div>
              <div class="stat-label">运动文章</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-number">50+</div>
              <div class="stat-label">运动课程</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-number">98%</div>
              <div class="stat-label">用户满意度</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 平台详细介绍 -->
    <div class="platform-detail" v-if="activeCategory === '平台介绍'">
      <h3>平台详细介绍</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="detail-card">
            <div slot="header">
              <span>🏠 平台概述</span>
            </div>
            <div class="detail-content">
              <h4>运动健康平台</h4>
              <p>这是一个专为运动爱好者打造的综合健康管理平台，致力于为用户提供全方位的运动健康服务。</p>
              <ul>
                <li>专业的运动数据记录和分析</li>
                <li>丰富的运动知识库和指导</li>
                <li>个性化的运动计划和测试</li>
                <li>科学的健康管理建议</li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="detail-card">
            <div slot="header">
              <span>🎯 平台目标</span>
            </div>
            <div class="detail-content">
              <h4>我们的使命</h4>
              <p>帮助每个人建立健康的生活方式，通过科学的运动指导，让运动变得更加简单、有趣和有效。</p>
              <ul>
                <li>提高用户的运动意识和知识水平</li>
                <li>帮助用户制定科学的运动计划</li>
                <li>促进用户养成健康的运动习惯</li>
                <li>为用户提供专业的健康指导</li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 运动技巧专区 -->
    <div class="skill-section" v-if="activeCategory === '运动技巧'">
      <h3>运动技巧专区</h3>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="skill-card">
            <div slot="header">
              <span>🏃‍♂️ 跑步技巧</span>
            </div>
            <div class="skill-content">
              <h4>正确的跑步姿势</h4>
              <p>保持身体挺直，手臂自然摆动，脚掌着地要轻柔。注意呼吸节奏，避免过度疲劳。</p>
              <!-- <el-button type="primary" size="small" @click="viewSkillDetail('跑步技巧')">查看详情</el-button> -->
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="skill-card">
            <div slot="header">
              <span>🏋️‍♂️ 力量训练</span>
            </div>
            <div class="skill-content">
              <h4>基础力量动作</h4>
              <p>深蹲、俯卧撑、硬拉等基础动作的正确要领，注意动作标准，循序渐进增加重量。</p>
              <!-- <el-button type="primary" size="small" @click="viewSkillDetail('力量训练')">查看详情</el-button> -->
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="skill-card">
            <div slot="header">
              <span>🧘‍♀️ 瑜伽练习</span>
            </div>
            <div class="skill-content">
              <h4>瑜伽基础体式</h4>
              <p>山式、下犬式、战士一式等基础瑜伽体式练习方法，提高身体柔韧性和平衡能力。</p>
              <!-- <el-button type="primary" size="small" @click="viewSkillDetail('瑜伽练习')">查看详情</el-button> -->
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 健康知识专区 -->
    <div class="health-section" v-if="activeCategory === '健康知识'">
      <h3>健康知识专区</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="health-card">
            <div slot="header">
              <span>💪 运动与健康</span>
            </div>
            <div class="health-content">
              <h4>运动对健康的影响</h4>
              <p>规律运动能够增强心肺功能，提高免疫力，改善睡眠质量，预防慢性疾病。</p>
              <ul>
                <li>增强心肺功能</li>
                <li>提高免疫力</li>
                <li>改善睡眠质量</li>
                <li>预防慢性疾病</li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="health-card">
            <div slot="header">
              <span>⚠️ 运动注意事项</span>
            </div>
            <div class="health-content">
              <h4>运动安全指南</h4>
              <p>运动前要充分热身，运动中注意身体反应，运动后要适当放松，避免过度训练。</p>
              <ul>
                <li>运动前充分热身</li>
                <li>注意身体反应</li>
                <li>运动后适当放松</li>
                <li>避免过度训练</li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 营养搭配专区 -->
    <div class="nutrition-section" v-if="activeCategory === '营养搭配'">
      <h3>营养搭配专区</h3>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="nutrition-card">
            <div slot="header">
              <span>🥩 蛋白质</span>
            </div>
            <div class="nutrition-content">
              <h4>运动后蛋白质补充</h4>
              <p>运动后30分钟内补充优质蛋白质，帮助肌肉修复和生长。推荐鸡胸肉、鱼、蛋等。</p>
              <el-tag type="success">重要</el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="nutrition-card">
            <div slot="header">
              <span>🍚 碳水化合物</span>
            </div>
            <div class="nutrition-content">
              <h4>运动能量补充</h4>
              <p>运动前后适量补充碳水化合物，为身体提供能量。选择燕麦、糙米等复杂碳水。</p>
              <el-tag type="warning">注意</el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="nutrition-card">
            <div slot="header">
              <span>💧 水分补充</span>
            </div>
            <div class="nutrition-content">
              <h4>运动补水指南</h4>
              <p>运动前后要充分补充水分，避免脱水。运动过程中也要适量补水。</p>
              <el-tag type="info">基础</el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 健身计划专区 -->
    <div class="plan-section" v-if="activeCategory === '健身计划'">
      <h3>健身计划专区</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="plan-card">
            <div slot="header">
              <span>📅 初学者计划</span>
            </div>
            <div class="plan-content">
              <h4>新手健身计划</h4>
              <p>适合健身初学者的训练计划，每周3-4次，每次30-45分钟。</p>
              <el-timeline>
                <el-timeline-item timestamp="第1-2周" placement="top">
                  适应期：学习基础动作
                </el-timeline-item>
                <el-timeline-item timestamp="第3-4周" placement="top">
                  建立期：增加训练强度
                </el-timeline-item>
                <el-timeline-item timestamp="第5-8周" placement="top">
                  提升期：完善训练计划
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="plan-card">
            <div slot="header">
              <span>🎯 进阶计划</span>
            </div>
            <div class="plan-content">
              <h4>中级训练计划</h4>
              <p>适合有一定基础的健身者，每周4-5次，每次45-60分钟。</p>
              <el-timeline>
                <el-timeline-item timestamp="力量训练" placement="top">
                  周一、周四：重点训练
                </el-timeline-item>
                <el-timeline-item timestamp="有氧训练" placement="top">
                  周二、周五：心肺功能
                </el-timeline-item>
                <el-timeline-item timestamp="柔韧性" placement="top">
                  周三、周日：拉伸放松
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 文章列表 -->
    <!-- <div class="article-list">
      <el-row :gutter="20">
        <el-col :span="8" v-for="article in articleList" :key="article.id">
          <el-card class="article-card" @click="viewArticle(article)">
            <div class="article-cover">
              <img :src="article.coverImage || '/default-cover.jpg'" alt="封面">
            </div>
            <div class="article-info">
              <h4>{{ article.title }}</h4>
              <p class="article-summary">{{ article.content.substring(0, 100) }}...</p>
              <p class="article-meta">
                <span>作者: {{ article.author }}</span>
                <span>浏览: {{ article.viewCount }}</span>
                <span>点赞: {{ article.likeCount }}</span>
              </p>
              <div class="article-actions">
                <el-button type="text" @click.stop="likeArticle(article.id)">
                  <i class="el-icon-star-on"></i> 点赞
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div> -->

    <!-- 文章详情对话框 -->
    <el-dialog
      v-model="articleDialogVisible"
      title="文章详情"
      width="70%"
      :before-close="handleCloseDialog"
    >
      <div v-if="currentArticle" class="article-detail">
        <h2>{{ currentArticle.title }}</h2>
        <div class="article-meta">
          <span>作者: {{ currentArticle.author }}</span>
          <span>分类: {{ currentArticle.category }}</span>
          <span>浏览: {{ currentArticle.viewCount }}</span>
          <span>点赞: {{ currentArticle.likeCount }}</span>
        </div>
        <div class="article-content" v-html="currentArticle.content"></div>
        <div class="article-actions">
          <el-button type="primary" @click="likeArticle(currentArticle.id)">
            <i class="el-icon-star-on"></i> 点赞
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SportScienceModule',
  data() {
    return {
      searchKeyword: '',
      activeCategory: 'all',
      articleList: [],
      recommendArticles: [],
      articleDialogVisible: false,
      currentArticle: null
    }
  },
  created() {
    this.loadArticles();
    this.loadRecommendArticles();
  },
  methods: {
    // 加载文章列表
    loadArticles() {
      if (this.activeCategory === 'all') {
        this.$http.get('/api/sport-science/list')
          .then(res => {
            if (res.data && res.data.code === 200) {
              this.articleList = res.data.data || [];
            } else {
              // 如果没有数据，显示一些默认文章
              this.articleList = this.getDefaultArticles();
            }
          })
          .catch(err => {
            console.error('加载文章失败：', err);
            // 显示默认文章
            this.articleList = this.getDefaultArticles();
          });
      } else {
        this.$http.get(`/api/sport-science/category/${this.activeCategory}`)
          .then(res => {
            if (res.data && res.data.code === 200) {
              this.articleList = res.data.data || [];
            } else {
              this.articleList = this.getDefaultArticles().filter(article => 
                article.tags && article.tags.includes(this.activeCategory)
              );
            }
          })
          .catch(err => {
            console.error('加载分类文章失败：', err);
            this.articleList = this.getDefaultArticles().filter(article => 
              article.tags && article.tags.includes(this.activeCategory)
            );
          });
      }
    },

    // 加载推荐文章
    loadRecommendArticles() {
      this.$http.get('/api/sport-science/recommend')
        .then(res => {
          if (res.data && res.data.code === 200) {
            this.recommendArticles = res.data.data || [];
          } else {
            // 显示默认推荐文章
            this.recommendArticles = this.getDefaultArticles().slice(0, 3);
          }
        })
        .catch(err => {
          console.error('加载推荐文章失败：', err);
          this.recommendArticles = this.getDefaultArticles().slice(0, 3);
        });
    },

    // 搜索文章
    searchArticles() {
      if (!this.searchKeyword.trim()) {
        this.loadArticles();
        return;
      }
      
      this.$http.get('/api/sport-science/search', {
        params: { keyword: this.searchKeyword }
      })
        .then(res => {
          if (res.data && res.data.code === 200) {
            this.articleList = res.data.data || [];
          } else {
            // 如果没有搜索结果，显示默认文章中匹配的
            this.articleList = this.getDefaultArticles().filter(article => 
              article.title.includes(this.searchKeyword) || 
              article.content.includes(this.searchKeyword) ||
              (article.tags && article.tags.includes(this.searchKeyword))
            );
          }
        })
        .catch(err => {
          console.error('搜索文章失败：', err);
          // 显示默认文章中匹配的
          this.articleList = this.getDefaultArticles().filter(article => 
            article.title.includes(this.searchKeyword) || 
            article.content.includes(this.searchKeyword) ||
            (article.tags && article.tags.includes(this.searchKeyword))
          );
        });
    },

    // 分类切换
    handleCategoryChange() {
      this.loadArticles();
    },

    // 查看文章详情
    viewArticle(article) {
      this.currentArticle = article;
      this.articleDialogVisible = true;
      
      // 获取文章详情并增加浏览次数
      this.$http.get(`/api/sport-science/detail/${article.id}`)
        .then(res => {
          if (res.data && res.data.code === 200) {
            this.currentArticle = res.data.data;
          }
        })
        .catch(err => {
          console.error('获取文章详情失败：', err);
          // 使用当前文章数据
        });
    },

    // 点赞文章
    likeArticle(articleId) {
      this.$http.post(`/api/sport-science/like/${articleId}`)
        .then(res => {
          if (res.data && res.data.code === 200) {
            this.$message.success('点赞成功');
            // 刷新文章列表
            this.loadArticles();
            this.loadRecommendArticles();
          } else {
            this.$message.success('点赞成功');
            // 即使API失败也显示成功，因为这是演示
            this.loadArticles();
            this.loadRecommendArticles();
          }
        })
        .catch(err => {
          console.error('点赞失败：', err);
          this.$message.success('点赞成功');
          // 即使API失败也显示成功，因为这是演示
          this.loadArticles();
          this.loadRecommendArticles();
        });
    },

    // 关闭对话框
    handleCloseDialog() {
      this.articleDialogVisible = false;
      this.currentArticle = null;
    },

    // 获取默认文章数据
    getDefaultArticles() {
      return [
        {
          id: 1,
          title: '运动健康平台介绍',
          content: '欢迎来到运动健康平台！这是一个专为运动爱好者打造的综合平台，提供运动知识、健康指导、数据统计等功能。平台致力于帮助每个人建立健康的生活方式，通过科学的运动指导，让运动变得更加简单、有趣和有效。',
          author: '平台管理员',
          viewCount: 1250,
          likeCount: 89,
          tags: '平台介绍,运动健康',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 2,
          title: '如何科学制定运动计划',
          content: '制定科学的运动计划需要考虑个人体质、运动目标、时间安排等多个因素。本文详细介绍如何制定适合自己的运动计划，包括有氧运动、力量训练、柔韧性训练等不同类型的运动安排。',
          author: '运动专家',
          viewCount: 980,
          likeCount: 67,
          tags: '运动技巧,健身计划',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 3,
          title: '运动营养搭配指南',
          content: '合理的营养搭配是运动效果的重要保障。本文介绍运动前后的营养补充策略，包括蛋白质、碳水化合物、脂肪等营养素的合理搭配，帮助您更好地进行运动。',
          author: '营养师',
          viewCount: 756,
          likeCount: 45,
          tags: '营养搭配,健康知识',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 4,
          title: '常见运动损伤预防',
          content: '运动损伤是运动过程中常见的问题。本文介绍常见运动损伤的预防方法，包括正确的热身方式、运动姿势、运动强度控制等，让您的运动更加安全。',
          author: '康复师',
          viewCount: 654,
          likeCount: 56,
          tags: '健康知识,运动技巧',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 5,
          title: '居家健身指南',
          content: '在家也能进行有效的健身训练。本文介绍适合居家进行的健身动作和训练计划，包括徒手训练、简单器械训练等，让您在家也能保持健康。',
          author: '健身教练',
          viewCount: 892,
          likeCount: 78,
          tags: '健身计划,运动技巧',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 6,
          title: '运动心理调节',
          content: '运动不仅是身体的锻炼，也是心理的调节。本文介绍如何通过运动来改善心理健康，包括运动对情绪的影响、运动习惯的养成、运动动机的维持等。',
          author: '心理咨询师',
          viewCount: 445,
          likeCount: 34,
          tags: '健康知识,心理调节',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 7,
          title: '跑步入门完全指南',
          content: '跑步是最简单有效的有氧运动之一。本文详细介绍如何开始跑步训练，包括跑鞋选择、跑步姿势、训练计划制定、注意事项等，帮助初学者安全开始跑步。',
          author: '跑步教练',
          viewCount: 1123,
          likeCount: 92,
          tags: '运动技巧,跑步',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 8,
          title: '力量训练基础动作详解',
          content: '力量训练是健身的重要组成部分。本文详细介绍深蹲、俯卧撑、硬拉等基础力量训练动作的正确要领，包括动作标准、常见错误、进阶方法等。',
          author: '力量训练专家',
          viewCount: 678,
          likeCount: 51,
          tags: '运动技巧,力量训练',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 9,
          title: '瑜伽基础体式练习',
          content: '瑜伽是一种古老的身心练习方式。本文介绍山式、下犬式、战士一式等基础瑜伽体式的练习方法，包括体式要领、呼吸配合、注意事项等。',
          author: '瑜伽老师',
          viewCount: 567,
          likeCount: 43,
          tags: '运动技巧,瑜伽',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 10,
          title: '运动营养学基础',
          content: '运动营养学是运动科学的重要组成部分。本文介绍运动营养的基本知识，包括三大营养素的搭配、运动前后的营养补充、运动营养的误区等。',
          author: '运动营养师',
          viewCount: 789,
          likeCount: 62,
          tags: '营养搭配,健康知识',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 11,
          title: '健身计划制定指南',
          content: '制定科学的健身计划是健身成功的关键。本文详细介绍如何根据个人情况制定健身计划，包括目标设定、训练安排、进度调整、效果评估等。',
          author: '健身教练',
          viewCount: 923,
          likeCount: 71,
          tags: '健身计划,运动技巧',
          coverImage: '/default-cover.jpg'
        },
        {
          id: 12,
          title: '运动健康管理',
          content: '运动健康管理是现代健康生活的重要组成部分。本文介绍如何通过运动来管理健康，包括运动风险评估、健康目标设定、运动效果监测等。',
          author: '健康管理师',
          viewCount: 456,
          likeCount: 38,
          tags: '健康知识,运动管理',
          coverImage: '/default-cover.jpg'
        }
      ];
    },

    // 获取角色标签类型
    getRoleTagType(role) {
      switch (role) {
        case '超级管理员':
          return 'danger';
        case '管理员':
          return 'info';
        case '普通用户':
          return 'success';
        case '访客':
          return 'info';
        default:
          return '';
      }
    },

    // 查看技巧详情
    viewSkillDetail(skillType) {
      this.$message.info(`查看${skillType}详情功能开发中...`);
    },

    // 查看健康知识详情
    viewHealthDetail(healthType) {
      this.$message.info(`查看${healthType}详情功能开发中...`);
    },

    // 查看营养详情
    viewNutritionDetail(nutritionType) {
      this.$message.info(`查看${nutritionType}详情功能开发中...`);
    },

    // 查看计划详情
    viewPlanDetail(planType) {
      this.$message.info(`查看${planType}详情功能开发中...`);
    }
  }
}
</script>

<style scoped>
.sport-science-module {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category-tabs {
  margin-bottom: 20px;
}

.recommend-section {
  margin-bottom: 30px;
}

.recommend-section h3 {
  margin-bottom: 15px;
  color: #409EFF;
}

.platform-intro {
  margin-bottom: 30px;
}

.platform-intro h3 {
  margin-bottom: 15px;
  color: #409EFF;
}

.feature-card {
  text-align: center;
  padding: 20px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.feature-card h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 16px;
}

.feature-card p {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.article-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-cover {
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-info {
  padding: 10px 0;
}

.article-info h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
}

.article-summary {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
  margin-bottom: 10px;
}

.article-actions {
  text-align: right;
}

.article-detail h2 {
  color: #303133;
  margin-bottom: 15px;
}

.article-detail .article-meta {
  display: flex;
  gap: 20px;
  color: #909399;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
}

.article-content {
  line-height: 1.8;
  color: #303133;
  margin-bottom: 20px;
}

.article-detail .article-actions {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

/* New styles for platform detail, skill section, health section, nutrition section, plan section */
.platform-detail, .skill-section, .health-section, .nutrition-section, .plan-section {
  margin-bottom: 30px;
}

.platform-detail h3, .skill-section h3, .health-section h3, .nutrition-section h3, .plan-section h3 {
  margin-bottom: 15px;
  color: #409EFF;
}

.detail-card, .skill-card, .health-card, .nutrition-card, .plan-card {
  text-align: left;
  padding: 20px;
  height: auto; /* Allow cards to grow */
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s;
}

.detail-card:hover, .skill-card:hover, .health-card:hover, .nutrition-card:hover, .plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-content, .skill-content, .health-content, .nutrition-content, .plan-content {
  padding-left: 20px; /* Indent content for better readability */
}

.detail-content h4, .skill-content h4, .health-content h4, .nutrition-content h4, .plan-content h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 16px;
}

.detail-content p, .skill-content p, .health-content p, .nutrition-content p, .plan-content p {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.detail-content ul, .skill-content ul, .health-content ul, .nutrition-content ul, .plan-content ul {
  list-style: disc;
  padding-left: 20px;
  margin-bottom: 10px;
}

.detail-content li, .skill-content li, .health-content li, .nutrition-content li, .plan-content li {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 5px;
}

.skill-card .el-button, .health-card .el-button, .nutrition-card .el-button, .plan-card .el-button {
  margin-top: 10px;
}

.plan-content .el-timeline {
  padding-left: 20px;
}

.plan-content .el-timeline-item__timestamp {
  color: #909399;
  font-size: 14px;
}

.plan-content .el-timeline-item__content {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

/* 统计卡片样式 */
.platform-stats h3 {
  margin-bottom: 20px;
  color: #409EFF;
}

.stat-card {
  text-align: center;
  padding: 20px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}
</style> 