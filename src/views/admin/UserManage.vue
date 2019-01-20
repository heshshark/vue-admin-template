<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button class="filter-item" @click="handleFilter" type="primary" v-waves icon="search">搜索</el-button>

      <el-button v-if="sys_user_add" @click="handleCreate" type="primary" icon="edit" class="filter-item" style="margin-left: 10px;">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" :src="scope.row.avatar"
                 class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;"/>
            {{scope.row.username}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span v-for="role in scope.row.roleList">{{role.roleName}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="sys_user_upd" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_user_del" size="small" type="danger" @click="remove(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输用户名"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogStatus === 'create'" label="密码" placeholder="请输入密码" prop="newpassword1">
          <el-input type="password" v-model="form.newPassword"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="role" multiple placeholder="请选择" class="filter-item" style="width: 300px">
            <el-option v-for="item in rolesOptions" :key="item.id" :value="item.id" :label="item.roleDesc">
              <span style="float: left">{{ item.roleDesc }}</span>
              <span style="float: right; margin-right:30px; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="验证码登录使用"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogStatus === 'update' && sys_user_del" label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item" :value="item" :label="item | statusFilter"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addObj, delObj, fetchList, getObj, putObj} from "@/api/user"
  import {fetchAllRole} from "@/api/role"
  import {mapGetters} from "vuex"
  import waves from "@/directive/waves/index.js"
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group"
  import ElOption from "element-ui/packages/select/src/option"
  import Pagination from '@/components/Pagination'

  export default {
    name: "UserManage",

    components: {
      ElOption,
      ElRadioGroup,
      Pagination
    },

    directives: {
      waves
    },

    filters: {
      statusFilter(status) {
        const statusMap = {
          0: "有效",
          1: "无效",
          9: "锁定"
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
        role: [],
        form: {
          username: undefined,
          newPassword: undefined,
          status: undefined,
          phone: undefined,
          roleIdList: undefined
        },
        rules: {
          username: [
            {
              required: true,
              message: "请输入账户",
              trigger: "blur"
            },
            {
              min: 3,
              max: 20,
              message: "长度在 3 到 20 个字符",
              trigger: "blur"
            }
          ],
          newPassword: [
            {
              required: true,
              message: "请输入密码",
              trigger: "blur"
            },
            {
              min: 6,
              max: 20,
              message: "长度在 6 到 20 个字符",
              trigger: "blur"
            }
          ],
          deptId: [
            {
              required: true,
              message: "请选择部门",
              trigger: "blur"
            }
          ],
          roleIdList: [
            {
              required: true,
              message: "请选择角色",
              trigger: "blur"
            }
          ],
          phone: [
            {
              required: true,
              message: "手机号",
              trigger: "blur"
            },
            {
              min: 11,
              max: 11,
              message: "长度在11 个字符",
              trigger: "blur"
            }
          ]
        },
        statusOptions: [0, 9],
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: "",
        textMap: {
          update: "编辑",
          create: "创建"
        },
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
      this.sys_user_add = this.permissions["sys_user_add"]
      this.sys_user_upd = this.permissions["sys_user_upd"]
      this.sys_user_del = this.permissions["sys_user_del"]
    },

    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.isAsc = false
        fetchList(this.listQuery).then(response => {
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

      remove(row) {
        this.$confirm(
          "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          delObj(row.id)
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
        this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
            putObj(this.form).then(() => {
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

      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create"
        this.dialogFormVisible = true
        this.role = []
        fetchAllRole().then(response => {
          this.rolesOptions = response.records
        })
      },

      handleUpdate(row) {
        getObj(row.id).then(response => {
          this.form = response
          this.role = []
          for (let i = 0; i < row.roleList.length; i++) {
            this.role[i] = row.roleList[i].id
          }
          fetchAllRole().then(response => {
            this.rolesOptions = response.records
            this.dialogFormVisible = true
            this.dialogStatus = "update"
          });
        })
      },

      resetTemp() {
        this.form = {
          id: undefined,
          username: "",
          password: "",
          role: [],
          delFlag: "",
          deptId: "",
          phone: ""
        }
      },

      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
