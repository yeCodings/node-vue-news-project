<template>
  <el-header>
    <div class="left">
      <el-icon @click="handleCollapsed">
        <Menu />
      </el-icon>
      <span>企业管理后台系统</span>
    </div>
    <div class="right">
      <span>欢迎 {{ store.state.userInfo.username }} 回来</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon :size="20">
            <User />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleCenter">用户中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Menu, User } from '@element-plus/icons-vue'

const store = useStore();
const router = useRouter();

// 控制侧边栏伸缩
const handleCollapsed = () => {
  store.commit('changeCollapsed')
}

// 返回用户中心
const handleCenter = () => {
  router.push('/center');
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token');
  store.commit('clearUserInfo');
  router.push('/login');
}

</script>

<style lang='scss' scoped>
.el-header {
  background-color: #2d3a4b;
  color: white;
  width: 100%;
  height: 60px;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left,
.right {
  display: flex;
}

.left {
  i {
    margin: auto;
    margin-right: 10px;
    cursor: pointer;
  }
}

.right {
  .el-dropdown-link {
    margin: auto;
    margin-left: 10px;
    color: white;
  }
}
</style>