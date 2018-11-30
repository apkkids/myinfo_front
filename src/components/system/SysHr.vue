<template>
  <div style="margin-top: 10px">
    <div style="margin-bottom: 10px; display:flex;justify-content: center; align-items: center ">
      <el-input
        placeholder="默认展示部分用户，请输入关键字搜索更多用户..."
        style="width:400px; margin-right: 10px"
        size="small"
        prefix-icon="el-icon-search"
        v-model="keywords">
      </el-input>
      <el-button size="small" type="primary" @click="searchHr">搜索</el-button>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
      <el-card style="width:350px; margin-bottom: 10px" v-for="cards in 10" :key="cards">
        <div slot="header" >
          <span>{{'卡片名称' + cards}}</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
          {{'列表内容 ' + o }}
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable indent,semi */
  export default {
    name: 'SysHr',
    data () {
      return {
        keywords: '',
        hrs: [] // 存储所有管理员变量的数组
      }
    },
    methods: {
      searchHr () {
        this.$message({message: '搜索消息', type: 'success'})
      },
      loadSysUsers () {
        this.$message({message: 'loadSysUsers', type: 'success'})
        // var _this = this
        // this.getRequest('/system/hr?keywords=' + this.keywords).then(resp => {
        //   if (resp && resp.status === 200) {
        //     var data = resp.data
        //     _this.emps = data.emps
        //     _this.totalCount = data.count
        //   }
        // })
      }
    },
    mounted: function () {
      // this.$message({message: 'initData()', type: 'success'});
      // this.initData();
      this.loadSysUsers();
    }
  }
</script>

<style scoped>
</style>
