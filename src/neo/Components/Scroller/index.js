import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addClass, removeClass } from '../../utils/dom';

class Scroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }
  componentDidMount(){
    const container = this.$$container;
    container.addEventListener('mouseover', (e)=>{
        // console.log(e);
        removeClass(container, 'scroller-thin')
        addClass(container, 'scroller')
    })
    container.addEventListener('mouseout', (e)=>{
    // console.log(e);
        removeClass(container, 'scroller')
        addClass(container, 'scroller-thin')
    })
  }
  render() {
    const { children, style} = this.props;
    return (
      <div className={'scroller'} style={style} ref={(r) => { this.$$container = r; }}>
        {children}
      </div>
    );
  }
}

Scroller.propTypes = {
  style:  PropTypes.shape({}),
};

Scroller.defaultProps = {
  style: {}
};


export default Scroller;
