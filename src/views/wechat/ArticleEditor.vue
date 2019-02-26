<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="5">
        <el-row v-for="(item,index) in articleList" :key="item">
          <el-card :body-style="{ padding: '0px' }" @click.native="handleArticleClick(item,index)">
            <div v-if="index === 0" style="position:relative;width:100%;height:150px;" :class="selectedArticleIndex === index? 'article-selected':''">
              <img :src="item.imgUrl" style="width:99.9%;height:99.99%"/>
              <strong style="color:white;position:absolute;left:10px;bottom:10px;right:10px">
                文字
              </strong>
            </div>
            <div v-else :class="selectedArticleIndex === index? 'article-selected':''">
              <el-row>
                <el-col :span="16">
                  <strong style="line-height: 80px;margin-left: 10px">{{ item.title }}</strong>
                </el-col>
                <el-col :span="8">
                  <img :src="item.imgUrl" style="width:80px;height:80px;padding: 10px">
                </el-col>
                <div class="appmsg_edit_mask js_readonly">
                  <a onclick="return false;" style="" class="icon20_common sort_up_white   js_up" data-id="" href="javascript:;" title="上移">向上</a>
                  <a onclick="return false;" style="display: block;" class="icon20_common sort_down_white js_down" data-id="" href="javascript:;" title="下移">向下</a>
                  <a onclick="return false;" style="" class="icon20_common del_media_white js_del" data-id="" href="javascript:;" title="删除">删除</a>
                </div>
              </el-row>
            </div>
          </el-card>
        </el-row>
        <el-row v-if="articleList.length < 8">
          <el-card>
            <el-button icon="el-icon-plus" style="margin-left: 70px" @click="handleAddArticle()"></el-button>
          </el-card>
        </el-row>
      </el-col>

      <el-col :span="10" :push="1">
        <vue-ueditor-wrap v-model="content" ref="editor" :init="editorInit" :config="editorConfig"></vue-ueditor-wrap>
      </el-col>

      <el-col :span="8">
        <div v-html="content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'

  export default {
    name: "WechatFansManage",

    components: {
      VueUeditorWrap
    },

    filters: {},

    data() {
      return {
        selectedArticleIndex: 0,

        articleList: [
          {
            imgUrl: 'http://pic3.40017.cn/scenery/destination/2015/04/18/03/vrn29Y.jpg',
            title: 'tete',
            content: '你好'
          },
          {
            imgUrl: 'http://pic3.40017.cn/scenery/destination/2015/04/18/03/vrn29Y.jpg',
            title: 'tete',
            content: '中国'
          }
        ],

        content: '',
        editorConfig: {
          autoHeightEnabled: true,
          // 初始容器高度
          initialFrameHeight: 600,
          // 初始容器宽度
          initialFrameWidth: 550,
          // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
          serverUrl: 'http://35.201.165.105:8000/controller.php'
        }
      }
    },

    computed: {},

    created() {
      this.initFirstArticle()
    },

    methods: {
      initFirstArticle() {
        this.content = this.articleList[0].content
      },

      editorInit() {
        this.$refs.editor.registerButton({
          name: 'xiumi',
          icon: '/static/UEditor/dialogs/xiumi-connect-icon.png',
          tip: '打开秀米微信编辑器',
          handler: (editor, name) => {
            // 点击自定义按钮事你需要做的事
            debugger
            var dialog = new UE.ui.Dialog({
              iframeUrl: '/static/UEditor/xiumi-ue-dialog-v5.html',
              editor: editor,
              name: 'xiumi-connect',
              title: "秀米图文消息助手",
              cssRules: "width: " + (window.innerWidth - 60) + "px;" + "height: " + (window.innerHeight - 60) + "px;",
            });
            dialog.render();
            dialog.open();
          }
        })
      },

      handleArticleClick(item, index) {
        this.selectedArticleIndex = index
        this.content = item.content
      },

      handleAddArticle() {
        let newArticle ={
          title:'标题'
        }
        this.articleList.push(newArticle)

        this.selectedArticleIndex = this.articleList.length -1
        this.content = ''
      }

    }
  }
</script>
<style>
  .article-selected {
    border: 2px solid #2bb673;
  }

  .appmsg_edit_mask{
    top: auto;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    background: rgba(0,0,0,0.5)!important;
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#80000000',endcolorstr = '#80000000');
    text-align: right;
  }
</style>
