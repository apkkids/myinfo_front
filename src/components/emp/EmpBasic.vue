<template>
  <div>
    <el-container>
      <el-header style="padding: 0px; display:flex;justify-content: space-between;align-items: center">
        <div style="display:inline">
          <el-input
            placeholder="通过姓名搜索员工"
            clearable
            prefix-icon="el-icon-search"
            style="width: 300px;margin: 0px;padding: 0px; padding-left: 10px"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @change="keywordsChange"
            @keyup.enter.native="searchEmp"
            v-model="keywords"></el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchEmp">搜索
          </el-button>
          <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                     @click="showAdvanceSearchView">
            <i class="fa fa-lg" style="margin-right: 5px"
               v-bind:class="[advanceSearchViewVisible ? faangledoubleup:faangledoubledown]"></i>
            高级搜索
          </el-button>
        </div>
        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          <el-upload
            :show-file-list="false"
            accept="application/vnd.ms-excel"
            action="/employee/basic/importEmp"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError" :disabled="fileUploadBtnText==='正在导入'"
            :before-upload="beforeFileUpload" style="display: inline">
            <el-button size="mini" type="success" :loading="fileUploadBtnText==='正在导入'">
              <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>{{fileUploadBtnText}}
            </el-button>
          </el-upload>
          <el-button size="mini" type="success" @click="exportEmps">
            <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出数据
          </el-button>
          <el-button size="mini" type="primary" @click="showAddEmpView" icon="el-icon-plus">添加员工</el-button>
        </div>
      </el-header>
      <el-main>
        <div>
          <!--Vue的过渡组件，advanceSearchViewVisible用来控制显示-->
          <transition name="slide-fade">
            <div v-show="advanceSearchViewVisible"
                 style="margin-bottom: 10px;border: 2px;border-radius: 5px;border-style: dashed;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff">
              <p>高级搜索</p>
              <el-row>
                <el-col :span="5">
                  政治面貌:
                  <el-select v-model="emp.politicId" style="width: 130px" size="mini" placeholder="政治面貌">
                    <el-option v-for="item in politics" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  民族:
                  <el-select v-model="emp.nations" style="width: 100px" size="mini" placeholder="民族">
                    <el-option v-for="item in nations" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  职位:
                  <el-select v-model="emp.positions" style="width: 100px" size="mini" placeholder="职位">
                    <el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  职称:
                  <el-select v-model="emp.joblevels" style="width: 100px" size="mini" placeholder="职称">
                    <el-option v-for="item in joblevels" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  聘用形式:
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio style="margin-left: 15px" label="劳务合同">劳务合同</el-radio>
                    <el-radio style="margin-left: 15px" label="实习生">实习生</el-radio>
                  </el-radio-group>
                </el-col>
               </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="5">
                  所属部门:
                  <el-popover
                    v-model="showOrHidePop2"
                    placement="bottom"
                    title="请选择部门"
                    trigger="manual">
                    <el-tree :data="deps" :default-expand-all="true" :props="defaultProps" :expand-on-click-node="false"
                             @node-click="handleNodeClick2"></el-tree>
                    <div slot="reference"
                         style="width: 130px;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                         @click="showDepTree2" v-bind:style="{color: depTextColor}">{{emp.departmentName}}
                    </div>
                  </el-popover>
                </el-col>
                <el-col :span="10">
                  入职日期:
                  <el-date-picker
                    v-model="beginDateScope"
                    unlink-panels
                    type="daterange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    placeholder="选择日期"
                    @change="dateChange">
                  </el-date-picker>
                </el-col>
                <el-col :span="5" :offset="4">
                  <el-button size="mini" type="info" @click="cancelSearch">取消</el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchEmp">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <!--用来展示员工信息的表格-->
          <el-table
            :data="emps"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="id"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="gender"
              label="性别">
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable semi,indent,space-before-function-paren */

  export default {
    data () {
      return {
        // 字典表对象
        nations: [],
        politics: [],
        positions: [],
        joblevels: [],
        deps: [],
        keywords: '', // 搜索关键字
        currentPage: 1, // 当前页
        advanceSearchViewVisible: false, // 高级搜索对话框是否显示
        faangledoubleup: 'fa-angle-double-up', // 图标
        faangledoubledown: 'fa-angle-double-down', // 图标
        fileUploadBtnText: '导入数据', // 上传导入按钮
        emp: { // 当前员工
          name: '',
          gender: '',
          birthday: '',
          idCard: '',
          wedlock: '',
          nationId: '',
          nativePlace: '',
          politicId: '',
          email: '',
          phone: '',
          address: '',
          departmentId: '',
          departmentName: '所属部门...',
          jobLevelId: '',
          posId: '',
          engageForm: '',
          tiptopDegree: '',
          specialty: '',
          school: '',
          beginDate: '',
          workState: '',
          workID: '',
          contractTerm: '',
          conversionTime: '',
          notWorkDate: '',
          beginContract: '',
          endContract: '',
          workAge: ''
        },
        showOrHidePop2: false, // 是否展示树形控件
        defaultProps: { // 部门树形控件的属性
          label: 'name',
          isLeaf: 'leaf',
          children: 'children'
        },
        depTextColor: '#c0c4cc', // 树形控件的颜色
        beginDateScope: '', // 入职日期，包括[开始日期，结束日期]
        // 表格中对应的变量，存储从数据库中读取的员工信息
        emps: []
      }
    },
    mounted: function () {
      this.$message({message: 'initData()', type: 'success'})
      this.initData()
      this.loadEmps()
    },
    methods: {
      initData() { // 读取字典表
        // load dictionary data
        var _this = this
        this.getRequest('/employee/basic/basicdata').then(resp => {
          if (resp && resp.status === 200) {
            var data = resp.data
            _this.nations = data.nations
            _this.politics = data.politics
            _this.positions = data.positions
            _this.joblevels = data.joblevels
            _this.deps = data.deps
          }
        });
      },
      loadEmps () { // 读取员工表
        var _this = this
        this.getRequest('/employee/basic/emp?page=' + this.currentPage + '&size=10')
          .then(resp => {
          if (resp && resp.status === 200) {
            var data = resp.data;
            _this.emps = data.emps;
            console.log('load ' + data.count + ' employees!')
          }
        });
      },
      keywordsChange() {
        this.$message({message: 'keywordsChange()', type: 'success'})
      },
      searchEmp() {
        this.$message({message: 'searchEmp()', type: 'success'})
      },
      showAdvanceSearchView() {
        this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      },
      fileUploadSuccess() {
        this.$message({message: '文件上传成功', type: 'success'})
      },
      fileUploadError() {
        this.$message.error('文件上传失败');
      },
      beforeFileUpload() {
        this.$message({message: '文件上传beforeFileUpload', type: 'success'})
      },
      // 添加员工
      showAddEmpView() {
        this.$message({message: '添加员工', type: 'success'})
      },
      // 导出数据
      exportEmps() {
        this.$message({message: '导出数据', type: 'success'})
      },
      // 点击部门tree控件节点的响应
      handleNodeClick2 (data) {
        this.$message({message: '点击了树状控件', type: 'success'})
        this.emp.departmentName = data.name
        this.emp.departmentId = data.id
        this.showOrHidePop2 = false
        this.depTextColor = '#606266'
      },
      // 切换树形控件显示
      showDepTree2 () {
        this.showOrHidePop2 = !this.showOrHidePop2
      },
      // 入职日期被改变
      dateChange () {
        this.$message({message: this.beginDateScope, type: 'success'})
      },
      cancelSearch () {
        this.$message({message: 'cancelSearch', type: 'success'})
      }
    }
  }
</script>

<style scoped>
</style>
