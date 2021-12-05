import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import styles from './style';
import Icon from '../Icon';
import theme from '../Style/theme';

class Box extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      text: '',
      checkStatus: this.props.checkStatus
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      checkStatus: nextProps.checkStatus
    });
  }
  change() {
    if (!this.props.disabled) {
      this.props.change(this.props);
    }
  }

  render() {
    const { disabled, style, text, checkStatus } = this.props;

    const labelStyle = Object.assign({}, styles.label);
    const checkedStyle = checkStatus === 'checked' ? {border: `1px solid ${theme.primary}`,backgroundColor: theme.primary, color: theme.white} : '';
    const disabledStyle = disabled ? styles.disabled : '';
    return (
      <div
        style={arrayUtils.merge([labelStyle, disabledStyle, style])}
        onClick={() => {
          this.change();
        }}
      >
        <span style={arrayUtils.merge([styles.radioInner, checkedStyle])} >
          <Icon iconName={'checkmark'} size={'90%'} iconColor={''} iconPadding={'0'} />
        </span>
        <span style={styles.text} >
          {text}
        </span>
      </div>
    );
  }
}

Box.propTypes = {
  disabled: PropTypes.bool,
  style: PropTypes.shape({}),
  change: PropTypes.func,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  checkStatus: PropTypes.string,
};

Box.defaultProps = {
  options: [],
  disabled: false,
  style: {},
  type: 'radio',
  text: '',
  checkStatus: 'unchecked',
  change: () => {}
};

export default Box;
