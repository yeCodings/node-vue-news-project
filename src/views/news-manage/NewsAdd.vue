<template>
  <el-page-header content="添加新闻" icon="" title="新闻管理" />
  <el-form ref="newsFormRef" :model="newsForm" :rules="newsFormRules" label-width="120px" class="newsForm">
    <el-form-item label="标题" prop="title">
      <el-input v-model="newsForm.title" />
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <editor @event="handleChange" />
    </el-form-item>
    <el-form-item label="新闻类别" prop="category">
      <el-select v-model="newsForm.category" class="m-2" placeholder="Select" style="width:100%">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="封面图片" prop="cover">
      <Upload :avatar="newsForm.cover" @avatarChange="coverChange" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        添加新闻
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed, ref, reactive } from 'vue';
import editor from '@/components/editor/Editor.vue'
import Upload from '@/components/upload/Upload.vue'
import upload from '@/util/upload'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";

const router = useRouter()
const newsFormRef = ref()

// 新闻表单数据
const newsForm = reactive({
  title: '',
  content: '',
  category: 1, // 1. 最新动态 2. 典型案例 3. 通知公告
  cover: '',   // 封面图片
  file: null,
  isPublish: 0, // 0未发布  1已发布
})

// 规则校验
const newsFormRules = reactive({
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请输入新闻类型', trigger: 'blur' }],
  cover: [{ required: true, message: '请设置封面图片', trigger: 'blur' }],
  // role: [{ required: true, message: '请输入权限', trigger: 'blur' }],
})

// 每次editor 内容改变的回调
const handleChange = (data) => {

  newsForm.content = data
}

// 新闻类别选项
const options = [
  { label: '最新动态', value: 1 },
  { label: '典型案例', value: 2 },
  { label: '通知公告', value: 3 },
]

// 封面图片选择完之后的回调函数
const coverChange = (file) => {
  newsForm.cover = URL.createObjectURL(file);
  newsForm.file = file;
}

// 校验数据成功后，提交数据到后端
const submitForm = () => {
  newsFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 校验数据成功，提交数据到后端
        const res = await upload('/adminapi/news/add', newsForm)
        // 跳转到用户列表页面
        router.push('/news-manage/newslist');
      } catch (error) {
        ElMessage.error(error.response.data.msg)
      }
    }
  })
}

</script>


<style lang="scss" scoped>
.el-form {
  margin-top: 20px;
}
</style>