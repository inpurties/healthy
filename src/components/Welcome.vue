<template>
  <div class="home-container">
    <!-- 标题 -->
    <h3>欢迎进入个人健康管理系统！</h3>

  
    <div class="card-container">
      <div class="card">
        <span>今日步数</span>
        <div class="value">{{ stepCount }}</div>
        <p>目标：{{ stepGoal }} 步</p>
      </div>
      <div class="card">
        <span>卡路里消耗</span>
        <div class="value">{{ calorie }} kcal</div>
        <p>来自运动：{{ calorieFromExercise }} kcal</p>
      </div>
      <div class="card">
        <span>睡眠时长</span>
        <div class="value">{{ sleepHours }} 小时</div>
        <p>深睡：{{ deepSleepHours }} 小时</p>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="shortcut">
      <div 
        class="shortcut-item" 
        v-for="(item, index) in shortcutList" 
        :key="index"
        @click="goToPage(item.path)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 模拟动态数据
      stepCount: 8520,   
      stepGoal: 10000,   
      calorie: 235,     
      calorieFromExercise: 180, 
      sleepHours: 7.2,  
      deepSleepHours: 2.5,

      // 快捷入口配置
      shortcutList: [
        { name: '运动记录', path: '/exercise', icon: 'el-icon-menu' },
        { name: '饮食日志', path: '/diet', icon: 'el-icon-setting' },
        { name: '健康报告', path: '/report', icon: 'el-icon-document' },
        { name: '睡眠分析', path: '/sleep', icon: 'el-icon-s-data' }
      ]
    }
  },
  methods: {
    goToPage(path) {
     
      this.$router.push(path)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 20px;
  background: #f9f9f9;
  min-height: calc(100vh - 60px); // 占满视口高度

  h3 {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 30px;
    color: #333;
  }

  // 卡片概览
  .card-container {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;

    .card {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      text-align: center;

      span {
        font-size: 14px;
        color: #666;
        display: block;
        margin-bottom: 10px;
      }

      .value {
        font-size: 28px;
        font-weight: bold;
        color: #2d8cf0;
        margin-bottom: 8px;
      }

      p {
        font-size: 12px;
        color: #999;
      }
    }
  }

  // 快捷入口
  .shortcut {
    display: flex;
    gap: 20px;

    .shortcut-item {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;

      i {
        font-size: 24px;
        color: #2d8cf0;
        margin-bottom: 10px;
        display: block;
      }

      span {
        font-size: 14px;
        color: #333;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
    }
  }
}
</style>