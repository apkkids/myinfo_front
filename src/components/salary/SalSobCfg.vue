<template>
  <div>
    <div>
      <el-table :data="emps" size="mini" border stripe style="width: 100%">
        <el-table-column type="selection" width="35" fixed/>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="workID" width="100" align="left" label="工号"/>
        <el-table-column prop="email" width="160" align="left" label="邮箱"/>
        <el-table-column prop="phone" width="110" align="left" label="电话号码"/>
        <el-table-column prop="department.name" width="80" align="left" label="所属部门"/>
        <el-table-column          label="工资账套"          width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>脚部</div>
  </div>
</template>

<script>
/* eslint-disable semi */

export default {
  name: 'SalSobCfg',
  data () {
    return {
      emps: [], // 员工信息
      currentPage: 1, // 当前页
      totalCount: -1, // 查询到的员工数量
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
  mounted: function () {
    this.loadEmps();
  },
  methods: {
    loadEmps () {
      var _this = this
      this.getRequest('/employee/basic/emp?page=' + this.currentPage + '&size=10').then(resp => {
        if (resp && resp.status === 200) {
          var data = resp.data
          _this.emps = data.emps
          _this.totalCount = data.count
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
