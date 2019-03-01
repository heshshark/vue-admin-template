<template>
  <div class="app-container calendar-list-container">
    <el-tabs active-name="first" @tab-click="handleTabClick">
      <el-tab-pane label="图文素材" name="first">
        <el-button type="primary" icon="el-icon-circle-plus-outline" v-waves @click="handleMaterialNewsCreate" class="filter-item">新增</el-button>

        <el-table :key='tableKey' :data="newsList" v-loading="listLoading" border fit highlight-current-row style="width: 99%;margin-top: 20px">
          <el-table-column type="index" width="50"/>

          <el-table-column align="center" label="内容">
            <template slot-scope="scope">
              <el-col :span="6">
                <img :src="scope.row.thumbUrl"/>
              </el-col>
              <el-col :span="18" :pull="8">
                <pre style="font-size: 16px">{{ scope.row.summary }}</pre>
              </el-col>
            </template>
          </el-table-column>

          <el-table-column align="center" width="200" label="更新时间">
            <template slot-scope="scope">
              <span>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="handleMaterialNewsUpdate(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

        <el-dialog :title="dialogTypeMap[dialogType]" :visible.sync="dialogFormVisible">
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel('form')">取 消</el-button>

            <el-button v-if="dialogType === 'create'" type="primary" @click="create('form')">确 定</el-button>
            <el-button v-else type="primary" @click="update('form')">修 改</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="图片素材" name="second">

      </el-tab-pane>

      <el-tab-pane label="语音素材" name="third">

      </el-tab-pane>

      <el-tab-pane label="视频素材" name="fourth">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {fetchMaterialList} from "@/api/wechat-mp"
  import {mapGetters} from "vuex"

  export default {
    name: "WechatMaterialManage",

    filters: {
      matchModeFilter(mode) {
        const matchModeMap = {
          0: "全匹配",
          1: "半匹配"
        }
        return matchModeMap[mode]
      },
      messageTypeFilter(messageType) {
        const messageTypeMap = {
          0: "文本消息",
          1: "图片消息",
          2: "语音消息",
          3: "视频消息",
          4: "图文消息"
        }
        return messageTypeMap[messageType]
      },
      statusFilter(status) {
        const statusMap = {
          0: "禁用",
          1: "启用",
        }
        return statusMap[status]
      }
    },

    data() {
      return {
        newsList: [{
          mediaId: 'dwdawdawdw',
          thumbUrl: 'https://mmbiz.qlogo.cn/mmbiz_jpg/uNGYC1dwMGW4F3VxhByQqO1Z2YSibpOqW8rSRv2RGDia4wkCsAuIXNbQkg56jdwfE2QMBoAolBgq6I2dcj9kIynA/0?wx_fmt=jpeg',
          summary: '1.title1\n2.title2\n3.title3\n4.title4\n5.title5',
          updateTime: "2019-02-12 11:00:00"
        }],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20
        },

        form: {
          ruleName: undefined,
          keyword: undefined,
          matchMode: undefined,
          messageType: undefined,
          textContent: undefined,
          isEnable: undefined
        },
        formRules: {
          ruleName: [
            {
              required: true,
              message: "请填写规则名称",
              trigger: "blur"
            }
          ],
          keyword: [
            {
              required: true,
              message: "请填写关键字",
              trigger: "blur"
            },
            {
              max: 60,
              message: "长度需在60个字符以内",
              trigger: "blur"
            }
          ],
          textContent: [
            {
              required: true,
              message: "请填写文本回复内容",
              trigger: "blur"
            },
            {
              max: 300,
              message: "长度需在300个字符以内",
              trigger: "blur"
            }
          ]
        },

        matchModeOptions: [0, 1],
        messageTypeOptions: [0, 1, 2, 3, 4],

        dialogFormVisible: false,
        dialogType: "",
        dialogTypeMap: {
          create: "创建",
          update: "编辑"
        },
        tableKey: 0
      }
    },

    computed: {
      ...mapGetters(["permissions"])
    },

    created() {
      // this.getList()
    },

    methods: {
      getList() {
        this.listLoading = true
        fetchMaterialList(this.listQuery.type, this.listQuery.offset, this.listQuery.count)
          .then(response => {
            if (this.listQuery.type === 'news') {
              this.newsList = response
            }
            this.list = response.records
            this.total = response.total
            this.listLoading = false
          })
      },

      handleMaterialNewsCreate() {
        this.$router.push({path: '/wechat/mp/article'})
      },

      handleMaterialNewsUpdate(row) {
        let mediaId = row.mediaId
        this.$router.push({path: '/wechat/mp/article', query: {mediaId}})
      },

      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },

      handleTabClick(tab, event) {

      },

      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss">
  .image {
    width: 100%;
    display: block;
  }
</style>
