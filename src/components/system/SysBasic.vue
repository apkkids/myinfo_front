<!--这个组件主要是将功能分发到5个子组件上-->
<template>
  <div style="margin-top: 10px; margin-left: 0px">
    <el-tabs type="border-card" v-model="defaultTab" @tab-click="tabClick()">
      <el-tab-pane label="部门管理" name="depMana">
        <DepMana></DepMana>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="pos-mana">
        <pos-mana></pos-mana>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="jobtitle-mana">
        <job-title-mana></job-title-mana>
      </el-tab-pane>
      <el-tab-pane label="奖惩规则" name="e-c-mana">
        <ECMana></ECMana>
      </el-tab-pane>
      <el-tab-pane label="权限组" name="menu-role">
        <menu-role></menu-role>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/* eslint-disable semi */

import DepMana from './basic/DepMana.vue'
import MenuRole from './basic/MenuRole'
import PosMana from './basic/PosMana'
import JobTitleMana from './basic/JobTitleMana'
import ECMana from './basic/ECMana'

export default {
  name: 'SysBasic',
  components: {ECMana, JobTitleMana, PosMana, MenuRole, DepMana},
  data () {
    return {
      defaultTab: 'depMana'
    }
  },
  methods: {
    tabClick () {
      // this.$message({showClose: true, message: '切换tab到' + this.defaultTab})
    }
  },
  component: {
    // 直接引入组件名称也可，标签使用<DepMana>
    DepMana,
    // 'dep-mana': DepMana,
    // 给组件一个标准kebab-case命名也行,标签使用<menu-role>或者<MenuRole>都行
    'menu-role': MenuRole,
    'e-c-mana': ECMana,
    'jobtitle-mana': JobTitleMana,
    'pos-mana': PosMana
  }
}
</script>

<style scoped>

</style>
