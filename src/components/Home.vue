<template>
  <div>
    <!--使用elementui的header、aside、main布局-->
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">信息管理系统</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <!--一个标记，加到一个图标上，显示信息-->
          <el-badge style="margin-right: 30px" :is-dot="this.$store.state.nfDot">
            <i class="el-icon-info" @click="goChat" style="cursor: pointer"></i>
          </el-badge>
          <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
            {{user.name}}
            <i>
              <img v-if="user.userface!==''" :src="user.userface"
                   style="width: 40px; margin-right: 5px; margin-left: 5px; border-radius: 40px"/>
            </i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside class="home-aside" width="200px">
          <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
            <el-menu style="background: #ececec;width: 180px;" unique-opened router>
              <template v-for="(item,index) in this.routes" v-if="!item.hidden">
                <el-submenu :key="index" :index="index+''">
                  <template slot="title">
                    <i :class="item.iconCls" style="color: #20a0ff;width: 14px;"></i>
                    <span slot="title">{{item.name}}</span>
                  </template>
                  <el-menu-item width="180px"
                                style="padding-left: 30px;padding-right:0px;margin-left: 0px;width: 170px;text-align: left"
                                v-for="child in item.children"
                                :index="child.path"
                                :key="child.path">{{child.name}}
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-menu>
          </div>
        </el-aside>
        <el-main class="home-main">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable semi */

export default {
  name: 'Home',
  methods: {
    handleCommand (cmd) {
      var _this = this
      if (cmd === 'logout') {
        this.$confirm('注销登录用户,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$message({type: 'success', message: '退出登录'});
          _this.getRequest('/logout') // 发送了一个get请求到/logout
          _this.$store.commit('logout') // commit了logout方法
          _this.$router.replace({path: '/'})
        }).catch(() => {
          _this.$message({type: 'info', message: '取消'});
        });
      } // end of logout
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>

<style>
  .home-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home-aside {
    background-color: #ECECEC;
  }

  .home-main {
    background-color: #fff;
    color: #000;
    text-align: center;
    margin: 0px;
    padding: 0px;;
  }
</style>
