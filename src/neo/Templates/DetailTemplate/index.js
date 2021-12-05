import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import fetch from '../../utils/request';
import { Row, Col, Toaster } from '../../Components';
import * as arrayUtils from '../../utils/array';
import config from '../../utils/config';
import styles from './style';
import { DetailPart, ButtonTools } from '../../Parts';

class DetailTemplate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageData: this.props.pageParmes || {},
      urlInfo: this.props.urlInfo,
      pageParmes: this.props.pageParmes,
      searchCondition: this.props.searchCondition,
      contextParames: this.props.contextParames
    };
    this.getValue =  this.getValue.bind(this)
  }
  componentDidMount(){
    if(this.props.editConfig&&this.props.editConfig.enableInitRequst==true){
      this.fetData()
    }
    if(this.props.editConfig == undefined) {
      this.fetData()
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      urlInfo: nextProps.urlInfo,
      pageParmes: nextProps.pageParmes,
      searchCondition: nextProps.searchCondition,
      contextParames: nextProps.contextParames
    }, ()=>{
      if(nextProps.reRender=='shuldRender'){
        this.fetData()
      }
    })
  }
  componentWillUnmount(){
    this.setState({
      urlInfo: ''
    })
  }
  getValue(){
    const { detailList  } = this.props;
    const { pageData } = this.state;
    const mergedDetailList = pageData&&JSON.stringify(pageData)!=='{}' ? this.mergeDetail(detailList, pageData): detailList  //DetailTemplate.mergeDetail(detailList, respData);
    
    return this.resetValue(mergedDetailList)||{};
  }
  
  resetValue(arr){
    let obg= {}
    if(!(arr&&arr.length>0)){return {}}
    for(let i=0;i<arr.length;i++){
      obg[arr[i].key] = arr[i].value
    }
    return obg;
  }

  setReq(condition, parmes){
    if(!parmes) return;
    let resp = {}
    for(let i=0;i<condition.length;i++){
      resp[condition[i].key] = condition[i].value ? condition[i].value :parmes[condition[i].key]
    }
    return resp
  }

  fetData(){
    const self = this
    const { urlInfo, pageParmes, searchCondition, contextParames } = this.state;
    let reqData = searchCondition&&searchCondition.length>0 ? self.setReq(searchCondition, pageParmes): {};
    if(contextParames) {
      reqData = Object.assign({}, reqData, contextParames)
    }
    if(!(urlInfo&&urlInfo.url)){
      return;
    }
    if(urlInfo&&urlInfo.options){
      reqData = Object.assign({}, reqData, arrayUtils.setReq(urlInfo.options, {}))
    }
    if(urlInfo&&urlInfo.url) {
      fetch(urlInfo.url, {
        method: urlInfo.method,
        data: reqData,
      }, urlInfo.header||{}, urlInfo).then((res) => {
        if (res.code === config.SUCCESS) {
          self.setState({
            pageData: res.data
          })
          // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        } else {
          Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch((err)=>{
        // console.log('err',err);
      });
    }
  }

  mergeDetail(detailList, pageData) {
    return detailList&&detailList.length>0 ? detailList.map((info) => {
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

  render() {
    const { detailList, funcButton, callback  } = this.props;
    const { pageData } = this.state;
    let mergedDetailList = pageData&&JSON.stringify(pageData)!=='{}' ? this.mergeDetail(detailList, pageData): detailList  //DetailTemplate.mergeDetail(detailList, respData);
    const self = this;
    return (
      <Row justify={"center"}>
        <Col className="">
        <DetailPart
          detailList={mergedDetailList}
          data={pageData}
        />
        </Col>
        {funcButton&&funcButton.length>0 ? <Col style={styles.container}> 
          <Row justify={'flex-end'}>
            <ButtonTools options={funcButton} styles={styles.btn} pageData={pageData}
            callback={()=>{callback()}} />
          </Row>
        </Col>: ''}
      </Row>
    );
  }
}

DetailTemplate.propTypes = {
  detailList: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  btns: PropTypes.arrayOf(PropTypes.shape()),
  funcButton: PropTypes.arrayOf(PropTypes.shape()),
  pageParmes: PropTypes.shape(),
  searchCondition:  PropTypes.oneOfType([PropTypes.shape({}),PropTypes.array])
};

DetailTemplate.defaultProps = {
  valid: [],
  btns: [],
  funcButton: [],
  pageParmes: {},
  searchCondition: [],
  detailList: []
};

export default DetailTemplate;