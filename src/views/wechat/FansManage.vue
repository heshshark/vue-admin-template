<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button type="primary" icon="search" v-waves @click="handleFilter" class="filter-item">搜索</el-button>

      <el-button type="primary" icon="sync" v-waves @click="handleSync" class="filter-item">同步</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="微信昵称">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl"
                 class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;"/>
            {{scope.row.nickName}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="国家">
        <template slot-scope="scope">
          <span>{{scope.row.country}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="省份">
        <template slot-scope="scope">
          <span>{{scope.row.province}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="城市">
        <template slot-scope="scope">
          <span>{{scope.row.city}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <span v-for="tag in scope.row.tagList">{{tag.tagName}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="关注时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtSubscribed | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注名称">
        <template slot-scope="scope">
          <span>{{scope.row.remarkName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.isSubscribe | statusFilter}}</el-tag>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
  </div>
</template>

<script>
  import {fetchFansList, syncFans} from "@/api/wechat-mp"
  import {mapGetters} from "vuex"
  import Waves from "@/directive/waves/index.js"
  import Pagination from '@/components/Pagination'
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group"
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    name: "WechatFansManage",

    components: {
      ElOption,
      ElRadioGroup,
      Pagination
    },

    directives: {
      Waves
    },

    filters: {
      statusFilter(status) {
        const statusMap = {
          0: "未关注",
          1: "关注中"
        }
        return statusMap[status]
      }
    },

    data() {
      return {
        treeDeptData: [],
        checkedKeys: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        statusOptions: [0, 1],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        dialogStatus: "",
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0
      };
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
        fetchFansList(this.listQuery).then(response => {
          this.list = response.records
          this.total = response.total
          this.listLoading = false
        })
      },

      handleSync() {
        this.listLoading = true
        syncFans()
          .then(() => {
            this.listLoading = false
            this.getList()
          })
          .catch(() => {
            this.listLoading = false
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
