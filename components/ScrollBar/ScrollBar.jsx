import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
class ScrollBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <PerfectScrollbar {...this.props}>
                {this.props.children}
            </PerfectScrollbar>
        )
    }
}
export default ScrollBar;