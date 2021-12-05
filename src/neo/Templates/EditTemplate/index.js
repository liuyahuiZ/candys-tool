import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Buttons, Row, Col, Toaster } from '../../Components';
import { EditConditionPart } from '../../Parts';
import { ListContext } from  'context';
import fetch from '../../utils/request';
import config from '../../utils/config';
import * as arrayUtils from '../../utils/array';

class EditTemplate extends Component {
  // 初始化编辑参数（如果是编辑）
  constructor(props) {
    super(props);
    this.state = {
      ButtonStatus: false,
      LoadSatus: 'NULLLOAD',
      editItemList: this.props.editItemList, 
      valid: this.props.valid, 
      respData: this.props.respData,
      ApiStatus: 'NULL', //SUCCESS ERROR
      pageData: {}
    };
    this.getValue = this.getValue.bind(this)
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      editItemList: nextProps.editItemList, 
      valid: nextProps.valid, 
      respData: nextProps.respData,
      pageData: {}
    })
  }

  getValue(){
    return this.state
  }

  mergeList(arr, obj) {
    if (!obj||!arr) {
      return arr || [];
    }
    for(let i=0;i<arr.length;i++){
      if(obj[arr[i].key]){
        arr[i].value = obj[arr[i].key]
      }
    }
    return arr;
  }

  fetData(comdata, refreshBack){
    const { urlInfo, callback } = this.props;
    if(!(urlInfo&&urlInfo.url)){
      this.setLoadStatus('NULLLOAD', 'NULL');
      return;
    }
    fetch(urlInfo.url, {
      method: urlInfo.method,
      data: Object.assign({}, comdata, arrayUtils.comSetReqs(urlInfo.options, {})),
    }, urlInfo.header||{}, urlInfo).then((res) => {
      if (res.code === config.SUCCESS) {      
        this.setState({ LoadSatus: 'LOADED' },()=>{
          this.setLoadStatus('NULLLOAD', 'SUCCESS');
        });
        Toaster.toaster({ type: 'success', content: res.msg, time: 3000 });   
        if(callback) callback();
        if(refreshBack)  refreshBack();
      } else {
        this.setLoadStatus('NULLLOAD', 'ERROR');
        Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
      }
    }).catch(()=>{
      this.setLoadStatus('NULLLOAD', 'ERROR');
    });
  }

  save(refreshBack) {
    const { checkValid, getData } = this.$$editParts;
    if (checkValid()) {
      const comdata = getData();
      // console.log('comdata', comdata)
      this.setState({ LoadSatus: 'LOADING', pageData: comdata});
      this.fetData(comdata, refreshBack);
    }
  }

  setLoadStatus(status, ApiStatus){
    const self = this;
    setTimeout(()=>{
      self.setState({ LoadSatus: status, ApiStatus:ApiStatus  });
    }, 2000)
  }

  render() {
    const { LoadSatus, editItemList, valid, respData,  pageData, ApiStatus} = this.state
    let newEditItemList = this.mergeList(editItemList, pageData);
    const self = this;
    return (
      <Row justify={"flex-end"} className="width-100">
        <Col className="">
        {editItemList&&editItemList.length> 0 ? <EditConditionPart
          editItemList={newEditItemList}
          respData={respData}
          ApiStatus={ApiStatus}
          valid={valid}
          ref={(ref) => {
            this.$$editParts = ref;
          }}
          {...this.props}
        /> : ''}
        </Col>
        <Col span={5} className="text-align-left padding-top-1r padding-bottom-1r padding-right-3r">
        <ListContext.Consumer>
          { context => {
            return (<Buttons text={'提交'} type={'primary'} LoadSatus={LoadSatus}  
            onClick={()=>{ 
              self.save(()=>{
                context.refreshCall()
              });
             }} 
            />)
            }
          }
          </ListContext.Consumer>
        </Col>
      </Row>
    );
  }
}

EditTemplate.propTypes = {
  editItemList: PropTypes.oneOfType([PropTypes.shape(), PropTypes.array, PropTypes.string]).isRequired,
  valid: PropTypes.arrayOf(PropTypes.shape()),
  respData: PropTypes.shape(),
  urlInfo: PropTypes.shape(),
};

EditTemplate.defaultProps = {
  valid: [],
  respData: {},
  urlInfo: {},
  editItemList: {}
};

export default EditTemplate;
