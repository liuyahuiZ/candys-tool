import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import '../Style/icon.scss';
import styles from './style';

class Icon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
  }

  handleClick(event) {
    this.props.onClick(event);
  }

  render() {
    const { iconName, size, iconColor, iconPadding, style, className, dataKey } = this.props;
    const fontSize = { fontSize: size };
    const color = { color: iconColor };
    const padding = iconPadding ? { padding: iconPadding } : styles.iconPadding;
    return (
      <i
        className={`ion-${iconName} ${className}`}
        style={arrayUtils.merge([fontSize, color, padding, style])}
        data-keynum={dataKey}
        onClick={this.handleClick}
      />
    );
  }
}

Icon.propTypes = {
  iconName: PropTypes.string,
  size: PropTypes.string,
  iconColor: PropTypes.string,
  iconPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape(),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Icon.defaultProps = {
  iconName: 'happy-outline',
  size: '100%',
  iconColor: '#666',
  iconPadding: '',
  style: {},
  onClick: () => {},
  className: ''
};


export default Icon;
