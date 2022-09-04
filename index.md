# 说明
```js
1. 该组件只需要传递表头配置项和获取列表数据api即可渲染出最简单的分页列表;不必在分页变化时再去手动调用获取列表数据接口;
2. 在删除数据的时候,可以直接调用组件的内部方法,在数据删除之后自动重新去获取数据,并且如果获取到的数据空并且页码不是1的时候会自动获取上一页数据;
3. 在删除数据的时候也可以在页面内部实现删除功能,删除成功后再调用$getList方法;不过本人更推荐上一种方法,更方便快捷
4. 处理额外提供的props和defineExpose,其他的都可以参考ant-design-table
5. 特别说明 data和columns为必要props
6. 获取列表数据接口返回的参数为
            {
                data: [],
                t: 101,
            }
```
# 额外提供的props和defineExpose
1. props

名称 | 描述 | 类型 |是否必须
--- | --- | --- |---
delApi | 删除数据api |Function|否
data |获取列表数据api|Function|是
pagination|分页器的配置项|Object|否
defaultQuery|获取列表数据api的默认参数|Object|否
target|返回列表数据对象|Object|是

```js
// 接口返回值
{
    data: {
        list:[],
        total: 51,
    }
}
// target的值
{
    list:['data','list'],
    total:['data','total']
}
```

2. defineExpose

名称 | 描述 |参数描述|参数类型|参数是否必传
--- | --- | --- |---|---
$search | 调用该方法会为获取列表接口设置动态的搜索参数,并且会恢复默认的分页参数 |参数一般为搜索栏绑定的值 |Object|否
$getList | 调用该方法相当于重新发起一次上上次一模一样的请求|无参数|-|-
$delApi|删除数据时可以调用该方法,该方法会在删除数据成功后自动重新获取列表数据,如果该页数据为空,则会获取上一页数据|参数为后端删除接口所需要的参数|any|否

# 其他属性及方法参考ant-design-table
# 用法
```vue
<template>
    <main>
        <div class="Search_box">
            <a-input v-model:value="query.name" placeholder="Please enter a search keyword" />
            <a-button @click="Search" type="link">Search Button</a-button>
            <a-button @click="Reset" type="link">Reset Button</a-button>
        </div>
        <!--  -->
        <aTableMy class="atable_box" :target="{
            list:['data','list'],
            total:['data','total']
        }"   :delApi="delApi" :data="getList" :columns="columns" ref="aTableMyCom">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button @click="Del(record.key)" type="link">del</a-button>
                </template>
                <template v-if="column.key === 'email'">
                    <a href="#">{{record.email}}</a>
                </template>
            </template>
            <template #headerCell="{ column }">
                <template v-if="column.key === 'description'">
                    <a href="#">Description</a>
                </template>
            </template>
        </aTableMy>
    </main>
</template>
<script setup lang="ts">
// 引入
import aTableMy from '../../components/aTableMy/index.vue'
// 获取列表数据api，删除数据api
import { getList, delApi } from '../../components/aTableMy/index.js'
import { ref, reactive } from 'vue'
const columns = [
    {
        title: 'index',
        align: 'center',
        width: "75px",
        customRender: (record) => {
            return record.index + 1

        }
    },
    {
        title: 'Description',
        key: 'description',
        align: 'center',
        children: [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'age',


            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: 'Sex',
                dataIndex: 'sex',
                key: 'sex',
            },

        ]
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        align: 'center',
        key: "gender"
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: "email"
    },

    {
        title: 'Action',
        key: 'action',
    }
]
const query = reactive({
    name: null
})

const aTableMyCom = ref()

const Reset = () => {
    query.name = null
    aTableMyCom.value.$search()
}
const Search = () => {
    aTableMyCom.value.$search(query)
}
const Del = async (key: any) => {
    aTableMyCom.value.$delApi(key)
}
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





