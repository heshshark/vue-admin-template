<template>
  <div class="public-account-management clearfix">
    <!--左边配置菜单-->
    <div class="left">
      <div class="menu clearfix">
        <div class="menu-bottom" v-for="(item, i) of menu.buttons" :key="i">
          <!-- 一级菜单 -->
          <div @click="handleMenuClick(i,item)" class="menu-item" :class="{'active': isActive === i}">{{item.name}}</div>
          <!--以下为二级菜单-->
          <div class="submenu" v-if="isSubMenuFlag === i">
            <div class="subtitle" v-for="(subItem, k) in item.subButtons" :key="k">
              <div class="menu-sub-item" :class="{'active': isSubMenuActive === i + '' +k}" @click="handleSubMenuClick(item, subItem, i, k)">{{subItem.name}}
              </div>
            </div>
            <!--  二级菜单加号， 当长度 小于  5 才显示二级菜单的加号  -->
            <div class="menu-bottom menu-add-icon" v-if="item.subButtons.length < 5" @click="handleSubMenuAdd(item)"><i class="el-icon-plus"></i>
            </div>
          </div>
        </div>
        <!-- 一级菜单加号 -->
        <div class="menu-bottom menu-add-icon" v-if="menuKeyLength < 3" @click="handleMenuAdd"><i class="el-icon-plus"></i></div>
      </div>
      <el-button class="save_btn" type="success" @click="handleSaveMenuButtons">保存至菜单</el-button>
    </div>
    <!--右边配置-->
    <div v-if="!showRightFlag" class="right">
      <div class="configure-page">
        <div class="delete-btn">
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteMenuButton(tempObj)">删除当前菜单</el-button>
        </div>

        <div>
          <span>菜单名称：</span>
          <el-input class="input-width" v-model="tempObj.name" placeholder="请输入菜单名称" clearable></el-input>
        </div>

        <div>
          <div class="menu-content">
            <span>菜单内容：</span>
            <el-radio-group v-model="tempObj.type">
              <el-radio :label="'media_id'">发送素材</el-radio>
              <el-radio :label="'view'">跳转链接</el-radio>
              <el-radio :label="'click'">发送关键词</el-radio>
              <el-radio :label="'miniprogram'">小程序</el-radio>
            </el-radio-group>
          </div>
          <div class="configure-content">
            <div class="material" v-if="tempObj.type === 'media_id'">
              <span>素材内容：</span>
              <el-input class="input-width" v-model="tempObj.mediaId" placeholder="素材名称" :disabled="true"></el-input>
              <!--下面点击“选择素材”按钮，弹框框-->
              <el-popover
                placement="left"
                width="700"
                v-model="materialDialogVisible">
                <el-table :data="materialList" style="width: 100%">
                  <el-table-column label="文件名" width="600">
                    <template slot-scope="scope">
                      <el-popover trigger="hover" placement="top">
                        <p>文件名: {{ scope.row.name }}</p>
                        <div slot="reference" class="name-wrapper">
                          <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">选择</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-button slot="reference" type="success">选择素材</el-button>
              </el-popover>

              <p class="blue">tips:需要调后台获取到内容，弹框出来，然后选择，把名字赋值上去！</p>
            </div>
            <div v-if="tempObj.type === 'view'">
              <span>跳转链接：</span>
              <el-input class="input-width" v-model="tempObj.url" placeholder="请输入链接" clearable></el-input>
            </div>
            <div v-if="tempObj.type === 'click'">
              <div>
                <span>关键词：</span>
                <el-input class="input-width" v-model="tempObj.key" placeholder="请输入关键词" clearable></el-input>
              </div>
              <p class="blue">tips:这里需要配合关键词推送消息一起使用</p>
            </div>
            <div v-if="tempObj.type === 'miniprogram'">
              <div class="applet">
                <span>小程序的appId：</span>
                <el-input class="input-width" v-model="tempObj.appId" placeholder="请输入小程序的appid" clearable></el-input>
              </div>
              <div>
                <span>小程序的页面路径：</span>
                <el-input class="input-width" v-model="tempObj.pagePath" placeholder="请输入小程序的页面路径，如：pages/index" clearable></el-input>
              </div>
              <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上哟！</p>
            </div>
          </div>
        </div>
      </div>
      <div>menu对象值：{{ menu }}</div>
    </div>
    <!--一进页面就显示的默认页面，当点击左边按钮的时候，就不显示了-->
    <div v-if="showRightFlag" class="right">
      <p>请选择菜单配置</p>
    </div>
  </div>
</template>

