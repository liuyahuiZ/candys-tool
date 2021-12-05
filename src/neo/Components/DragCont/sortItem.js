import React from 'react'
import { sortable } from './index'

class Item extends React.Component {
  render() {
    return (
      <div {...this.props}>
        {this.props.children}
      </div>
    )
  }
}

export default sortable(Item)