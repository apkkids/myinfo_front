<template>
  <div style="margin-top: 10px">
    <div style="margin-bottom: 10px; display:flex;justify-content: space-between; align-items: center ">
      <div style="display:inline">
        <el-input
          placeholder="默认展示部分用户，请输入关键字搜索更多用户..."
          style="width:400px; margin-right: 10px"
          size="small"
          prefix-icon="el-icon-search"
          v-model="keywords">
        </el-input>
        <el-button size="small" type="primary" @click="searchHr">搜索</el-button>
      </div>
      <div style="display:inline;">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="dialogFormVisible = true"
                   style="margin-right: 10px;">注册管理员
        </el-button>
      </div>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
      <el-card style="width:350px; margin-bottom: 10px" v-for="(item,index) in sysusers" :key="item.id"
               v-loading="cardloading[index]">
        <div slot="header">
          <span>{{item.name}}</span>
          <el-button style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
                     icon="el-icon-delete"
                     @click="deleteSysUser(item.id,index)"></el-button>
        </div>
        <div>
          <img :src=item.userface style="width: 70px;height: 70px;border-radius: 70px"><br>
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
                    style="margin-left: 5px">{{role.nameZh}}
            </el-tag>
            <el-popover
              placement="right"
              width="200"
              title="角色列表"
              @hide="popoverHide(item.id,index)"
              trigger="click">
              <el-select v-model="selRoles" placeholder="请选择角色" multiple size="mini"
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
    <!--此处的div就是放了一个注册对话框-->
    <el-form size="mini" :rules="rules" :model="user" ref="addSysUserForm" style="margin: 0px;padding: 0px;" label-width="100px">
      <div style="text-align: left">
        <el-dialog style="color:#409EFF" title="注册管理员" :visible.sync="dialogFormVisible">
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" placeholder="输入姓名" v-model="user.name" size="mini"
                            style="width: 140px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="手机:" prop="phone">
                  <el-input prefix-icon="el-icon-edit" placeholder="输入手机" v-model="user.phone" size="mini"
                            style="width: 140px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="电话:" prop="telephone">
                  <el-input prefix-icon="el-icon-edit" placeholder="输入电话" v-model="user.telephone" size="mini"
                            style="width: 150px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="状态:" prop="enabled">
                  <el-radio-group v-model="user.enabled">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0" style="margin-left: 15px">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="登录名:" prop="username">
                  <el-input prefix-icon="el-icon-edit" placeholder="输入登录名" v-model="user.username" size="mini"
                            style="width: 140px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="密码:" prop="password">
                  <el-input type="password" prefix-icon="el-icon-edit" placeholder="输入密码" v-model="user.password"
                            size="mini"
                            style="width: 140px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item label="图片地址:" prop="userface">
                  <el-input prefix-icon="el-icon-edit" placeholder="输入图片地址" v-model="user.userface" size="mini"
                            style="width: 300px"/>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div>
                <el-form-item label="地址:" prop="address">
                  <el-input prefix-icon="el-icon-edit" placeholder="输入地址" v-model="user.address" size="mini"
                            style="width: 600px"/>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div>
                <el-form-item label="备注:" prop="remark">
                  <el-input prefix-icon="el-icon-edit" placeholder="输入备注" v-model="user.remark" size="mini"
                            style="width: 600px"/>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div>
                <el-form-item label="用户头像:">
                  <el-upload
                    class="avatar-uploader"
                    action="/system/sysuser/uploadImage"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div slot="footer">
            <el-button size="mini" @click="resetForm('addSysUserForm')">取 消</el-button>
            <el-button size="mini" type="primary" @click="submitForm('addSysUserForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable indent,semi */
  export default {
    name: 'SysHr',
    data () {
      return {
        imageUrl: '',
        dialogFormVisible: false,
        keywords: '',
        selRoles: [], // 当前选中的角色
        selRolesBak: [], // selRoles的备份
        rolesChanged: false, // 选中的角色是否改变
        cardloading: [], // card是否正在loading
        allRoles: [], // 系统中所有角色
        user: {// 注册时的当前用户
          name: '',
          phone: '',
          telephone: '',
          address: '',
          enabled: 1,
          username: '',
          password: '',
          userface: '',
          remark: ''
        },
        sysusers: [], // 存储所有管理员变量的数组
        // form验证规则
        rules: {
          name: [{required: true, message: '请输入管理员名称', trigger: 'blur'}],
          address: [{required: true, message: '请输入地址', trigger: 'blur'}],
          phone: [{required: true, message: '请输入电话', trigger: 'blur'}],
          telephone: [{required: true, message: '请输入手机', trigger: 'blur'}],
          enabled: [{required: true, message: '请选择用户状态', trigger: 'blur'}],
          username: [{required: true, message: '请输入用户登录名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 100, message: '密码长度不能小于6', trigger: 'blur'}]
        }
      }
    },
    mounted: function () {
      this.loadAllRoles()
      this.loadSysUsers()
    },
    methods: {
      // 在添加管理员对话框中点击提交按钮
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this;
            this.putRequest('/system/sysuser/add', this.user).then(resp => {
              if (resp && resp.status === 200) {
                _this.$message({message: '添加管理员成功', type: 'success'})
                _this.dialogFormVisible = false;
                _this.loadSysUsers();
              }
            });
          } else {
            return false;
          }
        });
      },
      resetForm (formName) {
        // this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
      },
      // 加载系统中所有角色
      loadAllRoles () {
        var _this = this
        this.getRequest('/system/basic/roles').then(resp => {
          if (resp && resp.status === 200) {
            _this.allRoles = resp.data
          }
        })
      },
      searchHr () {
        this.loadSysUsers()
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
            for (var i = 0; i < _this.sysusers.length; i++) {
              _this.cardloading[i] = false
            }
          }
        })
      },
      // 删除管理员
      deleteSysUser (id, index) {
        this.$confirm('是否删除管理员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 提交从数据库中删除的请求
          var _this = this
          this.deleteRequest('/system/sysuser/del/' + id).then(resp => {
            if (resp && resp.status === 200) {
              _this.sysusers.splice(index, 1)
              _this.cardloading.splice(index, 1)
            }
          })
          this.$message({type: 'success', message: '管理员删除成功!'})
        }).catch(() => {
          this.$message({type: 'info', message: '取消删除操作'})
        })
      },
      selectChange () {
        this.rolesChanged = true
      },
      // 在弹出控件弹出前，准备好管理员的角色数组selRoles
      loadSelRoles (sysUserRoles) {
        this.rolesChanged = false
        this.selRoles = []
        this.selRolesBak = []
        sysUserRoles.forEach(role => {
          this.selRoles.push(role.id)
          this.selRolesBak.push(role.id)
        })
      },
      // 刷新某个管理员的界面
      refreshUser (userid, index) {
        // this.cardloading.splice(index, 1, true);
        this.cardloading[index] = true
        console.log(this.cardloading)
        var _this = this
        this.putRequest('/system/sysuser/id/' + userid).then(resp => {
          if (resp && resp.status === 200) {
            _this.sysusers.splice(index, 1, resp.data)
            _this.cardloading[index] = false
            console.log(this.cardloading)
          }
        })
      },
      // 弹出控件关闭时调用
      popoverHide (currentId, index) {
        if (this.rolesChanged) {
          this.$confirm('管理员角色已被改变, 是否保存至数据库?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 保存到数据库
            var _this = this
            var roles = this.selRoles
            this.putRequest('/system/sysuser/roles', {
              currentId: currentId,
              rids: roles
            }).then(resp => {
              if (resp && resp.status === 200) {
                var data = resp.data.msg
                if (data === 'success') {
                  _this.refreshUser(currentId, index)
                }
              }
            })
            this.$message({type: 'success', message: '管理员角色改变成功!'})
          }).catch(() => {
            this.$message({type: 'info', message: '取消角色改变'})
          })
        }
      },
      handleAvatarSuccess (res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style scoped>
  .user-info {
    font-size: 12px;
    color: #09c0f6;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
