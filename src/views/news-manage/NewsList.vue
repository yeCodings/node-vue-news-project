<template>
  <el-card>
    <el-page-header content="新闻列表" icon="" title="新闻管理" />
    <el-table :data="tableData" style="width: 100%;">

      <el-table-column prop="title" label="标题" />

      <el-table-column prop="category" label="分类">
        <!-- 当el-table-column 里面的内容需要自定义控制的时候 需要用到template 插槽  -->
        <!-- 设置 #default="scope" ，通过 scope.row.value 取值-->
        <template #default="scope">
          {{ categoryMap[scope.row.category] }}
        </template>
      </el-table-column>

      <el-table-column prop="editTime" label="更新时间">
        <template #default="scope">
          <!-- template 插槽里可以 使用自定义函数进行控制 -->
          {{ fromatTime.getTime(scope.row.editTime) }}
        </template>
      </el-table-column>

      <el-table-column prop="isPublish" label="是否更新">
        <template #default="scope">
          <el-switch v-model="scope.row.isPublish" @change="handleSwitchChange(scope.row)" :active-value="1"
            :inactive-value="0" />
        </template>
      </el-table-column>

      <el-table-column prop="isPublish" label="操作">
        <template #default="scope">
          <el-button circle :icon="Star" type="success" />
          <el-button circle :icon="Edit" />
          <el-button circle :icon="Delete" type="danger" />
        </template>
      </el-table-column>

      <el-table-column label="封面">
        <template #default="scope">
          <div v-if="scope.row.cover">
            <el-avatar :size="50" :src="scope.row.cover.includes('blob') ? scope.row.cover : BASE_URL + scope.row.cover">
            </el-avatar>
          </div>
          <div v-else>
            <el-avatar :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </el-card>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import fromatTime from '@/util/formatTime'
import { Star, Edit, Delete } from '@element-plus/icons-vue'


const BASE_URL = 'http://localhost:3000';
// 创建tableData 响应式数据
const tableData = ref([]);

// 在组件挂载后获取数据
onMounted(() => {
  getTableData();
})

// 获取新闻列表数据
const getTableData = async () => {
  const res = await axios.get('/adminapi/news/list')
  tableData.value = res.data.data
}

const categoryMap = {
  1: '最新动态',
  2: '典型案例',
  3: '通知公告'
}

// 开关的回调
const handleSwitchChange = async (item) => {
  await axios.put('/adminapi/news/publish', {
    _id: item._id,
    isPublish: item.isPublish
  })

  await getTableData();
}


</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
</style>