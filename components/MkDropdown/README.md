#### MkDropdown下拉菜单

## 何时使用

当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。MkDropdown跟antd的Dropdown的性质不太一样,不对overlay里面的元素做强绑定，只不过会对ul以及li做一些样式的默认设定，也可以
自己定制化，因为是覆盖，所以按钮的行高,padding会影响弹框的布局，所以特意加了left,top来对弹框加上自定义配置

## API

按钮的属性说明如下：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| disabled | 菜单是否禁用 | boolean | - |
| overlay | 菜单 | Menu | - |
| trigger | 触发下拉的行为 | Array<click|hover|contextMenu> | ['hover'] |
| visible | 菜单是否显示 | boolean | - |
| left | 弹框偏左位移 | number | 0 |
| top | 弹框偏上位移(默认弹框li的行高为22px，<br/>所以如果点击的button不带行高的话，<br/>可以将top设为-11)<br/> | number | 0 |



```jsx

const menu = (
  <ul>
    <li>Hover me</li>
    <li>Hover me</li>
    <li>Hover me</li>
    <li>Hover me</li>
  </ul>
);
    <MkDropdown overlay={menu} top={-11}>
        <a href="#">
        Hover me
        </a>
    </MkDropdown>
```