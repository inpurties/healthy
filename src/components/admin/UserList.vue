<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="10">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="状态" prop="state">
          <!-- scope.row 就是当前行的信息 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 5, 100]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 创建新用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%"
    @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
        ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
       <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <el-form :model="setRoleForm" :rules="setRoleFormRules" ref="setRoleFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="setRoleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="setRoleForm.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="访客" value="访客"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限说明">
          <el-alert
            v-if="setRoleForm.role === '超级管理员'"
            title="超级管理员：拥有所有权限，包括用户管理、系统设置等"
            type="warning"
            :closable="false">
          </el-alert>
          <el-alert
            v-if="setRoleForm.role === '管理员'"
            title="管理员：拥有大部分权限，可以管理用户和内容"
            type="info"
            :closable="false">
          </el-alert>
          <el-alert
            v-if="setRoleForm.role === '普通用户'"
            title="普通用户：可以查看和使用系统功能"
            type="success"
            :closable="false">
          </el-alert>
          <el-alert
            v-if="setRoleForm.role === '访客'"
            title="访客：只能查看部分公开内容"
            type="info"
            :closable="false">
          </el-alert>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求数据
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 5
      },
      userlist: [],
     
      total: 0, // 最大数据记录
      addDialogVisible: false ,// 对话框显示
      // 添加用户表单项
      addForm: {
        username:'',
        password:'',
        email:'',
      }, 
      
      
      // 修改用户信息
      editForm:{},

      // 控制修改用户对话框显示/隐藏
      editDialogVisible:false,

      // 控制分配权限对话框显示/隐藏
      setRoleDialogVisible: false,

      // 分配权限表单
      setRoleForm: {
        id: '',
        username: '',
        role: ''
      },

      // 分配权限表单验证规则
      setRoleFormRules: {
        role: [
          { required: true, message: "请选择角色", trigger: "change" }
        ]
      },

      // 添加用户验证规则
      addFormRules:{
        username:[
           { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
        ],
        password:[
           { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
        ],
        email:[
           { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" }
        ],
      },

      editFormRules:{
          password:[
           { required: true, message: "请输入密码", trigger: "blur" },
           { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
          ],
          email:[
           { required: true, message: "请输入邮箱", trigger: "blur" },
           { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" }
          ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      try {
        // 调用post请求
        const { data: res } = await this.$http.get("/api/allUser", {
          params: this.queryInfo
        });
        this.userlist = res.data; // 将返回数据赋值
        this.total = res.numbers; // 总个数
      } catch (error) {
        console.error('获取用户列表失败：', error);
        this.$message.error("获取用户列表失败，请重试！");
      }
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList(); // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList(); // 数据发生改变重新申请数据
    },

    async userStateChanged(userInfo) {
      try {
        const { data: res } = await this.$http.put(
          `/api/userState?id=${userInfo.id}&state=${userInfo.state}`
        );
        if (res != "success") {
          userInfo.state = !userInfo.state;
          return this.$message.error("状态修改失败！！！");
        }
        this.$message.success("状态修改成功！！！");
      } catch (error) {
        console.error('修改用户状态失败：', error);
        userInfo.state = !userInfo.state;
        this.$message.error("状态修改失败，请重试！");
      }
    },
    // 监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
    },

   addUser(){
    this.$refs.addFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        try {
            const {data:res} = await this.$http.post("/api/addUser", this.addForm);
            if (res !== "success") {
                return this.$message.error("添加失败！！！");
            }
            this.$message.success("添加成功！！！");
            this.addDialogVisible = false;
            this.getUserList();
        } catch (error) {
            console.error('添加用户失败：', error);
            this.$message.error("添加失败，请检查输入");
        }
        })
    },
    // 展示修改框
    async showEditDialog(id){
      try {
        const {data:res} = await this.$http.get("/api/getUpdate?id="+id);
        this.editForm = res;//查询用户信息返回表单
        this.editDialogVisible = true;//显示修改框
      } catch (error) {
        console.error('获取用户信息失败：', error);
        this.$message.error("获取用户信息失败，请重试！");
      }
    },
    // 关闭窗口
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    // 确认修改
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        try {
          // 发起请求
          const {data:res} = await this.$http.put("/api/editUser",this.editForm);
          console.log(res);
           if (res != "success") {
             return this.$message.error("操作失败！！！");
           }
          this.$message.success("操作成功！！！");
          //隐藏
          this.editDialogVisible = false;
          this.getUserList();
        } catch (error) {
          console.error('编辑用户失败：', error);
          this.$message.error("编辑失败，请重试！");
        }
      });
    },
    // 删除按钮
    async deleteUser(id){
      // 弹框
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      // 成功删除为confirm 取消为 cancel
      if(confirmResult!='confirm'){
        return this.$message.info("已取消删除");
      }
      
      try {
        const {data:res} = await this.$http.delete("/api/deleteUser?id="+id);
        if (res != "success") {
          return this.$message.error("删除失败！！！");
        }
        this.$message.success("删除成功！！！");
        this.getUserList();
      } catch (error) {
        console.error('删除用户失败：', error);
        this.$message.error("删除失败，请重试！");
      }
    },

    // 展示分配权限对话框
    showSetRoleDialog(userInfo) {
      this.setRoleForm.id = userInfo.id;
      this.setRoleForm.username = userInfo.username;
      this.setRoleForm.role = userInfo.role;
      this.setRoleDialogVisible = true;
    },

    // 关闭分配权限对话框
    setRoleDialogClosed() {
      this.$refs.setRoleFormRef.resetFields();
    },

    // 分配权限
    setRole() {
      this.$refs.setRoleFormRef.validate(async valid => {
        if (!valid) return;
        
        try {
          const {data: res} = await this.$http.put("/api/setUserRole", this.setRoleForm);
          if (res === "success") {
            this.$message.success("权限分配成功！");
            this.setRoleDialogVisible = false;
            this.getUserList();
          } else {
            this.$message.error("权限分配失败！");
          }
        } catch (error) {
          console.error('分配权限失败：', error);
          this.$message.error("权限分配失败，请重试！");
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
</style>