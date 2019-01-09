import React, { Component } from 'react';
import { Popover, Checkbox } from 'maycur-antd';
import utils from '../../utils/utils';
import _ from 'lodash';
const prefix = utils.prefixCls;
class PopContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: props.options || [],
            checkedValues: this.setDefaultValue()
        };
    }

    onChange = (checkedValues) => {
        this.setState({ checkedValues });
    }

    getValue = () => {
        const { options, checkedValues } = this.state;;
        let outValues = [];
        _.forEach(options, item => {
            if (checkedValues.includes(item.code)) {
                outValues.push(item);
            }
        })
        return outValues;
    }

    setDefaultValue = () => {
        const { defaultValue } = this.props;
        let convertValue = [];
        _.forEach(defaultValue, option => {
            convertValue.push(option.code);
        })
        return convertValue;
    }

    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        if (prevProps.visible !== visible && visible) {
            this.setState({ checkedValues: this.setDefaultValue() })
        }
    }

    render() {
        const { options, checkedValues } = this.state;
        return (
            <div className={`${prefix}-popcontent`}>
                <Checkbox.Group
                    value={checkedValues}
                    onChange={this.onChange}
                >
                    {options.map(optionItem => {
                        return (
                            <div key={optionItem.code} className={`${prefix}-option-child`}>
                                <Checkbox value={optionItem.code}>{optionItem.name}</Checkbox>
                            </div>
                        )
                    })}
                </Checkbox.Group>
            </div>
        )
    }
}

class PopSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    onVisibleChange = (visible) => {
        const { close } = this.props;
        this.setState({ visible });
        if (!visible && this.contentRef) {
            if (typeof close === 'function') {
                close(this.contentRef.getValue())
            }
        }
    }

    onValueChange = () => {

    }

    render() {
        const { defaultValue, children, options } = this.props;
        const { visible } = this.state;
        let popContent = <PopContent
            visible={visible}
            ref={(ref) => {
                this.contentRef = ref;
            }}
            options={options}
            defaultValue={defaultValue}
        />
        return (
            <Popover
                content={popContent}
                trigger="click"
                placement="bottomLeft"
                overlayClassName={`${prefix}-select-popover`}
                autoAdjustOverflow={true}
                onVisibleChange={this.onVisibleChange}
            >
                {children}
            </Popover>
        )
    }
}
export default PopSelect;