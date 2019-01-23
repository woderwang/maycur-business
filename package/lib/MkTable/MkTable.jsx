import "maycur-antd/lib/icon/style/css";
import _Icon from "maycur-antd/lib/icon";
import "maycur-antd/lib/button/style/css";
import _Button from "maycur-antd/lib/button";
import "core-js/modules/web.dom.iterable";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/*
 * @Author: woder.wang 
 * @desc: maycur-antd 业务包装
 * @Date: 2018-11-27 15:18:53 
 * @Last Modified by: woder.wang
 * @Last Modified time: 2019-01-18 11:36:40
 */

/* resizeable注意事项，在table中，需要至少有一列是非resizeable的，这一列是用来给调整宽度的时候，留给其他列的空间变动的，没有这样的列，交互会异常 */

/* scroll属性指定了fixed header触发的条件 */
import React, { Component } from 'react';
import { FlexTable } from 'maycur-antd/lib/table'; // import 'maycur-antd/lib/table/style';

import { Resizable } from 'react-resizable';
import _ from 'lodash';
import classnames from 'classnames';
import { DateFilter, FuzzFilter, CheckFilter } from './FilterDropDown';
import FilterStateBar from './FilterStateBar';
import PopSelect from './PopSelect/PopSelect';
import RcTable from '../lib/RcTable';
import Empty from '../Empty';
import utils from '../utils/utils';
let prefix = utils.prefixCls;
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
  let defaultOption = {
    isFixHeader: false,
    resizeAble: false,
    disableLoad: false,
    hidePagination: false,
    firstDisplayColumns: [],
    isCrossPageSelect: false
  };
  option = Object.assign(defaultOption, option);
  let defaultPageSizeOptions = [20, 50, 100];

  if (option.pageSize && defaultPageSizeOptions.indexOf(option.pageSize) < 0) {
    defaultPageSizeOptions.push(option.pageSize);
    defaultPageSizeOptions.sort((a, b) => {
      return a - b;
    });
  }

  _.forEach(defaultPageSizeOptions, (val, index) => {
    defaultPageSizeOptions[index] = val + '';
  });

  return class extends Component {
    constructor(_props) {
      var _this;

      _this = super(_props);

      this.columnConvert = columns => {
        let cloneColumns = _.cloneDeep(columns);
        /* 设置内置的column属性 */


        _.forEach(cloneColumns, col => {
          if (col.filterOption) {
            if (col.filterOption.type === 'dateRange') {
              col.filterDropdown = (_ref) => {
                let setSelectedKeys = _ref.setSelectedKeys,
                    selectedKeys = _ref.selectedKeys,
                    confirm = _ref.confirm,
                    clearFilters = _ref.clearFilters;
                return React.createElement(DateFilter, _extends({}, col, {
                  setSelectedKeys: setSelectedKeys,
                  selectedKeys: selectedKeys,
                  confirm: confirm,
                  clearFilters: clearFilters
                }));
              };
            } else if (col.filterOption.type === 'search') {
              col.filterDropdown = (_ref2) => {
                let setSelectedKeys = _ref2.setSelectedKeys,
                    selectedKeys = _ref2.selectedKeys,
                    confirm = _ref2.confirm,
                    clearFilters = _ref2.clearFilters;
                return React.createElement(FuzzFilter, _extends({}, col, {
                  setSelectedKeys: setSelectedKeys,
                  selectedKeys: selectedKeys,
                  confirm: confirm,
                  clearFilters: clearFilters
                }));
              };
            } else if (col.filterOption.type === 'checkbox') {
              col.filterDropdown = (_ref3) => {
                let setSelectedKeys = _ref3.setSelectedKeys,
                    selectedKeys = _ref3.selectedKeys,
                    confirm = _ref3.confirm,
                    clearFilters = _ref3.clearFilters;
                return React.createElement(CheckFilter, _extends({}, col, {
                  setSelectedKeys: setSelectedKeys,
                  selectedKeys: selectedKeys,
                  confirm: confirm,
                  clearFilters: clearFilters
                }));
              };
            }
          }
        });

        return cloneColumns || [];
      };

      this.handleResize = index => (e, _ref4) => {
        let size = _ref4.size;
        this.setState((_ref5) => {
          let columns = _ref5.columns;
          const nextColumns = [...columns];
          nextColumns[index] = _objectSpread({}, nextColumns[index], {
            width: size.width
          });
          return {
            columns: nextColumns
          };
        });
      };

      this.onChange = (pagination, filters, sorter) => {
        let columns = this.state.columns;
        const _this$state = this.state,
              currentFilters = _this$state.filters,
              CurrentPagination = _this$state.pagination;
        const _option = option,
              isCrossPageSelect = _option.isCrossPageSelect;
        let isClearSelection = false;
        if (!_.isEqual(currentFilters, filters)) isClearSelection = true;

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
          this.dataFetch({
            isClearSelection
          });
        });
      };

      this.columnModify = (column, dataPair) => {
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
      };

      this.filterChangeNotice = () => {
        const filterChange = this.props.filterChange;
        const filters = this.state.filters;

        if (filterChange && typeof filterChange === 'function') {
          filterChange(filters);
        }
      };

      this.clearAll = () => {
        let theFilters = this.$filterBar.convertFilter(this.state.filters);
        this.$filterBar.clear(theFilters);
      };

      this.removeSingleFilter = filterKeys => {
        let _this$state2 = this.state,
            filters = _this$state2.filters,
            pagination = _this$state2.pagination,
            sorter = _this$state2.sorter;

        let newFilter = _.cloneDeep(filters);
        /* 不要直接对state中的属性做delete操作（会导致无法正常render组件），clone一个来处理*/


        if (_.isArray(filterKeys)) {
          _.forEach(filterKeys, key => {
            newFilter[key] = [];
          });
        } else {
          newFilter[filterKeys] = [];
        }

        this.onChange(pagination, newFilter, sorter);
      };

      this.generateTable = params => {
        /* 当前不支持列冻结的功能 */
        const _this$state3 = this.state,
              columns = _this$state3.columns,
              loading = _this$state3.loading,
              pagination = _this$state3.pagination,
              dataSource = _this$state3.dataSource,
              selectedRowKeys = _this$state3.selectedRowKeys,
              selectAble = _this$state3.selectAble,
              selectAbleLock = _this$state3.selectAbleLock,
              loadProps = _this$state3.loadProps,
              hideColumnCodeList = _this$state3.hideColumnCodeList,
              tableMinWidth = _this$state3.tableMinWidth;
        const rowKey = params.rowKey,
              scroll = params.scroll,
              _params$rowSelection = params.rowSelection,
              rowSelectionOption = _params$rowSelection === void 0 ? {} : _params$rowSelection,
              _params$tableId = params.tableId,
              tableId = _params$tableId === void 0 ? 'tableId' : _params$tableId,
              onRow = params.onRow;
        const _option2 = option,
              isCrossPageSelect = _option2.isCrossPageSelect;

        let wrapOnRow = record => {
          return {
            onClick: e => {
              if (rowSelectionOption.type && rowSelectionOption.type === 'radio') {
                this.setState({
                  selectedRows: [record],
                  selectedRowKeys: [record[rowKey]]
                });
              }

              if (typeof onRow === 'function') {
                let instanceOnRow = onRow(record);

                if (instanceOnRow && typeof instanceOnRow.onClick) {
                  instanceOnRow.onClick(e);
                }
              }
            }
          };
        };

        const onSelectionChange = rowSelectionOption.onSelectionChange;
        this.rowKey = rowKey;

        let rowSelection = _objectSpread({}, rowSelectionOption, {
          onChange: (selectedRowKeys, selectedRows) => {
            /* 注意：onChange中的selectedRows，因为antd不支持跨页选取，所以selectedRows只包含当前页选中的数据 */
            let currentSelectRows = [],
                currentSelectedRowKeys = [];

            if (isCrossPageSelect) {
              /* 跨页选取 */
              if (!rowSelectionOption.type || rowSelectionOption.type && rowSelectionOption.type !== 'radio') {
                let unSelectedRows = _.differenceWith(dataSource, selectedRows, _.isEqual);

                let unSelectedRowKeys = _.map(unSelectedRows, row => {
                  return row[rowKey];
                });

                currentSelectRows = _.cloneDeep(this.state.selectedRows);

                if (selectedRows.length > 0) {
                  currentSelectRows = this.modifySelectRows({
                    currentSelectRows,
                    type: 'update',
                    rows: selectedRows,
                    rowKeys: selectedRowKeys
                  });
                }

                if (unSelectedRows.length > 0) {
                  currentSelectRows = this.modifySelectRows({
                    currentSelectRows,
                    type: 'delete',
                    rows: unSelectedRows,
                    rowKeys: unSelectedRowKeys
                  });
                }

                _.forEach(currentSelectRows, row => {
                  currentSelectedRowKeys.push(row[rowKey]);
                });
              } else {
                currentSelectRows = selectedRows;
                currentSelectedRowKeys = selectedRowKeys;
              }
            } else {
              /* 非跨页选取 */
              currentSelectRows = selectedRows;
              currentSelectedRowKeys = selectedRowKeys;
            }

            this.setState({
              selectedRows: currentSelectRows,
              selectedRowKeys: currentSelectedRowKeys
            }, () => {
              if (typeof onSelectionChange === 'function') {
                onSelectionChange(currentSelectedRowKeys, currentSelectRows);
              }
            });
          },
          onSelect: (record, selected, selectedRows, nativeEvent) => {
            this.onSelect(record, selected);
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            this.onSelectAll(selected, selectedRows, changeRows);
          },
          selectedRowKeys
        });

        let visibleColumns = _.filter(columns, col => {
          return !hideColumnCodeList.includes(col.dataIndex);
        });

        let tableCls = classnames(`${prefix}-mktable-container`, {
          'table-empty': !dataSource || dataSource && dataSource.length === 0,
          'enable-scroll-x': !(scroll && scroll.x),
          'row-clickable': typeof onRow === 'function',
          'fix-header': option.isFixHeader
        });
        let tableScroll = {};
        tableScroll = _.assign({}, option.isFixHeader ? {
          y: true,
          x: tableMinWidth
        } : {});

        if (this.tableId && this.tableId !== tableId) {
          this.tableReset();
          this.tableId = tableId;
          return null;
        } else {
          this.tableId = tableId;
          return React.createElement("div", {
            className: tableCls,
            ref: _ref6 => {
              this.tableRef = _ref6;
            }
          }, React.createElement(FlexTable, _extends({}, params, {
            onRow: wrapOnRow,
            key: tableId,
            rowSelection: selectAble ? rowSelection : selectAbleLock ? {
              selectedRowKeys
            } : null,
            components: this.components,
            columns: visibleColumns,
            scroll: tableScroll,
            pagination: option.hidePagination ? false : pagination,
            dataSource: dataSource,
            onChange: this.onChange,
            loading: _objectSpread({}, loadProps, {
              spinning: loading
            }),
            locale: {
              emptyText: () => React.createElement(Empty, null)
            },
            OptionTable: RcTable
          })));
        }
      };

      this.generateFilter = function () {
        let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const _this$state4 = _this.state,
              filters = _this$state4.filters,
              columns = _this$state4.columns,
              dataSource = _this$state4.dataSource;
        const filterConfig = props.filterConfig;
        return React.createElement(FilterStateBar, {
          filters: filters,
          filterConfig: filterConfig,
          columns: columns,
          totalCount: dataSource.length,
          removeFilter: _this.removeSingleFilter,
          onRefFilterBar: _this.onRefFilterBar
        });
      };

      this.onRefFilterBar = ref => {
        this.$filterBar = ref;
      };

      this.setColumns = originColumns => {
        let columns = [],
            hideColumnCodeList = [];
        let tableMinWidth = 0;
        originColumns = _.cloneDeep(originColumns);

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

            if (option.firstDisplayColumns.length > 0 && !option.firstDisplayColumns.includes(column.dataIndex)) {
              hideColumnCodeList.push(column.dataIndex);
            }

            if (column.fixed && !column.width) {
              column.fixed = false;
            }

            tableMinWidth += Number(column.width || column.minWidth || 100);
          });

          columns = this.columnConvert(originColumns);

          if (option.resizeAble) {
            columns = columns.map((col, index) => _objectSpread({}, col, {
              onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index)
              })
            }));
          }

          this.setState({
            columns,
            sorter: initSorter,
            filters: initFilter,
            hideColumnCodeList,
            tableMinWidth
          });
        }
      };

      this.setLoadStatus = status => {
        let loading = option.disableLoad ? false : status;
        this.setState({
          loading
        });
      };

      this.dataFetch = function () {
        let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const isClearSelection = params.isClearSelection;
        if (typeof _this.fetchDataSourceFn !== 'function') return;
        let _this$state5 = _this.state,
            filters = _this$state5.filters,
            pagination = _this$state5.pagination,
            sorter = _this$state5.sorter,
            allFlag = _this$state5.allFlag,
            canceledRowKeys = _this$state5.canceledRowKeys;

        let fnExe = _this.fetchDataSourceFn(filters, {
          pageSize: pagination.pageSize,
          current: pagination.current ? pagination.current : 1
        }, {
          field: sorter.field,
          order: sorter.order === 'descend' ? 'desc' : 'asc'
        });

        let dataSource;

        if (fnExe && fnExe.then) {
          _this.setLoadStatus(true);

          fnExe.then(resp => {
            _this.setLoadStatus(false);

            if (resp.code === 'success') {
              dataSource = resp.data || [];
              /* 如果触发需要清空所有选中的数据 */

              if (isClearSelection) _this.setAllFlag(false);

              _this.setState((_ref7) => {
                let pagination = _ref7.pagination,
                    selectedRows = _ref7.selectedRows,
                    selectedRowKeys = _ref7.selectedRowKeys;
                let newSelectedRowKeys = []; //_.cloneDeep(selectedRowKeys);

                let newSelectedRows = [];

                if (!isClearSelection) {
                  newSelectedRows = _.filter(dataSource, item => {
                    if (selectedRowKeys.includes(item[_this.rowKey])) {
                      newSelectedRowKeys.push(item[_this.rowKey]);
                      return true;
                    } else {
                      return false;
                    }
                  });
                }

                return {
                  dataSource,
                  selectedRows: newSelectedRows,
                  selectedRowKeys: newSelectedRowKeys,
                  pagination: _objectSpread({}, pagination, {
                    showQuickJumper: pagination.pageSize < resp.total,
                    total: resp.total
                  })
                };
              });
            }
          }, () => {
            _this.setLoadStatus(false);
          });
        } else {
          dataSource = fnExe;

          if (dataSource && _.isArray(dataSource)) {
            _this.setState({
              dataSource
            });
          }
        }
      };

      this.setDataFetchFn = fn => {
        if (typeof fn === 'function') {
          this.fetchDataSourceFn = fn;
        }
      };

      this.setSelectAble = val => {
        this.setState((_ref8) => {
          let selectAbleLock = _ref8.selectAbleLock,
              selectedRowKeys = _ref8.selectedRowKeys,
              selectAble = _ref8.selectAble;
          return {
            selectAble: val ? true : false,
            selectedRowKeys: selectAble !== val ? [] : selectedRowKeys,
            selectAbleLock: selectAble !== val ? true : selectAbleLock
          };
        });
        /* selectedRowKeys在table组件中需要延后执行,antd的table组件当前在移除checkbox行选择的时候，是无法移除选中状态 */

        setTimeout(() => {
          this.setState({
            selectAbleLock: false
          });
        }, 100);
      };

      this.setAllFlag = isAll => {
        let dataSource = this.state.dataSource;
        let _newSelectedRowKeys = [];
        let _newSelectedRows = [];

        if (isAll) {
          dataSource.forEach(item => {
            _newSelectedRowKeys.push(item[this.rowKey]);

            _newSelectedRows.push(item);
          });
        }

        this.setState({
          selectedRowKeys: _newSelectedRowKeys,
          selectedRows: _newSelectedRows,
          allSelectedRows: [],
          allFlag: isAll
        });
      };

      this.onSelect = (record, selected) => {
        let _this$state6 = this.state,
            allSelectedRows = _this$state6.allSelectedRows,
            allFlag = _this$state6.allFlag,
            canceledRowKeys = _this$state6.canceledRowKeys,
            canceledRows = _this$state6.canceledRows;

        if (selected) {
          // 如果是全选状态下
          if (allFlag) {
            canceledRows = this.removeFromCollection(record, canceledRows, this.rowKey, 'object');
            canceledRowKeys = this.removeFromCollection(record, canceledRowKeys, this.rowKey, 'string');
          } else {
            allSelectedRows.push(record);
          }
        } else {
          if (allFlag) {
            canceledRowKeys.push(record[this.rowKey]);
            canceledRows.push(record);
          } else {
            allSelectedRows = this.removeFromCollection(record, allSelectedRows, this.rowKey, 'object');
          }
        }

        this.setState({
          allSelectedRows,
          canceledRowKeys,
          canceledRows
        });
      };

      this.onSelectAll = (selected, selectedRows, changeRows) => {
        let _this$state7 = this.state,
            allSelectedRows = _this$state7.allSelectedRows,
            allFlag = _this$state7.allFlag,
            canceledRowKeys = _this$state7.canceledRowKeys,
            canceledRows = _this$state7.canceledRows;

        if (selected) {
          // 如果是全选状态下
          if (allFlag) {
            changeRows.forEach(item => {
              canceledRows = this.removeFromCollection(item, canceledRows, this.rowKey, 'object');
              canceledRowKeys = this.removeFromCollection(item, canceledRowKeys, this.rowKey, 'string');
            });
          } else {
            allSelectedRows = allSelectedRows.concat(changeRows);
          }
        } else {
          if (allFlag) {
            changeRows.forEach(item => {
              canceledRows.push(item);
              canceledRowKeys.push(item[this.rowKey]);
            });
          } else {
            changeRows.forEach(item => {
              allSelectedRows = this.removeFromCollection(item, allSelectedRows, this.rowKey, 'object');
            });
          }
        }

        this.setState({
          allSelectedRows,
          canceledRows,
          canceledRows
        });
      };

      this.removeFromCollection = (record, collection, rowKey, type) => {
        let index = -1;

        if (type === 'object') {
          index = _.findIndex(collection, {
            [`${rowKey}`]: record[rowKey]
          });
        } else if (type === 'string') {
          index = _.findIndex(collection, o => o === record[rowKey]);
        }

        if (index > -1) {
          collection.splice(index, 1);
        }

        return collection;
      };

      this.resetSelectRows = () => {
        this.setState({
          selectedRows: [],
          selectedRowKeys: []
        });
      };

      this.modifySelectRows = operate => {
        let type = operate.type,
            rows = operate.rows,
            currentSelectRows = operate.currentSelectRows;
        let result = null;

        let _update = () => {
          let rebuildSelectRows = _.unionWith(currentSelectRows, rows, _.isEqual);

          result = rebuildSelectRows;
        };

        let _delete = () => {
          let rebuildSelectRows = _.differenceWith(currentSelectRows, rows, _.isEqual);

          result = rebuildSelectRows;
        };

        switch (type) {
          case 'update':
            _update();

            break;

          case 'delete':
            _delete();

            break;

          default:
            break;
        }

        return result;
      };

      this.customColumns = () => {
        const _this$state8 = this.state,
              columns = _this$state8.columns,
              hideColumnCodeList = _this$state8.hideColumnCodeList;
        let columnsTreeData = [],
            defaultChecked = [];

        _.forEach(columns, col => {
          if (!col.meanLess) {
            columnsTreeData.push({
              code: col.dataIndex,
              name: col.title
            });

            if (!hideColumnCodeList.includes(col.dataIndex)) {
              defaultChecked.push({
                code: col.dataIndex,
                name: col.title
              });
            }
          }
        });

        return React.createElement(PopSelect, {
          options: columnsTreeData,
          defaultValue: defaultChecked,
          close: this.setHideColumnCodeList
        }, React.createElement(_Button, {
          size: "default",
          type: "default"
        }, "\u5B57\u6BB5\u663E\u793A"));
      };

      this.setHideColumnCodeList = data => {
        const columns = this.state.columns;
        let hideColumnCodeList = [];

        _.forEach(columns, col => {
          let findIndex = _.findIndex(data, {
            code: col.dataIndex
          });

          if (findIndex === -1 && !col.meanLess) {
            hideColumnCodeList.push(col.dataIndex);
          }
        });

        this.setState({
          hideColumnCodeList
        });
      };

      this.tableReset = () => {
        this.setState(() => {
          return this.originState;
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
          pageSize: option && option.pageSize ? option.pageSize : 20,
          defaultPageSize: option && option.pageSize ? option.pageSize : 20,
          // showTotal: (total) => {
          //     return <span>总数{total}条</span>
          // },
          pageSizeOptions: defaultPageSizeOptions,
          showSizeChanger: true,
          total: 0,
          size: 'small'
        },
        allSelectedRows: [],
        //所有选中过的data列，支持跨页选取
        selectedRows: [],
        selectedRowKeys: [],
        selectAble: false,
        selectAbleLock: false,
        sorter: {},
        hideColumnCodeList: [],
        allFlag: false,
        canceledRows: [],
        canceledRowKeys: [],
        tableMinWidth: 0
      };
      this.components = {
        header: {
          cell: ResizeableTitle
        }
      };
      this.fetchDataSourceFn = null;
      this.tableRef = null;
      this.tableId;
      this.originState = _.cloneDeep(this.state);
    }
    /* column转化，用于自定义的filter dropdown效果 */


    /* 设置table的local state，抛给Wrapper组件使用 */
    setTableState() {}
    /* 设置table可选与否 */


    render() {
      return React.createElement(WrapperComponent, _extends({
        generateTable: this.generateTable,
        generateFilter: this.generateFilter,
        dataFetch: this.dataFetch,
        setColumns: this.setColumns,
        setSelectAble: this.setSelectAble,
        setDataFetchFn: this.setDataFetchFn,
        resetSelectRows: this.resetSelectRows,
        customColumns: this.customColumns,
        setAllFlag: this.setAllFlag,
        onChange: this.onChange,
        clearAll: this.clearAll
      }, this.state, this.props));
    }

  };
};

export default MkTable;