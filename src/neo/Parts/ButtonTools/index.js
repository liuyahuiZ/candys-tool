import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {getDateTimeStr} from '../../utils/timeStamp';
import fetch from '../../utils/request';
import config from '../../utils/config';
import {
    Buttons,
  } from '../../Components';
import { checkArrStatus, checkRuleItem } from './checkRules';
class ButtonTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  setReq(condition, parmes){
    if(!parmes) return;
    let resp = {}
    for(let i=0;i<condition.length;i++){
      resp[condition[i].key] = condition[i].value ? condition[i].value : parmes[condition[i].key]
    }
    return resp
  }

  buttonAction(info, resolve, reject){
    const { callback, pageData } = this.props;
    const self = this;
    if(info&&info.url) {
      fetch(info.url, {
        method: info.method,
        data: info.options&&info.options.length>0 ? self.setReq(info.options, pageData): pageData,
      },info.header||{}, info).then((res) => {
        if (res.code === config.SUCCESS) {
          callback();
          // console.log('action Done')
          resolve(res.data)
          Toaster.toaster({ type: 'success', content: res.msg, time: 3000 });
        } else {
          reject()
          Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch(()=>{
        
      });
    }
  }

  downAction(info, resolve, reject){
    const data = this.props.getSearchData();
    const self = this;
    if(info&&info.url) {
      let reqData = info.options&&info.options.length>0 ? self.setReq(info.options, {}): {}
      fetch(info.url, {
        method: info.method,
        data: Object.assign({}, reqData, data),
        responseType: 'blob', 
      },info.header||{}, info).then(response=>{
        let currentDate=getDateTimeStr().substring(0, 8)
        let url = window.URL.createObjectURL(new Blob([response]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `${currentDate}.xlsx`)
        document.body.appendChild(link)
        link.click()
        resolve()
      }).catch(()=>{
        reject()
      });
    }
  }

 

  checkRules(op, obg){
    let statusArr = []
    let showStatus = true;
    for(let i=0;i < op.ruleArr.length;i++){
      statusArr[i] = checkRuleItem(op.ruleArr[i], obg)
    }
    showStatus = checkArrStatus(statusArr, op.ruleModalType);
    return showStatus
  }

  doButtonAction(btn, resolve, reject, parent, parentData){
    const { pageData, rowIdx, callback } = this.props
    const self = this;
    if(parentData&&JSON.stringify(parentData)!=='{}'){
      btn.parentData = parentData
    }
    if(btn.modal == 'link'){
      // console.log('link start')
      parent&&parent.func(rowIdx, pageData, btn);
    }else if(btn.modal == 'doAjax'){
      // console.log('doAjax start')
      self.buttonAction(btn, resolve, reject)
    }else if(btn.modal == 'doParentAction'){
      self.props.doParentAction(btn, callback)             
    }else if(btn.modal == 'doParentSubmitAction'){
      // console.log('doParentSubmitAction start')
      self.props.doParentSubmitAction(btn, resolve, reject, callback) 
    }else if(btn.modal == 'downLoad'){
      self.downAction(btn)
    }else if(btn.modal == 'customMethod'){
      btn.customClick && btn.customClick(pageData);
    }
  }

  doPromiseArray(array){
    let sequence = Promise.resolve();
    array.forEach(function (item) {
        sequence = sequence.then(item);
    });
    return sequence;
  }

  render() {
    const { options, styles, pageData, size } = this.props
    const self = this;
    let bunDom = options&&options.length>0 ? options.map((btn, idx)=>{
        let showStatus =  false;
        if(btn.ruleArr&&btn.ruleArr.length>0) {
            showStatus = self.checkRules(btn, pageData)
        }
        // console.log('btn.text', btn.text,btn.ruleModal, showStatus,(btn.ruleModal - showStatus) !== 0 )
        return (btn.ruleModal - showStatus) !== 0 ? <Buttons key={`${idx}-btn`} style={styles} 
        text={btn.text} 
        size={size}
        {...btn.btnStyle}
        onClick={()=>{
          if(btn&&btn.actionModal){
            if(btn&&btn.actionArray.length>0){
              let array = [];
              for(let i=0;i<btn.actionArray.length;i++){
                let p = function (data) {
                  // console.log('data',  data)
                  return new Promise(function (resolve, reject) {
                    self.doButtonAction(btn.actionArray[i], resolve, reject, btn, data)
                  })
                }
                array.push(p);
              }
              try{
                self.doPromiseArray(array)
              }catch(err){
                // console.log('err', err)
              }
              
            }
          }else{
            self.doButtonAction(btn, ()=>{}, ()=>{}, btn, {})
          }
          
        }} /> : <span key={`${idx}-btn`} />
    }) : ''
    return bunDom;
  }
}

ButtonTools.propTypes = {
    options: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
    callback: PropTypes.func,
    styles: PropTypes.shape({}),
    pageData: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
    doParentAction: PropTypes.func,
    doParentSubmitAction: PropTypes.func,
    rowIdx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    getSearchData: PropTypes.func,
    size: PropTypes.string,
};

ButtonTools.defaultProps = {
  options: [],
  callback: ()=>{},
  styles: {},
  pageData: {},
  size: 'small',
  doParentAction: ()=>{},
  doParentSubmitAction: ()=>{},
  getSearchData: ()=>{},
  rowIdx: ''
};

export default ButtonTools;
