<template>
  <div class="app-container calendar-list-container">
    <el-tabs active-name="first" @tab-click="handleTabClick">
      <el-tab-pane label="图文素材" name="first">
        <el-table :key='tableKey' :data="newsList" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
          <el-table-column type="index" width="50"/>

          <el-table-column align="center" label="内容">
            <template slot-scope="scope">
              <div style="text-align:center">
                <img :src="scope.row.content.articles[0].thumbUrl" width="150px" height="80px" style="float: left;vertical-align: middle;"/>
                <div style="float: left;padding-left: 20px">
                  <div v-for="item in scope.row.content.articles">{{ item.title }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" width="200" label="更新时间">
            <template slot-scope="scope">
              <span>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="handleArticleUpdate(scope.row)">编辑</el-button>
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
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in imageMaterialList" :key="item">
            <el-card :body-style="{ padding: '0px' }">
              <img class="image">
              <div style="padding: 14px;">
                <span>{{ item.name }}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.updateTime }}</time>
                  <el-button type="danger">删除</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

        <el-dialog :title="dialogTypeMap[dialogType]" :visible.sync="dialogFormVisible">
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel('form')">取 消</el-button>

            <el-button v-if="dialogType === 'create'" type="primary" @click="create('form')">确 定</el-button>
            <el-button v-else type="primary" @click="update('form')">修 改</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="语音素材" name="third">
        <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
          <el-table-column type="index" width="50">
          </el-table-column>

          <el-table-column align="center" label="规则名称">
            <template slot-scope="scope">
              <span>{{ scope.row.ruleName || '无' }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="关键字">
            <template slot-scope="scope">
              <span>{{ scope.row.keyword }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="匹配规则">
            <template slot-scope="scope">
              <span>{{ scope.row.matchMode | matchModeFilter }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="回复消息类型">
            <template slot-scope="scope">
              <span>{{ scope.row.messageType | messageTypeFilter }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button v-if="sys_user_upd" size="small" type="success" @click="handleUpdate(scope.row)">详情</el-button>
              <el-button v-if="sys_user_del" size="small" type="danger" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button v-if="sys_user_del" size="small" type="danger" @click="remove(scope.row)">删除</el-button>
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

      <el-tab-pane label="视频素材" name="fourth">
        <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
          <el-table-column type="index" width="50">
          </el-table-column>

          <el-table-column align="center" label="规则名称">
            <template slot-scope="scope">
              <span>{{ scope.row.ruleName || '无' }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="关键字">
            <template slot-scope="scope">
              <span>{{ scope.row.keyword }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="匹配规则">
            <template slot-scope="scope">
              <span>{{ scope.row.matchMode | matchModeFilter }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="回复消息类型">
            <template slot-scope="scope">
              <span>{{ scope.row.messageType | messageTypeFilter }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button v-if="sys_user_upd" size="small" type="success" @click="handleUpdate(scope.row)">详情</el-button>
              <el-button v-if="sys_user_del" size="small" type="danger" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button v-if="sys_user_del" size="small" type="danger" @click="remove(scope.row)">删除</el-button>
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
    </el-tabs>
  </div>
</template>

<script>
  import {fetchKeywordList, getKeyword, addKeyword, deleteKeyword, updateKeyword} from "@/api/wechat-mp"
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
          content: {
            articles: [
              {title: "标题1", thumbUrl: "https://cn.vuejs.org/images/logo.png"},
              {title: "标题2"},
              {title: "标题3"},
              {title: "标题4"},
              {title: "标题5"},
            ]
          },
          updateTime: "2019-02-12 11:00:00"
        }],
        total: 0,
        listLoading: true,
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
      this.getList()
    },

    methods: {
      getList() {
        this.listLoading = true
        fetchKeywordList(this.listQuery).then(response => {
          this.list = response.records
          this.total = response.total
          this.listLoading = false
        })
      },
      create(formName) {
        const set = this.$refs
        this.form.roleIdList = this.role
        set[formName].validate(valid => {
          if (valid) {
            addKeyword(this.form).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              })
            })
          } else {
            return false;
          }
        })
      },

      handleArticleUpdate(row) {
        this.$router.push({ path:'/wechat/mp/article'})
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
