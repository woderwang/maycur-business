import "maycur-antd/lib/button/style/css";
import _Button from "maycur-antd/lib/button";
import "maycur-antd/lib/input/style/css";
import _Input from "maycur-antd/lib/input";
import React, { Component } from 'react';
import styles from './FuzzFilter.less';

class FuzzFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return React.createElement("div", {
      className: styles['pin']
    }, React.createElement(_Input, null), React.createElement(_Button, {
      type: "primary"
    }, "\u786E\u5B9A"));
  }

}

export default FuzzFilter;