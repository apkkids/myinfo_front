<template>
  <div style="margin-top: 10px">
    <div style="margin-bottom: 10px; display:flex;justify-content: center; align-items: center ">
      <el-input
        placeholder="默认展示部分用户，请输入关键字搜索更多用户..."
        style="width:400px; margin-right: 10px"
        size="small"
        prefix-icon="el-icon-search"
        v-model="keywords">
      </el-input>
      <el-button size="small" type="primary" @click="searchHr">搜索</el-button>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
      <el-card style="width:350px; margin-bottom: 10px" v-for="(item,index) in sysusers" :key="item.id">
        <div slot="header">
          <span>{{item.name}}</span>
          <el-button style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
                     icon="el-icon-delete"
                     @click="deleteSysUser(item.id)"></el-button>
        </div>
        <div>
          <img :src=item.userface style="width: 70px;height: 70px;border-radius: 70px"><br>
          <div class="user-info"><span>{{'编号' + index}}</span></div>
          <div class="user-info"><span>{{'管理员:' + item.name}}</span></div>
          <div class="user-info"><span>{{'地址:' + item.address}}</span></div>
          <div class="user-info"><span>{{'电话:' + item.telephone}}</span></div>
          <div class="user-info"><span>用户状态:</span>
            <el-switch
              v-model="item.enabled"
              active-text="启用"
              inactive-text="禁用">
            </el-switch>
          </div>
          <div class="user-info">
            <span>用户角色:</span>
            <el-tag type="success" size="mini" v-for="(role) in item.roles" :key="role.id"
            style="margin-left: 5px">{{role.nameZh}}</el-tag>
            <el-popover
              placement="right"
              width="200"
              title="角色列表"
              @hide="popoverHide(item.id)"
              trigger="click">
              <el-select v-model="selRoles" placeholder="请选择角色" multiple size="mini" multiple-limit="0"
              @change="selectChange">
                <el-option
                  v-for="ar in allRoles"
                  :key="ar.id"
                  :label="ar.nameZh"
                  :value="ar.id">
                </el-option>
              </el-select>
              <el-button slot="reference" icon="el-icon-more" size="mini" @click="loadSelRoles(item.roles)"></el-button>
            </el-popover>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable indent,semi */
  export default {
    name: 'SysHr',
    data () {
      return {
        keywords: '',
        selRoles: [], // 当前选中的角色
        selRolesBak: [], // selRoles的备份
        rolesChanged: false, // 选中的角色是否改变
        allRoles: [], // 系统中所有角色
        sysusers: [] // 存储所有管理员变量的数组
      }
    },
    mounted: function () {
      // this.$message({message: 'initData()', type: 'success'});
      // this.initData();
      this.loadSysUsers();
      this.loadAllRoles();
    },
    methods: {
      // 加载系统中所有角色
      loadAllRoles () {
        var _this = this;
        this.getRequest('/system/basic/roles').then(resp => {
          if (resp && resp.status === 200) {
            _this.allRoles = resp.data;
          }
        });
      },
      searchHr () {
        this.$message({message: '搜索消息', type: 'success'})
      },
      // 按照关键字keywords载入多个管理员
      loadSysUsers () {
        this.$message({message: 'loadSysUsers', type: 'success'})
        var _this = this
        var searchWord = this.keywords
        if (searchWord === '') { // 如果关键字为空，则赋予all
          searchWord = 'all'
        }
        this.getRequest('/system/sysuser/' + searchWord).then(resp => {
          if (resp && resp.status === 200) {
            _this.sysusers = resp.data
          }
        })
      },
      deleteSysUser (id) {
        this.$message({
          message: '准备删除' + id,
          type: 'success'
        })
      },
      selectChange () {
        this.$message({
          message: '选中的角色为：' + this.selRoles,
          type: 'success'
        });
        this.rolesChanged = true;
      },
      // 在弹出控件弹出前，准备好管理员的角色数组selRoles
      loadSelRoles (sysUserRoles) {
        this.rolesChanged = false;
        this.selRoles = [];
        this.selRolesBak = [];
        sysUserRoles.forEach(role => {
          this.selRoles.push(role.id);
          this.selRolesBak.push(role.id);
        });
      },
      // 弹出控件关闭时调用
      popoverHide (currentId) {
        if (this.rolesChanged) {
          this.$confirm('管理员角色已被改变, 是否保存至数据库?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 保存到数据库
            var _this = this;
            var roles = this.selRoles;
            this.putRequest('/system/sysuser/roles', {
              currentId: currentId,
              rids: roles }).then(resp => {
                if (resp && resp.status === 200) {
                  var data = resp.data;
                  if (data === 'success') {
                    _this.loadSysUsers();
                  }
              }
            });
            this.$message({
              type: 'success',
              message: '管理员角色改变成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消角色改变'
            });
          });
        }
      }
    }
  }
</script>

<style scoped>
  .user-info {
    font-size: 12px;
    color: #09c0f6;
  }
</style>
