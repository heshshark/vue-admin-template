<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickName" placeholder="用户昵称" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button type="primary" icon="el-icon-search" v-waves @click="handleFilter" class="filter-item">搜索</el-button>

      <el-button type="primary" icon="el-icon-refresh" v-waves @click="handleSync" class="filter-item">同步</el-button>

      <el-button type="primary" icon="el-icon-circle-plus-outline" v-waves @click="handleFansTagCreate" class="filter-item">新建标签</el-button>
    </div>

    <el-row>
      <el-col :span="4">
        <el-tree
          node-key="id"
          highlight-current
          :data="fansTagData"
          :props="fansTagProps"
          @node-click="handleFansTagClick"
          class="filter-tree">
        </el-tree>
      </el-col>
      <el-col :span="20">
        <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
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

          <el-table-column align="center" label="国家" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.country}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="省份" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.province}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="城市" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.city}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="关注时间">
            <template slot-scope="scope">
              <span>{{scope.row.gmtSubscribed | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="备注名称" width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-col :span="12">
                  <el-input v-model="scope.row.remarkName" size="small" style="width: 100px"/>
                </el-col>
                <el-col :span="12">
                  <el-button size="small" type="warning" @click="cancelRemarkNameEdit(scope.row)">取消</el-button>
                </el-col>
              </template>
              <span v-else>{{ scope.row.remarkName }} </span>
            </template>
          </el-table-column>

          <el-table-column align="center" class-name="status-col" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag>{{scope.row.isSubscribe | statusFilter}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button v-if="scope.row.edit" type="success" size="small" @click="confirmRemarkNameEdit(scope.row)">确定</el-button>
              <el-button v-else type="primary" size="small" @click="scope.row.edit=!scope.row.edit">编辑备注名称</el-button>
              <el-button size="small" type="success" @click="handleUpdateTag(scope.row)">编辑标签</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <strong>选择标签</strong>
      <el-select v-model="currentFansTags" multiple placeholder="请选择" class="filter-item" style="width: 300px;margin-left:30px">
        <el-option v-for="item in allTagList" :key="item.id" :value="item.id" :label="item.tagName">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="updateTag()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchFansList, syncFans, fetchFansTagList, overwriteFansTags, updateFansRemarkName} from "@/api/wechat-mp"
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
      },
      tagNameFilter(tag) {
        return tag.split("[")[0]
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

        dialogVisible: false,

        currentFansId: '',
        currentFansTags: [],
        allTagList: [],

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
            this.list = response.records.map(v => {
              this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
              v.originalRemarkName = v.remarkName //  will be used when user click the cancel botton
              return v
            })

            this.total = response.total
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      },
      updateTag() {
        overwriteFansTags(this.currentFansId, this.currentFansTags)
          .then(() => {
            this.dialogVisible = false
          })
      },


      cancelRemarkNameEdit(row) {
        row.edit = false
        row.remarkName = row.originalRemarkName
      },
      confirmRemarkNameEdit(row) {
        updateFansRemarkName(row.id, row.openId, row.remarkName)
          .then(() => {
            row.edit = false
            this.$message({
              message: '更新备注名成功',
              type: 'success'
            })
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
          this.allTagList = response.records

          let totalFansCount = 0
          let temp = JSON.parse(JSON.stringify(response.records))
          temp.forEach(tag => {
            tag.tagName = tag.tagName + "[" + tag.fansCount + "]"
            totalFansCount += tag.fansCount
          })
          this.fansTagData[0].tagName = "全部[" + totalFansCount + "]"
          this.fansTagData[0].children = temp
        })
      },

      handleUpdateTag(row) {
        this.currentFansId = row.id;
        if (!!row.tagList) {
          for (let i = 0; i < row.tagList.length; i++) {
            this.currentFansTags[i] = row.tagList[i].id
          }
        }

        this.dialogVisible = true
      },

      handleFansTagCreate() {

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

      cancel() {
        this.dialogVisible = false
      }
    }
  }
</script>
