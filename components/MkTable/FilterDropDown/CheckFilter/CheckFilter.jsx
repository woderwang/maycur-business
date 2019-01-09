/*
 * @Author: yuxuan
 * @Date: 2018-11-13 11:20:30
 * @LastEditors: yuxuan
 * @LastEditTime: 2018-11-22 16:42:26
 * @Description: 筛选表头单选和多选的 Dropdown
 */
import React, { Component } from 'react';
import { Checkbox, Radio, Input } from 'maycur-antd';
import _ from 'lodash';
import utils from '../../../utils/utils';
const prefix = utils.prefixCls;
const Search = Input.Search;
class CheckFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: props.filters,
            searchKey: null
        }
    }

    componentDidUpdate(preProps) {
        if (preProps.filters.length !== this.props.filters.length) {
            this.setState({ filters: this.props.filters})
        }
    }

    onChange = (value) => {
        const { setSelectedKeys } = this.props;
        setSelectedKeys(value);
    }

    onSearch = (value) => {
        const { filters } = this.props;
        let filtered;
        if (value) {
            filtered = _.filter(filters, function (o) {
                return _.includes(o.text, value);
            })
        } else {
            filtered = filters;
        }
        this.setState({ filters: filtered })
    }

    onChangeSearchKey = (e) => {
        this.setState({ searchKey: e.target.value })
    }

    selectAll = (e) => {
        const { setSelectedKeys } = this.props;
        let { filters } = this.state;
        if (e.target.checked) {
            let all = _.map(filters, 'value');
            setSelectedKeys(all);
        } else {
            setSelectedKeys([]);
        }
    }

    onConfirm = () => {
        const {confirm} = this.props;
        confirm();
    }

    reset = () => {
        const { setSelectedKeys } = this.props;
        setSelectedKeys([]);
        this.setState({
            searchKey: null
        }, () => {
            this.onSearch(this.state.searchKey);
        })
    }

    render() {
        const { placeholder, selectedKeys, filterMultiple } = this.props;
        let { filters, searchKey } = this.state;

        return (
            <div className={`${prefix}-check-filter`}>
                <div className={'pin-search'}>
                    <Search
                        value={searchKey}
                        onSearch={this.onSearch} 
                        onChange={this.onChangeSearchKey}
                        placeholder={placeholder}
                    />
                </div>

                {
                    filterMultiple ? 
                        <div className={`${prefix}-check-filter_pin-box`}>                            
                            <Checkbox.Group onChange={this.onChange} value={selectedKeys}>
                                {
                                    filters && filters.length > 0 ? 
                                        filters.map((item, index) => (
                                            <Checkbox 
                                                value={item.value}
                                                className={'pin-item'} 
                                                key={index}
                                            >
                                                {item.text}
                                            </Checkbox>
                                        )) : 
                                        null
                                }
                            </Checkbox.Group>
                        </div> :
                        <div className={'pin-radio-box'}>
                            <Radio.Group onChange={(e) => this.onChange(e.target.value)} value={selectedKeys}>
                                {
                                    filters && filters.length > 0 ? 
                                        filters.map((item, index) => (
                                            <Radio 
                                                className={'pin-item'} 
                                                value={item.value}
                                                key={index}
                                            >
                                                {item.text}
                                            </Radio>
                                        )) : 
                                        null
                                }
                            </Radio.Group>
                        </div>
                }
                
                <div className={'pin-footer'}>
                    <div
                        onClick={this.onConfirm}
                        className={'footer-item'}
                    >
                        确定
                    </div>
                    <div
                        onClick={this.reset}
                        className={'footer-item'}
                    >
                        重置
                    </div>
                </div>
            </div>
        )
    }
}

CheckFilter.defaultProps = {
    filters: [],
    filterMultiple: false
}

export default CheckFilter;