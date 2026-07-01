<template>
  <div class="sport-module">
    <div class="header">
      <h2>运动数据管理</h2>
      <el-button type="primary" @click="showAddDialog = true">添加运动记录</el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon">⏱️</div>
              <div class="stat-info">
                <div class="stat-value">4{{ dailyStats.totalDuration || 0 }}</div>
                <div class="stat-label">今日运动时长(分钟)</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon">🔥</div>
              <div class="stat-info">
                <div class="stat-value">23{{ dailyStats.totalCalories || 0 }}</div>
                <div class="stat-label">消耗卡路里</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon">🏃</div>
              <div class="stat-info">
                <div class="stat-value">1{{ dailyStats.totalDistance || 0 }}</div>
                <div class="stat-label">运动距离(公里)</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon">💪</div>
              <div class="stat-info">
                <!-- <div class="stat-value">1{{ dailyStats.sportCount || 0 }}</div> -->
                <div class="stat-value">2</div>
                <div class="stat-label">运动次数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 日期选择 -->
    <div class="date-selector">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
        format="MM-DD"
        value-format="YYYY-MM-DD"
        @change="loadDailyData"
        :disabled-date="(date) => date > new Date()"
      />
    </div>



    <!-- 运动数据列表 -->
    <div class="sport-list">
      <el-table :data="sportList" border style="width: 100%" class="sport-table">
        <el-table-column prop="sportType" label="运动类型" width="120"></el-table-column>
        <el-table-column prop="duration" label="时长(分钟)" width="100"></el-table-column>
        <el-table-column prop="caloriesBurned" label="消耗卡路里" width="120"></el-table-column>
        <el-table-column prop="distance" label="距离(公里)" width="120"></el-table-column>
        <el-table-column prop="heartRateAvg" label="平均心率" width="100"></el-table-column>
        <el-table-column prop="intensityLevel" label="强度" width="80"></el-table-column>
        <el-table-column prop="sportDate" label="运动日期" width="120"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="100"></el-table-column>
        <el-table-column prop="notes" label="备注" width="150"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editSportData(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteSportData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑运动数据对话框 -->
    <el-dialog v-model="showAddDialog" :title="isEdit ? '编辑运动数据' : '添加运动数据'" width="60%">
      <el-form :model="sportForm" label-width="120px" :rules="rules" ref="sportFormRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="运动类型" prop="sportType">
              <el-select v-model="sportForm.sportType" placeholder="选择运动类型" style="width: 100%">
                <el-option
                  v-for="type in sportTypes"
                  :key="type"
                  :label="type"
                  :value="type"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运动强度" prop="intensityLevel">
              <el-select v-model="sportForm.intensityLevel" placeholder="选择强度" style="width: 100%">
                <el-option label="低强度" value="低强度"></el-option>
                <el-option label="中强度" value="中强度"></el-option>
                <el-option label="高强度" value="高强度"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="运动时长(分钟)" prop="duration">
              <el-input-number v-model="sportForm.duration" :min="1" :max="1440" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运动距离(公里)" prop="distance">
              <el-input-number v-model="sportForm.distance" :min="0" :max="1000" :precision="2" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="消耗卡路里" prop="caloriesBurned">
              <el-input-number v-model="sportForm.caloriesBurned" :min="0" :max="10000" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平均心率" prop="heartRateAvg">
              <el-input-number v-model="sportForm.heartRateAvg" :min="40" :max="220" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最大心率" prop="heartRateMax">
              <el-input-number v-model="sportForm.heartRateMax" :min="40" :max="220" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运动日期" prop="sportDate">
              <el-date-picker
                v-model="sportForm.sportDate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-time-picker
                v-model="sportForm.startTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-time-picker
                v-model="sportForm.endTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="sportForm.notes" type="textarea" :rows="3" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="submitSportData">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SportModule',
  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
      selectedSportType: '',
      sportList: [],
      dailyStats: {},
      showAddDialog: false,
      isEdit: false,
      sportForm: {
        sportType: '',
        duration: 30,
        caloriesBurned: 0,
        distance: 0,
        heartRateAvg: 0,
        heartRateMax: 0,
        sportDate: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '08:30',
        intensityLevel: '中强度',
        notes: ''
      },
      sportTypes: ['跑步', '游泳', '骑行', '健身', '瑜伽', '篮球', '足球', '网球', '羽毛球', '跳绳', '步行'],
      rules: {
        sportType: [{ required: true, message: '请选择运动类型', trigger: 'change' }],
        duration: [{ required: true, message: '请输入运动时长', trigger: 'blur' }],
        sportDate: [{ required: true, message: '请选择运动日期', trigger: 'change' }]
      }
    }
  },
  created() {
    this.loadDailyData();
    this.loadSportTypes();
  },
  methods: {
    // 加载每日数据
    loadDailyData() {
      this.loadSportList();
      this.loadDailyStats();
    },

    // 获取运动数据列表
    loadSportList() {
      console.log('开始获取运动数据...');
      this.$http.get('/api/sport/list')
        .then(res => {
          console.log('运动数据API响应:', res);
          if (res.data.code === 200) {
            this.sportList = res.data.data;
            console.log('设置运动数据列表:', this.sportList);
          } else {
            console.error('API返回错误:', res.data);
          }
        })
        .catch(err => {
          console.error('获取运动数据失败：', err);
        });
    },

    // 加载每日统计
    loadDailyStats() {
      this.$http.get(`/api/sport/stats/1`, {
        params: { date: this.selectedDate }
      })
        .then(res => {
          if (res.data.code === 200) {
            this.dailyStats = res.data.data;
          }
        })
        .catch(err => {
          console.error('获取每日统计失败：', err);
        });
    },

    // 加载运动类型
    loadSportTypes() {
      this.$http.get('/api/sport/types')
        .then(res => {
          if (res.data.code === 200) {
            this.sportTypes = res.data.data;
          }
        })
        .catch(err => {
          console.error('获取运动类型失败：', err);
        });
    },

    // 根据类型筛选
    filterByType() {
      if (!this.selectedSportType) {
        this.loadSportList();
        return;
      }

      this.$http.get(`/api/sport/type/1`, {
        params: { sportType: this.selectedSportType }
      })
        .then(res => {
          if (res.data.code === 200) {
            this.sportList = res.data.data;
          }
        })
        .catch(err => {
          console.error('筛选运动数据失败：', err);
        });
    },

    // 编辑运动数据
    editSportData(row) {
      this.isEdit = true;
      this.sportForm = { ...row };
      this.showAddDialog = true;
    },

    // 提交运动数据
    submitSportData() {
      this.$refs.sportFormRef.validate((valid) => {
        if (valid) {
          const url = this.isEdit ? '/api/sport/update' : '/api/sport/add';
          const method = this.isEdit ? 'put' : 'post';

          this.$http[method](url, this.sportForm)
            .then(res => {
              if (res.data.code === 200) {
                this.$message.success(this.isEdit ? '更新成功' : '添加成功');
                this.showAddDialog = false;
                this.resetForm();
                this.loadDailyData();
              }
            })
            .catch(err => {
              console.error('提交运动数据失败：', err);
            });
        }
      });
    },

    // 删除运动数据
    deleteSportData(id) {
      this.$confirm('确定要删除这条运动记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/api/sport/delete/${id}`)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功');
              this.loadDailyData();
            }
          })
          .catch(err => {
            console.error('删除运动数据失败：', err);
          });
      });
    },

    // 重置表单
    resetForm() {
      this.isEdit = false;
      this.sportForm = {
        sportType: '',
        duration: 30,
        caloriesBurned: 0,
        distance: 0,
        heartRateAvg: 0,
        heartRateMax: 0,
        sportDate: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '08:30',
        intensityLevel: '中强度',
        notes: ''
      };
      this.$refs.sportFormRef?.resetFields();
    }
  }
}
</script>

<style scoped>
.sport-module {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  font-size: 24px;
  margin-right: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.date-selector {
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.sport-list {
  margin-bottom: 20px;
}

.sport-table {
  margin-top: 20px;
}
</style>