<script>
  import {fetchMenuButtonTree, fetchMaterialList, addMenuButton} from '@/api/wechat-mp.js'

  /**
   *时间：2018/08/26
   *作者:Summer
   *功能:
   * 公众号管理页面（基于vue-cli + elementUI + mockjs）
   * 如果想迁移到其他UI框架，里面更改的地方，就是：
   * 1、+ 加号 按钮
   * 2、el-  开头的组件： 输入框，按钮，弹出框 基本就这三种类型
   * @参数：
   *
   *
   *
   *  1、自定义菜单配置文档，需要根据微信公众号要求配置，下面的链接
   *   https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141013
   *
   *  2、tempObj.type：以下这4个类型的type值一定是这样，不能改变。
   *   media_id：发送素材；  view：跳转链接；  click：发送关键词 ； miniprogram：小程序
   *
   *  3、素材内容这些都得调后台接口，读取微信配置，我本地没有，就用mock模拟
   *
   *  4、自定义菜单最多包括3个一级菜单，每个一级菜单最多包含5个二级菜单。
   *    一级菜单最多4个汉字，二级菜单最多7个汉字，多出来的部分将会以“...”代替。
   *    （PS：输入框这些没有做限制，也没有做验证）
   *
   *  5、menu 对象必须严格按照微信公众号文档说明的一样
   *
   *  6、提交的时候，整个menu提交，type值是什么，后台获取的也是对应的内容，如果同个菜单
   *  的其他内容也填写了，也不妨碍。
   */
  export default {
    name: 'WechatMenuButtonManage',

    props: {
      menuId: {
        required: true,
        type: String
      }
    },

    computed: {
      // menuObj的长度，当长度 小于  3 才显示一级菜单的加号
      menuKeyLength: function () {
        return this.menu.buttons.length;
      }
    },

    data() {
      return {
        showRightFlag: true,//右边配置显示默认详情还是配置详情

        menu: {
          buttons: [
            {
              type: "click",
              name: "菜单1",
              url: "",
              mediaId: "",
              subButtons: [
                {
                  type: "",
                  name: "子菜单1",
                  url: "",
                  mediaId: "",
                },
              ]
            }
          ]
        },

        isActive: -1,// 一级菜单点中样式
        isSubMenuActive: -1,// 一级菜单点中样式
        isSubMenuFlag: -1,// 二级菜单显示标志

        tempObj: {
          // type:"view",//media_id:素材内容; view:跳转链接
          // name:"",//菜单名称
          // material:"",//素材名称
          // link:"",//跳转链接
        },//右边临时变量，作为中间值牵引关系
        tempSelfObj: {
          //一些临时值放在这里进行判断，如果放在tempObj，由于引用关系，menu也会多了多余的参数
          // grand:"" 1:表示一级菜单； 2:表示二级菜单
          // index:"" 表示一级菜单索引
          // secondIndex:"" 表示二级菜单索引
        },

        materialDialogVisible: false,//素材内容  "选择素材"按钮弹框显示隐藏
        materialList: [] //素材列表弹框数据
      }
    },

    created(){
      console.log("created")
    },

    mounted() {
      console.log("mounted")
      this.getMenuButtonTree();//模拟调取菜单数据
    },

    destroyed(){
      console.log("销毁")
    },

    methods: {
      getMenuButtonTree() {
        fetchMenuButtonTree(this.menuId).then(response => {
          this.menu.buttons = response
        })
      },
      getMaterialList() {
        fetchMaterialList()
          .then(response => {
            this.menu = response
          })
          .catch(() => {

          })
      },
      // 删除菜单数据
      deleteData() {
        // 一级菜单的删除方法
        if (this.tempSelfObj.grand === "1") {
          this.menu.buttons.splice(this.tempSelfObj.index, 1)
        }
        // 二级菜单的删除方法
        if (this.tempSelfObj.grand === "2") {
          this.menu.buttons[this.tempSelfObj.index].subButtons.splice(this.tempSelfObj.secondIndex, 1)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      },

      handleSaveMenuButtons() {
        this.menu.buttons.map(value => {
          value.ruleId = this.menuId
          value.subButtons.map(value1 => {
            value1.ruleId = this.menuId
          })
        })
        console.log(this.menu)
        this.closeSelf()
        /*addMenuButton(this.menu)
          .then(() => {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })

            closeSelf()
          })*/
      },
      // 一级菜单点击事件
      handleMenuClick(i, item) {
        this.showRightFlag = false;//右边菜单隐藏
        this.tempObj = item;//这个如果放在顶部，flag会没有。因为重新赋值了。
        this.tempSelfObj.grand = "1";//表示一级菜单
        this.tempSelfObj.index = i;//表示一级菜单索引
        this.isActive = i; //一级菜单选中样式
        this.isSubMenuFlag = i; //二级菜单显示标志
        this.isSubMenuActive = -1; //二级菜单去除选中样式
      },
      // 二级菜单点击事件
      handleSubMenuClick(item, subItem, index, k) {
        this.showRightFlag = false;//右边菜单隐藏
        this.tempObj = subItem;//将点击的数据放到临时变量，对象有引用作用
        this.tempSelfObj.grand = "2";//表示二级菜单
        this.tempSelfObj.index = index;//表示一级菜单索引
        this.tempSelfObj.secondIndex = k;//表示二级菜单索引
        this.isSubMenuActive = index + "" + k; //二级菜单选中样式
        this.isActive = -1;//一级菜单去除样式
      },

      // 添加横向一级菜单
      handleMenuAdd() {
        // 先判断1，再判断2,对象增加，会进行往下计算，所以必须先判断2，再判断1
        if (this.menuKeyLength === 2) {
          this.$set(this.menu.buttons, "2",
            {
              name: "菜单3",
              subButtons: []
            }
          );
        }
        if (this.menuKeyLength === 1) {
          this.$set(this.menu.buttons, "1",
            {
              name: "菜单2",
              subButtons: []
            }
          );
        }
      },
      // 添加横向二级菜单
      handleSubMenuAdd(item) {
        let subMenuKeyLength = item.subButtons.length;//获取二级菜单key长度
        if (subMenuKeyLength === 4) {
          this.$set(item.subButtons, "4",
            {
              name: "子菜单5"
            }
          );
        }
        if (subMenuKeyLength === 3) {
          this.$set(item.subButtons, "3",
            {
              name: "子菜单4"
            }
          );
        }
        if (subMenuKeyLength === 2) {
          this.$set(item.subButtons, "2",
            {
              name: "子菜单3"
            }
          );
        }
        if (subMenuKeyLength === 1) {
          this.$set(item.subButtons, "1",
            {
              name: "子菜单2"
            }
          );
        }
        if (subMenuKeyLength === 0) {
          this.$set(item.subButtons, "0",
            {
              name: "子菜单1"
            }
          );
        }
      },
      // 素材内容弹框的选择按钮函数
      handleEdit(index, row) {
        this.materialDialogVisible = false;
        this.tempObj.mediaId = row.name;
      },
      //删除当前菜单
      handleDeleteMenuButton(obj) {
        console.log(obj);
        var _this = this;
        this.$confirm('此操作将永久删除该按钮, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteData();// 删除菜单数据
        }).catch(() => {
        });
      },

      closeSelf() {
        this.$emit('success', true)
        this.$emit('destroy')
      }
    },
  }
