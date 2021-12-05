import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

class FullScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      screenfull: false,
      showDes: this.props.showDes
    };
  }
  componentDidMount(){
  }
  launchFullScreen() {
    let element = document.documentElement 
    this.setState({
        screenfull: true
    })
    if(element.requestFullscreen) { 
      element.requestFullscreen(); 
    } else if(element.mozRequestFullScreen) { 
      element.mozRequestFullScreen(); 
    } else if(element.webkitRequestFullscreen) { 
      element.webkitRequestFullscreen(); 
    } else if(element.msRequestFullscreen) { 
      element.msRequestFullscreen(); 
    } 
  }
  exitFullscreen() { 
    this.setState({
        screenfull: false
    })
    if(document.exitFullscreen) { 
      document.exitFullscreen(); 
    } else if(document.mozExitFullScreen) { 
      document.mozExitFullScreen(); 
    } else if(document.webkitExitFullscreen) { 
      document.webkitExitFullscreen(); 
    } 
  } 

  render() {
    const { screenfull} = this.state;
    const { showDes } = this.props;
    return (
      <div className={'display-inline-block'} >
        {screenfull ? 
            <div onClick={()=>{this.exitFullscreen()}}>
            <Icon iconName={'android-contract '} size={'130%'} /> {showDes? '退出': ''}</div>: <div onClick={()=>{this.launchFullScreen()}}>
            <Icon iconName={'android-expand '} size={'130%'} /> {showDes?'全屏':''}</div>}
      </div>
    );
  }
}

FullScreen.propTypes = {
  style:  PropTypes.shape({}),
  showDes: PropTypes.bool,
};

FullScreen.defaultProps = {
  style: {},
  showDes: true
};


export default FullScreen;
