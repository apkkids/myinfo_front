<template>
    <div>
      <div style="text-align: left">
        <el-input
          placeholder="输入部门名称搜索部门..."
          style="width: 500px;margin: 0px;padding: 0px;"
          size="mini"
          prefix-icon="el-icon-search"
          v-model="keywords">
        </el-input>
      </div>
      <div>body</div>
    </div>
</template>

<script>
export default {
  name: 'DepMana',
  data () {
    return {
      keywords: ''
    }
  }
}
</script>

<style scoped>

</style>
