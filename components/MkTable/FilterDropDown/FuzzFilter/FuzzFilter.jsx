import React, { Component } from 'react';
import styles from './FuzzFilter.less';
import { Input, Button } from 'mkui';
class FuzzFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className={styles['pin']}>
                <Input />
                <Button type="primary">确定</Button>
            </div>
        )
    }
}
export default FuzzFilter;