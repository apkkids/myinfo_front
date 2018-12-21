<template>
  <div>
    <div>
      <el-table :data="emps" size="mini" border stripe style="width: 100%" v-loading="tableLoading">
        <el-table-column type="selection" width="35" fixed/>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="workID" width="100" align="left" label="工号"/>
        <el-table-column prop="email" width="160" align="left" label="邮箱"/>
        <el-table-column prop="phone" width="110" align="left" label="电话号码"/>
        <el-table-column prop="department.name" width="180" align="left" label="所属部门"/>
        <el-table-column label="工资账套" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <template v-if="scope.row.salary">
                <div>
                  <el-tag type="success" size="mini">{{ '基本工资: '+scope.row.salary.basicSalary }}</el-tag>
                </div>
                <div>
                  <el-tag type="success" size="mini">{{ '交通补助: '+scope.row.salary.trafficSalary }}</el-tag>
                </div>
                <div>
                  <el-tag type="success" size="mini">{{ '午餐补助: '+scope.row.salary.lunchSalary }}</el-tag>
                </div>
                <div>
                  <el-tag type="success" size="mini">{{ '奖金: '+scope.row.salary.bonus }}</el-tag>
                </div>
                <div>
                  <el-tag type="success" size="mini">{{ '养老金比率: '+scope.row.salary.pensionPer }}</el-tag>
                </div>
                <div>
                  <el-tag type="success" size="mini">{{ '养老金基数: '+scope.row.salary.pensionBase }}</el-tag>
                </div>
                <div>
                  <el-tag type="success" size="mini">{{ '医疗保险比率: '+scope.row.salary.medicalPer }}</el-tag>
                </div>
                <div>
                  <el-tag type="success" size="mini">{{ '医疗保险基数: '+scope.row.salary.medicalBase }}</el-tag>
                </div>
                <div>
                  <el-tag type="success" size="mini">{{ '公积金比率: '+scope.row.salary.accumulationFundPer }}</el-tag>
                </div>
                <el-tag type="success" size="mini">{{ '公积金基数: '+scope.row.salary.accumulationFundBase }}</el-tag>
              </template>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{scope.row.salary?scope.row.salary.name:'暂未设置'}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              width="400"
              @hide="updateSalaryCfg(scope.row.id)"
              trigger="click">
              <el-select v-model="sid" placeholder="请选择">
                <el-option
                  v-for="item in salaries"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button size="mini" type="danger" slot="reference" @click="clickChange(scope.row.salary)">修改账套</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: right;margin-top: 10px">
      <el-pagination
        background
        @current-change="currentChange"
        layout="prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable semi */

export default {
  name: 'SalSobCfg',
  data () {
    return {
      tableLoading: false,
      emps: [], // 员工信息
      currentPage: 1, // 当前页
      totalCount: -1, // 查询到的员工数量
      salaries: [], // 工资账套数组
      sid: '' // 当前工资账套
    }
  },
  mounted: function () {
    this.loadEmps();
  },
  methods: {
    loadSalaries () {
      var _this = this;
      this.getRequest('/salary/sob/salary').then(resp => {
        if (resp && resp.status === 200) {
          _this.salaries = resp.data;
        }
      });
    },
    loadEmps () {
      var _this = this
      this.tableLoading = true
      this.getRequest('/salary/sobcfg/emp?page=' + this.currentPage + '&size=10').then(resp => {
        if (resp && resp.status === 200) {
          var data = resp.data
          _this.emps = data.emps
          _this.totalCount = data.count
          _this.tableLoading = false
        }
      })
    },
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.loadEmps()
    },
    clickChange (salary) {
      if (salary) {
        this.sid = salary.id;
      } else {
        this.sid = '';
      }
      this.loadSalaries();
    },
    updateSalaryCfg (eid) {
      console.log(eid);
      console.log(this.sid);
      var _this = this;
      this.putRequest('/salary/sobcfg/updateCfg', {eid: eid, sid: this.sid}).then(resp => {
        if (resp && resp.status === 200) {
          _this.$message({
            message: '修改工资账套成功',
            type: 'success'
          });
          _this.loadEmps();
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
