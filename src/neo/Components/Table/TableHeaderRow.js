import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style';
import theme from '../Style/theme';

class TableHeader extends Component {
  render() {
    const { style, children } = this.props;

    const rowColumns = React.Children.map(children, (child, columnNumber) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          columnNumber,
          key: `thead-${columnNumber}`,
          style: Object.assign({}, child.props.style),
          head: true
        });
      }
      return null;
    });

    return (
      <tr
        style={Object.assign({}, styles.tableRow, styles.TableHeader, {color: theme.deepText}, style)}
      >
        {rowColumns}
      </tr>
    );
  }
}

TableHeader.propTypes = {
  style: PropTypes.shape({}),
  children: PropTypes.node.isRequired,
};

TableHeader.defaultProps = {
  style: null,
};

export default TableHeader;
