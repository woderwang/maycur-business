/*
 * @Author: woder.wang 
 * @desc: maycur-antd 业务包装
 * @Date: 2018-11-27 15:18:53 
 * @Last Modified by: woder.wang
 * @Last Modified time: 2019-01-08 21:33:19
 */
/* resizeable注意事项，在table中，需要至少有一列是非resizeable的，这一列是用来给调整宽度的时候，留给其他列的空间变动的，没有这样的列，交互会异常 */
/* scroll属性指定了fixed header触发的条件 */
import React, { Component } from 'react';
import { Icon, Button } from 'maycur-antd';
import { FlexTable } from 'maycur-antd/lib/table';
// import 'maycur-antd/lib/table/style';
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
const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props;
    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    );
};

let MkTable = (option) => WrapperComponent => {
    let defaultOption = {
        isFixHeader: false,
        resizeAble: false,
        disableLoad: false,
        hidePagination: false,
        firstDisplayColumns: []
    }
    option = Object.assign(defaultOption, option);
    let defaultPageSizeOptions = [20, 50, 100];
    if (option.pageSize && defaultPageSizeOptions.indexOf(option.pageSize) < 0) {
        defaultPageSizeOptions.push(option.pageSize);
        defaultPageSizeOptions.sort((a, b) => { return a - b });
    }
    _.forEach(defaultPageSizeOptions, (val, index) => {
        defaultPageSizeOptions[index] = val + '';
    });
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                columns: [],
                filters: {},
                dataSource: [],
                loading: false,
                loadProps: { indicator: <Icon type="loading-3-quarters" style={{ fontSize: 24 }} spin /> },
                pagination: {
                    pageSize: option && option.pageSize ? option.pageSize : 20,
                    defaultPageSize: option && option.pageSize ? option.pageSize : 20,
                    showTotal: (total) => {
                        return <span>总数{total}条</span>
                    },
                    pageSizeOptions: defaultPageSizeOptions,
                    showSizeChanger: true,
                    total: 0,
                    size: 'small',
                },
                allSelectedRows: [],//所有选中过的data列，支持跨页选取
                selectedRows: [],
                selectedRowKeys: [],
                selectAble: false,
                selectAbleLock: false,
                sorter: {},
                hideColumnCodeList: [],
                allFlag: false,
                canceledRows: [],
                canceledRowKeys: []
            };
            this.components = {
                header: {
                    cell: ResizeableTitle,
                },
            };
            this.fetchDataSourceFn = null;
            this.tableRef = null;
            this.tableId;
            this.originState = _.cloneDeep(this.state);
        }

        /* column转化，用于自定义的filter dropdown效果 */
        columnConvert = (columns) => {
            let cloneColumns = _.cloneDeep(columns);
            /* 设置内置的column属性 */
            _.forEach(cloneColumns, (col) => {
                if (col.filterOption) {
                    if (col.filterOption.type === 'dateRange') {
                        col.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                            return (
                                <DateFilter
                                    setSelectedKeys={setSelectedKeys}
                                    selectedKeys={selectedKeys}
                                    confirm={confirm}
                                    clearFilters={clearFilters}
                                />
                            )
                        };
                    } else if (col.filterOption.type === 'search') {
                        col.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                            return (
                                <FuzzFilter
                                    {...col}
                                    setSelectedKeys={setSelectedKeys}
                                    selectedKeys={selectedKeys}
                                    confirm={confirm}
                                    clearFilters={clearFilters}
                                />
                            )
                        };
                    } else if (col.filterOption.type === 'checkbox') {
                        col.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                            return (
                                <CheckFilter
                                    {...col}
                                    setSelectedKeys={setSelectedKeys}
                                    selectedKeys={selectedKeys}
                                    confirm={confirm}
                                    clearFilters={clearFilters}
                                />
                            )
                        };
                    }
                }
            });
            return cloneColumns || [];
        }

        /* 控制table header的resize功能 */
        handleResize = index => (e, { size }) => {
            this.setState(({ columns }) => {
                const nextColumns = [...columns];
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: size.width,
                };
                return { columns: nextColumns };
            });
        }

        /* table筛选属性的变化 */
        onChange = (pagination, filters, sorter) => {
            let { columns } = this.state;
            const { filters: currentFilters } = this.state;
            let isFilterChange = !_.isEqual(currentFilters, filters);
            if (isFilterChange) {
                this.setAllFlag(false);
            }
            _.forEach(filters, (value, key) => {
                if (value) {
                    let column = _.find(columns, { key });
                    this.columnModify(column, { key: 'filteredValue', value });
                }
            });
            _.forEach(columns, (column) => {
                if (sorter && sorter.field && column.key === sorter.field) {
                    this.columnModify(column, { key: 'sortOrder', value: sorter.order });
                } else if (column.sortOrder) {
                    this.columnModify(column, { key: 'sortOrder', value: false });
                }
            });

            this.setState({ filters, sorter: { field: sorter.field, order: sorter.order }, pagination }, () => {
                this.dataFetch({ isFilterChange });
            });
        }

        /* column状态变更 */
        columnModify = (column, dataPair) => {
            let { columns } = this.state;
            let idx = _.findIndex(columns, { dataIndex: column.dataIndex });
            if (dataPair && idx > -1) {
                let { key, value } = dataPair;
                column[key] = value;
                columns[idx] = column;
                this.setState({ columns });
            }
        }

        /* filter变动通知 */
        filterChangeNotice = () => {
            const { filterChange } = this.props;
            const { filters } = this.state;
            if (filterChange && typeof filterChange === 'function') {
                filterChange(filters);
            }
        }

        /* 清空所有筛选条件 */
        clearAll = () => {
            let { columns } = this.state;
            _.forEach(columns, col => {
                if (col.filteredValue !== undefined) {
                    col.filteredValue = null;
                }
            })
            this.setState({ columns });
        }

        /* 移除单独的筛选条件 */
        removeSingleFilter = (filterKeys) => {
            let { filters, pagination, sorter } = this.state;
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
        }

        /* 生成table */
        generateTable = (params) => {
            /* 当前不支持列冻结的功能 */
            const { columns, loading, pagination, dataSource, selectedRowKeys, selectAble, selectAbleLock, loadProps, hideColumnCodeList } = this.state;
            const { rowKey, scroll, rowSelection: rowSelectionOption = {}, tableId = 'tableId', onRow } = params;
            let wrapOnRow = (record) => {
                return {
                    onClick: (e) => {
                        if (rowSelectionOption.type && rowSelectionOption.type === 'radio') {
                            this.setState({ selectedRows: [record], selectedRowKeys: [record[rowKey]] });
                        }
                        if (typeof onRow === 'function') {
                            let instanceOnRow = onRow(record);
                            if (instanceOnRow && typeof instanceOnRow.onClick) {
                                instanceOnRow.onClick(e);
                            }
                        }
                    }
                }
            }
            const { onSelectionChange } = rowSelectionOption;
            this.rowKey = rowKey;
            let rowSelection = {
                ...rowSelectionOption,
                onChange: (selectedRowKeys, selectedRows) => {
                    /* 注意：onChange中的selectedRows，因为antd不支持跨页选取，所以selectedRows只包含当前页选中的数据 */
                    let currentSelectRows = [], currentSelectedRowKeys = [];
                    if (!rowSelectionOption.type || (rowSelectionOption.type && rowSelectionOption.type !== 'radio')) {
                        let unSelectedRows = _.differenceWith(dataSource, selectedRows, _.isEqual);
                        let unSelectedRowKeys = _.map(unSelectedRows, row => { return row[rowKey] });
                        currentSelectRows = _.cloneDeep(this.state.selectedRows);
                        if (selectedRows.length > 0) {
                            currentSelectRows = this.modifySelectRows({ currentSelectRows, type: 'update', rows: selectedRows, rowKeys: selectedRowKeys });
                        }
                        if (unSelectedRows.length > 0) {
                            currentSelectRows = this.modifySelectRows({ currentSelectRows, type: 'delete', rows: unSelectedRows, rowKeys: unSelectedRowKeys });
                        }
                        _.forEach(currentSelectRows, row => {
                            currentSelectedRowKeys.push(row[rowKey]);
                        });

                    } else {
                        currentSelectRows = selectedRows;
                        currentSelectedRowKeys = selectedRowKeys;
                    }
                    this.setState({ selectedRows: currentSelectRows, selectedRowKeys: currentSelectedRowKeys }, () => {
                        if (typeof onSelectionChange === 'function') {
                            onSelectionChange(currentSelectedRowKeys, currentSelectRows);
                        }
                    })
                },
                onSelect: (record, selected, selectedRows, nativeEvent) => {
                    this.onSelect(record, selected);
                },
                onSelectAll: (selected, selectedRows, changeRows) => {
                    this.onSelectAll(selected, selectedRows, changeRows);
                },
                selectedRowKeys
            };
            let visibleColumns = _.filter(columns, col => {
                return !hideColumnCodeList.includes(col.dataIndex);
            });
            let tableCls = classnames(`${prefix}-mktable-container`, {
                'empty': !dataSource || (dataSource && dataSource.length === 0),
                'enable-scroll-x': !(scroll && scroll.x),
                'fix-header': option.isFixHeader,
                'row-clickable': typeof onRow === 'function'
            });
            let tableScroll = _.assign({}, option.isFixHeader ? { y: true } : {});
            if (this.tableId && this.tableId !== tableId) {
                this.tableReset();
                this.tableId = tableId;
                return null;
            } else {
                this.tableId = tableId;
                return (
                    <div className={tableCls} ref={(ref) => { this.tableRef = ref; }} >
                        <FlexTable
                            {...params}
                            onRow={wrapOnRow}
                            key={tableId}
                            rowSelection={selectAble ? rowSelection : (selectAbleLock ? { selectedRowKeys } : null)}
                            components={this.components}
                            columns={visibleColumns}
                            scroll={tableScroll}
                            pagination={option.hidePagination ? false : pagination}
                            dataSource={dataSource}
                            onChange={this.onChange}
                            loading={{ ...loadProps, spinning: loading }}
                            locale={
                                {
                                    emptyText: () => (<Empty />)
                                }
                            }
                            OptionTable={RcTable}
                        />
                    </div>
                );
            }
        }

        /* 生成筛选条件 */
        generateFilter = (props = {}) => {
            const { filters, columns } = this.state;
            const { filterConfig } = props;
            return (
                <FilterStateBar
                    filters={filters}
                    filterConfig={filterConfig}
                    columns={columns}
                    removeFilter={this.removeSingleFilter}
                />
            )
        }

        /* 设置columns */
        setColumns = (originColumns) => {
            let columns = [], hideColumnCodeList = [];
            if (originColumns) {
                let initSorter = {}, initFilter = {};
                _.forEach(originColumns, (column) => {
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
                })
                columns = this.columnConvert(originColumns);
                if (option.resizeAble) {
                    columns = columns.map((col, index) => ({
                        ...col,
                        onHeaderCell: column => ({
                            width: column.width,
                            onResize: this.handleResize(index),
                        }),
                    }));
                }
                this.setState({ columns, sorter: initSorter, filters: initFilter, hideColumnCodeList });
            }
        }

        /* 设置table的加载状态 */
        setLoadStatus = (status) => {
            let loading = option.disableLoad ? false : status;
            this.setState({ loading });
        }

        /* 显示数据总数 */
        showTotal = () => {
            return (
                <span>总数19条</span>
            )
        }

        /* 更新数据源 */
        dataFetch = (params = {}) => {
            const { isFilterChange } = params;
            if (typeof this.fetchDataSourceFn !== 'function') return;
            let { filters, pagination, sorter, allFlag, canceledRowKeys } = this.state;
            let fnExe = this.fetchDataSourceFn(filters,
                { pageSize: pagination.pageSize, current: pagination.current ? pagination.current : 1 },
                { field: sorter.field, order: sorter.order === 'descend' ? 'desc' : 'asc' });
            let dataSource;
            if (fnExe && fnExe.then) {
                this.setLoadStatus(true);
                fnExe.then((resp) => {
                    this.setLoadStatus(false);
                    if (resp.code === 'success') {
                        dataSource = resp.data;
                        this.setState(({ pagination, selectedRows, selectedRowKeys }) => {
                            let _newSelectedRowKeys = _.cloneDeep(selectedRowKeys);
                            if (allFlag) {
                                if (dataSource.length > 0) {
                                    dataSource.forEach(item => {
                                        _newSelectedRowKeys.push(item[this.rowKey]);
                                    });
                                    _newSelectedRowKeys = Array.from(new Set(_newSelectedRowKeys));
                                    _newSelectedRowKeys = _.differenceBy(_newSelectedRowKeys, canceledRowKeys);
                                }
                            }
                            return {
                                dataSource,
                                selectedRows: isFilterChange ? [] : selectedRows,
                                selectedRowKeys: isFilterChange ? [] : _newSelectedRowKeys,
                                pagination: {
                                    ...pagination,
                                    showQuickJumper: pagination.pageSize < resp.total,
                                    total: resp.total
                                }
                            }
                        });
                    }
                }, () => {
                    this.setLoadStatus(false);
                })
            } else {
                dataSource = fnExe;
                if (dataSource && _.isArray(dataSource)) {
                    this.setState({ dataSource });
                }
            }
        }

        /* 设置table获取数据的函数 */
        setDataFetchFn = (fn) => {
            if (typeof fn === 'function') {
                this.fetchDataSourceFn = fn;
            }
        }

        /* 设置table的local state，抛给Wrapper组件使用 */
        setTableState() {

        }

        /* 设置table可选与否 */
        setSelectAble = (val) => {
            this.setState(({ selectAbleLock, selectedRowKeys, selectAble }) => {
                return {
                    selectAble: val ? true : false,
                    selectedRowKeys: selectAble !== val ? [] : selectedRowKeys,
                    selectAbleLock: selectAble !== val ? true : selectAbleLock
                }
            });
            /* selectedRowKeys在table组件中需要延后执行,antd的table组件当前在移除checkbox行选择的时候，是无法移除选中状态 */
            setTimeout(() => {
                this.setState({ selectAbleLock: false })
            }, 100)
        }

        // 设置全选
        setAllFlag = (isAll) => {
            let { dataSource } = this.state;
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
        }

        onSelect = (record, selected) => {
            let { allSelectedRows, allFlag, canceledRowKeys, canceledRows } = this.state;
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
            this.setState({ allSelectedRows, canceledRowKeys, canceledRows });
        }

        onSelectAll = (selected, selectedRows, changeRows) => {
            let { allSelectedRows, allFlag, canceledRowKeys, canceledRows } = this.state;
            if (selected) {
                // 如果是全选状态下
                if (allFlag) {
                    changeRows.forEach(item => {
                        canceledRows = this.removeFromCollection(item, canceledRows, this.rowKey, 'object');
                        canceledRowKeys = this.removeFromCollection(item, canceledRowKeys, this.rowKey, 'string');
                    })
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
            this.setState({ allSelectedRows, canceledRows, canceledRows });
        }

        removeFromCollection = (record, collection, rowKey, type) => {
            let index = -1;
            if (type === 'object') {
                index = _.findIndex(collection, { [`${rowKey}`]: record[rowKey] });
            } else if (type === 'string') {
                index = _.findIndex(collection, o => o === record[rowKey]);
            }
            if (index > -1) {
                collection.splice(index, 1);
            }
            return collection;
        }

        /* clear SelectRows */
        resetSelectRows = () => {
            this.setState({ selectedRows: [], selectedRowKeys: [] });
        }

        modifySelectRows = (operate) => {
            let { type, rows, currentSelectRows } = operate;
            let result = null;
            let _update = () => {
                let rebuildSelectRows = _.unionWith(currentSelectRows, rows, _.isEqual);
                result = rebuildSelectRows;
            }
            let _delete = () => {
                let rebuildSelectRows = _.differenceWith(currentSelectRows, rows, _.isEqual);
                result = rebuildSelectRows;
            }
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
        }

        customColumns = () => {
            const { columns, hideColumnCodeList } = this.state;
            let columnsTreeData = [], defaultChecked = [];
            _.forEach(columns, col => {
                if (!col.meanLess) {
                    columnsTreeData.push({ code: col.dataIndex, name: col.title });
                    if (!hideColumnCodeList.includes(col.dataIndex)) {
                        defaultChecked.push({ code: col.dataIndex, name: col.title });
                    }
                }
            });
            return (
                <PopSelect
                    options={columnsTreeData}
                    defaultValue={defaultChecked}
                    close={this.setHideColumnCodeList}
                >
                    <Button size='default' type='default'>字段显示</Button>
                </PopSelect>
            )
        }

        setHideColumnCodeList = (data) => {
            const { columns } = this.state;
            let hideColumnCodeList = [];
            _.forEach(columns, col => {
                let findIndex = _.findIndex(data, { code: col.dataIndex });
                if (findIndex === -1 && !col.meanLess) {
                    hideColumnCodeList.push(col.dataIndex);
                }
            })
            this.setState({ hideColumnCodeList });
        }

        widthMonitor = () => {
            /* minColumnWidth表格的最小宽度,用于解决长表格被挤压的情况 */
            const { columns } = this.state;
            let tableMinWidth = 0;
            let minColumnWidth = 100;
            if (columns.length >= 5) {
                _.forEach(columns, col => {
                    tableMinWidth += col.width && col.width > 0 ? col.width : minColumnWidth;
                });
            }
            return {
                tableMinWidth
            }
        }

        tableReset = () => {
            this.setState(() => {
                return this.originState;
            });
        }

        render() {
            return <WrapperComponent
                generateTable={this.generateTable}
                generateFilter={this.generateFilter}
                dataFetch={this.dataFetch}
                setColumns={this.setColumns}
                setSelectAble={this.setSelectAble}
                setDataFetchFn={this.setDataFetchFn}
                resetSelectRows={this.resetSelectRows}
                customColumns={this.customColumns}
                setAllFlag={this.setAllFlag}
                {...this.state}
                {...this.props}
            />
        }
    }
}

export default MkTable;