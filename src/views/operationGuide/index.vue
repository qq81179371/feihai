<template>
  <div v-html="text" />
</template>
<script>
import { getInstructions } from '@/api/app'
export default {
  data() {
    return {
      text: ''
    }
  },
  mounted() {
    this.handlerGetInstructions()
  },
  methods: {
    async handlerGetInstructions() {
      try {
        const res = await getInstructions()
        this.text = res.instructions
      } catch (err) {
        throw (err)
      }
    }
  }
}
</script>
