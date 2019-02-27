<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button type="primary" icon="el-icon-search" v-waves @click="handleFilter" class="filter-item">搜索</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" v-waves @click="handleCreate" class="filter-item">新增</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="标签名称">
        <template slot-scope="scope">
          <span>{{scope.row.tagName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="粉丝人数">
        <template slot-scope="scope">
          <span>{{scope.row.fansCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" type="default" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog :title="dialogTypeMap[dialogType]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="form.tagName" placeholder="请输标签名称"/>
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
  import {addFansTag, updateFansTag, deleteFansTag, getFansTag, fetchFansTagList} from "@/api/wechat-mp"
  import {mapGetters} from "vuex"

  export default {
    name: "WechatFansTagManage",

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
          tagName: undefined,
        },
        formRules: {
          tagName: [
            {
              required: true,
              message: "请输入标签名称",
              trigger: "blur"
            },
            {
              min: 1,
              max: 12,
              message: "长度在 1 到 12 个字符",
              trigger: "blur"
            }
          ],
        },

        dialogFormVisible: false,
        dialogType: "create",
        dialogTypeMap: {
          "create": "新建标签",
          "update": "修改标签"
        }
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
        fetchFansTagList(this.listQuery).then(response => {
          this.list = response.records
          this.total = response.total
          this.listLoading = false
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            addFansTag(this.form).then(() => {
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
      remove(row) {
        this.$confirm(
          "此操作将永久删除该标签:" + row.tagName + ", 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          deleteFansTag(row.id)
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
            updateFansTag(this.form).then(() => {
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
        getFansTag(row.id).then(response => {
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
