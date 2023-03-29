<template>
  <div>
    <el-page-header content="首页" icon="" title="企业管理后台" />
    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          <el-avatar :size="50" :src="avatarUrl" />
        </el-col>
        <el-col :span="20">
          <h3 style="line-height: 50px;">欢迎{{ store.state.userInfo.username }}回来，{{ welcomeText }}</h3>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header"><span>公司产品</span></div>
      </template>
      <el-carousel :interval="2000" type="card" height="200px">
        <el-carousel-item v-for="item in loopList" :key="item._id">
          <div :style="{
            backgroundImage: `url(${item.cover.includes('blob')
              ? item.cover
              : BASE_URL + item.cover})`,
            backgroundSize: 'cover',
          }">
            <h3 text="2xl" justify="center">{{ item.title }}</h3>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, ref, onMounted } from 'vue';
import axios from 'axios'

const loopList = ref([])
const store = useStore()
const BASE_URL = 'http://localhost:3000'
const author = store.state.userInfo.username

const avatarUrl = computed(() =>
  store.state.userInfo.avatar
    ? BASE_URL + store.state.userInfo.avatar
    : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
);

const welcomeText = computed(() =>
  new Date().getHours() < 12
    ? '只争朝夕，奋力拼搏'
    : '道阻且长，行则将至'
)

// 在组件挂载后获取数据
onMounted(() => {
  getData();
})

// 获取当前用户产品列表数据
const getData = async () => {
  const res = await axios.get(`/adminapi/product/list`)
  loopList.value = res.data.data.filter(item => item.author === author)
}

</script>

<style lang="scss" scoped>
.box-card {
  margin: 50px 20px;
}

.el-carousel__item h3 {
  color: white;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>