/*
 * @Author: woder.wang 
 * @desc: maycur-antd 业务包装
 * @Date: 2018-11-27 15:18:53 
 * @Last Modified by: woder.wang
 * @Last Modified time: 2018-12-20 19:20:10
 */
/* resizeable注意事项，在table中，需要至少有一列是非resizeable的，这一列是用来给调整宽度的时候，留给其他列的空间变动的，没有这样的列，交互会异常 */
/* scroll属性指定了fixed header触发的条件 */
import React, { Component } from 'react';
import { Table, Icon, Button } from 'maycur-antd';
import { Resizable } from 'react-resizable';
import _ from 'lodash';
import classnames from 'classnames';
import { DateFilter, FuzzFilter, CheckFilter } from './FilterDropDown';
import FilterStateBar from './FilterStateBar';
import PopSelect from './PopSelect/PopSelect';
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
    let defaultPageSizeOptions = [10, 20, 30, 40];
    if (option.pageSize) {
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
                    pageSize: option && option.pageSize ? option.pageSize : 10,
                    defaultPageSize: option && option.pageSize ? option.pageSize : 10,
                    showTotal: (total) => {
                        return <span>总数{total}条</span>
                    },
                    pageSizeOptions: defaultPageSizeOptions,
                    showSizeChanger: true,
                    total: 0,
                },
                selectedRows: [],
                selectedRowKeys: [],
                selectAble: false,
                selectAbleLock: false,
                sorter: {},
                hideColumnCodeList: [],
            };
            this.components = {
                header: {
                    cell: ResizeableTitle,
                },
            };
            this.fetchDataSourceFn = null;
            this.tableRef = null;
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
                                <FuzzFilter />
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

        /* 设置行属性，比如click mouseMove等 */
        onRow = (record, index) => {
            const { rowClick } = this.props;
            return {
                /* 行点击事件 */
                onClick: (e) => {
                    if (typeof rowClick === 'function') {
                        rowClick(record);
                    }
                }
            }
        }

        /* table筛选属性的变化 */
        onChange = (pagination, filters, sorter) => {
            let { columns } = this.state;
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
                this.dataFetch();
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
        removeSingleFilter = (filterKey) => {
            let { filters, pagination, sorter } = this.state;
            let newFilter = _.cloneDeep(filters);
            /* 不要直接对state中的属性做delete操作（会导致无法正常render组件），clone一个来处理*/
            newFilter[filterKey] = [];
            this.onChange(pagination, newFilter, sorter);
        }

        /* 生成table */
        generateTable = (params) => {
            const { columns, loading, pagination, dataSource, selectedRowKeys, selectAble, selectAbleLock, loadProps, hideColumnCodeList } = this.state;
            const { rowKey, scroll, rowSelection: rowSelectionOption } = params;
            const { onSelectionChange } = rowSelectionOption || {};
            this.rowKey = rowKey;
            let rowSelection = {
                ...rowSelectionOption,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRows, selectedRowKeys });
                    onSelectionChange && onSelectionChange(selectedRowKeys);
                },
                selectedRowKeys: selectedRowKeys,
            };
            let visibleColumns = _.filter(columns, col => {
                return !hideColumnCodeList.includes(col.dataIndex);
            });
            let tableCls = classnames(`${prefix}-mktable-container`, {
                'empty': !dataSource || (dataSource && dataSource.length === 0),
                'enable-scroll-x': !(scroll && scroll.x),
                'fix-header': option.isFixHeader
            })
            let tableScroll = _.assign(scroll, option.isFixHeader ? { y: true } : {});            
            return (
                <div className={tableCls} ref={(ref) => { this.tableRef = ref; }} >
                    <Table
                        {...params}
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
                                emptyText: () => (<div className={'data-emtpy'}>
                                    <span className={'fm fm-prompt'}></span>
                                    <span>暂无数据</span>
                                </div>)
                            }
                        }
                    />
                </div>
            );
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
        dataFetch = () => {
            if (typeof this.fetchDataSourceFn !== 'function') return;
            let { filters, pagination, sorter } = this.state;
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
                        this.setState(({ pagination, selectedRows }) => {
                            let rebuildSelectedRows = [], rebuildSelectedRowKeys = [];
                            if (selectedRows && selectedRows.length > 0) {
                                _.forEach(dataSource, rowData => {
                                    if (!this.rowKey) return;
                                    let findIndex = _.findIndex(selectedRows, { [`${this.rowKey}`]: rowData[this.rowKey] });
                                    if (findIndex > -1) {
                                        rebuildSelectedRows.push(selectedRows[findIndex]);
                                        rebuildSelectedRowKeys.push(selectedRows[findIndex][this.rowKey]);
                                    }
                                })
                            }
                            return {
                                dataSource,
                                selectedRows: rebuildSelectedRows,
                                selectedRowKeys: rebuildSelectedRowKeys,
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
            const { selectAble } = this.state;
            this.setState(() => {
                if (selectAble !== val) {
                    return {
                        selectedRowKeys: [],
                        selectAble: val ? true : false,
                        selectAbleLock: true,
                    }
                } else {
                    return {};
                }
            });
            /* selectedRowKeys在table组件中需要延后执行,antd的table组件当前在移除checkbox行选择的时候，是无法移除选中状态 */
            setTimeout(() => {
                this.setState({ selectAbleLock: false })
            }, 100)
        }

        /* clear SelectRows */
        resetSelectRows = () => {
            this.setState({ selectedRows: [], selectedRowKeys: [] });
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
                {...this.state}
                {...this.props}
            />
        }
    }
}

export default MkTable;