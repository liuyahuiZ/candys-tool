import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import styles from './style';
import Icon from '../Icon';
import * as arrayUtils from '../../utils/array';

class Input extends Component {
  constructor(props) {
    super(props);
    let propValue = this.props.value;

    if (propValue === null || propValue === undefined) {
      propValue = '';
    }
    this.state = {
      count: propValue.length,
      value: propValue,
      focus: false,
      disabled: this.props.disabled,
      maxLength: (propValue.maxLength=='' ? 100 : propValue.maxLength) || 100
    };
    this.handleChange = this.handleChange.bind(this);
    this.getValue = this.getValue.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.setValue = this.setValue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setDisable = this.setDisable.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      disabled: nextProps.disabled,
      maxLength: nextProps.maxLength=='' ? 100 : nextProps.maxLength
    });
  }
  getValue() {
    if (this.props.type === 'number'
      && this.state.value !== ''
      && this.state.value !== undefined) {
      return +this.state.value;
    }
    return this.state.value;
  }

  setValue(_value) {
    this.setState({ value: _value });
  }
  
  setDisable(disabled){
    this.setState({ disabled: disabled });
  }

  handleFocus() {
    this.setState({ focus: true });
    if (!this.props.disabled) {
      this.props.onFocus(event);
    }
  }
  handleClick() {
    if (!this.props.disabled) {
      this.props.onClick(event);
    }
  }

  handleBlur() {
    this.setState({ focus: false });
    if (!this.props.disabled) {
      this.props.onBlur(event);
    }
  }

  computeStyle() {
    const { maxLength } = this.props;
    return maxLength;
  }


  handleChange(event) {
    const { type, max, min, onChange } = this.props;
    const { disabled } = this.state;
    const { maxLength } = this.state;
    const value = event.target.value;

    if (!disabled) {
      if (value !== '') {
        // if (valid && !isValid(value, valid)) {
        //   return;
        // }
        if (type === 'number' && ( Number(max)  < Number(value) || Number(min) > Number(value))) {
          return;
        }
      }
      const length = value.toString().length;
      if (length <= maxLength) {
        this.setState({
          count: length,
          value
        },()=>{
          onChange(event, this, value);
        });
      }
    }
  }


  render() {
    const { placeholder, maxLength, maxLengthShow,
      style, typeStyle, onKeyUp, icon, type, innerStyle, hasBorder, autoComplete } = this.props;
    const { count, value, focus, disabled } = this.state;
    let padWidth = 0;
    if (maxLengthShow) {
      padWidth = (maxLength.toFixed(0).length * 20) + 10;
    }
    let containerStyle = Object.assign({}, styles.containerStyle, styles[typeStyle], typeof style =='string'? JSON.parse(style): style);
    if(hasBorder){
      containerStyle = Object.assign({}, containerStyle, styles.hasBorder)
    }
    let inputStyle = Object.assign({}, styles.inputStyle, disabled && styles.disabled);
    const padStyle = Object.assign({}, styles.padStyle, {
      width: padWidth
    });
    inputStyle = focus ? arrayUtils.merge([inputStyle,
      { outline: 0, boxShadow: 0, border: 0 }]) : inputStyle;
    const maxLengthSpan = this.props.maxLengthShow ? (<span style={padStyle}>
      {count}/{maxLength}
    </span>) : '';
    const preIcon = icon ? (<Icon iconName={icon.iconName} size={icon.size} color={icon.color} style={arrayUtils.merge([styles.iconStyle, icon.style ])} />) : '';
    const hasIcon = icon ? styles.hasIcon : '';
    return (
      <div style={containerStyle} className={`${hasBorder ? 'has-border': ''}`}>
        {preIcon}
        <input
          className="normalinput"
          placeholder={placeholder||'请输入'}
          onChange={this.handleChange}
          style={arrayUtils.merge([inputStyle, hasIcon, innerStyle])}
          value={value}
          id={this.props.id ? this.props.id : null}
          disabled={disabled}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onClick={this.handleClick}
          onKeyUp={onKeyUp}
          autoComplete={autoComplete}
          type={type}
        />
        {maxLengthSpan}
      </div>
    );
  }
}

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number,
    PropTypes.bool, PropTypes.shape({})]),
  type: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.number,
  min: PropTypes.number,
  disabled: PropTypes.bool,
  valid: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({}), PropTypes.func]),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
  maxLengthShow: PropTypes.bool,
  typeStyle: PropTypes.string,
  hasBorder: PropTypes.bool,
  icon: PropTypes.shape({}),
  innerStyle: PropTypes.shape({}),
  autoComplete: PropTypes.string,
};

Input.defaultProps = {
  value: '',
  style: {},
  innerStyle: {},
  type: 'text',
  max: Infinity,
  min: -Infinity,
  placeholder: '请输入',
  maxLength: 100,
  maxLengthShow: false,
  valid: '',
  disabled: false,
  typeStyle: '',
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  onKeyUp: () => {},
  icon: null,
  hasBorder: false,
  onClick: () => {},
  autoComplete: 'off',
};

export default Input;
