<template>
  <div>
    <el-container>
      <el-header style="display: flex;justify-content: space-between;align-items: center;padding-left: 0px">
        <el-button @click="dialogVisible=true" icon="el-icon-plus" type="primary" size="mini">添加账套</el-button>
        <el-button @click="loadSalaryCfg" icon="el-icon-refresh" size="mini" type="success"></el-button>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="salaries"
            stripe="true"
            v-loading="tableLoading"
            size="mini"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column type="selection" width="30"/>
            <el-table-column prop="name" label="账套名称" width="180"/>
            <el-table-column width="70" prop="basicSalary" label="基本工资"/>
            <el-table-column width="70" prop="trafficSalary" label="交通补助"/>
            <el-table-column width="70" prop="lunchSalary" label="午餐补助"/>
            <el-table-column prop="bonus" width="70" label="奖金"/>
            <el-table-column width="100" label="启用时间">
              <template slot-scope="scope">{{ scope.row.createDate | formatDate}}</template>
            </el-table-column>
            <el-table-column label="养老金" align="center">
              <el-table-column prop="pensionPer" width="70" label="比率"/>
              <el-table-column prop="pensionBase" width="70" label="基数"/>
            </el-table-column>
            <el-table-column label="医疗保险" align="center">
              <el-table-column width="70" prop="medicalPer" label="比率"/>
              <el-table-column prop="medicalBase" width="70" label="基数"/>
            </el-table-column>
            <el-table-column label="公积金" align="center">
              <el-table-column width="70" prop="accumulationFundPer" label="比率"/>
              <el-table-column prop="accumulationFundBase" width="70" label="基数"/>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <el-table-column label="编辑" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
              </el-table-column>
              <el-table-column label="删除" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>

            </el-table-column>
          </el-table>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 添加对话框是否显示
      dialogVisible: false,
      tableLoading: false,
      index: 0,
      salaries: [],
      multipleSelection: [],
      salary: {
        id: '',
        createDate: '',
        basicSalary: '',
        trafficSalary: '',
        lunchSalary: '',
        bonus: '',
        pensionBase: '',
        pensionPer: '',
        medicalBase: '',
        medicalPer: '',
        accumulationFundBase: '',
        accumulationFundPer: ''
      }
    }
  },
  methods: {
    loadSalaryCfg () {
      this.$message({
        message: 'loadSalaryCfg方法被执行了',
        type: 'success'
      })
      this.tableLoading = true
      var _this = this
      // 向后台发送请求/salary/sob/salary，获取数据库Salary数据
      this.getRequest('/salary/sob/salary').then(resp => {
        _this.tableLoading = false
        if (resp && resp.status === 200) {
          _this.salaries = resp.data
        }
      })
    },
    handleSelectionChange () {
      this.$message({
        message: 'handleSelectionChange方法被执行了',
        type: 'success'
      })
    },
    handleEdit (index, row) {
      this.$message({
        message: 'handleEdit: index = ' + index + ', row = ' + row,
        type: 'success'
      })
    },
    handleDelete (index, row) {
      this.$message({
        message: 'handleDelete: index = ' + index + ', row = ' + row,
        type: 'success'
      })
    }
  },
  mounted: function () {
    this.loadSalaryCfg()
  }
}
</script>

<style scoped>

</style>
