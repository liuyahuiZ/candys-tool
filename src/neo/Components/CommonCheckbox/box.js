import React, { Component } from 'react';
import styles from '../Tree/style';
import * as arrayUtils from '../../utils/array';
import Icon from '../Icon';
class Box extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      checkStatus: 'unChecked' || this.props.checkStatus //unChecked, checked, ambivalent
    };
    this.changetoAmb = this.changetoAmb.bind(this)
  }
  componentWillReceiveProps(nextProps){
    this.setState({
        checkStatus: nextProps.checkStatus,
        active: nextProps.active
    })
  }
  checkd() {
      const {checkStatus} =  this.state;
      let newCheckStatus = 'checked'
      if(checkStatus=='checked'){
        newCheckStatus = 'unChecked'
      }
      this.setState({
        checkStatus: newCheckStatus
      })
      this.props.onChange(newCheckStatus)
  }
  delAmb() {
    this.props.onChange('unChecked')
  }
  changetoAmb(status){
    this.setState({
        checkStatus: status
    })
  }
  render(){
      const { checkStatus, active } = this.state
      const self = this;
      let checked = '';
      let checkbox = '';
      const actived = active ? styles.active : '';
      if (checkStatus === 'checked') {
        checked = styles.checked;
      }
      checkbox = (<span style={arrayUtils.merge([styles.checkbox, checked])} onClick={() => { self.checkd(); }}><Icon iconName={'checkmark'} size={'90%'} iconColor={''} iconPadding={'0'} /></span>);
      if (checkStatus === 'ambivalent') {
        checked = styles.checked;
        checkbox = (<span style={arrayUtils.merge([styles.checkbox, checked])} onClick={() => { self.delAmb(); }}><Icon iconName={'minus-round'} size={'90%'} iconColor={''} iconPadding={'0'} /></span>);
      }
      
      return (<div style={{display: 'inline-block'}}>
      <span style={styles.switch} />
      {checkbox}
      <span className="text" style={arrayUtils.merge([styles.text, actived])}></span></div>)
  }
}
export default Box;