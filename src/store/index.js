/* eslint-disable semi */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: { // 从window本地存储中获取user信息
      name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
      userface: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).userface,
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
      roles: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).roles
    },
    routes: []
    // msgList: [],
    // isDotMap: new Map(),
    // currentFriend: {}
  },
  mutations: {
    // 初始化菜单
    initMenu (state, menus) {
      state.routes = menus;
    },
    login (state, user) {
      state.user = user;
      // 登录时将user信息存储在window的localStorage中
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    logout (state) {
      window.localStorage.removeItem('user');
      state.routes = [];
    }
    // toggleNFDot (state, newValue) {
    //   state.nfDot = newValue;
    // },
    // updateMsgList (state, newMsgList) {
    //   state.msgList = newMsgList;
    // },
    // updateCurrentFriend (state, newFriend) {
    //   state.currentFriend = newFriend;
    // },
    // addValue2DotMap (state, key) {
    //   state.isDotMap.set(key, '您有未读消息')
    // },
    // removeValueDotMap (state, key) {
    //   state.isDotMap.delete(key);
    // }
  },
  actions: {
  }
});
