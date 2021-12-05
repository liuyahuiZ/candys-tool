import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import Cell from './cell';
import { Toaster, Row, Col, Icon, Buttons, Pages } from '../../Components/';
import isValid from '../../utils/validFuncs';
import * as arrayUtils from '../../utils/array';
import fetch from '../../utils/request';
import config from '../../utils/config';

class ListPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArr: [],
      urlInfo: this.props.urlInfo|| {},
      id: 0,
      shuldRefresh: this.props.shuldRefresh||'init',
      pageParmes: this.props.pageParmes||{},
      editConfig: this.props.editConfig,
      checkedArr: [],
      headerList: [],
      dataNum: 1,
      pageInfo: {
        current: 1,
        size: 5
      }
    };
    this.rmMsg = this.rmMsg.bind(this);
    this.addIdForArr = this.addIdForArr.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.getValue =  this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }
  componentDidMount() {
    this.addIdForArr();
    const { editConfig } = this.props
    if(this.props.editConfig&&this.props.editConfig.enableInitRequst==true){
      this.fetData()
    }
    if(this.props.editConfig == undefined) {
      this.fetData()
    }
    if(editConfig.hasHeaderRequest&&editConfig.hasHeaderRequest==true){
      this.fetHeaderData()
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.shuldRefresh=='noRender') return
    const { editConfig } = nextProps
    this.setState({
      pageParmes: nextProps.pageParmes||{},
      contextParames: nextProps.contextParames||{},
      checkedArr: [],
      id: 0,
    },()=>{
      if(nextProps.reRender=='shuldRender'){
        this.fetData()
        if(editConfig.hasHeaderRequest&&editConfig.hasHeaderRequest==true){
          this.fetHeaderData()
        }
      }
    });
  }
  
  setValue(value){
    if(!value||value=='') return;
    this.setState({
        dataNum: value
    }, ()=>{
        this.resetArr()
    })
  }

  resetArr(){
    const { dataNum } = this.state;
    let newArr = [];
    for(let i=0;i<dataNum;i++){
      newArr.push({ text: i+1, id: i+1});
    }
    this.setState({
      dataArr: newArr
    })
  }

  setReq(condition, parmes){
    if(!parmes) return;
    let resp = {}
    for(let i=0;i<condition.length;i++){
      resp[condition[i].key] = condition[i].value&&condition[i].value!=='' ? condition[i].value :parmes[condition[i].key]
    }
    return resp
  }

  fetData(){
    const { urlInfo, pageParmes, contextParames, pageInfo } = this.state;
    const { editConfig } = this.props;
    const self = this;
    if(urlInfo&&!urlInfo.url){
      return;
    }
    if(urlInfo&&urlInfo.url) {
      let reqData = urlInfo.options&&urlInfo.options.length>0 ? self.setReq(urlInfo.options, pageParmes): {};
      if(contextParames) {
        reqData = Object.assign({}, reqData, contextParames)
      }
      if(editConfig.showPage&&pageInfo){
        reqData = Object.assign({}, reqData, pageInfo)
      }
      fetch(urlInfo.url, {
        method: urlInfo.method,
        data: reqData
      }, urlInfo.header||{}, urlInfo).then((res) => {
        if (res.code === config.SUCCESS) {
          let totalPage = Number(res.data.totalCount) / Number(pageInfo.size)
          if(totalPage>parseInt(totalPage)){
            totalPage=parseInt(totalPage)+1
          }
          pageInfo.totalPage = totalPage;
          pageInfo.totalCount = Number(res.data.totalCount)
          self.setState({
            dataArr: res.data&&res.data.data ? res.data.data: res.data,
            pageInfo: pageInfo
          })
          // Toaster.toaster({ type: 'success', content: res.msg, time: 3000 });
        } else {
          Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch((err)=>{
        // console.log('err',err);
      });
    }
  }

  fetHeaderData(){
    const { pageParmes, contextParames } = this.state;
    const { editConfig } = this.props;
    const urlInfo = editConfig.headerRequest
    const self = this;
    if(urlInfo&&!urlInfo.url){
      return;
    }
    if(urlInfo&&urlInfo.url) {
      let reqData = urlInfo.options&&urlInfo.options.length>0 ? self.setReq(urlInfo.options, pageParmes): {};
      if(contextParames) {
        reqData = Object.assign({}, reqData, contextParames)
      }
      fetch(urlInfo.url, {
        method: urlInfo.method,
        data: reqData
      }, urlInfo.header||{}, urlInfo).then((res) => {
        if (res.code === config.SUCCESS) {
          let headerData = res.data&&res.data.data ? res.data.data: res.data;
          headerData = arrayUtils.getOptions(headerData, urlInfo.textKey, urlInfo.valueKey)
          self.setState({
            headerList: headerData
          })
          Toaster.toaster({ type: 'success', content: res.msg, time: 3000 });
        } else {
          Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch((err)=>{
        // console.log('err',err);
      });
    }
  }
  getCheckData(checkedArr, dataArr){
    let newArr = []
    for(let i=0;i<checkedArr.length;i++){
      newArr.push(dataArr[checkedArr[i].checkId])
    }
    return newArr;
  }
  getValue() {
    const {editConfig, dataArr, checkedArr} = this.state;
    // console.log('checkedArr', checkedArr)
    if(editConfig&&editConfig.showCheckBox){
      let resData = this.getCheckData(checkedArr, dataArr);
      if(resData.length==0){
        Toaster.toaster({ type: 'error', content: '请选择', time: 3000 });
        return false;
      }
      // console.log('resData', resData)
      return resData
    }
    
    return dataArr;
  }
  addIdForArr() {
    const data = this.props.EditlistData;
    for (let i = 0; i < data.length; i++) {
      data[i].id = i + 1;
    }
    this.setState({ dataArr: data });
  }
  remove(arr, id) {
    this.arr = arr;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
  add() {
    const Newid = this.state.id + 1;
    const format = this.props.listFormat;
    const obj = {};
    for (let i = 0; i < format.length; i++) {
      obj[format[i].key] = '';
      if (format[i].items) {
        const objc = {};
        for (let j = 0; j < format[i].items.length; j++) {
          objc[format[i].items[j].key] = '';
        }
        obj[format[i].key] = objc;
      }
    }
    obj.id = Newid;
    const newOptions = this.state.dataArr;
    newOptions.push(obj);
    this.setState({ id: Newid, dataArr: newOptions });
  }
  rmMsg(key) {
    const newOptions = this.state.dataArr;
    const newarr = this.remove(newOptions, key);
    this.setState({ dataArr: newarr });
  }
  sortArr(index, action) {
    const newOptions = this.state.dataArr;
    if (action === 'up') {
      const cache = newOptions[index];
      newOptions[index] = newOptions[index - 1];
      newOptions[index - 1] = cache;
    } else {
      const cache = newOptions[index];
      newOptions[index] = newOptions[index + 1];
      newOptions[index + 1] = cache;
    }
    this.setState({ dataArr: newOptions });
  }
  changeArr(rowIdx, key, value, parentKey) {
    const newOptions = this.state.dataArr;
    if (parentKey) {
      if (newOptions[rowIdx][parentKey] === undefined) {
        newOptions[rowIdx][parentKey] = {};
      }
      newOptions[rowIdx][parentKey][key] = value;
    } else {
      newOptions[rowIdx][key] = value;
    }
    this.setState({ dataArr: newOptions });
  }
  changeSelect(rowIdx, key, value, option) {
    const newOptions = this.state.dataArr;
    newOptions[rowIdx][key][option] = value;
    this.setState({ dataArr: newOptions });
  }

  changeCheckArr(item, checkStatus, idx){
    const { checkedArr, dataArr } = this.state
    let newArr= JSON.parse(JSON.stringify(checkedArr))
    item.checkId = idx;
    item.checkStatus = checkStatus&&checkStatus.agree.checkStatus;
    let isInArr = arrayUtils.checkInArrIndex(newArr, 'checkId', idx)
    let newData = JSON.parse(JSON.stringify(dataArr));
    newData[idx] = item;
    if(checkStatus&&checkStatus.agree.checkStatus =='checked'){
      if(!isInArr.status){
        newArr.push(item)
        this.setState({
          checkedArr: newArr,
          dataArr: newData
        })
      } 
    } else{
      newArr.splice(isInArr.index, 1)
      this.setState({
        checkedArr: newArr,
        dataArr: newData
      })
    }
    
  }

  checkData(data, listFormat) {
    // const keys = Object.keys(data);
    // const values = Object.values(data);
    let statuslin = true;
    let nobo = '';
    let keyStr = '';
    let errStr = '';
    // if (values.indexOf('') >= 0) {
    //   statuslin = false;
    //   nobo = values.indexOf('');
    //   keyStr = keys[nobo];
    //   return { status: statuslin, key: keyStr, no: nobo, errStr: '' };
    // }

    for (let j = 0; j < listFormat.length; j++) {
      if (listFormat[j].valid) {
        let newVaild = listFormat[j].valid;
        if(newVaild == 'diy'){
          newVaild = new RegExp(listFormat[j].validDiy) ;
        }
        statuslin = isValid(data[listFormat[j].key], newVaild);
        if(statuslin==undefined||statuslin==''||statuslin==false){
          statuslin =  false
          nobo = j;
          keyStr = listFormat[j].key;
          errStr = listFormat[j].errorMsg|| 'not for Vaild';
          break;
        }
      }
      // if (data[listFormat[j].key] === undefined || data[listFormat[j].key] === '') {
      //   statuslin = false;
      //   nobo = j;
      //   keyStr = listFormat[j].key;
      //   errStr = 'value is undefined';
      //   break;
      // }  // listFormat[j].vaild
      if (typeof (listFormat[j].items) === 'object' && JSON.stringify(listFormat[j].items) !== '{}') {
        const res = this.checkData(data[listFormat[j].key], listFormat[j].items);
        if (res.status === false) {
          statuslin = res.status;
          nobo = res.no;
          keyStr = res.key;
          errStr = 'item err';
          break;
        }
      }
    }
    return { status: statuslin, key: keyStr, no: nobo, errStr: errStr };
  }
  checkValid() {
    const {editConfig, dataArr, checkedArr} = this.state;
    const { listFormat } = this.props;
    let resultStatus = '';
    let checkData = dataArr
    if(editConfig&&editConfig.showCheckBox){
      checkData = this.getCheckData(checkedArr, dataArr);
    }
    for (let i = 0; i < checkData.length; i++) {
      resultStatus = this.checkData(checkData[i], listFormat);
    }
    return resultStatus;
  }

  render() {
    const { listFormat, style, showIndex,showOption, showSort, showInfo ,showButton, editConfig, wholeRules } = this.props;
    const { headerList, dataArr, pageInfo } = this.state;
    const self = this;
    const sortOperations= [{
      action: 'up',
      func: (idx) => {
        // console.log(idx, item, 'commit', surchFun);
        this.sortArr(idx, 'up');
      }
    }, {
      action: 'down',
      func: (idx) => {
        // console.log(idx, item, 'commit', surchFun);
        this.sortArr(idx, 'down');
      }
    }]
    const delItem= this.props.delItem||'';
    const operations = [{
      text: '删除',
      func: (idx, item, surchFun) => {
        // console.log(idx, item, 'commit', surchFun);
        // console.log("删除来啦",idx,item,surchFun)
        self.rmMsg(item.id);
        delItem?delItem(idx,item,surchFun):''
      },
      action: 'delete',
    }];
    let headerCondition = listFormat
    if(editConfig.hasHeaderRequest&&editConfig.hasHeaderRequest==true&&headerList.length>0){
      headerCondition = headerList
    }

    return (
      <div style={arrayUtils.merge([styles.container, style])} >
      <Row >
        <Col>{showButton?<Buttons
            text={<div><Icon iconName={'android-add-circle'} size={'130%'} iconColor={'#fff'}
            /> 新增</div>}
            type={'primary'}
            size={'small'}
            style={{color:'#fff', borderRadius: '3rem'}}
            onClick={()=>{
                this.add()
            }}
        />:''}
        </Col>
        <Col className=" scroller"><Cell
          itemFormat={headerCondition} items={dataArr}
          operations={operations} showIndex={showIndex}
          sort={sortOperations}
          showOption={showOption}
          showSort={showSort}
          showCheckBox={editConfig&&editConfig.showCheckBox}
          showInfo={showInfo}
          changeCheckArr={(item, data, rowIdx)=>{
            self.changeCheckArr(item, data, rowIdx)
          }}
          wholeRules={wholeRules}
          onChange={(itm, idx)=>{
            // console.log(itm, idx);
            let newData = JSON.parse(JSON.stringify(dataArr));
            newData[idx] = itm
            self.setState({dataArr: newData})

          }}
        /></Col>
        <Col className="padding-top-1r">{
              editConfig&&editConfig.showPage ?
                <Pages
                  pageInfo={pageInfo}
                  onChange={(res)=>{ 
                    // console.log(res)
                    pageInfo.current = res.current
                    pageInfo.size = res.size
                    self.setState({
                      pageInfo: pageInfo
                    }, ()=>{
                      self.fetData()
                    })
                  }}
                  ref={(item) => {
                    this.page = item;
                  }}
                />
              : ''
            }
        </Col>
        </Row>
      </div>
    );
  }
}

ListPart.propTypes = {
  style: PropTypes.shape({}),
  listFormat: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  EditlistData: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  showIndex: PropTypes.bool,
  showSort: PropTypes.bool,
  showInfo: PropTypes.bool,
  urlInfo: PropTypes.shape({}),
  editConfig: PropTypes.shape({}),
};

ListPart.defaultProps = {
  style: {},
  EditlistData: [],
  showIndex: true,
  showSort: true,
  showInfo: false,
  urlInfo: {},
  editConfig:{},
};

export default ListPart;
