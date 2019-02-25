<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.country" placeholder="国家" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.province" placeholder="省份" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.city" placeholder="城市" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"></el-input>
      <el-button class="filter-item" @click="handleFilter" type="primary" v-waves icon="el-icon-search">搜索</el-button>

      <el-button class="filter-item" @click="handleCreate" type="primary" v-waves icon="el-icon-circle-plus-outline">新增</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
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

      <!--
      <el-table-column align="center" label="国家">
        <template slot-scope="scope">
          <span>{{scope.row.country || '无' }}</span>
        </template>
      </el-table-column>
      -->

      <el-table-column align="center" label="省份">
        <template slot-scope="scope">
          <span>{{scope.row.province || '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="城市">
        <template slot-scope="scope">
          <span>{{scope.row.city || '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户端类型">
        <template slot-scope="scope">
          <span>{{scope.row.clientPlatformType | clientFilter}}</span>
        </template>
      </el-table-column>

      <!--
      <el-table-column align="center" label="语言">
        <template slot-scope="scope">
          <span>{{scope.row.language || '无' }}</span>
        </template>
      </el-table-column>
      -->

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.menuId  === '-1' ? 'info':'success'">{{ scope.row.menuId  === '-1' ? '草稿':'已发布' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button v-if="scope.row.id !== '0'" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="success" @click="handleButtonEdit(scope.row)">配置按钮</el-button>
          <el-button v-if="scope.row.menuId === '-1'" size="small" type="success" @click="handlePublish(scope.row.id)">发布</el-button>
          <el-button v-if="scope.row.id !== '0'" size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="!listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog :fullscreen="dialogType === 'buttonEdit'" :title="dialogTypeMap[dialogType]" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false">
      <el-form v-if="dialogType !== 'buttonEdit' " :model="form" ref="form" label-width="100px">
        <el-form-item label="标签" prop="tagId">
          <el-select v-model="form.tagId" placeholder="请选择" class="filter-item" style="width: 300px">
            <el-option v-for="item in tagOptions" :key="item.id" :value="item.id" :label="item.tagName"/>
          </el-select>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择" class="filter-item" style="width: 300px">
            <el-option v-for="item in sexOptions" :key="item" :value="item" :label="item | sexFilter"/>
          </el-select>
        </el-form-item>

        <el-form-item label="客户端类型" prop="clientPlatformType">
          <el-select v-model="form.clientPlatformType" placeholder="请选择" class="filter-item" style="width: 300px">
            <el-option v-for="item in clientOptions" :key="item" :value="item" :label="item | clientFilter"/>
          </el-select>
        </el-form-item>

        <!--
        <el-form-item label="语言" prop="language">
          <el-select v-model="form.language" placeholder="暂不支持" disabled="" class="filter-item" style="width: 300px"></el-select>
        </el-form-item>
        -->

        <el-form-item  label="省市" prop="area">
          <dist-picker :province="form.province + '省'" :city="form.city + '市'" :hide-area="true"/>
        </el-form-item>
      </el-form>

      <menu-button-manage v-else :menu="this.menu" @success="closeDialog" ref="menuButtonManage"></menu-button-manage>

      <div v-if="dialogType !== 'buttonEdit' " slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogType === 'create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addWechatMenu, fetchMenuButtonTree, fetchMenuList, publishMenu} from '@/api/wechat-mp'
  import {mapGetters} from 'vuex'
  import DistPicker from 'v-distpicker'
  import Waves from '@/directive/waves/index.js'
  import Pagination from '@/components/Pagination'
  import MenuButtonManage from '@/views/wechat/MenuButtonManage'

  export default {
    name: "WechatMenuManage",

    components: {
      Pagination,
      MenuButtonManage,
      DistPicker
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
          0: "无",
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
        dialogType: "",
        dialogTypeMap: {
          create: "创建",
          update: "编辑",
          buttonEdit: "编辑按钮"
        },

        form: {
          username: undefined,
          newPassword: undefined,
          status: undefined,
          phone: undefined,
          roleIdList: undefined
        },

        sexOptions: [0, 1, 2],
        clientOptions: [0, 1, 2, 3],
        tagOptions: [],

        menu: {
          menuRuleId: null,
          buttons: []
        }
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
        fetchMenuList(this.listQuery)
          .then(response => {
            this.list = response.records
            this.total = response.total
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      },

      create(formName) {
        const set = this.$refs
        this.form.roleIdList = this.role
        set[formName].validate(valid => {
          if (valid) {
            addWechatMenu(this.form).then(() => {
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

      },

      handlePublish(menuRuleId) {
        publishMenu(menuRuleId).then(() => {
          this.getList()
        })
      },

      handleCreate() {
        this.dialogType = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {
        this.form = row
        this.dialogType = 'update'
        this.dialogFormVisible = true
      },
      handleButtonEdit(row) {
        this.menu.menuRuleId = row.id
        fetchMenuButtonTree(row.id).then(response => {
          if (response === null) {
            this.menu.buttons = [{
              type: "click",
              name: "菜单1",
              url: "",
              mediaId: "",
              subButtons: [
                {
                  type: "",
                  name: "子菜单1",
                  url: "",
                  mediaId: "",
                },
              ]
            }]
          } else {
            this.menu.buttons = response;
          }

          this.dialogFormVisible = true
          this.dialogType = 'buttonEdit'
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

      closeDialog() {
        this.dialogFormVisible = false
      },
      cancel(formName) {
        this.form = {}
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      }

    }
  }
</script>
