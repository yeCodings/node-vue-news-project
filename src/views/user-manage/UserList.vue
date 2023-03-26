<template>
  <div>
    <el-card>
      <el-page-header content="用户列表" icon="" title="用户管理" />
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="username" label="用户名" />
        <el-table-column label="头像">
          <template #default="scope">
            <div v-if="scope.row.avatar">
              <el-avatar :size="50"
                :src="scope.row.avatar.includes('blob') ? scope.row.avatar : BASE_URL + scope.row.avatar">
              </el-avatar>
            </div>
            <div v-else>
              <el-avatar :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template #default="scope">
            <el-tag v-if="scope.row.role === 1" class="ml-2" type="danger">
              管理员
            </el-tag>
            <el-tag v-else class="ml-2" type="success">
              编辑
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="你确定删除吗" @confirm="handleDelete(scope.row)" confirmButtonText="确定" cancelButtonText="取消">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑用户 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="50%" :before-close="handleClose" center>
      <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="80px" class="userForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.number="userForm.password" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" class="m-2" placeholder="Select" style="width: 100%">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="userForm.introduction" type="textarea" row="15" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <Upload :avatar="userForm.avatar" @avatarChange="handleChange" />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditConfirm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import { ref, onMounted, reactive } from 'vue'
import Upload from '@/components/upload/Upload.vue'
import upload from '@/util/upload'
import axios from 'axios'

const BASE_URL = 'http://localhost:3000';

const tableData = ref([])
const dialogVisible = ref(false)
const userFormRef = ref()

// 用户表单数据
let userForm = reactive({
  username: '',
  password: '',
  introduction: '',
  role: 2, // 1 管理员 2编辑
  avatar: '',
  file: null,
  gender: 0, //保密
})

// 表单验证规则
const userFormRules = reactive({
  introduction: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  username: [{ required: true, message: '请输入名字', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { type: 'number', message: '密码必须输入数字' }],
  avatar: [{ required: true, message: '请设置头像', trigger: 'blur' }],
  role: [{ required: true, message: '请输入权限', trigger: 'blur' }],
})

// 角色选择映射数据
const options = [
  { label: '管理员', value: 1 },
  { label: '编辑', value: 2 },
]

onMounted(() => {
  getTableData();
})

// 获取所有用户列表
const getTableData = async () => {
  // 获取用户列表数据，赋值给 tableData.value 
  const res = await axios.get('/adminapi/user/list')
  tableData.value = res.data.data
}

// 头像图片选择完之后的回调函数
const handleChange = (file) => {
  userForm.avatar = URL.createObjectURL(file);
  userForm.file = file;
}

// 编辑回调 编辑用户信息
const handleEdit = async data => {
  const res = await axios.get(`/adminapi/user/list/${data._id}`)

  // userForm 成为响应式的两种方法： 1. reactive 搭配 Object.assign(userForm,{...res.data}) 2. ref userForm.value = res.data.data[0]
  // userForm.value = res.data.data[0];

  // 后端传过来的password 是string类型，转成 number类型在 userFormRules 校验时不会出现提醒信息
  res.data.data[0].password = Number(res.data.data[0].password);
  Object.assign(userForm, res.data.data[0])
  dialogVisible.value = true
}
// 编辑确认回调 提交编辑用户信息到后端
const handleEditConfirm = () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      // 1.更新后台 2. dialog隐藏 3. 获取table数据
      await axios.put(`/adminapi/user/list/${userForm._id}`, userForm)
      dialogVisible.value = false
      getTableData();
    }
  })

}

// 删除用户信息
const handleDelete = async data => {
  await axios.delete(`/adminapi/user/list/${data._id}`)
  // reload page  不可取的方法
  // reload data  需要再调一次接口
  // tableData 本地删除

  // 再次调用getTableData 方法，获取数据 赋值给 tableData
  getTableData()
}


</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
</style>