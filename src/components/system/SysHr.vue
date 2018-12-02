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
            <el-tag type="success" size="mini">标签二</el-tag>
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
        sysusers: [] // 存储所有管理员变量的数组
      }
    },
    mounted: function () {
      // this.$message({message: 'initData()', type: 'success'});
      // this.initData();
      this.loadSysUsers()
    },
    methods: {
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
            console.log(_this.sysusers.length)
          }
        })
      },
      deleteSysUser (id) {
        this.$message({
          message: '准备删除' + id,
          type: 'success'
        })
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
