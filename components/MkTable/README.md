### MkTable
> 每刻业务table HOC组件
> 代码维护者:刀马

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
----------
#### option
|name|type|description|default|
|:--|:--|:--|:--|
|isFixHeader(已失效)|boolean|是否固定表头(已失效)|false|
|resizeAble|boolean|是否可拖动column的宽度|false|
|disableLoad|boolean|是否可拖动column的宽度|false|
|hidePagination|boolean|是否可拖动column的宽度|false|
|firstDisplayColumns|array|首次显示的字段dataIndex集合,不传默认全部显示|[]|
----------
#### columns
> 扩展antd table中columns

|name|type|description|default|
|:--|:--|:--|:--|
|meanLess|boolean|无意义字段,用户放置动作条等信息|false|

#### rowSelection
>行的操作配置

|name|type|description|default|
|:--|:--|:--|:--|
|onSelectionChange|function|table数据选取发生后需要回调的函数,function(rowKeys,rows),回传2个参数||
#### 关于fix header的特殊说明
默认的mktable都是开启fix header模式，原antd的table需要指定fix header的scroll height，灵活性不足，所以重新mktable利用display flex特性，然scroll触发机制，根据用户的浏览器窗口高度决定，所以如果想要用flex特性的fixheader，需要包裹table的容器display为flex


