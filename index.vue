<template>
    <a-table @change="handleTableChange" :loading="loading" :dataSource="dataSource" :pagination="pageTion">
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
  const dataSource = ref([])
  const loading = ref(true)
  const props = defineProps({
      //   分页配置
      pagination: {
          type: Object,
          default: () => (
              {
                  total: 0,
                  pageSize: 10,
                  current: 1,
                  showSizeChanger: false,
                  'show-total': (total: any) => `一共 ${total} 条`
              }
          )
      },
      //   获取数据的api
      data: {
          type: Function,
          redirect: true
      },
      //   删除数据
      delApi: {
          type: Function
      },
      //   获取数据api的默认参数
      defaultQuery: {
          type: Object,
          default: {}
      },
    //   table表格数据和分页总数的目标数据
        target:{
        type: Object,
         redirect: true
    }
  })
  //   搜索栏点击搜索传递的参数
  let query = reactive({})
  const pageTion = reactive({
      total: props.pagination.total ? props.pagination.total : 0,
      pageSize: props.pagination.pageSize ? props.pagination.pageSize : 10,
      current: props.pagination.current ? props.pagination.current : 1,
      showSizeChanger: props.pagination.showSizeChanger,
      'show-total': props.pagination['show-total'] ? props.pagination['show-total'] : (total: any) => `一共 ${total} 条`
  })
  //   分页器变化
  const handleTableChange = (e: any) => {
      pageTion.current = e.current
      pageTion.pageSize = e.pageSize
      getList()
  }
  //   获取列表
  const getList = async () => {
      // 改造搜索参数：分页参数+默认参数+搜索栏参数
      let $query = {
          current: pageTion.current,
          pageSize: pageTion.pageSize,
          ...props.defaultQuery,
          ...query
      }
      loading.value = true
      const res = await props.data($query)
      
      dataSource.value = res
      pageTion.total = res
      for(let i=0;i<props.target.list.length;i++){
        dataSource.value = dataSource.value[props.target.list[i]]
      }
      for(let i=0;i<props.target.total.length;i++){
        pageTion.total = pageTion.total[props.target.total[i]]
      }
      
    
      loading.value = false
      //防止最后一页数据为空
      if (dataSource.value.length == 0 && pageTion.current != 1) {
          pageTion.current = pageTion.current - 1
          await getList()
      }
  }
  //  设置搜索栏参数和恢复分页参数
  const $search = ($query = {}) => {
      query = { ...$query }
      pageTion.pageSize = props.pagination.pageSize ? props.pagination.pageSize : 10
      pageTion.current = props.pagination.current ? props.pagination.current : 1
      getList()
  }
  //  重新发起上一次请求，参数不会恢复
  const $getList = () => {
      getList()
  }
  //   删除
  const $delApi = async (key?: any) => {
      loading.value = true
      await props.delApi(key)
      message.success('删除成功');
      getList()
  
  }
  getList()
  defineExpose({
      $search,
      $delApi,
      $getList
  })
  </script>
  
  