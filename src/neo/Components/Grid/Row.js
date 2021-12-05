import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Style/comstyle.scss';
import * as arrayUtils from '../../utils/array';

class Row extends Component {
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
    const { direction, justify, align, style, gutter, className, content, dataKey, id } = this.props;
    const styleDirection = direction ? `flex-direction-${direction}` : '';
    const styleJustyfy = justify ? `flex-justify-${justify}` : '';
    const styleAlign = align ? `flex-items-${align}` : '';
    const styleContent = content ? `flex-content-${content}` : '';
    const ClassName = `row flex-wrap ${styleDirection} ${styleJustyfy} ${styleAlign} ${styleContent} ${className}`;
    const gutterStyle = gutter ? { margin: `0 ${0 - (gutter / 2)}px` } : '';
    const Children = this.props.children;
    // let child = '';
    // if (Children.length > 1) {
    //   child = Children.map((val, idx) => {
    //     const key = `${idx}-child-${dataKey}`;
    //     const dom = React.cloneElement(val, { colgutter: gutter, key });
    //     return dom;
    //   });
    // } else {
    //   child = React.cloneElement(Children, { colgutter: gutter });
    // }
    return (
      <div className={ClassName} id={id} style={arrayUtils.merge([style, gutterStyle])} onClick={this.handleClick} data-keynum={dataKey}>
        {Children}
      </div>
    );
  }
}

Row.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({}),
    PropTypes.array, PropTypes.func]),
  direction:PropTypes.string,
  justify: PropTypes.string,
  align: PropTypes.string,
  style: PropTypes.shape({}),
  gutter: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  content: PropTypes.string,
};

Row.defaultProps = {
  children: [],
  direction:'',
  justify: '',
  align: '',
  style: {},
  gutter: 0,
  className: '',
  content: '',
  onClick: () => {},
};


export default Row;
