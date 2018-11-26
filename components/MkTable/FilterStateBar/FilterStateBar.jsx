import React, { Component } from 'react';
import styles from './style.less';
import _ from 'lodash';
import moment from 'moment';
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
        const { filterConfig, columns } = this.props;
        let newFilters = [];
        _.forEach(filters, (filterValue, key) => {
            // let filterLabel = filterConfig && filterConfig[key] ? filterConfig[key].label : '无标题';
            let filterColumn = _.find(columns, { dataIndex: key });
            let filterLabel = filterColumn ? filterColumn.title : '无标题';
            let filterName = '';
            if (filterColumn && filterValue && !_.isEmpty(filterValue)) {
                let filterOption = filterColumn.filterOption;
                if (filterOption) {
                    switch (filterOption.type) {
                        case 'dateRange':
                            filterName = moment(filterValue[0]).format('YYYY/MM/DD') + ' ~ ' + moment(filterValue[1]).format('YYYY/MM/DD');
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
    render() {
        const { filters } = this.props;
        let theFilters = this.convertFilter(filters)
        let node = null;
        if (theFilters && theFilters.length > 0) {
            node = (
                <div className={styles['bar']}>
                    <span className={styles['label']}>筛选条件3：</span>
                    <div className={'flex-1'}>
                        <div className={styles['filter-wrapper']}>
                            {theFilters.map((filter) => {
                                return (
                                    <div className={styles['filter']} key={filter.key}>
                                        <span className={styles['label']}>{filter.label}:</span>
                                        <span>{filter.name}</span>
                                        <span className={`${styles['close']} fm fm-cross`} onClick={(e) => { this.remove(filter) }}></span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            );
        }
        return node;
    }
}
export default FilterStateBar;