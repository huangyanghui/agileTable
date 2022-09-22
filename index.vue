<template>
    <a-table @change="showSizeChange" :pagination="pagination" :loading="loading" :dataSource="dataSource">
        <template #bodyCell="{ column, record }">
            <slot name="bodyCell" :column="column" :record="record">
            </slot>
        </template>
        <template #headerCell="{ column }">
            <slot name="headerCell" :column="column">
            </slot>
        </template>
    </a-table>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { ref, defineProps, reactive, defineExpose } from 'vue'
const $props = defineProps({
    getData: {
        type: Function,
        redirect: true
    },
    delApi: {
        type: Function
    },
    pagination: {
        type: Object,
        default: {}
    }
})
const dataSource = ref([])
const loading = ref(true)
const pagination: any = reactive({
    current: 1,
    total: 0,
    pageSize: 10,
    'show-total': (total: Number) => `一共 ${total} 条`
})
// 重置分页器
const resetPagination = () => {
    for (let k in $props.pagination) {
        pagination[k] = $props.pagination[k]
    }
}
// 获取数据
const getList = async (reset = false) => {
    if (reset) {
        pagination.current = 1
    }
    loading.value = true
    const res = await $props.getData({
        current: pagination.current,
        pageSize: pagination.pageSize
    })
    dataSource.value = res.list
    pagination.total = res.total
    if (res.list.length == 0 && pagination.current > 1) {
        pagination.current--
        getList()
    }
    loading.value = false
}
// 分页
const showSizeChange = ({ current, pageSize }: any) => {
    pagination.current = current
    pagination.pageSize = pageSize
    getList()
}
// 删除
const delData = (key: any) => {
    if ($props.delApi && $props.delApi instanceof Function) {
        try {
            loading.value = true
            return $props.delApi(key).then((res: any) => {
                message.success('删除成功');
                getList()
                return res
            })
        } catch (err) {
            message.error('删除失败:' + JSON.stringify(err));
        }
    } else {
        return message.error('您需要为组件传递一个删除接口，详情请看文档')
    }
}
resetPagination()
getList()

defineExpose({
    delData,
    getList
})
</script>
  
  