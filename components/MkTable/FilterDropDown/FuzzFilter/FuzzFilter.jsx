import React, { Component } from 'react';
import { Input } from 'maycur-antd';
import utils from '../../../utils/utils';
const prefix = utils.prefixCls;
const Search = Input.Search;

class FuzzFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: []
        };
    }

    onSearch = (value) => {
        const { setSelectedKeys, confirm } = this.props;
        if (typeof this.props.filtersSync === 'function') {
            this.props.filtersSync(value).then(data => {
                this.setState({ result: data });
                this.props.setFilters(data);
            })
        } else {
            setSelectedKeys(value); 
            confirm();
        }
    }

    onClick = (item) => {
        const { setSelectedKeys, confirm } = this.props;
        setSelectedKeys(item.code);
        confirm();
    }

    render() {
        const { placeholder } = this.props;
        let { result } = this.state;

        return (
            <div className={`${prefix}-fuzz-filter`}>
                <Search
                    placeholder={placeholder}
                    onSearch={this.onSearch}
                />
                <ul className={'search-list'}>
                {
                    result && result.length > 0 ? 
                        result.map((item, index) => {
                            return (
                                <li 
                                    onClick={this.onClick.bind(this, item)} 
                                    key={index}
                                >
                                    {item.name}
                                </li>
                            )
                        }) :
                        null
                }
                </ul>
                {/* <Button type="primary">确定</Button> */}
            </div>
        )
    }
}
export default FuzzFilter;