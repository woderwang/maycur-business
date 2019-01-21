import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Button } from 'maycur-antd';
import utils from '../../utils/utils';
const prefix = utils.prefixCls;
class FilterStateBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.remove = this.remove.bind(this);
        this.convertFilter = this.convertFilter.bind(this);
    }
    remove(filter) {
        const { removeFilter } = this.props;
        if (typeof removeFilter === 'function') removeFilter(filter.key);
    }
    convertFilter(filters) {
        const { columns } = this.props;
        let newFilters = [];
        _.forEach(filters, (filterValue, key) => {
            let filterColumn = _.find(columns, { dataIndex: key });
            let filterLabel = filterColumn ? filterColumn.title : '无标题';
            let filterName = '';
            if (filterColumn && filterValue && !_.isEmpty(filterValue)) {
                let filterOption = filterColumn.filterOption;
                let filterPlainText = [];
                if (filterColumn.filters) {
                    _.forEach(filterColumn.filters, item => {
                        if (filterValue.includes(item.value)) {
                            filterPlainText.push(item.text);
                        }
                    });
                }
                if (filterOption) {
                    switch (filterOption.type) {
                        case 'dateRange':
                            filterName = moment(filterValue[0]).format('YYYY/MM/DD') + ' ~ ' + moment(filterValue[1]).format('YYYY/MM/DD');
                            break;
                        case 'checkbox':
                            filterName = this.limitLen(filterPlainText.join(','));
                            break;
                        case 'search':
                            filterName = filterPlainText.length > 0 ? filterPlainText[0] : filterValue;
                            break;
                        default:
                            filterName = filterValue;
                            break;
                    }
                } else if (filterColumn.filters && !filterColumn.filterMultiple) {
                    let filterData = _.find(filterColumn.filters, { value: filterValue[0] });
                    filterName = filterData ? filterData.text : filterName;
                }
            }
            if (filterName) newFilters.push({ key, label: filterLabel, value: filterValue, name: filterName });
        });
        return newFilters;
    }

    limitLen = (str, len = 12) => {
        let result = '';
        if (_.isString(str)) {
            if (str.length > len) {
                result = str.substr(0, len) + '...';
            } else {
                result = str;
            }
        } else {
            result = str;
        }
        return result;
    }

    /* 清空所有filter条件 */
    clear = (allFilters) => {
        const { removeFilter } = this.props;
        let filterKeys = [];
        _.forEach(allFilters, filter => {
            filterKeys.push(filter.key);
        });
        if (typeof removeFilter === 'function') removeFilter(filterKeys);
    }

    componentDidMount() {
        this.props.onRefFilterBar(this);
    }

    render() {
        const { filters, totalCount } = this.props;
        let theFilters = this.convertFilter(filters)
        let componentCls = `${prefix}-mktable-filterbar`;
        let node = null;
        node = (
            <div className={componentCls}>
                <span>筛选条件：</span>
                <div className={'flex-1'}>
                    <div className={`${componentCls}-filter-wrapper`}>
                        {theFilters.map((filter) => {
                            return (
                                <div className={'filter'} key={filter.key}>
                                    <span className={'filter-label'}>{filter.label}:</span>
                                    <span>{filter.name}</span>
                                    <span className={'filter-close fm fm-cross'} onClick={(e) => { this.remove(filter) }}></span>
                                </div>
                            )
                        })}
                        <div className={'filter-data-state'}>
                            共<span className={'filter-data-state_num'}>{totalCount || 0}</span>条记录
                        </div>
                        {theFilters.length > 0 ? (
                            <div className={'filter-clear'}>
                                <Button type="primary" size="small" onClick={() => { this.clear(theFilters) }}>重置</Button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
        //}
        return node;
    }
}
export default FilterStateBar;