import React, { Component } from 'react';
import { Input, Button } from 'mkui';
let prefix = 'mkbs';
class FuzzFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className={`${prefix}-fuzz-filter`}>
                <Input />
                <Button type="primary">确定</Button>
            </div>
        )
    }
}
export default FuzzFilter;