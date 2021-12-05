import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col, Toaster } from '../../Components';
import isValid from '../../utils/validFuncs';
import genInput from './factory';

class NumFormPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMap: this.props.dataMap||[{ value: '', text: '', id: 1}],
      dataNum: 1,
      valid: this.props.valid,
      validDiy: this.props.validDiy,
      errorMsg: this.props.errorMsg,
      formatArr: this.props.formatArr,
      modalType: this.props.modalType ||'LIST',
      allData: []
    };
    this.genInput = genInput.bind(this);
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  checkVaild(){
    const { dataMap, formatArr } =this.state;
    let status =  true;
    for(let i=0;i<dataMap.length;i++){
      for(let j=0;j<formatArr.length;j++){
        if(formatArr[j].valid){
          const res = this.checkItemValid(dataMap[i], formatArr[j].key, formatArr[j].valid, formatArr[j].validDiy);
          if (!res) {
            status = false;
            Toaster.toaster({ type: 'error', content: formatArr[j].errorMsg|| '系统错误' }, true);
          }
        }
      }
    }
    return status;
  }
  checkItemValid(item, key, valid, validDiy){
    let newVaild = valid;
    if(valid == 'diy'){
      newVaild = new RegExp(validDiy) ;
    }
    let vaildStatus = isValid(item[key], newVaild);
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
    // let valueText = this.props.valueText || 'value';
    // let keyText = this.props.keyText || 'key'
    const { formatArr } = this.state;
    // console.log('data', data)
    for(let i=0;i<data.length;i++){
      // newData[i][valueText] = data[i].value;
      // newData[i][keyText] = data[i].text;
      newData[i]={}
      for(let j=0;j<formatArr.length;j++){
        newData[i][formatArr[j].key] = data[i][formatArr[j].key]
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
  renderHeader(){
    const { formatArr, modalType } = this.state;
    let headerDom = modalType == 'LIST' ? (formatArr&&formatArr.length>0 ?  formatArr.map((itm, idx)=>{
      return <Col key={`${idx}-h`} span={12} className="maxwidthx-160 text-align-center line-height-3r">{itm.text}</Col>
    }): ''): <div/>;
    return headerDom
  }
  renderList(){
    const { dataMap, formatArr } = this.state;
    const self = this;
    let newData = JSON.parse(JSON.stringify(dataMap));
    let mapDom = dataMap&&dataMap.length>0 ? dataMap.map((itm, idx)=>{
      return (<Col key={`${idx}-k`} className="">
      <Row className="bg-show">
      {
        (formatArr&&formatArr.length>0 ?  formatArr.map((ifs, ix)=>{
          // console.log(ifs)
          if(ifs.auto){
            dataMap[idx][ifs.key] = idx+1
            // console.log('newData', newData
            ifs.value = idx+1
          } else {
            ifs.value = itm[ifs.key]
          }
          ifs.keyName=`${ifs.key}-${idx}`;
        return <Col span={12} className="maxwidthx-160 text-align-center" key={`${ix}-col`}>
        {self.genInput(ifs, idx, (v)=>{
          newData[idx][ifs.key] = v
          console.log('newData', v)
          self.setState({
            dataMap: newData
          })
          
          if(ifs.onChange){
            ifs.onChange(newData);
          }
        })}
        {/* <Input
          value={ifs.auto ? idx+1 : itm[ifs.key]}
          placeholder="请输入"
          maxLength={100}
          innerStyle={{'lineHeight':'3rem', 'textAlign': 'center','height': '3rem'}}
          disabled={ifs.disabled}
          onChange={(e,t,v)=>{
            // console.log(idx, ifs, ix)
            newData[idx][ifs.key] = v
            // console.log('newData', newData)
            self.setState({
              dataMap: newData
            })
            if(ifs.onChange){
              ifs.onChange(newData);
            }
          }}
        /> */}
        </Col>
        }): <div/>)
      }
      </Row></Col>)
    }) : <div/>;
    return mapDom
  }
  render() {
    const { dataMap, dataNum, formatArr, modalType } = this.state;
    const self = this;
    let headerDom = self.renderHeader();
    let mapDom = self.renderList();
    return (<Row className="border-all border-color-e5e5e5 border-radius-3f">
    {headerDom}
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
