import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import Transition from '../Transition';
import PageTransition from '../PageTransition';

class ExModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      display: this.props.display, //'hide',
      action: this.props.action, //'enter'
      options: this.props.options||{},
      disabledLayout:this.props.disabledLayout,
      hideDom: false
    };
    this.rmMsg = this.rmMsg.bind(this);
  }

  componentDidMount(){
    // this.toaster()
  }
  componentWillReceiveProps(nextProps){
    const { action } = this.state
    // if(display == nextProps.display) return;
    this.setState({
      display: nextProps.display,
      action: nextProps.action,
      options: nextProps.options,
      disabledLayout:nextProps.disabledLayout,
      hideDom: false
    })
  }

  toaster() {
    if(this.state.display==='hide'){
        this.setState({ display: 'show', action: 'enter' });
    } else {
      this.setState({  display: 'hide', action: 'leave' });
    }
  }

  rmMsg(key) {
    const {disabledLayout}=this.state;
    if(disabledLayout=='0') return;
    this.setState({ display: 'hide' });
    this.props.hideModal()
  }
  shouldComponentUpdate(nextProps, nextState){
    // const { display } = this.state;
    // if(display==nextProps.display){
    //   return false
    // }
    return true;
  }
  render() {
    const self = this;
    const { options, action, display, hideDom } = this.state;
    console.log('action', action)
    const contbg = display==='show' ? (<Transition
      act={action}
      duration={166}
      enter={'modalbg-enter'}
      leave={'modalbg-leave'}
    ><div style={styles.boxbg} ref={(r) => {
      self.$$boxbg = r;
    }} onClick={()=>{
      self.rmMsg();
    }} /></Transition>) : '';

    const cellDom = display ? <PageTransition
      act={action}
      duration={166}
      enter={`actionSheet-${options.type}enter`}
      leave={`actionSheet-${options.type}leave`}
    ><div className="scroller" style={Object.assign({}, styles.cont, options.containerStyle)}>{options.content}</div></PageTransition>: '';

    return (
      <div style={Object.assign({}, styles.container) } className="transi">
        {cellDom}
        {contbg}
      </div>
    );
  }
}

ExModal.propTypes = {
  callbackRM: PropTypes.func
  // style: PropTypes.shape({})
};

ExModal.defaultProps = {
  options: {},
  callbackRM: () => {},
};

export default ExModal;
