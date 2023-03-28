<template>
  <div id="myeditor">
  </div>
</template>

<script setup>
import E from 'wangeditor'
import { onMounted, defineEmits, defineProps } from 'vue'

const emits = defineEmits(['event']);

const props = defineProps({
  content: String
})

onMounted(() => {
  // 创建富文本实例
  const editor = new E('#myeditor')
  editor.create()

  // 设置初始值
  props.content && editor.txt.html(props.content)

  editor.config.onchange = function (newHtml) {
    emits('event', newHtml)
  }
})


</script>