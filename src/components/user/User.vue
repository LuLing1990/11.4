<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索用户名 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUseList">
                        <el-button slot="append" icon="el-icon-search" @click="getUseList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDia = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 渲染用户表格 -->
            <el-table
            :data="userList"
            stripe
            border
            style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域插槽，覆盖prop，可以将prop直接去掉 -->
                    <template slot-scope = "scope">
                        <!-- {{scope.row.mg_state}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope = "scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDia(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页模块 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2,5,10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            
        </el-card>
        <!-- 添加用户的弹窗口 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDia"
            width="50%"
            @close="addDiaClose">
            <!-- 内容主体区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>    
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDia = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的弹出框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDia"
            width="50%"
            @close="editDiaClose">
            <!-- 内容主体区 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item> 
            </el-form>    
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDia = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        var checkEmail= (rule,value,cb) => {
            // 通过正则来判断
            const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if(regEmail.test(value)){
                // 验证通过
                return cb()
            }
            // 验证失败
            cb(new Error('请输入合法的邮箱！'))
        }
        var checkMobile= (rule,value,cb) => {
            // 通过正则来判断
            const regMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的手机号！'))
        }
        return {
            //获取用户列表的参数对象
            queryInfo: {
                query: '',
                //当前页数
                pagenum: 1,
                //一页显示多少条数据
                pagesize: 2
            },
            userList: [],
            total: 0,
            //控制添加用户对话框的显示与隐藏
            addDia: false,
            editDia: false,
            //添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email:'',
                mobile: ''
            },
            //查询到的用户对象
            editForm:{
                username: '',
                email:'',
                mobile: ''
            },
            //添加表单的验证规则对象
            addFormRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名的长度在 3 到 10 个字符', trigger: 'blur' } 
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '密码的长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur'}
                ]
            },
            // 修改表单的验证规则
            editFormRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名的长度在 3 到 10 个字符', trigger: 'blur' } 
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur'}
                ]
            }
            
        }
    },
    created(){
        this.getUseList()
    },
    methods:{
        async getUseList(){
            const result = await this.$http.get('users',{params: this.queryInfo})
            console.log(result)
            if(result.data.meta.status !== 200) return this.$message.error("获取用户列表失败")
            this.userList = result.data.data.users
            this.total = result.data.data.total

             console.log(this.userList,this.total)
        },
        //获取一页显示多少条数据
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getUseList()
        },
        //获取最新页码值
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getUseList()
        },
        //监听switch开关状态的改变
        async userStateChanged(userinfo){
            console.log(userinfo)
            
            const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status !== 200){
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error("更新用户状态失败")
            }
            this.$message.success("更新用户状态成功")
        },
        //关闭对话框触发的事件
        addDiaClose(){
            this.$refs.addFormRef.resetFields()
        },
        //点击按钮，添加新用户
        addUser(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return this.$message.error("信息填写错误！")
                //可以发送添加用户的网络请求
                const {data: res} = await this.$http.post('users',this.addForm)
                if(res.meta.status !== 201) return this.$message.error("添加用户失败！")
                this.$message.success("添加用户成功！")
                //关闭弹出框
                this.addDia = false
                //重新获取用户列表数据
                this.getUseList()
            })
        },
        //显示修改的对话框
        async showEditDia(id){
            
            //根据id查询用户对应的信息
            console.log(id)
            const {data: res} = await this.$http.get('users/'+ id)
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error("查询用户信息失败")
            this.editForm = res.data
            this.editDia = true

        },
        //保存用户的修改
        editUser(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return this.$message.error("填写的信息不符合要求!")
                //发起修改用户信息的请求
                
                var {data: res} = await this.$http.put('users/' + this.editForm.id,{
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                // console.log(res)
                if(res.meta.status !== 200) return this.$message.error("更新用户信息失败！！")
                //隐藏对话框，更新数据，提示更新成功
                this.editDia = false
                this.$message.success("用户信息更新成功")
                this.getUseList()
            })
        },
        //关闭表单的重置
        editDiaClose(){
            this.$refs.editFormRef.resetFields()
        },
        //删除用户
        deleteUser(id){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data:res} = await this.$http.delete('users/' + id)
                // console.log(res)
                this.getUseList()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    }
}
</script>

<style scoped>
    
</style>