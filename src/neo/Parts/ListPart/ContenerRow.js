import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { noop } from '../../utils/base';
import styles from './style';

class ContenerRow extends Component {
  constructor() {
    super();

    this.onRowClick = this.onRowClick.bind(this);
    this.onRowHover = this.onRowHover.bind(this);
    this.onRowHoverExit = this.onRowHoverExit.bind(this);

    this.state = {
      hovered: false
    };
  }
  onRowClick(event) {
    this.props.onRowClick(event, this.props.rownumber);
  }

  onRowHover(event) {
    const { hoverable, onRowHover, rownumber } = this.props;
    if (hoverable) {
      onRowHover(event, rownumber);
      this.setState({
        hovered: true
      });
    }
  }

  onRowHoverExit(event) {
    const { hoverable, onRowHoverExit, rownumber } = this.props;
    if (hoverable) {
      onRowHoverExit(event, rownumber);
      this.setState({
        hovered: false
      });
    }
  }

  getStyle() {
    const res = {};
    const { center, style } = this.props;
    const { hovered } = this.state;
    Object.assign(res, styles.tableRow);

    if (hovered) {
      Object.assign(res, styles.tableRowHover);
    }
    if (center) {
      Object.assign(res, styles.tableRowCenter);
    }

    Object.assign(res, style);

    return res;
  }

  render() {
    const { children, rownumber } = this.props;

    const rowColumns = React.Children.map(children, (child, columnNumber) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          columnNumber,
          key: `${rownumber}-${columnNumber}`,
          style: Object.assign({}, child.props.style),
        });
      }
      return null;
    });

    const handlers = {
      onClick: this.onRowClick,
      onMouseOver: this.onRowHover,
      onMouseOut: this.onRowHoverExit,
    };

    return (
      <div
        style={this.getStyle()}
        {...handlers}
      >
        {rowColumns}
      </div>
    );
  }
}

ContenerRow.propTypes = {
  children: PropTypes.node.isRequired,
  hoverable: PropTypes.bool,
  center: PropTypes.bool,
  style: PropTypes.shape({}),
  rownumber: PropTypes.number,
  onRowClick: PropTypes.func,
  onRowHover: PropTypes.func,
  onRowHoverExit: PropTypes.func,
};

ContenerRow.defaultProps = {
  onRowClick: noop,
  onRowHover: noop,
  onRowHoverExit: noop,
  hoverable: true,
  center: false,
  style: null,
};

export default ContenerRow;
