import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { noop } from '../../utils/base';
import styles from './style';
import theme from '../Style/theme';

class TableRowColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      child: this.props.children
    };
    this.onClick = this.onClick.bind(this);
    this.rendChildren = this.rendChildren.bind(this);
  }

  componentWillReceiveProps(nextProp){
    if(nextProp.noRender){
      this.setState({
        child: nextProp.children
      })
    }
  }
  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event, this.props.columnNumber);
    }
  }

  rendChildren(item) {
    this.setState({
      child: item
    });
  }

  render() {
    const { style, head, title } = this.props;
    const children = this.state.child;
    const handlers = {
      onClick: this.onClick,
    };

    if (head) {
      return (
        <th
          {...handlers}
          style={Object.assign({}, styles.tableRowColumn, styles.TableHeaderRowColumn, style)}
          title={title}
        >
          {children}
        </th>
      );
    }

    return (
      <td
        {...handlers}
        style={Object.assign({}, styles.tableRowColumn, {color: theme.contentText}, style)}
        title={title}
        colSpan = {this.props.colspan ? this.props.colspan : 1}
      >
        {children}
      </td>
    );
  }
}

TableRowColumn.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  columnNumber: PropTypes.number,
  style: PropTypes.shape({}),
  head: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string, PropTypes.number]),
  noRender: PropTypes.bool,
};

TableRowColumn.defaultProps = {
  onClick: noop,
  children: null,
  columnNumber: 0,
  style: {},
  title: '',
  head: false,
  noRender: true
};

export default TableRowColumn;
