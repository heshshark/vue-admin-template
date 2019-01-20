<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.country" placeholder="国家" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.province" placeholder="省份" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.city" placeholder="城市" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button class="filter-item" @click="handleFilter" type="primary" v-waves icon="search">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <span>{{scope.row.tagName || '无'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex | sexFilter}}</span>
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

      <el-table-column align="center" label="客户端类型">
        <template slot-scope="scope">
          <span>{{scope.row.clientPlatformType | clientFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="语言">
        <template slot-scope="scope">
          <span>{{scope.row.language}}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
  </div>
</template>

<script>
  import {fetchMenuList} from "@/api/wechat-mp"
  import {mapGetters} from "vuex"
  import Waves from "@/directive/waves/index.js"
  import Pagination from '@/components/Pagination'
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group"
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    name: "WechatMenuManage",

    components: {
      ElOption,
      ElRadioGroup,
      Pagination
    },

    directives: {
      Waves
    },

    filters: {
      sexFilter(sex) {
        const sexMap = {
          0: "无",
          1: "男",
          2: "女"
        }
        return sexMap[sex]
      },
      clientFilter(client) {
        const clientMap = {
          1: "iOS",
          2: "Android",
          3: "其他"
        }
        return clientMap[client]
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
              });
            });
          } else {
            return false;
          }
        });
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
