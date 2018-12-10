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
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
        </el-tree>
      </div>
    </div>
</template>

<script>
/* eslint-disable semi */

export default {
  name: 'DepMana',
  data () {
    return {
      keywords: '',
      treeData: [], // 树状控件对应的数据，分层加载
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf',
        children: 'children'
      }
    }
  },
  mounted: function () {
    this.loadTreeData();
  },
  methods: {
    loadTreeData () {
      var _this = this;
      // 读取树根节点
      this.getRequest('/system/basic/dep/-1').then(resp => {
        if (resp && resp.status === 200) {
          _this.treeData = resp.data;
          console.log(_this.treeData);
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
