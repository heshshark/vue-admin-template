<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="4">
        <el-row v-for="(item,index) in articleList">
          <el-card :body-style="{ padding: '0px' }" @click.native="handleArticleClick(item,index)">
            <div v-if="index === 0" :class="selectedArticleIndex === index? 'article-selected':''">
              <div class="article-item" style="position:relative;width:100%;height:120px;">
                <el-col style="position:relative;width:100%;height:120px;">
                  <img :src="item.thumbUrl" style="width:99.9%;height:99.99%"/>
                  <strong style="color:white;position:absolute;left:10px;bottom:10px;right:10px">
                    {{ item.title }}
                  </strong>
                </el-col>
                <div class="article-operation-mask" style="top: 110px">
                  <el-icon name="arrow-down" class="article-operation" style="margin-left: -150px"
                           @click.native.stop="handleArticleDown(index)"/>
                </div>
              </div>
            </div>

            <div v-else :class="selectedArticleIndex === index? 'article-selected':''">
              <el-row>
                <div class="article-item">
                  <el-col :span="15">
                    <strong style="line-height: 104px;margin-left: 10px">{{ item.title }}</strong>
                  </el-col>
                  <el-col :span="7">
                    <img :src="item.thumbUrl" style="width:90px;height:90px;margin: 5px 0">
                  </el-col>
                  <div class="article-operation-mask">
                    <el-icon name="arrow-up" class="article-operation" style="margin-left: -250px;"
                             @click.native.stop="handleArticleUp(index)"/>
                    <el-icon v-if="index !== articleList.length -1" name="arrow-down" class="article-operation"
                             style="margin-left: -200px"
                             @click.native.stop="handleArticleDown(index)"/>
                    <el-icon name="delete" class="article-operation" style="margin-left: -10px"
                             @click.native.stop="handleArticleDelete(index)"/>
                  </div>
                </div>
              </el-row>
            </div>
          </el-card>
        </el-row>
        <el-row v-if="articleList.length < 8">
          <el-card body-style="{display:block;text-align:center;position:relative}">
            <div class="el-icon-plus" style="font-size:25px;width:100%;height:100%;" @click="handleAddArticle()"></div>
          </el-card>
        </el-row>
      </el-col>

      <el-col :span="8" :push="1">
        <el-row>
          <vue-ueditor-wrap v-model="articleList[selectedArticleIndex].content" ref="editor" :init="editorInit" :config="editorConfig"></vue-ueditor-wrap>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-form>
            <el-form-item label="封面">
              <div @click="handleThumbImagePick" :class="selectedArticleIndex === 0?'thumb-uploader-main':'thumb-uploader-normal'">
                <img v-if="articleList[selectedArticleIndex].thumbUrl" :src="articleList[selectedArticleIndex].thumbUrl"
                     :class="selectedArticleIndex === 0?'thumb-img-main':'thumb-img-normal'">
                <i v-else class="el-icon-plus"></i>
              </div>
            </el-form-item>
            <el-form-item label="文章标题">
              <el-input placeholder="请输入标题"
                        v-model="articleList[selectedArticleIndex].title"/>
            </el-form-item>
            <el-form-item label="作者名称">
              <el-input placeholder="请输入作者名称"
                        v-model="articleList[selectedArticleIndex].author"/>
            </el-form-item>
            <el-form-item label="摘要">
              <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入摘要内容"
                        v-model="articleList[selectedArticleIndex].digest"/>
            </el-form-item>
            <el-form-item label="是否开启评论">
              <el-switch
                v-model="articleList[selectedArticleIndex].needOpenComment"
                active-color="#13ce66"
                inactive-color="#999">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="articleList[selectedArticleIndex].needOpenComment" label="是否粉丝才可评论">
              <el-switch
                v-model="articleList[selectedArticleIndex].onlyFansCanComment"
                active-color="#13ce66"
                inactive-color="#999">
              </el-switch>
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-check" v-waves @click="handleArticleSave" class="filter-item">保存</el-button>
        </el-row>
      </el-col>

      <el-col :span="8" :offset="2">
        <div v-html="articleList[selectedArticleIndex].content"></div>
      </el-col>
    </el-row>

    <el-dialog v-if="dialogVisible" title="选择封面" :visible.sync="dialogVisible" :before-close="handleDialogClose">
      <el-steps :active="imageStepActive" :space="200" :align-center="true" style="margin-left: 250px;margin-bottom: 20px">
        <el-step title="选择图片"></el-step>
        <el-step title="裁剪图片"></el-step>
      </el-steps>
      <el-upload
        v-if="imageStepActive === 1"
        style="float: right"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :before-upload="handleLocalUpload">
        <el-button slot="trigger" size="small" type="primary" :disabled="!!materialImageSelected.url">本地文件</el-button>
      </el-upload>
      <vue-waterfall-easy v-if="imageStepActive === 1" :imgsArr="materialImageList"
                          :imgWidth="150"
                          height="400px"
                          srcKey="url"
                          @scrollReachBottom="getMaterialImageList()"
                          style="margin-top: 50px">
        <div slot-scope="props">
          <el-button :type="materialImageSelected.url === props.value.url ?'success':'info'" icon="el-icon-check" circle
                     @click="handleMaterialImgClick(props.value)"></el-button>
          <i style="margin-left: 10px;font-size: 14px">{{props.value.name}}</i>
        </div>
      </vue-waterfall-easy>
      <image-cropper v-show="imageStepActive === 2" v-else :ratio="selectedArticleIndex === 0? 2.35:1" :imgUrl="materialImageSelected.url"
                     :local-file="localFile" ref="imageCropper"/>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="imageStepActive === 1" :disabled="!materialImageSelected.url" @click="nextCropImg">下一步</el-button>
        <div v-else>
          <el-button @click="prevChooseImg">上一步</el-button>
          <el-button @click="saveCropImg">完成</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addMaterialNews, addMaterial, fetchMaterialList, getMaterial} from '@/api/wechat-mp'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import VueWaterfallEasy from 'vue-waterfall-easy'
  import ImageCropper from '@/components/cropper/CustomCropper'

  export default {
    name: "WechatArticleEditor",

    components: {
      VueUeditorWrap,
      VueWaterfallEasy,
      ImageCropper
    },

    filters: {},

    data() {
      return {
        selectedArticleIndex: 0,

        articleList: [
          {
            thumbUrl: 'http://pic3.40017.cn/scenery/destination/2015/04/18/03/vrn29Y.jpg',
            title: 'title1',
            author: '',
            content: '你好',
            digest: "这是摘要",
            needOpenComment: true,
            onlyFansCanComment: false
          },
          {
            thumbUrl: 'https://mmbiz.qpic.cn/mmbiz_png/uNGYC1dwMGWljPgtP9UekLMd7UvjaGDWg7wicceq5vCibx4BicKfaGZNJOe9sDEbs2dklaicj9iaOTJv7P3AKoGMXxA/0?wx_fmt=png',
            title: 'title2',
            content: '中国'
          }
        ],

        editorConfig: {
          autoHeightEnabled: true,
          initialFrameHeight: 650,
          initialFrameWidth: 570,
          serverUrl: 'http://35.201.165.105:8000/controller.php'
        },

        materialImageOffset: 0,
        dialogVisible: false,
        materialImageList: [
          {
            url: 'http://pic3.40017.cn/scenery/destination/2015/04/18/03/vrn29Y.jpg',
            name: '图片名称',
            mediaIdId: ''
          },
          {
            url: 'http://94.191.37.36/wechat_img/mmbiz_png/uNGYC1dwMGWljPgtP9UekLMd7UvjaGDWg7wicceq5vCibx4BicKfaGZNJOe9sDEbs2dklaicj9iaOTJv7P3AKoGMXxA/0?wx_fmt=png',
            name: '图片名称',
            mediaIdId: ''
          }
        ],
        materialImageSelected: {
          url: '',
          name: '',
          mediaIdId: ''
        },
        imageStepActive: 1,
        clipData: null,
        localFile: null
      }
    },

    computed: {},

    created() {
      this.initData()
    },

    methods: {
      initData() {
        if (this.$route.query.mediaId) {
          getMaterial('news', this.$route.query.mediaId)
            .then(response => {
              this.articleList = response.articles
            })
        }
      },

      editorInit() {
        this.$refs.editor.registerButton({
          name: 'xiumi',
          icon: '/static/UEditor/dialogs/xiumi-connect-icon.png',
          tip: '打开秀米微信编辑器',
          handler: (editor, name) => {
            // 点击自定义按钮事你需要做的事
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
        let newArticle = {
          title: '标题'
        }
        this.articleList.push(newArticle)

        this.selectedArticleIndex = this.articleList.length - 1
      },

      handleArticleSave() {
        addMaterialNews({articles: this.articleList})
      },

      handleArticleUp(index) {
        [this.articleList[index], this.articleList[index - 1]] = [this.articleList[index - 1], this.articleList[index]]
        this.selectedArticleIndex = -1
        this.selectedArticleIndex = index - 1
      },
      handleArticleDown(index) {
        [this.articleList[index], this.articleList[index + 1]] = [this.articleList[index + 1], this.articleList[index]]
        this.selectedArticleIndex = -1
        this.selectedArticleIndex = index + 1
      },
      handleArticleDelete(index) {
        this.articleList.splice(index, 1)
        this.selectedArticleIndex = -1
        this.selectedArticleIndex = index - 1
      },

      handleThumbImagePick() {
        this.dialogVisible = true
        //this.getMaterialImageList()
      },
      handleMaterialImgClick(item) {
        if (this.materialImageSelected === item) {
          this.materialImageSelected = {}
        } else {
          this.materialImageSelected = item
        }
      },
      getMaterialImageList() {
        fetchMaterialList('image', this.materialImageOffset, 20)
          .then(response => {
            this.materialImageList = this.materialImageList.concat(response.items)
          })
      },

      nextCropImg() {
        this.imageStepActive = 2
      },

      prevChooseImg() {
        this.imageStepActive = 1
      },

      dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1])
        else
          byteString = unescape(dataURI.split(',')[1])

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }

        return new Blob([ia], {type: mimeString})
      },

      saveCropImg() {
        let thumbFile = this.dataURItoBlob(this.$refs.imageCropper.clipData);
        let thumbFilename = 'thumb_img_' + new Date().getTime() + '.png'
        let formData = new FormData();
        formData.append('file', thumbFile, thumbFilename)
        addMaterial('image', formData)
          .then((response) => {
            this.articleList[this.selectedArticleIndex].thumbMediaId = response.mediaId
            this.articleList[this.selectedArticleIndex].thumbUrl = response.url
            this.dialogVisible = false
          })
      },

      handleLocalUpload(file) {
        this.imageStepActive = 2
        this.localFile = file
        return false
      },

      handleDialogClose() {
        this.dialogVisible = false
        this.materialImageSelected = {}
        this.materialImageList = []
        this.imageStepActive = 1
        this.clipData = null
        this.localFile = null
      }

    }
  }
</script>
<style>
  .article-item {

  }

  .article-item:hover .article-operation-mask {
    display: block;
  }

  .article-selected {
    border: 2px solid #2bb673;
  }

  .article-operation-mask {
    display: none;
    top: 64px;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    background: rgba(0, 0, 0, 0.5) !important;

    position: relative;
    z-index: 1;
  }

  .article-operation-mask .article-operation {
    margin-top: 7px;
    font-size: 25px;
    color: #FFF;
    float: left;
  }

  .thumb-uploader-main {
    width: 235px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .thumb-uploader-normal {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .thumb-img-main {
    width: 235px;
    height: 100px;
    display: block;
  }

  .thumb-img-normal {
    width: 100px;
    height: 100px;
    display: block;
  }

  .thumb-img-add-main {
    font-size: 28px;
    color: #8c939d;
    width: 235px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .thumb-img-add-normal {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

</style>
