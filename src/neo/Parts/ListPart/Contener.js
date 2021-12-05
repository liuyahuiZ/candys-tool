import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style';

class Contener extends Component {
  render() {
    const {
      hoverable,
      center,
      style,
      children
    } = this.props;

    // @TODO: thead & tbody 分离
    const rowColumns = React.Children.map(children, (child, rownumber) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          rownumber,
          hoverable,
          center,
          style: Object.assign({}, child.props.style),
        });
      }

      return null;
    });

    return (
      <div style={Object.assign({}, styles.table, style)}>
        {rowColumns}
      </div>
    );
  }
}

Contener.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  hoverable:  PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  style: PropTypes.shape({}),
  center:  PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

Contener.defaultProps = {
  children: [],
  style: {},
  hoverable: false,
  center: false
};

export default Contener;
