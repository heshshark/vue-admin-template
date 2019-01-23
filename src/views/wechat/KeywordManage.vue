<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.country" placeholder="国家" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button class="filter-item" @click="handleFilter" type="primary" v-waves icon="search">搜索</el-button>
    </div>

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
          <el-button v-if="sys_user_upd" size="small" type="success" @click="handleUpdate(scope.row)">详情
          </el-button>
          <el-button v-if="sys_user_del" size="small" type="danger" @click="remove(scope.row)">修改
          </el-button>
          <el-button v-if="sys_user_del" size="small" type="danger" @click="remove(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
  </div>
</template>

<script>
  import {fetchMenuList, deply} from "@/api/wechat-mp"
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
        dialogFormVisible: false,
        dialogStatus: "",
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
    },

    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.isAsc = false
        fetchMenuList(this.listQuery).then(response => {
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
            addObj(this.form).then(() => {
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
