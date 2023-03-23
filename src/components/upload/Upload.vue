<template>
  <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :show-file-list="false" :auto-upload="false" :on-change="handleChange">
    <img v-if="props.avatar" :src="uploadAvatar" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon">
      <Plus />
    </el-icon>
  </el-upload>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue';
import { defineEmits, defineProps, computed } from 'vue';

const BASE_URL = 'http://localhost:3000';

const props = defineProps({
  avatar: String
})

const emit = defineEmits(['avatarChange']);

// 每次选择图片后的回调,使用原生的 URL.createObjectURL 方法把图片的信息赋值给 avatar
const handleChange = (file) => {

  emit('avatarChange', file.raw)
}

//  URL.createObjectURL 是使用二进制转换图片信息，因此需要对图片地址进行处理
// computed 里面的箭头函数后面返回的是值，不应该加{}
const uploadAvatar = computed(() =>
  props.avatar.includes('blob') ? props.avatar : BASE_URL + props.avatar
);

</script>

<style lang="scss" scoped>
::v-deep .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

::v-deep .el-upload:hover {
  border-color: var(--el-color-primary);
}

::v-deep .el-icon .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
}
</style>