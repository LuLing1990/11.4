<template>
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <img src="../assets/logo.png" alt="">
            <span>后台管理系统</span>
            <el-button type="info" plain @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCol ? '64px' : '200px'">
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    unique-opened
                    router
                    :collapse = "isCol"
                    :collapse-transition="false"
                    :default-active="activePath">
                    <div class="toggle" @click="toggle">111</div>
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menus" :key="item.id">
                        <template slot="title">
                            <i :class="icons[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="savePath('/' + subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            //左侧菜单数据
            menus: [],
            //左侧图标存贮
            icons:{
                "125": "iconfont icon-yonghu",
                "103": "iconfont icon-mima",
                "101": "iconfont icon-yonghu",
                "102": "iconfont icon-mima",
                "145": "iconfont icon-yonghu"
            },
            //是否缩放
            isCol:false,
            //存储path
            activePath: ''
        }
    },
    created: function(){
        this.getMenus()
        //组件一创建就从sessionStorge里面获取path
        this.activePath = window.sessionStorage.getItem('path')
        
    },
    methods: {
        logout: function(){
            window.sessionStorage.clear()
            this.$router.push("/login")
        },
        async getMenus(){
            const result = await this.$http.get('menus')
            this.menus = result.data.data
            console.log(this.menus)
        },
        toggle(){
            this.isCol = !this.isCol

        },
        savePath(val){
            window.sessionStorage.setItem('path',val)
            this.activePath = val
            
        }
    }
}
</script>

<style scoped>
    .el-header{
        background-color: #373d41;
    }
    .el-header img{
        width: 40px;
        vertical-align: middle;
        margin-right: 10px;
    }
    .el-header span{
        font-size: 20px;
        color: #fff;
        line-height: 60px;
    }
    .el-header .el-button{
        float: right;
        margin-top: 10px;
    }
    .el-aside{
        background-color: #333744;
    }
    .el-container{
        height: 100%;
    }
    .el-menu{
        border-right:none
    }
    .el-submenu span{
        margin-left: 10px;
    }
    .toggle{
        background-color: #ccc;
        height: 36px;
        line-height: 36px;
        text-align: center;
    }
</style>