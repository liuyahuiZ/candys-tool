import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import styles from './style';
import * as arrayUtils from '../../utils/array';

class Text extends Component {
  constructor(props) {
    super(props);
    let propValue = this.props.value;

    if (propValue === null || propValue === undefined) {
      propValue = '';
    }
    this.state = {
      count: propValue.length,
      value: propValue,
      focus: false
    };
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      nextProps
    });
  }
  getValue() {
    let value = this.state.value;
    if (this.props.type === 'number'
      && this.state.value !== ''
      && this.state.value !== undefined) {
       
      return this.props.oldValue;
    }
    if((typeof value)=='object'){
      return this.props.oldValue;
    }
    return this.state.value;
  }

  setValue(_value) {
    this.setState({ value: _value });
  }

  render() {
    // const { value } = this.state;
    const { dataKey, className, value } = this.props;
    return (
      <span  className={className} style={arrayUtils.merge([styles.containerStyle])} data-keynum={dataKey}>
        {value}
      </span>
    );
  }
}

Text.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  className: PropTypes.string
};

Text.defaultProps = {
  value: '',
  style: {},
  type: 'text',
  className: '',
};

export default Text;
