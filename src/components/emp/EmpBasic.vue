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
            <i class="fa fa-lg" style="margin-right: 5px"  v-bind:class="[advanceSearchViewVisible ? faangledoubleup:faangledoubledown]"></i>
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
        </div>
      </el-header>
      <el-main></el-main>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable semi */

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
      advanceSearchViewVisible: false, // 高级搜索对话框是否显示
      faangledoubleup: 'fa-angle-double-up', // 图标
      faangledoubledown: 'fa-angle-double-down', // 图标
      fileUploadBtnText: '导入数据' // 上传导入按钮
    }
  },
  mounted: function () {
    this.$message({message: 'initData()', type: 'success'})
    this.initData()
  },
  methods: {
    initData () {
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
      })
    },
    keywordsChange () {
      this.$message({message: 'keywordsChange()', type: 'success'})
    },
    searchEmp () {
      this.$message({message: 'searchEmp()', type: 'success'})
    },
    showAdvanceSearchView () {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
    },
    fileUploadSuccess () {
      this.$message({message: '文件上传成功', type: 'success'})
    },
    fileUploadError () {
      this.$message.error('文件上传失败');
    },
    beforeFileUpload () {
      this.$message({message: '文件上传beforeFileUpload', type: 'success'})
    }
  }
}
</script>

<style scoped>

</style>
