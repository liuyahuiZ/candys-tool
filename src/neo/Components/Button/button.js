import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import styles from './buttonStyle';
import theme from '../Style/theme';
import Icon from '../Icon';
import * as arrayUtils from '../../utils/array';
import Modal from '../Modal';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      LoadSatus: this.props.LoadSatus || 'NULLLOAD' // LOADING ,  HASACCOUNT, NULLACCOUNT,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      LoadSatus: nextProps.LoadSatus,
      ...nextProps
    })
  }
  setStyle() {
    const { style, type, disabled, size, plain } = this.props;
    const { hovered } = this.state;

    let typeStyle = '';
    if (plain) {
      if (hovered) {
        typeStyle = { borderColor: theme[type], color: theme[type] };
      } else {
        typeStyle = { borderColor: theme.normal, color: theme.deepText };
      }
      if (disabled) {
        typeStyle = arrayUtils.merge([{ borderColor: theme.disable, color: theme.normal },
          styles.alldisabled]);
      }
    } else {
      if (type === 'link') {
        typeStyle = arrayUtils.merge([styles.link, { color: theme.primary }]);
        if (hovered) {
          typeStyle = arrayUtils.merge([typeStyle, styles.linkHover]);
        }
        if (disabled) {
          typeStyle = arrayUtils.merge([styles.link, { color: theme.disable }, styles.alldisabled]);
        }
      } else {
        typeStyle = { border: '0', backgroundColor: theme[type], color: theme.white };
        if (hovered) {
          typeStyle = arrayUtils.merge([typeStyle, styles.buttonHover]);
        }
        if (disabled) {
          typeStyle = arrayUtils.merge([{ border: '0', backgroundColor: theme.disable, color: theme.normal }, styles.alldisabled]);
        }
      }
    }
    const buttonStyle = arrayUtils.merge([styles.button, typeStyle, styles[size], style]);
    return buttonStyle;
  }

  handleClick(event) {
    const {LoadSatus} = this.state;
    const { modalCheckStatus, modalTitle, modalContent } = this.props;
    if(LoadSatus&&LoadSatus=='LOADING') return;
    
    if (!this.props.disabled) {
      if(modalCheckStatus) {
        this.modalCheck({title: modalTitle, content: modalContent}, ()=>{
          this.props.onClick(event);
        })
        return;
      }
      this.props.onClick(event);
    }
  }

  handleMouseEnter(event) {
    if (!this.props.disabled) {
      this.props.onMouseEnter(event);
      this.setState({ hovered: true });
    }
  }

  modalCheck(option, doAction){
    Modal.formConfirm({ title: option.title,
    content: option.content || '确定做该操作吗？',
    style: '',
    type: 'small',
    btnConStyle: 'right',
    btnSure: {
        text: '确认',
        type: 'primary',
        style: { 'height': '2rem', 'minWidth': '100px'}
    },
    btnCancle: {
        text: '取消',
        type: 'primary',
        plain: true,
        style: { 'height': '2rem', 'minWidth': '100px'}
    }
    },
    (id, callback) => { 
        callback(id);
        doAction();
    },
    (id, callback) => { callback(id); });
  }
  handleMouseLeave(event) {
    if (!this.props.disabled) {
      this.props.onMouseLeave(event);
      this.setState({ hovered: false });
    }
  }

  renderLoad(){
    const { LoadSatus } = this.state;
    switch(LoadSatus){
      case 'LOADING':
        return (<div className="loader-8"></div>);
      case 'LOADED':
        return (<Icon iconName="checkmark-circled " size={'120%'} iconColor={'#fff'} />);
      case 'NULLLOAD': 
        return (<div />);
      default:
        return <div />
    }
  }
  render() {
    const { text, hasIcon, iconName, plain, type } = this.props;
    // const { hovered } = this.state;
    const IconDom = hasIcon ? <Icon iconName={iconName} iconColor={plain ? theme[type] : '#fff'} size={'120%'} iconPadding={1} /> : '';
    const buttonStyle = this.setStyle();
    const loadDom = this.renderLoad()
    return (
      <button
        className={`transi`}
        onClick={this.handleClick}
        onTouchStart={this.handleMouseEnter}
        onTouchEnd={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={buttonStyle}
      >
      { loadDom }
      { IconDom } {text}
      </button>
    );
  }
}

Button.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  style: PropTypes.shape({}),
  type: PropTypes.string,
  size: PropTypes.string,
  plain: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  LoadSatus: PropTypes.string,
  hasIcon: PropTypes.bool,
  iconName: PropTypes.string,
  modalCheckStatus: PropTypes.bool,
};

Button.defaultProps = {
  style: {},
  type: 'primary',
  size: '',
  text: '按钮',
  LoadSatus: 'NULLLOAD',
  plain: false,
  disabled: false,
  hasIcon: false,
  modalCheckStatus: false,
  iconName: 'android-add-circle',
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {}
};

export default Button;
