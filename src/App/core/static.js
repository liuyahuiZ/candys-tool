import React, { Component } from 'react';

export default class Static extends Component {

    shouldComponentUpdate(nextProps) {
      return !!nextProps.shouldUpdate;
    }
  
    render() {
      var child = this.props.children;
      if (child === null || child === false) {
        return null;
      }
      return React.Children.only(child);
    }
  
  }
