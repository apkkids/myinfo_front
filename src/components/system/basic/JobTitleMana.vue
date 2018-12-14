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
        <el-button type="danger" size="mini" icon="el-icon-delete">批量删除</el-button>
      </div>
      <div>看不见的对话框</div>
    </div>
</template>

<script>
/* eslint-disable semi */
import dateUtil from 'element-ui/src/utils/date';
export default {
  name: 'JobTitleMana',
  data () {
    return {
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
      loading: false
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
    handleSelectionChange () {},
    handleEdit (index, row) {},
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
    deleteMore () {}
  }
}
</script>

<style scoped>

</style>
