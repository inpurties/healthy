<template>
  <div class="permission-edit-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限设置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 标题 -->
    <el-page-header content="修改权限"></el-page-header>
    
    <!-- 搜索和操作区域 -->
    <el-card style="margin-top: 20px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input 
            placeholder="搜索用户名" 
            v-model="searchQuery" 
            clearable 
            @clear="getUserList"
            @keyup.enter="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="refreshUserList">刷新列表</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户&权限表格 -->
    <el-card style="margin-top: 20px;">
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        />
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
        />
        <el-table-column
          prop="role"
          label="当前角色"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="getRoleTagType(scope.row.role)">
              {{ scope.row.role || '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.state ? 'success' : 'danger'">
              {{ scope.row.state ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="权限操作"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <div class="permission-buttons">
              <el-button
                type="default"
                icon="el-icon-edit"
                size="mini"
                @click="openPermissionDialog(scope.row)"
              >
                编辑权限
              </el-button>
              <el-button
                type="default"
                icon="el-icon-view"
                size="mini"
                @click="viewUserDetail(scope.row)"
              >
                查看详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: center;"
      ></el-pagination>
    </el-card>

    <!-- 权限编辑弹窗 -->
    <el-dialog
      title="编辑用户权限"
      :visible.sync="dialogVisible"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限说明">
          <el-alert
            v-if="form.role === '超级管理员'"
            title="超级管理员：拥有所有权限，包括用户管理、系统设置、内容管理等"
            type="warning"
            :closable="false">
          </el-alert>
          <el-alert
            v-if="form.role === '管理员'"
            title="管理员：拥有大部分权限，可以管理用户和内容"
            type="info"
            :closable="false">
          </el-alert>
          <el-alert
            v-if="form.role === '普通用户'"
            title="普通用户：可以查看和使用系统功能"
            type="success"
            :closable="false">
          </el-alert>
          <el-alert
            v-if="form.role === '访客'"
            title="访客：只能查看部分公开内容"
            type="info"
            :closable="false">
          </el-alert>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.state"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermission" :loading="saving">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 用户详情弹窗 -->
    <el-dialog
      title="用户详情"
      :visible.sync="detailDialogVisible"
      width="500px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ currentUser.username }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="getRoleTagType(currentUser.role)">
            {{ currentUser.role || '普通用户' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentUser.state ? 'success' : 'danger'">
            {{ currentUser.state ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentUser.createTime || '未知' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PermissionEdit',
  data() {
    return {
      // 用户列表（从接口获取）
      userList: [],
      // 搜索查询
      searchQuery: '',
      // 加载状态
      loading: false,
      // 查询信息
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      // 总条数
      total: 0,
      // 弹窗显隐
      dialogVisible: false,
      // 表单数据
      form: {
        id: '',
        username: '',
        email: '',
        role: '',
        state: true
      },
      // 表单验证规则
      formRules: {
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      // 角色下拉选项
      roleOptions: [
        { label: '超级管理员', value: '超级管理员' },
        { label: '管理员', value: '管理员' },
        { label: '普通用户', value: '普通用户' },
        { label: '访客', value: '访客' }
      ],
      // 权限选项
      permissionOptions: [
        { label: '用户管理', value: 'user:manage' },
        { label: '权限编辑', value: 'perm:edit' },
        { label: '运动模块管理', value: 'sport:manage' },
        { label: '商品模块管理', value: 'goods:manage' }
      ],
      // 当前选中的用户详情
      currentUser: {},
      // 详情弹窗显隐
      detailDialogVisible: false,
      // 保存状态
      saving: false
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表采用async/await处理异步请求
    async getUserList() {
      this.loading = true;
      try {
        const params = {
          query: this.searchQuery,
          pageNum: this.queryInfo.pageNum,
          pageSize: this.queryInfo.pageSize
        };
        const { data: res } = await this.$http.get("/api/allUser", { params });
        if (res && res.data) {
          this.userList = res.data;
          this.total = res.numbers;
        }
      } catch (error) {
        console.error('获取用户列表失败:', error);
        this.$message.error('获取用户列表失败');
      } finally {
        this.loading = false;
      }
    },
    // 刷新列表
    // 数据逻辑处理
    refreshUserList() {
      this.getUserList();
    },
    // 处理每页显示的条数
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList();
    },
    // 处理当前页
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList();
    },
    // 打开编辑弹窗
    openPermissionDialog(row) {
      this.form = {
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role || '普通用户',
        state: row.state || true
      };
      this.dialogVisible = true;
    },
    // 重置表单
    resetForm() {
      this.$refs.formRef.resetFields();
    },
    // 保存权限
    async savePermission() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return;
        this.saving = true;
        try {
          // 调用后端接口更新用户角色
          const { data: res } = await this.$http.put("/api/editUser", {
            id: this.form.id,
            username: this.form.username,
            email: this.form.email,
            role: this.form.role,
            state: this.form.state
          });
          
          if (res === "success") {
            this.$message.success('权限保存成功');
            this.dialogVisible = false;
            this.getUserList(); // 重新获取用户列表
          } else {
            this.$message.error('权限保存失败');
          }
        } catch (error) {
          console.error('保存权限失败:', error);
          this.$message.error('保存权限失败');
        } finally {
          this.saving = false;
        }
      });
    },
    // 查看用户详情
    viewUserDetail(row) {
      this.currentUser = row;
      this.detailDialogVisible = true;
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
    }
  }
}
</script>

<style scoped>
.permission-edit-page {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}

.el-card {
  margin-bottom: 20px;
}

.el-table {
  margin-top: 10px;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.el-tag {
  margin-right: 5px;
}

.el-alert {
  margin-bottom: 10px;
}

.el-descriptions {
  margin-top: 10px;
}

/* 权限操作按钮容器样式 */
.permission-buttons {
  display: flex;
  justify-content: center;
  gap: 0; /* 按钮之间没有空隙 */
}
</style>