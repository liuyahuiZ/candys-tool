import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Buttons, Row, Col, Toaster } from '../../Components';
import { EditConditionPart } from '../../Parts';
import { ListContext } from  'context';
import fetch from '../../utils/request';
import config from '../../utils/config';
import * as arrayUtils from '../../utils/array';

class ModifyTemplate extends Component {
  // 初始化编辑参数（如果是编辑）
  constructor(props) {
    super(props);
    this.state = {
      ButtonStatus: false,
      pageData: this.props.pageParmes || {},
      urlInfo: this.props.urlInfo || {},
      pageParmes: this.props.pageParmes,
      searchCondition: this.props.searchCondition || [],
      searchUrlCondition: this.props.searchUrlCondition || {},
      contextParames: this.props.contextParames,
      editItemList: this.props.editItemList,
      LoadSatus: 'NULLLOAD',
      ApiStatus: 'NULL', //SUCCESS ERROR
    };
    this.getValue =  this.getValue.bind(this)
  }

  componentDidMount(){
    if(this.props.editConfig&&this.props.editConfig.enableInitRequst==true){
      this.fetchSearchData()
    }
    if(this.props.editConfig == undefined) {
      this.fetchSearchData()
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      urlInfo: nextProps.urlInfo,
      editItemList: nextProps.editItemList,
      pageParmes: nextProps.pageParmes,
      searchCondition: nextProps.searchCondition,
      searchUrlCondition: nextProps.searchUrlCondition,
      contextParames: nextProps.contextParames
    }, ()=>{
      this.fetchSearchData()
    })
  }

  setReq(condition, parmes){
    if(!parmes) return;
    let resp = {}
    for(let i=0;i<condition.length;i++){
      resp[condition[i].key] = parmes[condition[i].key]
    }
    return resp
  }
  getValue(){
    const { checkValid, getData } = this.$$editPart;
    if (checkValid()) {
      const comdata = getData();
      // this.setState({ LoadSatus: 'LOADING' });
      return comdata;
    }
  }
  fetchSearchData(){
    const { searchUrlCondition, pageParmes, searchCondition, contextParames } = this.state;
    const self = this;
    if(searchUrlCondition&&searchUrlCondition.url) {
      let reqData = searchCondition&&searchCondition.length>0 ? self.setReq(searchCondition, pageParmes): {};
      if(contextParames) {
        reqData = Object.assign({}, reqData, contextParames)
      }
      if(searchCondition&&searchCondition.options){
        reqData = Object.assign({}, reqData, self.setReq(searchCondition.options, pageParmes))
      }
      fetch(searchUrlCondition.url, {
        method: searchUrlCondition.method,
        data: reqData,
      }, searchUrlCondition.header||{}, searchUrlCondition).then((res) => {
        if (res.code === config.SUCCESS) {
          self.setState({
            pageData: res.data,
            ApiStatus: 'SUCCESS'
          })
          // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        } else {
          Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch(()=>{
        
      });
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

  mergeDetail(array, pageData) {
    return array&&array.length>0 ? array.map((info) => {
      // console.log(info);
      if (info.items) {
        arrayUtils.forEach(info.items, (item) => {
          item.value = pageData[item.key];
        });
      } else {
        info.value = pageData[info.key];
      }
      info.pageData = pageData;

      return info;
    }) : {};
  }

  fetData(comdata, refreshBack){
    const { urlInfo } = this.state;
    const { callback } = this.props;
    if(!urlInfo.url){
      // this.setLoadStatus('NULLLOAD');
      return;
    }
    fetch(urlInfo.url, {
      method: urlInfo.method,
      data: Object.assign({}, comdata, arrayUtils.comSetReqs(urlInfo.options, {})),
    }, urlInfo.header||{}, urlInfo).then((res) => {
      if (res.code === config.SUCCESS) {
        this.setState({ LoadSatus: 'LOADED' },()=>{
          // this.setLoadStatus('NULLLOAD');
        });
        if(callback) callback();
        if(refreshBack)  refreshBack();
        Toaster.toaster({ type: 'success', content: res.msg, time: 3000 });
      } else {
        this.setState({ ApiStatus: 'ERROR' })
        // this.setLoadStatus('NULLLOAD');
        Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
      }
    }).catch(()=>{
      this.setState({ ApiStatus: 'ERROR' })
      // this.setLoadStatus('NULLLOAD');
    });
  }

  setLoadStatus(status, ApiStatus){
    const self = this;
    setTimeout(()=>{
      self.setState({ LoadSatus: status, ApiStatus:ApiStatus  });
    }, 2000)
  }

  save(refreshBack) {
    const { checkValid, getData } = this.$$editPart;
    if (checkValid()) {
      const comdata = getData();
      // this.setState({ LoadSatus: 'LOADING' });
      this.fetData(comdata, refreshBack);
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   const { listStatus } = this.state;
  //   // console.log(listStatus);
  //   // console.log(nextState.listStatus)
  //   // console.log('componentWillUpdate', md5(JSON.stringify(nextState.listStatus)), md5(JSON.stringify(listStatus)));
  //   if(md5(JSON.stringify(nextState.listStatus)) == md5(JSON.stringify(listStatus))) {
  //     return true
  //   }
  //   return false
  // }


  render() {
    const { valid, editConfig } = this.props;
    const { pageData, editItemList, LoadSatus, pageParmes, ApiStatus } = this.state;
    
    // let newEditItemList = this.mergeList(editItemList, respData);
    const mergedDetailList = pageData&&JSON.stringify(pageData)!=='{}' ? this.mergeDetail(editItemList, pageData): editItemList  //DetailTemplate.mergeDetail(detailList, respData);
    // console.log('editConfig', editConfig)
    return (
      <Row justify={"flex-end"}>
        <Col className="minheight-30">
        {mergedDetailList&&mergedDetailList.length> 0 ? <EditConditionPart
          editItemList={mergedDetailList}
          ApiStatus={ApiStatus}
          valid={valid}
          pageParmes={pageParmes}
          ref={(ref) => {
            this.$$editPart = ref;
          }}
          {...this.props}
        /> : ''}
        </Col>
        {(editConfig&&editConfig.showSubmit==true)||editConfig== undefined?<Col span={5} className="text-align-left padding-top-1r padding-bottom-1r padding-right-3r">
        <ListContext.Consumer>
          { context => {
            return (<Buttons text={'提交'} type={'primary'} LoadSatus={LoadSatus}  onClick={()=>{
              let callback = ()=> { context.refreshCall()};
              this.save(
                callback
              )}} />
            )
          }
        }
        </ListContext.Consumer>
        </Col>: ''}
      </Row>
    );
  }
}

ModifyTemplate.propTypes = {
  editItemList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  valid: PropTypes.arrayOf(PropTypes.shape()),
  respData: PropTypes.shape(),
  urlInfo: PropTypes.shape(),
  searchCondition:  PropTypes.oneOfType([PropTypes.shape({}),PropTypes.array]),
  searchUrlCondition: PropTypes.shape(),
};

ModifyTemplate.defaultProps = {
  valid: [],
  respData: {},
  urlInfo: {},
  searchCondition: [],
  searchUrlCondition: {},
  editItemList: []
};

export default ModifyTemplate;
