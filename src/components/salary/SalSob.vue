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
        <div style="text-align: left; margin-top:10px; " v-if="salaries!=0">
          <el-button type="danger" round size="mini" :disabled="multipleSelection.length===0" @click="deleteAll">批量删除
          </el-button>
        </div>
      </el-main>
    </el-container>
    <div style="text-align:left">
      <!--:visible.sync指示对话框是否显示,visible是el-dialog的属性-->
      <el-dialog title="添加工资账套" :visible.sync="dialogVisible" width="50%" @close="emptySalary"
                 :close-on-click-modal="false">
        <div style="display: flex; justify-content: flex-start;">
          <!--步骤条，当前激活步骤：index-->
          <el-steps :active="index" direction="vertical">
            <el-step title="基本工资" size="mini"></el-step>
            <el-step title="交通补助"></el-step>
            <el-step title="午餐补助"></el-step>
            <el-step title="奖金"></el-step>
            <el-step title="养老金"></el-step>
            <el-step title="医疗保险"></el-step>
            <el-step title="公积金"></el-step>
            <el-step title="启用时间"></el-step>
          </el-steps>
          <div style="display:flex; justify-content: center; margin-left: 30px; align-items: center; width:80%">
            <div v-show="index===0">
              基本工资：
              <el-input placeholder="请输入基本工资（整数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.basicSalary">
              </el-input>
            </div>
            <div v-show="index===1">
              交通补助：
              <el-input placeholder="请输入交通补助（整数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.trafficSalary">
              </el-input>
            </div>
            <div v-show="index===2">
              交通补助：
              <el-input placeholder="请输入午餐补助（整数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.lunchSalary">
              </el-input>
            </div>
            <div v-show="index===3">
              奖金：
              <el-input placeholder="请输入奖金（整数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.bonus">
              </el-input>
            </div>
            <div v-show="index===4">
              养老金基数：
              <el-input placeholder="请输入养老金基数（整数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.pensionBase">
              </el-input>
              养老金比率：
              <el-input placeholder="请输入养老金比率（小于1的小数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.pensionPer">
              </el-input>
            </div>
            <div v-show="index===5">
              医疗保险基数：
              <el-input placeholder="请输入医疗保险基数（整数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.medicalBase">
              </el-input>
              医疗保险比率：
              <el-input placeholder="请输入医疗保险比率（小于1的小数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.medicalPer">
              </el-input>
            </div>
            <div v-show="index===6">
              公积金基数：
              <el-input placeholder="请输入公积金基数（整数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.accumulationFundBase">
              </el-input>
              公积金比率：
              <el-input placeholder="请输入公积金比率（小于1的小数）：" size="mini" style="width:200px" type="number"
                        @keyup.enter.native="next" v-model="salary.accumulationFundPer">
              </el-input>
            </div>
            <div v-show="index===7">
              启用时间：
              <el-date-picker v-model="salary.createDate" type="date" placeholder="选择启用日期" :picker-options="datePickerOptions">
              </el-date-picker>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 添加对话框是否显示
      dialogVisible: false,
      // table is loading
      tableLoading: false,
      index: 0,
      // save all the salaries objects
      salaries: [],
      // save all selected records
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
      },
      // date-picker空间的快捷选择日期
      datePickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
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
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$message({
        message: 'handleSelectionChange方法被执行了' + val.name,
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
    },
    deleteAll () {
      this.$message({
        message: 'deleteAll',
        type: 'success'
      })
    },
    emptySalary () {
      this.$message({
        message: 'emptySalary',
        type: 'success'
      })
    },
    next () {
      this.$message({
        message: 'next, index = ' + this.index,
        type: 'success'
      })
      this.index++
    }
  },
  mounted: function () {
    this.loadSalaryCfg()
  }
}
</script>

<style scoped>

</style>
