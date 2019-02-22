<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="类型" size="mini" v-model="listQuery.type">
      </el-input>
      <el-button class="filter-item" type="primary" size="mini" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_dict_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" size="mini" icon="edit">添加
      </el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column align="center" label="字典编码">
        <template slot-scope="scope">
          <span>{{ scope.row.dicCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签名">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据值">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.sortNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注信息">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="sys_dict_upd" size="mini" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_dict_del" size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item v-if="dialogStatus === 'update'" label="编号" prop="id">
          <el-input v-model="form.id" placeholder="编号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="form.dicCode" placeholder="字典编码"></el-input>
        </el-form-item>
        <el-form-item label="标签名" prop="label">
          <el-input v-model="form.label" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item label="数据值" prop="value">
          <el-input v-model="form.value" placeholder="数据值"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input v-model="form.sortNum" placeholder="排序（升序）"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" placeholder="备注信息"></el-input>
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
  import {addObj, delObj, fetchList, putObj} from '@/api/dict'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {mapGetters} from 'vuex'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'DictManage',

    components: {
      Pagination
    },

    directives: {
      waves
    },

    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '有效',
          1: '无效'
        }
        return statusMap[status]
      }
    },

    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          ascList: ['dic_code','value']
        },
        formRules: {
          value: [
            {
              required: true,
              message: '数据值',
              trigger: 'blur'
            }
          ],
          label: [
            {
              required: true,
              message: '标签名',
              trigger: 'blur'
            }
          ],
          dicCode: [
            {
              required: true,
              message: '字典编码',
              trigger: 'blur'
            }
          ],
          description: [
            {
              required: true,
              message: '描述',
              trigger: 'blur'
            }
          ],
          remarks: [
            {
              required: true,
              message: '备注信息',
              trigger: 'blur'
            }
          ],
          sortNum: [
            {
              required: true,
              message: '排序',
              trigger: 'blur'
            }
          ],
        },
        form: {},
        dialogFormVisible: false,
        dialogStatus: '',
        sys_dict_add: false,
        sys_dict_upd: false,
        sys_dict_del: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },

    computed: {
      ...mapGetters(['permissions'])
    },

    created() {
      this.getList()
      this.sys_dict_add = this.permissions['sys_dict_add']
      this.sys_dict_upd = this.permissions['sys_dict_upd']
      this.sys_dict_del = this.permissions['sys_dict_del']
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
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleDelete(row) {
        delObj(row).then(() => {
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
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.form.id = row.id
        this.form.type = row.type
        this.form.value = row.value
        this.form.label = row.label
        this.form.description = row.description
        this.form.sort = row.sort
        this.form.remarks = row.remarks
      },

      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
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
            this.form.password = undefined
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
      cancel(formName) {
        this.dialogFormVisible = false
        const set = this.$refs
        set[formName].resetFields()
      }
    }
  }
</script>
