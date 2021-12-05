import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Style/comstyle.scss';
import * as arrayUtils from '../../utils/array';

class Col extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      defaultAllWidth: 24
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
  }
  handleClick(event) {
    this.props.onClick(event);
  }
  render() {
    const { flex, style, span, colgutter, className, dataKey, idx, title, id} = this.props;
    const flexLength = flex ? `flex-${flex}` : '';
    const widthStyle = span ? { width: `${(span / this.state.defaultAllWidth) * 100}%` } : '';
    const gutterStyle = colgutter ? { padding: `0 ${colgutter / 2}px` } : '';
    const ClassName = `col ${flexLength} ${className}`;
    return (
      <div id={id} className={ClassName} style={arrayUtils.merge([widthStyle, gutterStyle, style])} data-keynum={dataKey} data-num={idx} onClick={this.handleClick} title={title}>
        {this.props.children}
      </div>
    );
  }
}

Col.propTypes = {
  children: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.func,
    PropTypes.node, PropTypes.element]),
  flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape({}),
  span: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colgutter: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

Col.defaultProps = {
  children: [],
  flex: '',
  title: '',
  style: {},
  span: 24,
  colgutter: 0,
  className: '',
  onClick: () => {},
};


export default Col;
