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
      <el-button type="danger" size="mini" :disabled="multipleSelection ==''" @click="deleteMore">批量删除</el-button>
    </div>
    <!--用来编辑职位的对话框-->
    <div style="text-align:left">
      <el-dialog title="编辑职位" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="职位名称" label-width="120px">
            <el-input v-model="pos.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="120px">
            <el-date-picker v-model="pos.createDate" type="date" placeholder="选择创建时间"
                            style="width: 150px" value-format="yyyy-MM-dd"/>
          </el-form-item>
          <el-form-item label="是否有效" label-width="120px">
            <el-radio-group v-model="pos.enabled">
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
  name: 'PosMana',
  data () {
    return {
      dialogFormVisible: false, // 对话框是否显示
      input: '',
      loading: true,
      multipleSelection: [], // 选中的行
      positions: [], // 存储从数据库中读取的position数组
      pos: { // 当前职位变量
        id: '',
        name: '',
        enabled: true,
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
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 批量删除
    deleteMore () {
      var ids = '';
      for (var i = 0; i < this.multipleSelection.length; i++) {
        ids += this.multipleSelection[i].id + ',';
      }
      this.$confirm('此操作将永久删除[' + this.multipleSelection.length + '个目标], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var _this = this;
        this.loading = true;
        this.deleteRequest('/system/basic/pos/' + ids).then(resp => {
          if (resp && resp.status === 200) {
            _this.loadPosData();
          }
        });
        this.loading = false;
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'})
      });
    },
    handleEdit (index, row) {
      this.pos = row;
      this.pos.createDate = this.formatDate(row.createDate)
      this.dialogFormVisible = true;
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除[' + row.name + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var _this = this;
        this.loading = true;
        this.deleteRequest('/system/basic/pos/' + row.id).then(resp => {
          if (resp && resp.status === 200) {
            _this.loadPosData();
          }
        });
        this.loading = false;
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'})
      });
    },
    // 对话框点击了确认
    dlgSumbmit () {
      this.loading = true;
      var _this = this;
      this.pos.createDate += ' 00:00:00';
      this.putRequest('/system/basic/pos', this.pos).then(resp => {
        if (resp && resp.status === 200) {
          _this.loadPosData();
        }
      });
      this.loading = false;
      this.dialogFormVisible = false;
    },
    dlgCancel () {
      this.pos = {
        id: '',
        name: '',
        enabled: true,
        createDate: ''
      };
      this.dialogFormVisible = false;
    }
  }
}
</script>

<style scoped>

</style>
