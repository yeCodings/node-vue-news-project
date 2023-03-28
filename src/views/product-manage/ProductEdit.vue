<template>
  <el-page-header content="编辑产品" @back="handleBack" title="产品管理" />

  <el-form ref="productFormRef" :model="productForm" :rules="productFormRules" label-width="80px" class="userForm">

    <el-form-item label="产品名" prop="title">
      <el-input v-model="productForm.title" />
    </el-form-item>

    <el-form-item label="产品简介" prop="introduction">
      <el-input v-model="productForm.introduction" type="textarea" row="15" />
    </el-form-item>

    <el-form-item label="详细介绍" prop="detail">
      <el-input v-model="productForm.detail" type="textarea" row="15" />
    </el-form-item>

    <el-form-item label="产品图片" prop="cover">
      <Upload :avatar="productForm.cover" @avatarChange="handleChange" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm">
        编辑用户
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script setup >
import Upload from '@/components/upload/Upload.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue'
import upload from '@/util/upload'
import { useStore } from 'vuex'
import axios from 'axios';
import { ElMessage } from "element-plus";


const productFormRef = ref()
const router = useRouter()
const route = useRoute()
const store = useStore()

const author = store.state.userInfo.username

// 用户表单所需数据
const productForm = reactive({
  author,
  title: '',
  introduction: '',
  detail: '',
  cover: '',
  file: null,
})

// 表单验证规则
const productFormRules = reactive({
  introduction: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  detail: [{ required: true, message: '请输入详细介绍', trigger: 'blur' }],
  cover: [{ required: true, message: '请设置产品图片', trigger: 'blur' }],
})


// 头像图片选择完之后的回调函数
const handleChange = (file) => {
  productForm.cover = URL.createObjectURL(file);
  productForm.file = file;
}

// 校验数据成功后，提交数据到后端
const submitForm = () => {
  productFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 校验数据成功，提交数据到后端
        const res = await upload('/adminapi/product/list', productForm)
        // 返回到产品列表页面
        router.back()
      } catch (error) {
        ElMessage.error(error.response.data.msg)
      }

    }
  })
}

// 获取当前页面数据
onMounted(async () => {
  const res = await axios.get(`/adminapi/product/List/${route.params.id}`)
  Object.assign(productForm, ...res.data.data)
})

const handleBack = () => {
  router.back()
}

</script>

<style lang="scss" scoped>
.userForm {
  margin-top: 50px;
}
</style>
