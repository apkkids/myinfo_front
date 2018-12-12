<template>
  <div>
    <div style="display: flex; margin-bottom: 10px ">
      <el-input v-model="input" placeholder="请输入要添加的职位名称" prefix-icon="el-icon-plus"
                style="width:500px;margin-right: 10px"></el-input>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addPosition">添加</el-button>
    </div>
    <div>
      <el-table :data="positions" v-loading="loading" size="mini" stripe border style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="编号" width="180"></el-table-column>
        <el-table-column prop="name" label="职位名称" width="180"></el-table-column>
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
    <div style="display:flex;margin-top: 10px">
      <el-button type="danger" size="mini">批量删除</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable semi */
import dateUtil from 'element-ui/src/utils/date';
export default {
  name: 'PosMana',
  data () {
    return {
      input: '',
      loading: true,
      positions: [], // 存储从数据库中读取的position数组
      ids: '', // 待删除的id字符串
      pos: {
        id: '',
        name: '',
        enabled: 1,
        createDate: ''
      }
    }
  },
  mounted: function () {
    this.loadPosData();
  },
  methods: {
    loadPosData () {
      var _this = this;
      this.loading = true;
      this.getRequest('/system/basic/pos/getAll').then(resp => {
        if (resp && resp.status === 200) {
          _this.positions = resp.data;
        }
      });
      _this.loading = false;
    },
    addPosition () {
      if (this.input === '') {
        this.$alert('要添加的职位名称不能为空！', '提示');
        return;
      }
      var _this = this;
      this.loading = true;
      this.pos.name = this.input;
      // use dateUtil transform the createDate,注意mm和MM
      this.pos.createDate = dateUtil.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
      this.putRequest('/system/basic/pos/add', this.pos).then(resp => {
        if (resp && resp.status === 200) {
          _this.loadPosData();
        }
      });
      this.loading = false;
    },
    handleSelectionChange () {
    },
    handleEdit (index, row) {
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除[' + row.name + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ids = row.id;
        var _this = this;
        this.loading = true;
        this.deleteRequest('/system/basic/pos/' + this.ids).then(resp => {
          if (resp && resp.status === 200) {
            _this.loadPosData();
          }
        });
        this.loading = false;
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'})
      });
    }
  }
}
</script>

<style scoped>

</style>
