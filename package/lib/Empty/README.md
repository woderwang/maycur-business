#### 空数据占位符

## 何时使用

任何无数据的场景，可以结合ant-design,List,table等无数据的情况。

## API

按钮的属性说明如下：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | empty的类型，传入report会应用在报表<br/>当中传入default会应用在普通table场景<br/>默认default | string | `default` |
| text | empty下方的说明 | string | '暂无相关数据' |
| className | 自定义样式 |  |  |



```jsx
    <Empty></Empty>
    <Empty type="report" text="test data"></Empty>
    <Empty><div>extra</div></Empty>
```