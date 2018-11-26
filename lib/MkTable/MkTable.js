import "maycur-antd/lib/table/style/css";
import _Table from "maycur-antd/lib/table";
import "core-js/modules/web.dom.iterable";
import "maycur-antd/lib/icon/style/css";
import _Icon from "maycur-antd/lib/icon";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* resizeable注意事项，在table中，需要至少有一列是非resizeable的，这一列是用来给调整宽度的时候，留给其他列的空间变动的，没有这样的列，交互会异常 */

/* scroll属性指定了fixed header触发的条件 */
import React, { Component } from 'react';
import { Resizable } from 'react-resizable';
import _ from 'lodash';
import { DateFilter, FuzzFilter } from './FilterDropDown';
import FilterStateBar from './FilterStateBar';
import styles from './MkTable.less';
/* title 宽度变动 */

const ResizeableTitle = props => {
  const onResize = props.onResize,
        width = props.width,
        restProps = _objectWithoutProperties(props, ["onResize", "width"]);

  if (!width) {
    return React.createElement("th", restProps);
  }

  return React.createElement(Resizable, {
    width: width,
    height: 0,
    onResize: onResize
  }, React.createElement("th", restProps));
};

let MkTable = option => WrapperComponent => {
  let isFixHeader = option && option.isFixHeader ? option.isFixHeader : false;
  return class extends Component {
    constructor(props) {
      super(props);

      this.handleResize = index => (e, _ref) => {
        let size = _ref.size;
        this.setState((_ref2) => {
          let columns = _ref2.columns;
          const nextColumns = [...columns];
          nextColumns[index] = _objectSpread({}, nextColumns[index], {
            width: size.width
          });
          return {
            columns: nextColumns
          };
        });
      };

      this.resetSelectRows = () => {
        this.setState({
          selectedRows: [],
          selectedRowKeys: []
        });
      };

      this.state = {
        columns: [],
        filters: {},
        dataSource: [],
        loading: false,
        loadProps: {
          indicator: React.createElement(_Icon, {
            type: "loading-3-quarters",
            style: {
              fontSize: 24
            },
            spin: true
          })
        },
        pagination: {
          pageSize: option && option.pageSize ? option.pageSize : 10,
          showTotal: total => {
            return React.createElement("span", null, "\u603B\u6570", total, "\u6761");
          },
          total: 0
        },
        selectedRows: [],
        selectedRowKeys: [],
        selectAble: false,
        selectAbleLock: false,
        sorter: {}
      };
      this.components = {
        header: {
          cell: ResizeableTitle
        }
      };
      this.handleResize = this.handleResize.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onRow = this.onRow.bind(this);
      this.columnConvert = this.columnConvert.bind(this);
      this.columnModify = this.columnModify.bind(this);
      this.filterChangeNotice = this.filterChangeNotice.bind(this);
      this.clearAll = this.clearAll.bind(this);
      this.removeSingleFilter = this.removeSingleFilter.bind(this);
      this.generateTable = this.generateTable.bind(this);
      this.generateFilter = this.generateFilter.bind(this);
      this.setColumns = this.setColumns.bind(this);
      this.setLoadStatus = this.setLoadStatus.bind(this);
      this.showTotal = this.showTotal.bind(this);
      this.dataFetch = this.dataFetch.bind(this);
      this.fetchDataSourceFn = null;
      this.setDataFetchFn = this.setDataFetchFn.bind(this);
      this.setSelectAble = this.setSelectAble.bind(this);
    }
    /* column转化，用于自定义的filter dropdown效果 */


    columnConvert(columns) {
      let cloneColumns = _.cloneDeep(columns);
      /* 设置内置的column属性 */


      _.forEach(cloneColumns, col => {
        if (col.filterOption) {
          if (col.filterOption.type === 'dateRange') {
            col.filterDropdown = (_ref3) => {
              let setSelectedKeys = _ref3.setSelectedKeys,
                  selectedKeys = _ref3.selectedKeys,
                  confirm = _ref3.confirm,
                  clearFilters = _ref3.clearFilters;
              return React.createElement(DateFilter, {
                setSelectedKeys: setSelectedKeys,
                selectedKeys: selectedKeys,
                confirm: confirm,
                clearFilters: clearFilters
              });
            };
          } else if (col.filterOption.type === 'search') {
            col.filterDropdown = (_ref4) => {
              let setSelectedKeys = _ref4.setSelectedKeys,
                  selectedKeys = _ref4.selectedKeys,
                  confirm = _ref4.confirm,
                  clearFilters = _ref4.clearFilters;
              return React.createElement(FuzzFilter, null);
            };
          }
        }
      });

      return cloneColumns || [];
    }
    /* 控制table header的resize功能 */


    /* 设置行属性，比如click mouseMove等 */
    onRow(record, index) {
      const rowClick = this.props.rowClick;
      return {
        /* 行点击事件 */
        onClick: e => {
          if (typeof rowClick === 'function') {
            rowClick(record);
          }
        }
      };
    }
    /* table筛选属性的变化 */


    onChange(pagination, filters, sorter) {
      let columns = this.state.columns;

      _.forEach(filters, (value, key) => {
        if (value) {
          let column = _.find(columns, {
            key
          });

          this.columnModify(column, {
            key: 'filteredValue',
            value
          });
        }
      });

      _.forEach(columns, column => {
        if (sorter && sorter.field && column.key === sorter.field) {
          this.columnModify(column, {
            key: 'sortOrder',
            value: sorter.order
          });
        } else if (column.sortOrder) {
          this.columnModify(column, {
            key: 'sortOrder',
            value: false
          });
        }
      });

      this.setState({
        filters,
        sorter: {
          field: sorter.field,
          order: sorter.order
        },
        pagination
      }, () => {
        this.dataFetch();
      });
    }
    /* column状态变更 */


    columnModify(column, dataPair) {
      let columns = this.state.columns;

      let idx = _.findIndex(columns, {
        dataIndex: column.dataIndex
      });

      if (dataPair && idx > -1) {
        let key = dataPair.key,
            value = dataPair.value;
        column[key] = value;
        columns[idx] = column;
        this.setState({
          columns
        });
      }
    }
    /* filter变动通知 */


    filterChangeNotice() {
      const filterChange = this.props.filterChange;
      const filters = this.state.filters;

      if (filterChange && typeof filterChange === 'function') {
        filterChange(filters);
      }
    }
    /* 清空所有筛选条件 */


    clearAll() {
      let columns = this.state.columns;

      _.forEach(columns, col => {
        if (col.filteredValue !== undefined) {
          col.filteredValue = null;
        }
      });

      this.setState({
        columns
      });
    }
    /* 移除单独的筛选条件 */


    removeSingleFilter(filterKey) {
      let _this$state = this.state,
          columns = _this$state.columns,
          filters = _this$state.filters,
          pagination = _this$state.pagination,
          sorter = _this$state.sorter;

      let newFilter = _.cloneDeep(filters); // _.forEach(columns, col => {
      //     if (col.filteredValue !== undefined && col.dataIndex === filterKey) {
      //         col.filteredValue = null;
      //     }
      // })

      /* 不要直接对state中的属性做delete操作（会导致无法正常render组件），clone一个来处理*/


      newFilter[filterKey] = [];
      this.onChange(pagination, newFilter, sorter); // this.setState({ columns, filters: newFilter },()=>{
      //     this.onChange(pagination, newFilter, sorter)
      // });
    }
    /* 生成table */


    generateTable(params) {
      const _this$state2 = this.state,
            columns = _this$state2.columns,
            loading = _this$state2.loading,
            pagination = _this$state2.pagination,
            dataSource = _this$state2.dataSource,
            selectedRowKeys = _this$state2.selectedRowKeys,
            selectAble = _this$state2.selectAble,
            selectAbleLock = _this$state2.selectAbleLock,
            loadProps = _this$state2.loadProps;
      const rowKey = params.rowKey,
            onRow = params.onRow;
      const resizeColumns = columns.map((col, index) => _objectSpread({}, col, {
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index)
        })
      }));
      this.rowKey = rowKey;
      let rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            selectedRows,
            selectedRowKeys
          });
        },
        getCheckboxProps: record => ({// disabled: record.name === 'Disabled User', // Column configuration not to be checked
          // name: record.expenseCode,
        }),
        selectedRowKeys: selectedRowKeys
      };
      return React.createElement("div", {
        className: styles['container']
      }, React.createElement(_Table, {
        // bordered
        rowSelection: selectAble ? rowSelection : selectAbleLock ? {
          selectedRowKeys
        } : null,
        components: this.components,
        columns: resizeColumns,
        rowKey: rowKey,
        scroll: isFixHeader ? {
          y: 500
        } : undefined,
        pagination: pagination,
        dataSource: dataSource,
        onRow: onRow,
        onChange: this.onChange,
        loading: _objectSpread({}, loadProps, {
          spinning: loading
        }),
        locale: {
          emptyText: () => React.createElement("div", {
            className: styles['data-emtpy']
          }, React.createElement("span", {
            className: 'fm fm-prompt'
          }), React.createElement("span", null, "\u6682\u65E0\u6570\u636E"))
        }
      }));
    }
    /* 生成筛选条件 */


    generateFilter() {
      let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const _this$state3 = this.state,
            filters = _this$state3.filters,
            columns = _this$state3.columns;
      const filterConfig = props.filterConfig;
      return React.createElement(FilterStateBar, {
        filters: filters,
        filterConfig: filterConfig,
        columns: columns,
        removeFilter: this.removeSingleFilter
      });
    }
    /* 设置columns */


    setColumns(originColumns) {
      if (originColumns) {
        let initSorter = {},
            initFilter = {};

        _.forEach(originColumns, column => {
          if (column.sortOrder) {
            initSorter.field = column.dataIndex;
            initSorter.order = column.sortOrder;
          }

          if (column.filteredValue) {
            initFilter[column.dataIndex] = column.filteredValue;
          }
        });

        this.setState({
          columns: this.columnConvert(originColumns),
          sorter: initSorter,
          filters: initFilter
        });
      }
    }
    /* 设置table的加载状态 */


    setLoadStatus(status) {
      this.setState({
        loading: status ? status : false
      });
    }
    /* 显示数据总数 */


    showTotal() {
      return React.createElement("span", null, "\u603B\u657019\u6761");
    }
    /* 更新数据源 */


    dataFetch() {
      if (typeof this.fetchDataSourceFn !== 'function') return;
      let _this$state4 = this.state,
          filters = _this$state4.filters,
          pagination = _this$state4.pagination,
          sorter = _this$state4.sorter;
      let fnExe = this.fetchDataSourceFn(filters, {
        pageSize: pagination.pageSize,
        current: pagination.current ? pagination.current : 1
      }, {
        field: sorter.field,
        order: sorter.order === 'descend' ? 'desc' : 'asc'
      });
      let dataSource;

      if (fnExe && fnExe.then) {
        this.setLoadStatus(true);
        fnExe.then(resp => {
          this.setLoadStatus(false);

          if (resp.code === 'success') {
            dataSource = resp.data;
            this.setState((_ref5) => {
              let pagination = _ref5.pagination,
                  selectedRows = _ref5.selectedRows;
              let rebuildSelectedRows = [],
                  rebuildSelectedRowKeys = [];

              if (selectedRows && selectedRows.length > 0) {
                _.forEach(dataSource, rowData => {
                  if (!this.rowKey) return;

                  let findIndex = _.findIndex(selectedRows, {
                    [`${this.rowKey}`]: rowData[this.rowKey]
                  });

                  if (findIndex > -1) {
                    rebuildSelectedRows.push(selectedRows[findIndex]);
                    rebuildSelectedRowKeys.push(selectedRows[findIndex][this.rowKey]);
                  }
                });
              }

              return {
                dataSource,
                selectedRows: rebuildSelectedRows,
                selectedRowKeys: rebuildSelectedRowKeys,
                pagination: _objectSpread({}, pagination, {
                  total: resp.total
                })
              };
            });
          }
        }, () => {
          this.setLoadStatus(false);
        });
      } else {
        dataSource = fnExe;
        this.setState({
          dataSource
        });
      }
    }
    /* 设置table获取数据的函数 */


    setDataFetchFn(fn) {
      if (typeof fn === 'function') {
        this.fetchDataSourceFn = fn;
      }
    }
    /* 设置table的local state，抛给Wrapper组件使用 */


    setTableState() {}
    /* 设置table可选与否 */


    setSelectAble(val) {
      const selectAble = this.state.selectAble;
      this.setState(() => {
        if (selectAble !== val) {
          return {
            selectedRowKeys: [],
            selectAble: val ? true : false,
            selectAbleLock: true
          };
        } else {
          return {};
        }
      });
      /* selectedRowKeys在table组件中需要延后执行,antd的table组件当前在移除checkbox行选择的时候，是无法移除选中状态 */

      setTimeout(() => {
        this.setState({
          selectAbleLock: false
        });
      }, 100);
    }
    /* clear SelectRows */


    render() {
      return React.createElement(WrapperComponent, _extends({
        generateTable: this.generateTable,
        generateFilter: this.generateFilter,
        dataFetch: this.dataFetch,
        setColumns: this.setColumns,
        setSelectAble: this.setSelectAble,
        setDataFetchFn: this.setDataFetchFn,
        resetSelectRows: this.resetSelectRows
      }, this.state, this.props));
    }

  };
};

export default MkTable;