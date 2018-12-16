<template>
  <div v-loading="loading">
    <div style="display:flex; ">
      <el-input placeholder="请输入角色英文名称" style="margin-right:5px;width:300px" size="mini" v-model="rolename">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input placeholder="请输入角色中文名称" style="margin-right:10px;width:300px" size="mini" v-model="roleZhname"/>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRole">添加角色</el-button>
    </div>
    <div style="margin-top: 10px;text-align: left">
      <el-collapse v-model="activeColItem" accordion style="width:600px" @change="collapseChange">
        <el-collapse-item v-for="(item,index) in roles" :title=item.nameZh :name=item.id :key=item.id>
          <el-card class="box-card">
            <div slot="header" style="display:flex;justify-content:space-between;width:500px;">
              <span>{{'可访问的资源'+ index}}</span>
              <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
              <el-button size="mini" plain type="text" icon="el-icon-delete"
                         style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"></el-button>
            </div>
            <el-tree
              :props="defaultProps"
              :key=item.id
              :data="treeData"
              :default-checked-keys="checkedKeys"
              highlight-current
              show-checkbox
              node-key="id"
              ref="tree"
              @check-change="handleCheckChange">
            </el-tree>
            <div style="display:flex;justify-content:flex-end;width:500px;margin-top: 10px">
              <el-button size="mini">取消修改</el-button>
              <el-button size="mini" type="primary">确认修改</el-button>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
/* eslint-disable semi */

export default {
  name: 'MenuRole',
  data () {
    return {
      loading: true,
      activeColItem: -1, // 当前展开的el-collapse
      defaultProps: {children: 'children', label: 'name'},
      treeData: [], // 当前树的数据
      checkedKeys: [], // 当前树选中的项目
      rolename: '',
      roleZhname: '',
      roles: []
    }
  },
  mounted: function () {
    this.loading = true;
    this.loadData()
  },
  methods: {
    addRole () {
    },
    loadData () {
      this.loading = true;
      var _this = this
      this.getRequest('/system/basic/roles').then(resp => {
        if (resp && resp.status === 200) {
          _this.roles = resp.data
          this.loading = false;
        }
      })
    },
    // 树的选择改变
    handleCheckChange () {},
    // collapse控件展开状态改变
    collapseChange (activeNames) {
      console.log(activeNames);
      if (activeNames === '') { // 如果没有展开某个Collapse，则不用读取数据
        return
      }
      // 否则从后台读取某个角色的数据，此时activeNames=这个角色的id
      var _this = this
      this.getRequest('/system/basic/menuTree/' + activeNames).then(resp => {
        if (resp && resp.status === 200) {
          var data = resp.data;
          _this.treeData = data.menus;
          console.log(data.menus);
          _this.checkedKeys = data.mids;
          console.log(data.mids);
        }
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    // 存储的菜单
    routes () {
      return this.$store.state.routes
    }
  }
}
</script>

<style scoped>

</style>
