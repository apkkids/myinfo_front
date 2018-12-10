<template>
  <div>
    <div style="text-align: left">
      <el-input
        placeholder="输入部门名称搜索部门..."
        style="width: 500px;margin: 0px;padding: 0px;"
        size="mini"
        prefix-icon="el-icon-search"
        v-model="keywords">
      </el-input>
    </div>
    <div>
      <el-tree
        v-loading="loading"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        style="width: 500px;margin-top: 10px"
        :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            style="padding:3px;font-size: 12px"
            @click="clickAddDep(node,data)">
            添加部门
          </el-button>
          <el-button
            type="danger"
            size="mini"
            style="padding:3px;font-size: 12px"
            @click="deleteDep(node, data)">
            删除部门
          </el-button>
        </span>
      </span>
      </el-tree>
    </div>
    <!--弹出的对话框，用来添加部门-->
    <div>
      <el-dialog title="添加部门" :visible.sync="dialogFormVisible">
        <el-form :model="form" size="mini">
          <el-form-item label="上级部门" label-width="80px">
            <el-input v-model="form.parentName" autocomplete="off" placeholder="上级部门名称" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="名称" label-width="80px">
            <el-input v-model="form.name" autocomplete="off" placeholder="请填入部门名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDep">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable semi */

export default {
  name: 'DepMana',
  data () {
    return {
      form: {
        parentName: '',
        name: ''
      },
      depForAdd: {},
      dialogFormVisible: false,
      loading: true,
      keywords: '',
      treeData: [], // 树状控件对应的数据
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf',
        children: 'children'
      }
    }
  },
  mounted: function () {
    this.loading = true
    this.loadTreeData()
  },
  methods: {
    loadTreeData () {
      var _this = this
      // 读取树根节点
      this.getRequest('/system/basic/dep/-1').then(resp => {
        if (resp && resp.status === 200) {
          _this.treeData = resp.data
        }
      })
      this.loading = false
    },
    /**
       * 添加一个部门
       * @param node 代表当前的node对象
       * @param data 代表当前node中的Department对象
       */
    clickAddDep (node, data) {
      this.dialogFormVisible = true
      this.form.parentName = data.name
      this.depForAdd = data
      this.depForAdd.parentId = data.id
      console.log(this.depForAdd)
    },
    addDep () {
      var _this = this
      this.depForAdd.name = this.form.name
      this.depForAdd.isParent = false
      this.depForAdd.children = null
      // this.loading = true;
      this.putRequest('/system/basic/dep', this.depForAdd).then(resp => {
        if (resp && resp.status === 200) {
          // _this.loading = false;
          console.log(_this.depForAdd)
          _this.loading = true
          _this.loadTreeData()
        }
      })
      this.dialogFormVisible = false
    },
    deleteDep (node, data) {
      console.log(data)
      this.$confirm('此操作将永久删除[' + data.name + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var _this = this
        this.deleteRequest('/system/basic/dep/' + data.id).then(resp => {
          if (resp && resp.status === 200) {
            _this.$message({
              type: 'success', message: '删除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