</script>
<!--本组件样式-->
<style lang="scss" scoped="scoped">
  .clearfix {
    *zoom: 1;
  }

  .clearfix::after {
    content: "";
    display: table;
    clear: both;
  }

  div {
    text-align: left;
  }

  .public-account-management {
    min-width: 1200px;
    width: 1200px;
    margin: 0 auto;

    .left {
      float: left;
      display: inline-block;
      width: 350px;
      height: 715px;
      background: url("../../assets/iphone_backImg.png") no-repeat;
      background-size: 100% auto;
      padding: 581px 25px 88px;
      position: relative;
      box-sizing: border-box;

      /*第一级菜单*/
      .menu {
        .menu-bottom {
          position: relative;
          float: left;
          display: inline-block;
          box-sizing: border-box;
          width: 100px;
          /*height: 44px;*/
          /*line-height: 44px;*/
          text-align: center;
          background-color: #e2e2e2;
          border: 1px solid #ebedee;
          cursor: pointer;

          &.menu-add-icon {
            height: 46px;
            line-height: 46px;
          }

          .menu-item {
            height: 44px;
            line-height: 44px;
            /*padding: 14px 0;*/
            text-align: center;
            box-sizing: border-box;

            &.active {
              border: 1px solid #2bb673;
            }
          }

          .menu-sub-item {
            height: 44px;
            line-height: 44px;
            text-align: center;
            box-sizing: border-box;
            /*padding: 14px 0;*/

            &.active {
              border: 1px solid #2bb673;
            }
          }
        }

        /*第二级菜单*/
        .submenu {
          position: absolute;
          width: 100px;
          bottom: 45px;

          .subtitle {
            background-color: #e8e7e7;
            box-sizing: border-box;
            margin-bottom: 2px;
          }
        }

        i {
          color: #2bb673;
        }
      }

      .save_btn {
        position: absolute;
        bottom: -50px;
        left: 100px;
      }
    }

    /*右边菜单内容*/

    .right {
      float: left;
      width: 63%;
      background-color: #e8e7e7;
      padding: 25px 10px 0px 20px;
      height: 710px;
      margin-left: 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;

      .configure-page {
        .delete-btn {
          text-align: right;
          margin-bottom: 15px;
        }

        .menu-content {
          margin-top: 20px;
        }

        .configure-content {
          margin-top: 20px;
        }

        .blue {
          color: #29b6f6;
          margin-top: 10px;
        }

        .applet {
          margin-bottom: 20px;

          span {
            margin-right: 18px;
          }
        }

        .material {
          .input-width {
            width: 30%;
          }

          .el-textarea {
            width: 80%
          }
        }
      }
    }
  }
</style>
<!--修改UI框架样式-->
<style lang="scss">
  .public-account-management {
    .el-input {
      width: 78%;;
    }

    .material {
      .el-button {
        float: right;
      }
    }
  }
</style>
