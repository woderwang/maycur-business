import React, { Component } from 'react';
import { Popover } from 'maycur-antd';
import utils from '../utils/utils';
let prefixCls = utils.prefixCls;
class PageHeaderBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    back = () => {
        window.history.go(-1);
    }

    close = () => {
        const { closeCallBack } = this.props;
        if (typeof closeCallBack === 'function') {
            closeCallBack();
        }
    }

    render() {
        const { title, pageDescription, witGoBack, withClose } = this.props;
        let basicCls = `${prefixCls}-pageheader-bar`;
        return (
            <div className={basicCls}>
                {witGoBack ?
                    <span
                        className={`${basicCls}_back mkbs-fm mkbs-fm-arrow-left`}
                        onClick={this.back}
                    ></span> : null}
                <span className={`${basicCls}_title`}>
                    {title}
                </span>
                <div className={'mkbs-flex-1'}></div>
                {pageDescription ?
                    (<Popover
                        autoAdjustOverflow
                        content={pageDescription}
                        placement="bottomRight"
                    >
                        <div className={`${basicCls}_help`}>
                            <span></span>
                            使用说明
                        </div>
                    </Popover>) : null}
                {withClose ?
                    <span
                        className={`${basicCls}_close mkbs-fm mkbs-fm-close`}
                        onClick={this.close}
                    ></span> : null
                }

            </div>
        )
    }
}
PageHeaderBar.defaultProps = {
    witGoBack: true,
    withClose: false
}
export default PageHeaderBar;