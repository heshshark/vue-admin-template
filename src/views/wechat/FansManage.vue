<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickName" placeholder="用户昵称" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button type="primary" icon="el-icon-search" v-waves @click="handleFilter" class="filter-item">搜索</el-button>

      <el-button type="primary" icon="el-icon-refresh" v-waves @click="handleSync" class="filter-item">同步</el-button>

      <el-button type="primary" icon="el-icon-refresh" v-waves @click="handleFansTagCreate" class="filter-item">同步</el-button>
    </div>

    <el-row>
      <el-col :span="8">
        <el-tree
          node-key="id"
          highlight-current
          :data="fansTagData"
          :props="fansTagProps"
          @node-click="handleFansTagClick"
          class="filter-tree">
        </el-tree>
      </el-col>
      <el-col :span="16">
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
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {fetchFansList, syncFans, fetchFansTagList} from "@/api/wechat-mp"
  import {mapGetters} from "vuex"

  export default {
    name: "WechatFansManage",

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
        tableKey: 0,

        fansTagData: [
          {
            tagName: '全部',
            children: []
          }
        ],
        fansTagProps: {
          label: 'tagName',
          children: 'children'
        },
      }
    },

    computed: {
      ...mapGetters(["permissions"])
    },

    created() {
      this.getFansTagList()
      this.getList()
    },

    methods: {
      getList() {
        this.listLoading = true
        fetchFansList(this.listQuery)
          .then(response => {
            this.list = response.records
            this.total = response.total
            this.listLoading = false
          })
          .catch(() => {
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

      getFansTagList() {
        fetchFansTagList({}).then(response => {
          let totalFansCount = 0;
          response.records.forEach(tag => {
            tag.tagName = tag.tagName+"["+tag.fansCount+"]"
            totalFansCount += tag.fansCount
          })
          this.fansTagData[0].tagName = "全部[" + totalFansCount + "]"
          this.fansTagData[0].children = response.records
        })
      },

      handleFansTagClick(data) {
        if (data.id === undefined) {
          this.listQuery.tagId = null
          this.getList()
          return
        }
        this.listQuery.tagId = data.id;
        this.getList()
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
