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
          <el-table :data="emps" size="mini" stripe border style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="35" fixed/>
            <el-table-column prop="name" label="姓名" width="100" fixed/>
            <el-table-column prop="gender" label="性别" width="50"/>
            <el-table-column prop="birthday" label="生日" width="100">
              <!--日期类型要转换后显示-->
              <template slot-scope="scope">{{ scope.row.birthday | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="idCard" width="170" align="left" label="身份证号码"/>
            <el-table-column prop="wedlock" width="60" align="left" label="婚姻状况"/>
            <!--民族是读取nation的name属性，这个东西在EmployeeMapper.xml中定义-->
            <el-table-column prop="nation.name" width="60" align="left" label="民族"/>
            <el-table-column prop="nativePlace" width="80" align="left" label="籍贯"/>
            <el-table-column prop="politicsStatus.name" width="80" align="left" label="政治面貌"/>
            <el-table-column prop="email" width="160" align="left" label="邮箱"/>
            <el-table-column prop="phone" width="110" align="left" label="电话号码"/>
            <el-table-column prop="address" width="170" align="left" label="联系地址"/>
            <el-table-column prop="department.name" width="80" align="left" label="所属部门"/>
            <el-table-column prop="jobLevel.name" width="100" align="left" label="职称"/>
            <el-table-column prop="position.name" width="100" align="left" label="职务"/>
            <el-table-column prop="engageForm" width="90" align="left" label="聘用形式"/>
            <el-table-column prop="tiptopDegree" width="80" align="left" label="最高学历"/>
            <el-table-column prop="specialty" width="120" align="left" label="所属专业"/>
            <el-table-column prop="school" width="140" align="left" label="毕业院校"/>
            <el-table-column prop="beginDate" width="100" align="left" label="入职日期">
              <template slot-scope="scope">{{ scope.row.beginDate | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="workState" width="80" align="left" label="在职状态"/>
            <el-table-column prop="workID" width="100" align="left" label="工号"/>
            <el-table-column prop="contractTerm" width="80" align="left" label="合同期限"/>
            <el-table-column prop="conversionTime" width="100" align="left" label="转正日期">
              <template slot-scope="scope">{{ scope.row.beginDate | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="notWorkDate" width="100" align="left" label="离职日期">
              <template slot-scope="scope">{{ scope.row.beginDate | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="beginContract" width="100" align="left" label="合同起始日期">
              <template slot-scope="scope">{{ scope.row.beginDate | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="endContract" width="100" align="left" label="合同终止日期">
              <template slot-scope="scope">{{ scope.row.beginDate | formatDate}}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button type="danger" size="mini">批量删除</el-button>
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-form :model="emp" size="mini" :rules="rules" ref="addEmpForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="75%"
                   style="padding: 0px; margin: 0px">
          <!--第一行-->
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" placeholder="输入姓名" v-model="emp.name" size="mini"
                            style="width: 150px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="emp.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio style="margin-left: 15px" label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="生日:" prop="birthday">
                  <el-date-picker v-model="emp.birthday" type="date" placeholder="选择日期"
                                  style="width: 150px" value-format="yyyy-MM-dd HH:mm:ss"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="政治面貌:" prop="politicId">
                  <el-select v-model="emp.politicId" placeholder=" 政治面貌" style="width: 200px">
                    <el-option
                      v-for="item in politics"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <!--第2行-->
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="民族:" prop="nationId">
                  <el-select v-model="emp.nationId" placeholder="民族" style="width: 150px">
                    <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label=" 籍贯:" prop="nativePlace">
                  <el-input placeholder="籍贯" v-model="emp.nativePlace" style="width: 150px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="邮箱:" prop="email">
                  <el-input placeholder="邮箱" v-model="emp.email" style="width: 150px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="联系地址:" prop="address">
                  <el-input placeholder="联系地址" v-model="emp.address" style="width: 200px"/>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <!--第三行-->
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="职务:" prop="posId">
                  <el-select v-model="emp.posId" placeholder="职务" style="width: 150px">
                    <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="职称:" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId" placeholder="职称" style="width: 150px">
                    <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="部门:" prop="departmentId">
                  <el-select v-model="emp.departmentId" placeholder="所属部门" style="width: 150px">
                    <el-option
                      v-for="item in deps"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="联系电话:" prop="phone">
                  <el-input placeholder="联系电话" v-model="emp.phone" style="width: 200px"/>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <!--第四行-->
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="工号:" prop="workID">
                  <el-input placeholder="工号" v-model="emp.workID" style="width: 150px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="学历:" prop="tiptopDegree">
                  <el-select v-model="emp.tiptopDegree" placeholder="最高学历" style="width: 150px">
                    <el-option
                      v-for="item in degreeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="院校:" prop="school">
                  <el-input placeholder="毕业院校" v-model="emp.school" style="width: 150px"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="所属专业:" prop="specialty">
                  <el-input placeholder="所属专业" v-model="emp.specialty" style="width: 200px"/>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <!--第五行-->
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="入职日期:" prop="beginDate">
                  <el-date-picker
                    v-model="emp.beginDate"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="入职日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    style="width: 130px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="转正日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="合同起始日期:" prop="beginContract">
                  <el-date-picker
                    v-model="emp.beginContract"
                    size="mini"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 135px"
                    type="date"
                    placeholder="合同起始日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="合同终止日期:" prop="endContract">
                  <el-date-picker
                    v-model="emp.endContract"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="mini"
                    style="width: 135px"
                    type="date"
                    placeholder="合同终止日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div>
                <el-form-item label="身份证号码:" prop="idCard">
                  <el-input prefix-icon="el-icon-edit" v-model="emp.idCard" size="mini" style="width: 180px"
                            placeholder="请输入员工身份证号码..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="聘用形式:" prop="engageForm">
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio style="margin-left: 15px" label="劳务合同">劳务合同</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="婚姻状况:" prop="wedlock">
                  <el-radio-group v-model="emp.wedlock">
                    <el-radio label="已婚">已婚</el-radio>
                    <el-radio style="margin-left: 15px" label="未婚">未婚</el-radio>
                    <el-radio style="margin-left: 15px" label="离异">离异</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('addEmpForm')">取 消</el-button>
            <el-button type="primary" @click="submitForm('addEmpForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable semi,indent,space-before-function-paren */

  export default {
    data() {
      return {
        dialogFormVisible: false, // 对话框是否展示
        dialogFormTitle: '添加员工',
        formLabelWidth: '120px', // 对话框中label宽度
        degreeOptions: [ // '博士','硕士','本科','大专','高中','初中','小学','其他'
          {value: '博士', label: '博士'},
          {value: '硕士', label: '硕士'},
          {value: '本科', label: '本科'},
          {value: '大专', label: '大专'},
          {value: '高中', label: '高中'},
          {value: '初中', label: '初中'},
          {value: '小学', label: '小学'},
          {value: '其他', label: '其他'}
        ],
        // 字典表对象
        nations: [],
        politics: [],
        positions: [],
        joblevels: [],
        deps: [],
        keywords: '', // 搜索关键字
        currentPage: 1, // 当前页
        multipleSelection: [], // 当前选中行
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
        emps: [],
        totalCount: -1, // 查询到的员工数量
        // form验证规则
        rules: {
          name: [
            {required: true, message: '请输入员工名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ],
          gender: [{required: true, message: '请选择性别', trigger: 'change'}],
          birthday: [{required: true, message: '请选择生日', trigger: 'change'}],
          politicId: [{required: true, message: '请选择政治面貌', trigger: 'change'}],
          nationId: [{required: true, message: '请选择民族', trigger: 'change'}],
          nativePlace: [{required: true, message: '请输入员工籍贯', trigger: 'blur'}],
          email: [{required: true, message: '请输入邮件地址', trigger: 'blur'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}], // elementui 提供的邮箱验证pattern
          address: [{required: true, message: '请输入地址', trigger: 'blur'}],
          posId: [{required: true, message: '请选择职务', trigger: 'change'}],
          jobLevelId: [{required: true, message: '请选择职称', trigger: 'change'}],
          departmentId: [{required: true, message: '请选择部门', trigger: 'change'}],
          phone: [{required: true, message: '请输入电话', trigger: 'blur'}],
          workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
          tiptopDegree: [{required: true, message: '请选择学历', trigger: 'change'}],
          school: [{required: true, message: '请输入学校', trigger: 'blur'}],
          specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
          beginDate: [{required: true, message: '请选择入职日期', trigger: 'change'}],
          conversionTime: [{required: true, message: '请选择转正日期', trigger: 'change'}],
          beginContract: [{required: true, message: '请选择合同起始日期', trigger: 'change'}],
          endContract: [{required: true, message: '请选择合同终止日期', trigger: 'change'}],
          idCard: [{required: true, message: '请输入身份证号', trigger: 'blur'},
            {pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/, message: '身份证号格式不正确'}],
          engageForm: [{required: true, message: '请选择聘用形式', trigger: 'change'}],
          wedlock: [{required: true, message: '请选择婚姻状况', trigger: 'change'}]
        }
      }
    },
    mounted: function () {
      this.$message({message: 'initData()', type: 'success'});
      this.initData();
      this.loadEmps();
    },
    methods: {
      initData() { // 读取字典表
        // load dictionary data
        var _this = this;
        this.getRequest('/employee/basic/basicdata').then(resp => {
          if (resp && resp.status === 200) {
            var data = resp.data
            _this.nations = data.nations
            _this.politics = data.politics
            _this.positions = data.positions
            _this.joblevels = data.joblevels
            _this.deps = data.deps
          }
        })
      },
      loadEmps() { // 读取员工表
        var _this = this
        this.getRequest('/employee/basic/emp?page=' + this.currentPage + '&size=10')
          .then(resp => {
            if (resp && resp.status === 200) {
              var data = resp.data
              _this.emps = data.emps
              _this.totalCount = data.count
              console.log('load ' + data.count + ' employees!')
            }
          })
      },
      keywordsChange() {
        this.$message({message: 'keywordsChange()', type: 'success'})
      },
      searchEmp() {
        this.$message({message: 'searchEmp()', type: 'success'})
      },
      showAdvanceSearchView() {
        this.advanceSearchViewVisible = !this.advanceSearchViewVisible
      },
      fileUploadSuccess() {
        this.$message({message: '文件上传成功', type: 'success'})
      },
      fileUploadError() {
        this.$message.error('文件上传失败')
      },
      beforeFileUpload() {
        this.$message({message: '文件上传beforeFileUpload', type: 'success'})
      },
      // 添加员工
      showAddEmpView() {
        this.$message({message: '添加员工', type: 'success'})
        this.dialogFormVisible = !this.dialogFormVisible
      },
      // 导出数据
      exportEmps() {
        this.$message({message: '导出数据', type: 'success'})
      },
      // 点击部门tree控件节点的响应
      handleNodeClick2(data) {
        this.$message({message: '点击了树状控件', type: 'success'})
        this.emp.departmentName = data.name
        this.emp.departmentId = data.id
        this.showOrHidePop2 = false
        this.depTextColor = '#606266'
      },
      // 切换树形控件显示
      showDepTree2() {
        this.showOrHidePop2 = !this.showOrHidePop2
      },
      // 入职日期被改变
      dateChange() {
        this.$message({message: this.beginDateScope, type: 'success'})
      },
      cancelSearch() {
        this.$message({message: 'cancelSearch', type: 'success'})
      },
      handleSelectionChange(val) {
        this.$message({message: 'handleSelectionChange列表选中', type: 'success'})
        this.multipleSelection = val
      },
      // 操作表中的行
      handleEdit(index, row) {
        console.log(index, row)
      },
      handleDelete(index, row) {
        var _this = this;
        var url = '/employee/basic/emp/' + row.id;
        this.$confirm('此操作将删除员工[' + row.name + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest(url).then(resp => {
            if (resp && resp.status === 200) {
              _this.$message({
                type: 'success',
                message: '删除成功!'
              });
              // 重新载入用户
              _this.loadEmps()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 处理分页变化
      handleCurrentChange(val) {
        this.$message({message: '当前分页是:' + val, type: 'success'});
        // 重新查询数据
        this.currentPage = val;
        this.loadEmps()
      },
      submitForm(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.$message({type: 'success', message: '验证成功!'});
            _this.dialogFormVisible = false;
          } else {
            _this.$message({type: 'success', message: '验证失败!'});
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
      }
    }
  }
</script>

<style scoped>
</style>
