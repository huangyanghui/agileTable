# 说明
```js
1. 这是一个基于vue3+ant-design/a-table二次封装的敏捷的条件分页列表组件
2. 不单继承ant-design/a-table上的所有属性和参方法，还额外暴露了getData、delApi、delData、getList这几个属性/方法
3. 只需传递两个必填参数（getData、columns）即可实现条件分页查询
4. 还可以传递delApi和调用delData快速实现删除数据后提示和重新获取列表
```
# 额外提供的props和defineExpose
1. props

名称 | 描述 | 类型 |是否必须
--- | --- | --- |---
delApi | 删除数据api |Function|否
getData |获取列表数据api|Function|是

2. defineExpose

名称 | 描述 |参数描述|参数类型|参数是否必传
--- | --- | --- |---|---
getList | 调用获取列表接口。假如current!=1&&list.length==0则current--后重新调用 |值为真时会重置current，默认值为false |Boolean|否
delData | 调用delApi传进来的这个接口，删除成功后会自动获取最新数据。接口请求完成时会返回promise对象|删除接口需参数|any|是

# 其他属性及方法参考ant-design-table
# 用法
```vue
<template>
    <main>
        <div class="Search_box">
            <a-input v-model:value="query.name" placeholder="Please enter a search keyword" />
            <a-button type="link" @click="search">Search Button</a-button>
            <a-button type="link" @click="reset">Reset Button</a-button>
        </div>
        <agileTable :getData="getData" :columns="columns" :delApi="delApi" bordered class="atable_box"
            ref="agileTableRef">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key=='action'">
                    <a-button type="link" @click="del(record.key)">删除</a-button>
                </template>
            </template>
        </agileTable>
    </main>
</template>
<script setup lang="ts">
// columns表格表头
import { columns, getList, delApi } from './index.js'
import { ref, reactive } from 'vue'
const agileTableRef = ref(null)
const query = reactive({
    name: null,
})
// 传递到组件的接口
const getData = (page: any) => {
    return getList({
        ...page,
        ...query
    }).then((res: any) => {
        return res.data
        /*  
         *  res.data需要为以下格式
            {   
                // 列表数据
                list:[],
                // 总条数
                total:100
            } 
        */
    })
}
// 搜索
const search = () => {
    agileTableRef.value.getList(true)
}
// 重置
const reset = () => {
    query.name = null
    agileTableRef.value.getList(true)
}
// 删除
const del = async (key: any) => {
    const res = await agileTableRef.value.delData(key)
    console.log(res)
}
// 或 
// const del = async (key: any) => {
//    await delApi(key)
//    console.log('删除成功')
//    agileTableRef.value.getList()
// }
</script>
<style scoped >
main {
    padding: 10px 20px;
    display: flex;

}
.Search_box {
    flex: 2;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.atable_box {
    flex: 10;
}
</style>
```





