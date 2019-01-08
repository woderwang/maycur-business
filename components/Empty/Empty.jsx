import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import utils from '../utils/utils';
const prefix = utils.prefixCls;
class Empty extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { text, type, className, children } = this.props;
        return (
            <div className={classnames(`${prefix}-empty`, className)}>
                <div className={`${prefix}-empty-content`}>
                    <div className={`${prefix}-empty-circle`}>
                        {type && type === 'report' ? <span className="fm fm-allocation"></span> : <span className="fm fm-default-page"></span>}
                    </div>
                    <div className={`${prefix}-empty-text`}>{text}</div>
                    {children}
                </div>
            </div>
        )
    }
}

Empty.defaultProps = {
    text: '暂无相关数据'
};

Empty.propTypes = {
    text: PropTypes.string,
    type: PropTypes.string
};

export default Empty;