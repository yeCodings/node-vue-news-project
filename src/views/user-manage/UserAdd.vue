<template>
  <el-page-header content="添加用户" icon="" title="用户管理" />
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
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        添加用户
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import Upload from '@/components/upload/Upload.vue'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import upload from '@/util/upload'
import { ElMessage } from "element-plus";


const userFormRef = ref();
const router = useRouter();

// 用户表单所需数据
const userForm = reactive({
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

// 头像图片选择完之后的回调函数
const handleChange = (file) => {
  userForm.avatar = URL.createObjectURL(file);
  userForm.file = file;
}

// 校验数据成功后，提交数据到后端
const submitForm = () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 校验数据成功，提交数据到后端
        const res = await upload('/adminapi/user/add', userForm)
        // 跳转到用户列表页面
        router.push('/user-manage/userlist');
      } catch (error) {
        ElMessage.error(error.response.data.msg)
      }

    }
  })
}

</script>

<style lang="scss" scoped>
.userForm {
  margin-top: 50px;
}
</style>
