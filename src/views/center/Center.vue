<template>
  <el-page-header content="个人中心" icon="" title="企业管理后台">
    <el-row :gutter="20" class="el-row">
      <!-- 左侧头像及基本信息 -->
      <el-col :span="8">
        <el-card class="box-card">
          <el-avatar :size="50" :src="avatarUrl" />
          <h3>{{ store.state.userInfo.username }}</h3>
          <h3>{{ store.state.userInfo.role === 1 ? '管理员' : '编辑' }}</h3>
        </el-card>
      </el-col>
      <!-- 右侧表单 -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>
          <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="120px" class="userForm">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="userForm.gender" class="m-2" placeholder="Select" style="width:100%">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
                设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </el-page-header>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import upload from '@/util/upload';
import Upload from '@/components/upload/Upload';

const store = useStore();

const BASE_URL = 'http://localhost:3000';

const avatarUrl = computed(() =>
  store.state.userInfo.avatar
    ? BASE_URL + store.state.userInfo.avatar
    : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
);

const handleChange = (file) => {
  userForm.avatar = URL.createObjectURL(file);
  userForm.file = file;

}

const userFormRef = ref();

const { username, gender, introduction, avatar } = store.state.userInfo;
const userForm = reactive({
  username,
  gender,
  introduction,
  avatar,
  file: null
});



const userFormRules = reactive({
  username: [{ required: true, message: '请输入名字', trigger: 'blur' }],
  gender: [{ required: true, message: '请输入性别', trigger: 'blur' }],
  introduction: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  avatar: [{ required: true, message: '请设置头像', trigger: 'blur' }],
})

// 性别选项
const options = [
  {
    label: '保密',
    value: 0
  },
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 2
  },
]



const submitForm = () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await upload('/adminapi/user/upload', userForm);

      if (res.ActionType === 'OK') {
        // 成功接收到后端的数据，再次把数据通过 commit('changeUserInfo') 更新到 vuex 的 store 中
        store.commit('changeUserInfo', res.data);
        ElMessage.success('更新成功');
      }
    }
  })
}

</script>

<style lang="scss" scoped>
.el-row {
  margin-top: 20px;

  .box-card {
    text-align: center;
  }
}
</style>