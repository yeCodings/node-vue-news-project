<template>
  <div>
    <el-card>
      <el-page-header content="用户列表" icon="" title="用户管理" />
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="username" label="用户名" />
        <el-table-column label="头像">
          <template #default="scope">
            <div v-if="scope.row.avatar">
              <el-avatar :size="50" :src="BASE_URL + scope.row.avatar">
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
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const BASE_URL = 'http://localhost:3000';

const tableData = ref([])

onMounted(() => {
  getTableData();
})

const getTableData = async () => {
  // 获取用户列表数据，赋值给 tableData.value 
  const res = await axios.get('/adminapi/user/list')
  tableData.value = res.data.data
}

// 编辑用户信息
const handleEdit = (data) => {
  console.log(' handleEdit', data)
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