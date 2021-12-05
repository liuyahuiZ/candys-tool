import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col, Input, Toaster } from '../../Components';
import isValid from '../../utils/validFuncs';

class NumFormPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMap: this.props.dataMap||[{ value: '', text: '', id: 1}],
      dataNum: 1,
      valid: this.props.valid,
      validDiy: this.props.validDiy,
      errorMsg: this.props.errorMsg
    };
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  checkVaild(){
    const { dataMap, errorMsg } =this.state;
    let status =  true;
    for(let i=0;i<dataMap.length;i++){
      const res = this.checkItemValid(dataMap[i]);
      if (!res) {
        status = false;
        Toaster.toaster({ type: 'error', content: errorMsg|| '系统错误' }, true);
      }
    }
    return status;
  }
  checkItemValid(item){
    const { valid,  validDiy } =this.state;
    let newVaild = valid;
    if(valid == 'diy'){
      newVaild = new RegExp(validDiy) ;
    }
    let vaildStatus = isValid(item.value, newVaild);
    // console.log(vaildStatus);
    return vaildStatus
  }
  setValue(value){
    this.setState({
      dataNum: value
    }, ()=>{
      this.resetArr()
    })
  }
  resetResData(data){
    let newData = []
    let valueText = this.props.valueText || 'value';
    let keyText = this.props.keyText || 'key'
    // console.log('data', data)
    for(let i=0;i<data.length;i++){
      // newData[i][valueText] = data[i].value;
      // newData[i][keyText] = data[i].text;
      newData[i] = {
        [valueText]: data[i].value,
        [keyText] : data[i].text

      }
    }
    return newData;
  }

  getValue(){
    let vaildStatus = this.checkVaild()
    // console.log('vaildStatus', vaildStatus);
    if(vaildStatus) {
      return this.resetResData(this.state.dataMap);
    }
    return '';
  }
  addArr(){
    const { dataMap } = this.state;
    let newArr = dataMap;
    newArr.push({ value: '', text: ''});
    this.setState({
        dataMap: newArr
    })
  }
  deleteArr(itm, idx){
    const { dataMap } = this.state;
    let newArr = dataMap;
    newArr.splice(idx, 1);
    this.setState({
        dataMap: newArr
    })
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
  render() {
    const { dataMap } = this.state;
    const self = this;
    let mapDom = dataMap&&dataMap.length>0 ? dataMap.map((itm, idx)=>{
      return (<Col span={4} key={`${idx}-k`} className="border-all border-color-e5e5e5 border-radius-3f">
      <Row className="bg-show padding-all">
      <Col className="text-align-center" >{itm.id}</Col>
      <Col className="text-align-center" >
      <Input
        value={itm.value || ''}
        placeholder="请输入"
        maxLength={100}
        innerStyle={{'lineHeight':'3rem', 'textAlign': 'center','height': '3rem'}}
        onChange={(e,t,v)=>{
            dataMap[idx].value = v
            self.setState({
              dataMap: dataMap
            })
        }}
      />
      </Col>
      </Row></Col>)
    }) : '';
    return (<Row>
      {/* <Col >
      <Input
        value={dataNum || ''}
        placeholder="请输入"
        maxLength={2}
        hasBorder
        type={'number'}
        innerStyle={{'lineHeight':'3rem'}}
        onChange={(e,t,v)=>{
            self.setState({
              dataNum: v
            },()=>{
              self.resetArr()
            })
        }}
      />
    </Col> */}
    {mapDom}
    </Row>);
  }
}

NumFormPart.propTypes = {
  titlepart: PropTypes.shape()
};

NumFormPart.defaultProps = {
  style: {},
  titlepart: {}
};

export default NumFormPart;
