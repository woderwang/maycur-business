
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
const prefix = 'mkbs';


class MkDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    appendDom(node) {
        const { left, top, test } = this.props;

        const _left = node.getBoundingClientRect().left - 12 + left;
        const _top = node.getBoundingClientRect().top + top;
        const cssText = `left:${_left}px;top:${_top}px;`;
        const popup = this.popup = document.createElement("div");
        popup.className = `${prefix}-dropdown ${test ? `${prefix}-dropdown-test` : null}`;
        popup.style.cssText = cssText;

        document.body.appendChild(popup);
        ReactDom.render(this.props.overlay, popup);
    }

    componentDidMount() {
        const node = findDOMNode(this);
        const { trigger, visible, test, disabled } = this.props;

        if (disabled) {
            return;
        }

        if (visible || test) {
            this.appendDom(node);
            return;
        }

        if (trigger.includes('hover')) {
            node.onmouseenter = () => {
                this.appendDom(node)
            }
        }

        if (trigger.includes('click')) {
            node.onclick = (e) => {
                e.stopPropagation()
                this.appendDom(node)
            };
        }

        document.addEventListener('mousemove', this.remove)

    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.remove)
    }

    remove = (e) => {
        const node = findDOMNode(this);

        const isParent = (node, p) => {
            if (!node.parentNode) {
                return false;
            }

            if (node === p || node.parentNode === p) {
                return true;
            } else {
                return isParent(node.parentNode, p)
            }
        }

        if (!this.popup || isParent(e.target, node) || isParent(e.target, this.popup)) {
            return
        }

        if (this.popup.parentNode) {
            ReactDom.unmountComponentAtNode(this.popup);
            this.popup.parentNode.removeChild(this.popup);
        }
    }

    render() {
        let { children, disabled } = this.props;
        children = React.Children.map(children, (o, i) => {
            const { className } = o.props;
            return React.cloneElement(o, { key: i, className: `${className} ${disabled ? `${prefix}-disabled` : null}` })
        })

        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        )
    }
}

MkDropdown.defaultProps = {
    trigger: ['hover'],
    top: 0,
    left: 0
};

MkDropdown.propTypes = {
    trigger: PropTypes.array,
    disabled: PropTypes.bool,
    visible: PropTypes.bool,
    test: PropTypes.bool,
    top: PropTypes.number,
    left: PropTypes.number
};

export default MkDropdown;