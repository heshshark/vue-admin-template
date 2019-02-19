<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.ruleName" placeholder="规则名称" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button type="primary" icon="search" v-waves @click="handleFilter" class="filter-item">搜索</el-button>

      <el-button v-if="addPermission" @click="handleCreate" type="primary" icon="edit" class="filter-item" style="margin-left: 10px;">添加</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column type="index" width="50"/>

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

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="default" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog :title="dialogTypeMap[dialogType]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输规则名称"/>
        </el-form-item>

        <el-form-item label="关键字" prop="keyword" v-if="dialogType === 'create'">
          <el-input type="text" v-model="form.keyword" placeholder="请输入关键字"/>
        </el-form-item>

        <el-form-item label="匹配模式" prop="matchMode">
          <el-radio-group v-model="form.matchMode">
            <el-radio :label="0">全匹配</el-radio>
            <el-radio :label="1">半匹配</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="form.messageType" placeholder="请选择" class="filter-item">
            <el-option v-for="item in messageTypeOptions" :key="item" :value="item" :label="item | messageTypeFilter"/>
          </el-select>
        </el-form-item>

        <el-form-item label="文本内容" prop="textContent" v-if="form.messageType === 0">
          <el-input type="textarea" v-model="form.textContent" placeholder="请输入自动回复内容"/>
        </el-form-item>

        <el-form-item label="状态" prop="status" v-if="dialogType === 'update'">
          <el-radio-group v-model="form.isEnable">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
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
  import {fetchKeywordList, getKeyword, addKeyword, deleteKeyword, updateKeyword} from "@/api/wechat-mp"
  import {mapGetters} from "vuex"
  import Waves from "@/directive/waves/index.js"
  import Pagination from '@/components/Pagination'

  export default {
    name: "WechatKeywordManage",

    components: {
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
        total: 0,
        list: null,
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
          matchMode: [
            {
              required: true,
              message: "请选择匹配模式",
              trigger: "blur"
            }
          ],
          messageType: [
            {
              required: true,
              message: "请选择回复消息类型模式",
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
        }
      }
    },

    computed: {
      ...mapGetters(["permissions"])
    },

    created() {
      this.getList()
      this.addPermission = true
    },

    methods: {
      getList() {
        this.listLoading = true
        fetchKeywordList(this.listQuery)
          .then(response => {
            this.list = response.records
            this.total = response.total
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          });
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
      remove(row) {
        this.$confirm(
          "此操作将永久删除该关键字:" + row.keyword + ", 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          deleteKeyword(row.id)
            .then(() => {
              this.getList()
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
            })
            .cache(() => {
              this.$notify({
                title: "失败",
                message: "删除失败",
                type: "error",
                duration: 2000
              })
            })
        })
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
            updateKeyword(this.form).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: "成功",
                message: "修改成功",
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
        this.dialogType = "create"
      },
      handleUpdate(row) {
        getKeyword(row.id).then(response => {
          this.form = response
          this.dialogFormVisible = true
          this.dialogType = "update"
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
