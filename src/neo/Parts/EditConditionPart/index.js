import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import { Toaster, Row, Col } from '../../Components/';
import isValid from '../../utils/validFuncs';
import Theme from '../../Components/Style/theme';
import * as arrayUtils from '../../utils/array';
import genInput from '../factory';
import * as changeAction from '../changeAction';
import md5 from 'js-md5';
import formatPart from '../../Parts/FormatPart';
import * as sessions from '../../utils/sessions';
import { getFactor, getFactorChange } from '../wholesUtil';

class EditPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasItems: true,
      respData: this.props.respData,
      valid: this.props.valid,
      parentPageParmes: this.props.pageParmes,
      editItemList: this.props.editItemList || {},
      cachData: this.props.cachData,
      listStatus: {},
      validStatus:{},
    };
    this.getData = this.getData.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.genInput = genInput.bind(this);
  }
  componentDidMount(){
    this.setlistStatus()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      respData: nextProps.respData,
      valid: nextProps.valid,
      editItemList: nextProps.editItemList,
      cachData: nextProps.cachData,
      parentPageParmes: nextProps.pageParmes
    });
  }
  setlistStatus(){
    const { editItemList, listStatus } = this.state;
    let newlistStatus = JSON.parse(JSON.stringify(listStatus)) 
    for(let i =0; i< editItemList.length;i++){
      if (editItemList[i].isShow!==undefined) {
        newlistStatus[editItemList[i].key] = editItemList[i].isShow
      }
    }
    this.setState({
      listStatus: newlistStatus
    })
  }
  checkRequired(valid, conditionValid) {
    if (valid) {
      return (
        <span style={styles.require}>*</span>
      );
    }

    return null;
  }
  //获取每个表单元素的值
  getDomData(item, format) {
    let $$dom = this[`$$${item.key}`];
    if(!$$dom){
      return ''
    }
    // 获取自定义模板的value值
    let keys = item.hasTmplate ? item.actionName.replace('@','') : '';
    let value = $$dom.getValue ? $$dom.getValue(keys) : $$dom.value;
    if(item.cacheKey){
      let cache = sessions.getStorage('caches')
      value = cache[item.cacheKey.keyName]
    }
    if (format && item.format && value !== '') {
      return item.format(value);
    }
    

    return value;
  }
  getData() {
    const { editItemList } = this.state;
    const data = {};
    editItemList&&arrayUtils.forEach(editItemList, (item) => {
      data[item.key] = this.getDomData(item, true);
      item.value = this.getDomData(item, true);
      // arrayUtils.forEach(item.items, (it) => {
      //   data[it.key] = this.getDomData(it, true);
      // });
    });

    return data;
  }

  checkItemValid(item) {
    const { valid, validDiy } = item;
    const { listStatus } = this.state;
    let $$dom = this[`$$${item.key}`];
    if(!$$dom){
      return ''
    }
    // console.log('item.key', item.key, listStatus&&listStatus[item.key])
    // 判断当前表单元素是否是隐藏的
    if (listStatus&&listStatus[item.key]===false) {
      return true;  //如果是隐藏的则不校验
    }
    let keys = item.hasTmplate ? item.actionName.replace('@','') : '';
    const value = $$dom.getValue ? $$dom.getValue(keys) : $$dom.value;
    item.value = value
    let newVaild = valid;
    if(valid == 'diy'){
      newVaild = new RegExp(validDiy) ;
    }

    const remarkDom = this[`$$${item.key}-remark`];
    let vaildStatus = isValid(value, newVaild);
    if(vaildStatus===false||vaildStatus===''){
      remarkDom.style.display = 'inline-block';
    } else{
      remarkDom.style.display = 'none';
    }
    return vaildStatus;
  }
  checkValid() {
    const { editItemList, listStatus } = this.state;
    let status =  true;
    let newEditItemList = JSON.parse(JSON.stringify(editItemList));
    let newListStatus = JSON.parse(JSON.stringify(listStatus));
    const self = this;
    // 单个校验
    for(let i=0;i<newEditItemList.length;i++){
      const res = this.checkItemValid(newEditItemList[i]);
      if (!res) {
        status = false;
        newEditItemList[i].isValid = true
        newListStatus[new Date().getTime()] = true;
        this.setState({
          editItemList:  newEditItemList,
          listStatus: newListStatus
        })
        // console.log(newEditItemList[i]);
        Toaster.toaster({ type: 'error', content: newEditItemList[i].errorMsg|| '表单填写错误' }, true);
        break;
      } else{
        newEditItemList[i].isValid = false
      }
    }
    // 全局校验
    const wholeRules = this.props.wholeRules;
    if(wholeRules){
      for(let i=0;i<wholeRules.length;i++){
        if(wholeRules[i].vaildType=='Factor'){
          if(wholeRules[i].actionType=='valid'){
            let factorIn = getFactor(wholeRules[i].factors, self)
            // console.log('factorIn', factorIn)
            if (!factorIn) {
              status = false;
              Toaster.toaster({ type: 'error', content: wholeRules[i].errorMsg|| '表单填写错误' }, true);
              break;
            }
          }
        }
      }
      this.setState({
        editItemList:  newEditItemList,
        listStatus: newListStatus
      })
    }

    return status;
  }
  setShow(status, linkDomKey, resolve){
    const { listStatus } = this.state;
    const cacheData = this.getData();
    // console.log('cacheData', cacheData, listStatus, linkDomKey, status)
    let newlistStatus = JSON.parse(JSON.stringify(listStatus));
    newlistStatus[linkDomKey] = status
    this.setState({
      listStatus: newlistStatus,
      cachData: cacheData
    }, ()=>{
      if(resolve) resolve()
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    const { listStatus } = this.state;
    if(nextProps.ApiStatus=='ERROR') {
      return false
    }

    if(md5(JSON.stringify(nextState.listStatus)) == md5(JSON.stringify(listStatus))) {
      return true
    }
    
    return false
  }

  mergeData(arr, res){
    let newArr = JSON.parse(JSON.stringify(arr));
    let newEditItemList = arrayUtils.mergeObg(newArr, res);
    return newEditItemList
  }
  render() {
    const { editItemList, cachData, respData } = this.state;
    const { wholeRules, ApiStatus } = this.props;
    const self = this;
    let newEditItemList = this.mergeData(editItemList, respData);
    if(cachData) {
      newEditItemList = this.mergeData(newEditItemList, cachData);
    }
    return (
      <div>
        {
          newEditItemList&&newEditItemList.length>0? newEditItemList.map((editItem, idx) => {
            const key = `${idx}-${editItem.text}`;
            const dispStyle = {};
            if (editItem.isShow!==undefined) {
              if (editItem.isShow==false) {
                dispStyle.display = 'none';
              }
            }
           
            let contStyle = {}
            if(editItem.contStyle) {
              contStyle = arrayUtils.arrToObg(editItem.contStyle, 'text', 'value')
              // console.log(contStyle);
            }
            let textContStyle= {}
            if(editItem.textContStyle) {
              textContStyle = arrayUtils.arrToObg(editItem.textContStyle, 'text', 'value')
              // console.log(contStyle);
            }
            let labelStyle = {}
            if(editItem.labelStyle) {
              labelStyle = arrayUtils.arrToObg(editItem.labelStyle, 'text', 'value')
              // console.log(contStyle);
            }

            if(editItem.formatModel){
              editItem.oldValue = editItem.value
              editItem.value = formatPart(editItem, editItem.value, editItem.formatStr, editItem.replaceStr )
            }

            if(editItem.value){
              if(editItem.changeConfigs&&editItem.changeConfigs.length>0){
                let itemValue = editItem.value;
                if(editItem.formatModel){
                  itemValue = editItem.oldValue
                }
                if(itemValue&&(ApiStatus=='SUCCESS'||ApiStatus=='NULL')){
                  setTimeout(()=>{
                    changeAction.loop(editItem.changeConfigs, self, itemValue, {}, {});
                  }, 2000)
                }
                
              }
              if(wholeRules){
                setTimeout(()=>{
                  getFactorChange(wholeRules, self)
                }, 2000)
              }
            }
            
            return (
              <div
                key={key}
                ref={(dom) => {
                  this[`$$wrap-${editItem.key}${editItem.keyId?editItem.keyId:''}`] = dom;
                }}
                style={Object.assign({}, styles.container, contStyle, dispStyle)}
              >
                <Row>
                  <Col span={24} style={Object.assign({}, styles.text, textContStyle) }  className="text-align-left maxwidthx-130 text-overflow padding-right-3" title={editItem.text}>
                  {
                    this.checkRequired(editItem.valid, editItem.conditionValid)
                  }
                  <span style={Object.assign({}, styles.labelText, editItem.textStyle, labelStyle)}>
                    {editItem.text} 
                  </span>
                </Col>
                <Col span={22}>
                {editItem ? <Row className="relative">
                          <Col span={editItem.after ? 22 : 24} ref={(r) => { this[`$$${editItem.key}-input`] = r; }}>{
                            editItem.hasTmplate ? '' :this.genInput( editItem, idx, (res, linkDomKey, resolve)=>{
                            // console.log('checkStatus', res, linkDomKey);
                            self.setShow(res, linkDomKey, resolve)
                            }, (itm, valueBack, s)=>{  return self.props.getPages(itm, valueBack, s) }, wholeRules)
                          }</Col>
                          {editItem.after ? <Col span={2} className="text-align-center" >{editItem.after || ''}{editItem.remark || ''}</Col> : ''}
                          <Col>{
                            editItem.hasTmplate ? self.props.getPages(editItem, ()=>{}, self): ''
                          }</Col>
                          <div className="absolute top-100" style={{'color': Theme.error, 'display': 'none'}} ref={(r) => { this[`$$${editItem.key}-remark`] = r; }}>{editItem.errorMsg||'表单填写错误'}</div> 
                  </Row>: ''}
                {/* {editItem.items.length > 1 ? editItem.items.map((item, innerIdx) => {
                    const innerkey = `inner-${innerIdx}`;
                    return (
                      <div style={styles.inline} key={innerkey}>
                        <Row>
                          {item.text ? <Col span={4}><span style={item.textStyle}>{item.text}</span></Col> : ''}
                          <Col span={16}>{this.genInput(item)}</Col>
                          <Col span={4} className="text-align-center">{item.after || ''}{item.remark || ''}</Col>
                        </Row>
                      </div>
                    );
                  })
                : ''} */}
                </Col>
                </Row>
              </div>
            );
          }) : ''
        }
      </div>
    );
  }
}

EditPart.propTypes = {
  editItemList: PropTypes.oneOfType([PropTypes.shape({}),PropTypes.array, PropTypes.func]),
  valid: PropTypes.arrayOf(PropTypes.shape()),
  respData: PropTypes.oneOfType([PropTypes.shape({}),
  PropTypes.arrayOf(PropTypes.shape({})), PropTypes.func]),
};

EditPart.defaultProps = {
  valid: [],
  respData: {},
  editItemList: []
};

export default EditPart;
