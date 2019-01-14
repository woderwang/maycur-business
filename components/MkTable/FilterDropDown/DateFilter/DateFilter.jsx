import React, { Component } from 'react';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import _ from 'lodash';
import moment from 'moment';
import utils from '../../../utils/utils';
const prefix = utils.prefixCls;
class DateFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: props.selectedKeys || []
        };
    }

    dateChange = (nextValue) => {
        if (moment(nextValue[0]).isSame(nextValue[1])) {
            nextValue[0] = moment(nextValue[0]).startOf('day');
            nextValue[1] = moment(nextValue[1]).endOf('day')
        }
        const { setSelectedKeys } = this.props;
        this.setState({ selectedValue: nextValue }, () => {
            setSelectedKeys(nextValue);
        });
    }


    componentDidUpdate(prevProps) {
        const { selectedKeys: prevSelectedKeys } = prevProps;
        const { selectedKeys } = this.props;
        const { selectedValue } = this.state;
        if (!_.isEqual(prevSelectedKeys, selectedKeys) && !_.isEmpty(selectedValue, selectedKeys)) {
            this.setState({ selectedValue: selectedKeys });
        }
    }

    render() {
        const { confirm } = this.props;
        const { selectedValue } = this.state;
        return (
            <div className={`${prefix}-date-filter`}>
                <RangeCalendar
                    locale={zhCN}
                    selectedValue={selectedValue}
                    dateInputPlaceholder={['开始', '结束']}
                    showToday={true}
                    onChange={(data) => { this.dateChange(data) }}
                    showOk={true}
                    onOk={() => { confirm() }}
                />
            </div>
        )
    }
}
export default DateFilter;