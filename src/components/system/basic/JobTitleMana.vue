<template>
    <div>
      <div style="display: flex; margin-bottom: 10px ">
        <el-input v-model="job.name" placeholder="请输入要添加的职称名称" prefix-icon="el-icon-plus" size="mini"
                  style="width:500px;margin-right: 10px"></el-input>
        <el-select v-model="job.titleLevel" placeholder="请选择职称级别" style="width:200px;margin-right: 10px" size="mini">
          <el-option
            v-for="item in titleOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addJobLevel">添加</el-button>
      </div>
      <div>
        <el-table :data="joblevels" v-loading="loading" size="mini" stripe border style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="id" label="编号" width="180"></el-table-column>
          <el-table-column prop="name" label="职称名称" width="180"></el-table-column>
          <el-table-column prop="titleLevel" label="职称等级" width="180"></el-table-column>
          <el-table-column prop="createDate" label="创建时间" width="100">
            <!--日期类型要转换后显示-->
            <template slot-scope="scope">{{ scope.row.createDate | formatDate}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="display: flex; margin-bottom: 10px ; margin-top: 10px">
        <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="this.multipleSelection == ''"
        @click="deleteMore">批量删除</el-button>
      </div>
      <div style="text-align: left">
        <el-dialog title="编辑职称" :visible.sync="dialogFormVisible">
          <el-form>
            <el-form-item label="职称名称" label-width="120px">
              <el-input v-model="job.name" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="职称等级" label-width="120px">
              <el-select v-model="job.titleLevel" placeholder="请选择职称级别" style="width:200px;margin-right: 10px" size="mini">
                <el-option
                  v-for="item in titleOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" label-width="120px">
              <el-date-picker v-model="job.createDate" type="date" placeholder="选择创建时间"
                              style="width: 150px" value-format="yyyy-MM-dd" size="mini"/>
            </el-form-item>
            <el-form-item label="是否有效" label-width="120px">
              <el-radio-group v-model="job.enabled" size="mini">
                <el-radio :label=true>有效</el-radio>
                <el-radio :label=false>无效</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dlgCancel">取 消</el-button>
            <el-button type="primary" @click="dlgSumbmit">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
/* eslint-disable semi */
import dateUtil from 'element-ui/src/utils/date';
export default {
  name: 'JobTitleMana',
  data () {
    return {
      dialogFormVisible: false,
      titleOptions: [{
        value: '正高级'
      }, {
        value: '副高级'
      }, {
        value: '中级'
      }, {
        value: '初级'
      }, {
        value: '员级'
      }],
      joblevels: [],
      job: { // 当前的jobLevel
        id: '',
        name: '',
        titleLevel: '',
        createDate: '',
        enabled: 1
      },
      loading: false,
      multipleSelection: []
    }
  },
  mounted: function () {
    this.loadData();
  },
  methods: {
    loadData () {
      this.loading = true;
      var _this = this;
      this.getRequest('/system/basic/jobLevel/getAll').then(resp => {
        if (resp && resp.status === 200) {
          _this.joblevels = resp.data;
        }
      });
      this.loading = false;
    },
    addJobLevel () {
      if (this.job.name === '') {
        this.$alert('请填写职称名称', '注意');
        return;
      }
      if (this.job.name === '' || this.job.titleLevel === '') {
        this.$alert('请选择职称等级', '注意');
        return;
      }
      this.loading = true;
      var _this = this;
      this.job.createDate = dateUtil.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
      this.postRequest('/system/basic/jobLevel', this.job).then(resp => {
        if (resp && resp.status === 200) {
          _this.loadData();
        }
      });
      this.loading = false;
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    handleEdit (index, row) {
      this.dialogFormVisible = true;
      this.job = row;
      this.job.createDate = this.formatDate(row.createDate)
    },
    handleDelete (index, row) {
      this.loading = true;
      var _this = this;
      this.deleteRequest('/system/basic/jobLevel/' + row.id).then(resp => {
        if (resp && resp.status === 200) {
          _this.loadData();
        }
      });
      this.loading = false;
    },
    deleteMore () {
      this.loading = true;
      var ids = '';
      for (var i = 0; i < this.multipleSelection.length; i++) {
        ids += this.multipleSelection[i].id + ',';
      }
      var _this = this;
      this.deleteRequest('/system/basic/jobLevel/' + ids).then(resp => {
        if (resp && resp.status === 200) {
          _this.loadData();
        }
      })
      this.loading = false;
    },
    resetJobLevel () {
      this.job = { // 当前的jobLevel
        id: '',
        name: '',
        titleLevel: '',
        createDate: '',
        enabled: 1
      };
    },
    dlgCancel () {
      this.dialogFormVisible = false;
      this.resetJobLevel();
    },
    dlgSumbmit () {
      this.dialogFormVisible = false;
      var _this = this;
      this.job.createDate += ' 00:00:00';
      this.putRequest('/system/basic/jobLevel', this.job).then(resp => {
        if (resp && resp.status === 200) {
          _this.loadData();
        }
      })
      this.resetJobLevel();
    }
  }
}
</script>

<style scoped>

</style>
