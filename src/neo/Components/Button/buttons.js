import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import styles from './buttonStyle';
import theme from '../Style/theme';
import Icon from '../Icon';
import * as arrayUtils from '../../utils/array';

class Buttons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
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
    } else  {
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
    if (!this.props.disabled) {
      this.props.onClick(event);
    }
  }

  handleMouseEnter(event) {
    if (!this.props.disabled) {
      this.props.onMouseEnter(event);
      this.setState({ hovered: true });
    }
  }

  handleMouseLeave(event) {
    if (!this.props.disabled) {
      this.props.onMouseLeave(event);
      this.setState({ hovered: false });
    }
  }

  render() {
    const { text, hasIcon, iconName, type, plain } = this.props;
    const IconDom = hasIcon ? <Icon iconName={iconName} iconColor={plain ? theme[type] : '#fff'} size={'120%'} iconPadding={1} /> : ''
    const buttonStyle = this.setStyle();
    return (
      <button
        className={'transi'}
        onClick={this.handleClick}
        onTouchStart={this.handleMouseEnter}
        onTouchEnd={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={buttonStyle}
      >
        {IconDom} {text}
      </button>
    );
  }
}

Buttons.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  style: PropTypes.shape({}),
  type: PropTypes.string,
  size: PropTypes.string,
  plain: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  hasIcon: PropTypes.bool,
  iconName: PropTypes.string,
};

Buttons.defaultProps = {
  style: {},
  type: 'primary',
  size: 'small',
  text: '按钮',
  plain: false,
  disabled: false,
  hasIcon: false,
  iconName: '',
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {}
};

export default Buttons;
