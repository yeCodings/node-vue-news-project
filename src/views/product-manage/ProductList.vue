<template>
  <el-card>
    <el-page-header content="产品列表" icon="" title="产品管理" />
    <el-table :data="tableData" style="width: 100%;">

      <el-table-column prop="title" label="产品名称" />
      <el-table-column prop="introduction" label="产品简介" />

      <el-table-column prop="editTime" label="更新时间">
        <template #default="scope">
          <!-- template 插槽里可以 使用自定义函数进行控制 -->
          {{ fromatTime.getTime(scope.row.editTime) }}
        </template>
      </el-table-column>


      <el-table-column prop="isPublish" label="操作">
        <template #default="scope">

          <el-button circle :icon="Star" type="success" @click="handlePreview(scope.row)" />

          <el-button circle :icon="Edit" @click="handleEdit(scope.row)" />

          <el-popconfirm title="你确定删除吗" @confirm="handleDelete(scope.row)" confirmButtonText="确定" cancelButtonText="取消">
            <template #reference>
              <el-button circle :icon="Delete" type="danger" />
            </template>
          </el-popconfirm>

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

    <el-dialog v-model="dialogVisible" title="预览产品" width="50%" :before-close="handleClose" center>
      <div>
        <h1>{{ previewData.title }}</h1>
        <div class="editTime">{{ fromatTime.getTime(previewData.editTime) }}</div>
        <el-divider>
          <el-icon><star-filled /></el-icon>
        </el-divider>
        <!-- v-html 使用有风险，需要后端做好防护 -->
        <div v-html="previewData.content" class="htmlContent"></div>
      </div>
    </el-dialog>
  </el-card>
</template>


<script setup>
import axios from 'axios'
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import fromatTime from '@/util/formatTime'
import { Star, Edit, Delete, StarFilled } from '@element-plus/icons-vue'


const BASE_URL = 'http://localhost:3000';

// 创建tableData 响应式数据
const tableData = ref([])

// 预览产品弹窗
const dialogVisible = ref(false)

// 预览产品响应式数据
const previewData = ref({})

const router = useRouter()

const store = useStore()

const author = store.state.userInfo.username

// 在组件挂载后获取数据
onMounted(() => {
  getTableData();
})

// 获取产品列表数据
const getTableData = async () => {
  const res = await axios.get(`/adminapi/product/list`)
  tableData.value = res.data.data.filter(item => item.author === author)
}

// 预览的回调
const handlePreview = (data) => {
  previewData.value = data
  dialogVisible.value = true
}

// 删除的回调
const handleDelete = async (item) => {
  await axios.delete(`/adminapi/product/list/${item._id}`);
  await getTableData();
}

// 编辑的回调
const handleEdit = (item) => {
  router.push(`/product-manage/editproduct/${item._id}`)
}

const handleClose = () => { dialogVisible.value = false }
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}

.editTime {
  font-size: 12px;
  color: gray;
}

::v-deep .htmlContent {
  overflow: hidden;

  img {
    width: 100%;
  }
}
</style>