<template>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
      <el-button type="danger" @click="getString">从后端请求一段话</el-button>
    </div>
</template>

<script>
/* eslint-disable semi */

export default {
  name: 'PosMana',
  data () {
    return {
      mystr: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    getString () {
      this.$message({type: 'info', message: '我想从后端得到一段话？'});
      var _this = this;
      this.getRequest('/system/basic/getString').then(resp => {
        if (resp && resp.status === 200) {
          // console.log(resp.data)
          _this.mystr = resp.data.msg;
          _this.$message({type: 'info', message: _this.mystr});
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
