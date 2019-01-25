<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button v-if="roleManager_btn_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">
        添加
      </el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column type="index" width="50"/>

      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色标识">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{ scope.row.roleDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="success" v-if="roleManager_btn_edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" v-if="roleManager_btn_del" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="info" v-if="roleManager_btn_perm" @click="handlePermission(scope.row)" plain>权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog :title="dialogTypeMap[dialogType]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="角色标识"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" placeholder="描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogType === 'create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTypeMap[dialogType]" :visible.sync="dialogPermissionVisible">
      <el-tree node-key="id" :props="defaultProps" :data="treeData" :default-checked-keys="checkedKeys"
               :check-strictly="false" :filter-node-method="filterNode"
               default-expand-all highlight-current show-checkbox ref="menuTree" class="filter-tree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePermission(roleId)">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addRole, delRole, fetchList, fetchRoleMenuIds, getObj, updaterPermission, putObj} from '@/api/role'
  import {fetchMenuTree} from '@/api/menu'
  import {mapGetters} from 'vuex'
  import waves from '@/directive/waves/index.js'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'RoleManage',

    components: {
      Pagination
    },
    directives: {
      waves
    },

    data() {
      return {
        tableKey: 0,

        treeData: [],
        treeDeptData: [],
        checkedKeys: [],
        menuIds: '',
        defaultProps: {
          label: 'menuName',
          children: 'children'
        },

        total: 0,
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },

        form: {
          roleName: undefined,
          roleCode: undefined,
          roleDesc: undefined,
          deptName: undefined,
          roleDeptId: undefined
        },
        formRules: {
          roleName: [
            {
              required: true,
              message: '角色名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          roleCode: [
            {
              required: true,
              message: '角色标识',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          roleDesc: [
            {
              required: true,
              message: '角色标识',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ]
        },

        roleId: undefined,
        roleCode: undefined,
        rolesOptions: undefined,

        statusOptions: ['0', '1'],

        dialogFormVisible: false,
        dialogDeptVisible: false,
        dialogPermissionVisible: false,
        dialogType: '',
        dialogTypeMap: {
          create: '创建',
          update: '编辑',
          permission: '分配权限'
        },

        roleManager_btn_add: false,
        roleManager_btn_edit: false,
        roleManager_btn_del: false,
        roleManager_btn_perm: false
      }
    },

    computed: {
      ...mapGetters(['elements', 'permissions'])
    },

    created() {
      this.getList()
      this.roleManager_btn_add = this.permissions['sys_role_add']
      this.roleManager_btn_edit = this.permissions['sys_role_edit']
      this.roleManager_btn_del = this.permissions['sys_role_del']
      this.roleManager_btn_perm = this.permissions['sys_role_perm']
    },

    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.records
          this.total = response.total
          this.listLoading = false
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            addRole(this.form).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            putObj(this.form).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      updatePermission(roleId) {
        this.menuIds = ''
        this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
        updaterPermission(roleId, this.menuIds).then(() => {
          this.dialogPermissionVisible = false
          fetchMenuTree()
            .then(response => {
              this.treeData = response
              return fetchRoleMenuIds(roleId)
            })
            .then(response => {
              this.checkedKeys = response.data
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
        })
      },

      handleCreate() {
        this.resetTemp()
        this.dialogType = 'create'
        this.dialogFormVisible = true
      },
      handleDelete(row) {
        delRole(row.id).then(response => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleUpdate(row) {
        getObj(row.id).then(response => {
          this.form = response
          this.form.deptName = row.deptName
          this.form.roleDeptId = row.roleDeptId
          this.dialogFormVisible = true
          this.dialogType = 'update'
        })
      },
      handlePermission(row) {
        fetchRoleMenuIds(row.id)
          .then(response => {
            this.checkedKeys = response
            return fetchMenuTree()
          })
          .then(response => {
            this.treeData = response
            this.checkedKeys = this.resolveAllLeafNodeId(this.treeData, this.checkedKeys, [])
            this.dialogType = 'permission'
            this.dialogPermissionVisible = true
            this.roleId = row.id
            this.roleCode = row.roleCode
          })
      },

      /**
       * 解析出所有的叶子节点id
       * @param json 待解析的json串
       * @param idArr 原始节点数组
       * @param temp 临时存放节点id的数组
       * @return 叶子节点id数组
       */
      resolveAllLeafNodeId(json, idArr, temp) {
        for (let i = 0; i < json.length; i++) {
          const item = json[i]
          // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
          if (item.children && item.children.length !== 0) {
            this.resolveAllLeafNodeId(item.children, idArr, temp)
          } else {
            temp.push(idArr.filter(id => id === item.id))
          }
        }
        return temp
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },

      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },

      resetTemp() {
        this.form = {
          id: undefined,
          roleName: undefined,
          roleCode: undefined,
          roleDesc: undefined
        }
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
