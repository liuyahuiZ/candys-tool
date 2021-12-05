import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col, Icon, Toaster, ExModal, Buttons } from '../../Components';

class LookBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMap: this.props.dataMap||[{ value: '', text: '', id: 1}],
      dataNum: 1,
      valid: this.props.valid,
      validDiy: this.props.validDiy,
      value: this.props.value,
      errorMsg: this.props.errorMsg,
      MDdisplay: '',
      MDaction: '',
      lookBackValue: '',
      noRender: false,
      selectModal: this.props.selectModal|| 'SINGEL', // SINGEL , MULTIPLE
      showKey: this.props.showKey|| 'id'
    };
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
    this.hideModals = this.hideModals.bind(this);
  }

  getValue(){
    let resultValue = this.renderValue()
    return resultValue.value
  }
  setValue(){

  }
  resetArr(){
    const { dataNum } = this.state;
    let newArr = [];
    for(let i=0;i<dataNum;i++){
      newArr.push({ value: '', text: i+1, id: i+1});
    }
    this.setState({
        dataMap: newArr
    })
  }
  showModal(status){
    this.setState({
        MDdisplay: 'show',
        MDaction: 'enter',
        status: status || null,
    })
    setTimeout(()=>{
      this.setState({
        noRender: true
      })
    }, 100)
  }
  hideModals(){
      this.setState({
          MDdisplay: 'hide',
          MDaction: 'leave',
          noRender: false,
      })
  }

  renderValue(){
    const { lookBackValue ,selectModal, showKey, value } = this.state;
    let valueDom = '点击查找';
    let resultValue = '';
    if(value){
      valueDom = value;
      resultValue = value;
    }

    if(lookBackValue&&lookBackValue!==''&&lookBackValue.length>0) {
      if(selectModal == 'SINGEL'){
        if(showKey&&showKey.length>0){
          valueDom = lookBackValue[0][showKey[0].text]
          resultValue = lookBackValue[0][showKey[0].value]
        }
        // valueDom = lookBackValue[0][showKey]
      } else {

      }
    }

    return {label: valueDom, value: resultValue}
  }

  shouldComponentUpdate(nextProps, nextState){
    // console.log(listStatus);
    // console.log(nextState.listStatus)
    // console.log('componentWillUpdate', md5(JSON.stringify(nextState.listStatus)), md5(JSON.stringify(listStatus)));
    if(nextState.noRender) {
      return false
    }
    return true
  }

  checkValue(){
    const { lookBackValue  } = this.state;
    if(lookBackValue&&lookBackValue.length>0){
      const self = this;
      self.hideModals()
        self.props.onChange(lookBackValue[0], (self)=>{
      }, self)
    } else{
      Toaster.toaster({ type: 'error', position: 'top', content: '请至少选择一个', time: 5000 });
    }
    
  }
  render() {
    const { MDdisplay, MDaction } = this.state;
    const self = this;
    const valueDom = self.renderValue();
    return (<div><Row className="padding-2x-5x border-all border-color-bfbfbf border-radius-3f" style={{height: '2rem', lineHeight: '2rem', boxSizing: 'content-box'}}>
      <Col span={21} onClick={()=>{self.showModal()}}>{valueDom.label}</Col>
      <Col span={3} className="text-align-right"><Icon iconName={"ios-search-strong "} size={"160%"} iconColor={"#666"} /></Col>
    </Row>
    <ExModal display={MDdisplay} action={MDaction} options={{
        content: (<Row className="padding-all-1r" justify={'center'}>
        <Col span={12}>{this.props.text}</Col>
        <Col span={12} onClick={()=>{self.hideModals(); }} className="text-align-right"><Icon iconName={"close-circled "} size={"160%"} iconColor={"#666"} /></Col>
        <Col className="margin-top-1r heighth-65 overflow-y-scroll">{self.props.renderTpl(this.props, (res)=>{
          // console.log('lookBackValue', res);
          self.setState({
            lookBackValue: res,
            noRender: true
          })
        })}</Col>
        <Col className="margin-top-1r">
        <Buttons 
        size={'small'} 
        text="带回"
        style={{color:'#fff', borderRadius: '0.3rem', width: '100px'}}
        onClick={()=>{
          self.checkValue()
          
        }} />
        </Col>
        </Row>),
        type: 'bottom',
        containerStyle: { bottom: '0rem', top: '20px',  width: '80%', left: '10%', maxWidth: '90%'},
        }}
        hideModal={()=>{
          self.setState({
            noRender: false
          })
        }}
        />
    
    </div>);
  }
}

LookBack.propTypes = {
  titlepart: PropTypes.shape(),
  onChange: PropTypes.func
};

LookBack.defaultProps = {
  style: {},
  titlepart: {},
  onChange: ()=>{}
};

export default LookBack;
