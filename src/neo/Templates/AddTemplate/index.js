import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col, Toaster } from '../../Components';
import { AddConditionPart } from '../../Parts';
import fetch from '../../utils/request';
import config from '../../utils/config';
import * as arrayUtils from '../../utils/array';

class AddTemplate extends Component {
  // 初始化编辑参数（如果是编辑）
  constructor(props) {
    super(props);
    this.state = {
      ButtonStatus: false,
      LoadSatus: 'NULLLOAD',
      editItemList: this.props.editItemList,
      pageParmes: this.props.pageParmes,
      funcButton: this.props.funcButton,
      valid: this.props.valid, 
      respData:  this.props.contextParames,
      reRender: this.props.reRender
    };
    this.getValue = this.getValue.bind(this)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.reRender=='init'||nextProps.reRender=='shuldRender'){
      this.setState({
        editItemList: nextProps.editItemList, 
        valid: nextProps.valid, 
        pageParmes: nextProps.pageParmes,
        respData: nextProps.contextParames
      })
    }
  }

  getValue(){
    const { checkValid, getData } = this.$$addParts;
    if (checkValid()) {
      const comdata = getData();
      return comdata
    }else {
      return false
    }
  }

  mergeList(array, obj) {
    if (!obj) {
      return;
    }
    arrayUtils.forEach(array, (item) => {
      if (item.items) {
        arrayUtils.forEach(item.items, (t) => {
          if (obj[t.key]) {
            t.value = obj[t.key];
          }
        });
      } else if (obj[item.key]) {
        item.value = obj[item.key];
      }
    });
  }

  fetData(comdata){
    const { initUrlInfo, callback } = this.props;
    if(!(initUrlInfo&&initUrlInfo.url)){
      this.setLoadStatus('NULLLOAD');
      return;
    }
    fetch(initUrlInfo.url, {
      method: initUrlInfo.method,
      data: comdata,
    }, initUrlInfo.header||{}, initUrlInfo).then((res) => {
      if (res.code === config.SUCCESS) {      
        this.setState({ LoadSatus: 'LOADED' },()=>{
          this.setLoadStatus('NULLLOAD');
        });
        Toaster.toaster({ type: 'success', content: res.msg, time: 3000 });   
        callback();
      } else {
        this.setLoadStatus('NULLLOAD');
        Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
      }
    }).catch(()=>{
      this.setLoadStatus('NULLLOAD');
    });
  }

  setLoadStatus(status){
    const self = this;
    setTimeout(()=>{
      self.setState({ LoadSatus: status });
    }, 2000)
  }

  render() {
    const { editItemList, valid, respData, pageParmes, funcButton } = this.state
    const that = this;
    if(editItemList&&editItemList.length>0&&pageParmes) {
      this.mergeList(editItemList, pageParmes);
    }
    if(editItemList&&editItemList.length>0&&respData){
      this.mergeList(editItemList, respData);
    }
    let cachData = respData || pageParmes;
    return (
      <Row justify={"center"} className="width-100">
        <Col className="padding-top-1r">
        <AddConditionPart
          editItemList={editItemList}
          respData={cachData}
          cachData={cachData}
          funcButton={funcButton}
          valid={valid}
          buttonAction={(res)=>{that.buttonAction(res)}}
          downAction={(dow)=>{that.downAction(dow)}}
          callback={()=>{that.props.callback()}}
          ref={(ref) => {
            this.$$addParts = ref;
          }}
          {...this.props}
        />
        </Col>
      </Row>
    );
  }
}

AddTemplate.propTypes = {
  editItemList: PropTypes.oneOfType([PropTypes.shape(), PropTypes.array, PropTypes.string]).isRequired,
  valid: PropTypes.arrayOf(PropTypes.shape()),
  respData: PropTypes.shape(),
  urlInfo: PropTypes.shape(),
};

AddTemplate.defaultProps = {
  valid: [],
  respData: {},
  urlInfo: {},
  editItemList: {}
};

export default AddTemplate;
