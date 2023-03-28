<template>
  <el-page-header content="添加产品" icon="" title="产品管理" />

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
        添加用户
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script setup >
import Upload from '@/components/upload/Upload.vue'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import upload from '@/util/upload'
import { useStore } from 'vuex'
import { ElMessage } from "element-plus";


const productFormRef = ref()
const router = useRouter()
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
        const res = await upload('/adminapi/product/add', productForm)
        // 跳转到用户列表页面
        router.push('/product-manage/productlist');
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
