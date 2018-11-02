### MkTable
>每刻业务table HOC组件

#### props

|name|type|description|参数说明|
|:--|:--|:--|:--|
|setColumns|function(columns)|传入columns参数|columns:参考antd table中columns|
|generateTable|function(params)|生成table函数|params:{rowKey,onRow:antd table组件中属性,详情参考antd的doc}|
|generateFilter|function({ filterConfig })|生成table的筛选状态bar||
|setDataFetchFn|function(fn)|设置dataFetch方法需要执行的函数，组件使用方可以指定自己的数据获取方式和逻辑|fn:如果是异步操作（如后台请求），需要把结果集以resolve的方式返回，如果是同步的方式，需要return 结果集|
|dataFetch|function()|用于table的数据获取,需要配置setDataFetchFn使用,手动触发数据更新时调用|无参|
|setSelectAble|function(value)|设置table行是否可勾选|val:false/true|
|resetSelectRows|function()|重置/清空所有选中状态|无参|

----------
#### setDataFetchFn
|name|type|description|参数说明|
|:--|:--|:--|:--|
|fn|function|获取table中数据的方法|filters:table当前的筛选数据;<br/> pagination:table当前分页数据;<br/>sorter:table当前排序数据|