<template>
  <div id="myeditor">
  </div>
</template>

<script setup>
import E from 'wangeditor'
import { onMounted, defineEmits } from 'vue'

const emits = defineEmits(['event']);

onMounted(() => {
  const editor = new E('#myeditor')
  editor.create()

  editor.config.onchange = function (newHtml) {
    // console.log(' onchange之后的html', newHtml)
    emits('event', newHtml)
  }
})


</script>