import React, { Component } from "react";
import PropTypes from 'prop-types';

const colors = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];
const prefix = 'mkbs';
function hashCode(str) {
    str = str || '';
    if (Array.prototype.reduce) {
        return str.split('').reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0);
    }
    var hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            abbrName: '',
            color: ''
        };
        this.getAbbrName = this.getAbbrName.bind(this);
        this.updateState = this.updateState.bind(this);
        this.onClickAvatar = this.onClickAvatar.bind(this);
    }

    componentDidMount() {
        const { user } = this.props;
        this.updateState(user);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        this.updateState(user);
    }

    updateState(user) {
        if (user) {
            let abbrName = this.getAbbrName(user.userName);
            var idx = Math.abs(hashCode(user.userName)) % colors.length;
            this.setState({ abbrName, color: colors[idx] });
        }
    }

    onClickAvatar(e) {
        e.stopPropagation();
        const { user, onClick } = this.props;
        if (typeof onClick === 'function') {
            onClick();
        }
    }

    getAbbrName(name) {
        if (!name) return '';
        let chineseReg = new RegExp('[\u4E00-\uFA29\uE7C7-\uE7F3]+', 'g');
        let wordReg = new RegExp('[A-Za-z]{1,4}');
        let result = '';
        let m = (name || '').match(chineseReg);
        if (m && m.length !== 0) {
            result = m[0];
            if (result && result.length > 2) {
                result = result.substring(result.length - 2, result.length);
            }
        }
        if (!result) {
            m = (name || '').match(wordReg);
            if (m && m.length !== 0) {
                result = m[0];
            }
        }
        if (!result) {
            result = name.substr(0, 1);
        }
        return result;
    }

    render() {
        const { customStyle, avatarUrl } = this.props;
        return (
            <React.Fragment>
                {avatarUrl ?
                    <img className={`${prefix}-avatar-img`} src={avatarUrl} alt="头像"></img> :
                    <span onClick={this.onClickAvatar} className={`${prefix}-avatar ${this.state.color}`} style={{ ...customStyle }}>
                        <span>{this.state.abbrName}</span>
                    </span>}
            </React.Fragment>

        )
    }
}

Avatar.propTypes = {
    /** 个人用户信息  */
    user: PropTypes.object,
    /** 自定义组件style  */
    customStyle: PropTypes.object
}
export default Avatar;
