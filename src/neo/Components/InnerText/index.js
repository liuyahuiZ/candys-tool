import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import theme from '../Style/theme';

class InnerText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      value: this.props.value,
    };
    this.getValue=this.getValue.bind(this)
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

  render() {
    // const { value } = this.state;
    const { dataKey, className, content, fontSize, color, fontWeight, value } = this.props;
    let innerStyle = {
      color: color? color: theme.deepText,
      fontSize: `${fontSize}px` || '18px',
      fontWeight: fontWeight || '',
      lineHeight: `${fontSize*2}px` || '36px'
    }
    return (
      <span  className={`${className}`} style={innerStyle} data-keynum={dataKey}>
        {content||value}
      </span>
    );
  }
}

InnerText.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontSize: PropTypes.string,
  className: PropTypes.string,
  fontWeight: PropTypes.string,
  color: PropTypes.string,
};

InnerText.defaultProps = {
  text: '',
  fontSize: '100%',
  className: '',
  fontWeight: '',
  color: theme.deepText
};

export default InnerText;
