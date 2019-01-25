<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.country" placeholder="国家" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button class="filter-item" @click="handleFilter" type="primary" v-waves icon="search">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title || '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="摘要">
        <template slot-scope="scope">
          <span>{{ scope.row.digest }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="原文链接">
        <template slot-scope="scope">
          <span>{{ scope.row.contentSourceUrl }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-if="wechat_article_upd" size="small" type="danger" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="wechat_article_del" size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog :title="dialogTypeMap[dialogType]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输规则名称"/>
        </el-form-item>

        <el-form-item label="关键字" prop="keyword" v-if="dialogType === 'create'">
          <el-input type="text" v-model="form.keyword" placeholder="请输入关键字"/>
        </el-form-item>

        <el-form-item label="匹配模式" prop="matchMode">
          <el-select v-model="role" multiple placeholder="请选择" class="filter-item" style="width: 300px">
            <el-option v-for="item in matchModeOptions" :key="item.code" :value="item.code" :label="item.desc">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; margin-right:30px; color: #8492a6; font-size: 13px">{{ item.roleDesc }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="form.messageType" multiple placeholder="请选择" class="filter-item">
            <el-option v-for="item in messageTypeOptions" :key="item.code" :value="item.code" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="文本消息内容" prop="textContent" v-if="form.messageType === 0">
          <el-input type="textarea" v-model="form.textContent" placeholder="请输入自动回复内容"/>
        </el-form-item>

        <el-form-item label="状态" prop="status" v-if="dialogType === 'update' && sys_user_del">
          <el-select v-model="form.isEnable" placeholder="请选择" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item" :value="item" :label="item | statusFilter"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>

        <el-button v-if="dialogType === 'create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchArticleList, getArticle, addArticle, deleteArticle, updateArticle} from "@/api/wechat-mp"
  import {mapGetters} from "vuex"
  import Waves from "@/directive/waves/index.js"
  import Pagination from '@/components/Pagination'
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group"
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    name: "WechatKeywordManage",

    components: {
      ElOption,
      ElRadioGroup,
      Pagination
    },

    directives: {
      Waves
    },

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
        list: null,
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
        matchModeOptions: [
          {
            code: 0,
            name: "全匹配",
            desc: "一字不差"
          },
          {
            code: 1,
            name: "半匹配",
            desc: "包含即可"
          }
        ],
        messageTypeOptions: [
          {
            code: 0,
            name: "文本消息",
          },
          {
            code: 1,
            name: "图片消息",
          },
          {
            code: 2,
            name: "语音消息",
          },
          {
            code: 3,
            name: "视频消息",
          },
          {
            code: 4,
            name: "图文消息",
          },
        ],
        dialogFormVisible: false,
        dialogType: "",
        dialogTypeMap: {
          create: "创建",
          update: "编辑"
        },
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0
      }
    },

    computed: {
      ...mapGetters(["permissions"])
    },

    created() {
      this.getList()
      this.wechat_article_add = this.permissions["wechat_article_add"]
      this.wechat_article_upd = this.permissions["wechat_article_upd"]
      this.wechat_article_del = this.permissions["wechat_article_del"]
    },

    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.isAsc = false
        fetchArticleList(this.listQuery).then(response => {
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
            addArticle(this.form).then(() => {
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

      handleCreate() {
        this.dialogFormVisible = true
        this.dialogType = "update"
      },
      handleUpdate(row) {
        getArticle(row.id).then(response => {
          this.form = response
          this.dialogFormVisible = true
          this.dialogType = "update"
        })
      },
      handleDetail(row) {
        getArticle(row.id).then(response => {
          this.form = response
          this.dialogFormVisible = true
          this.dialogType = "detail"
        })
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

      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
