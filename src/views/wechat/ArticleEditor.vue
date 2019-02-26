<template>
  <div class="app-container calendar-list-container">
    <vue-ueditor-wrap v-model="content" ref="editor" :init="editorInit" :config="editorConfig"></vue-ueditor-wrap>
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
        content: '',
        editorConfig:{
          autoHeightEnabled: false,
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

    },

    methods: {
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
      }
    }
  }
</script>
