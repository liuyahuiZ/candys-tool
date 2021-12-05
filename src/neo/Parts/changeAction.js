import fetch from '../utils/request';
import config from '../utils/config';
import { Toaster } from '../Components/';
var last = 0;
function throttle(delay, action){
    return function(){
      var curr = +new Date();
      if (curr - last > delay){
        action()
        last = curr 
      }
    }
}
  
function doRequest(urlInfo, parmes){
    return new Promise((resolve, reject)=>{
      fetch(urlInfo.url, {
        method: urlInfo.method,
        data: urlInfo.options&&urlInfo.options.length > 0 ? setReq(urlInfo.options, parmes) : {},
      }, urlInfo.header||{}, urlInfo).then((res) => {
        if (res.code === config.SUCCESS) {
          let data = res.data
          if(urlInfo.valueKey){
            data = res.data[urlInfo.valueKey]
          }
          resolve(data)
        } else {
          reject(res.msg)
          Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch((err)=>{
        reject(err)
        Toaster.toaster({ type: 'error', content: '系统错误', time: 3000 });
      });
    })
    
  }

function checkShow(itm, v, ruleModal){
    let showStatus =  false;
    if(itm.rule&&itm.rule.length>0) {
      for(let i=0;i < itm.rule.length;i++){
        if(itm.rule[i].value == v ) {
          showStatus = true;
        }
        // console.log(showStatus, itm.rule[i].value, v);
      }
    }
    
    return ruleModal!==undefined ? (ruleModal - showStatus) !== 0 : showStatus;
  }

function doChange(item, self, value, parmes, allValue, callback, resolve, rowIdx){
    let itemDom = self[`$$wrap-${item.linkDomKey}${rowIdx!==undefined?`-${rowIdx}`:''}`];
    let inputDom = self[`$$${item.linkDomKey}${rowIdx!==undefined?`-${rowIdx}`:''}`];
    // console.log('inputDom', inputDom);
    if(item.ruleModal!==undefined){
      if(item.rule&&item.rule.length>0){
        let status = false; 
        if(checkShow(item, value, item.ruleModal)){
          if(itemDom) itemDom.style.display = 'inline-block';
          status = true
        } else {
          if(itemDom) itemDom.style.display = 'none';
          status = false
        }
        if(callback) callback(status, item.linkDomKey, resolve);
        if(resolve) resolve()
      }
      
    }

    if(item.disableModal!==undefined){
      if(item.rule&&item.rule.length>0){
        let status = false; 
        if(checkShow(item, value, item.disableModal)){
          if(inputDom) inputDom.setDisable(true);
          status = true
        } else {
          if(inputDom) inputDom.setDisable(true);
          status = false
        }
        if(callback) callback(status, item.linkDomKey, resolve);
        if(resolve) resolve()
      }
      
    }
    if(item&&item.hasChangeRequest){
      throttle(1500, ()=>{doRequest(item.changeRequest, parmes).then((res)=>{
        // console.log(res);
        inputDom&&inputDom.setValue(res);
        if(resolve) resolve()
        }).catch((err)=>{
          // console.log(err);
        })}
      )()
      
    }
    if(item&&item.hasChangeTo){
      if(item.toKey&&item.toKey.length > 0) {
        for(let i=0;i<item.toKey.length;i++){
          let value = allValue
          if(typeof allValue == 'object') {
           value  = allValue[item.toKey[i].value] || ''
          }
          if(value!==undefined){
            inputDom&&inputDom.setValue(value);
          }
        }
      } else {
        inputDom&&inputDom.setValue(allValue);
      }
      if(resolve) resolve()
    }
  
    if(item&&item.hasChangeInit){
      if(item.InitKey&&item.InitKey.length > 0) {
        let parmes= {}
        for(let i=0;i<item.InitKey.length;i++){
          if(item.InitKey[i].valueType =="Object"){
            parmes = JSON.parse(item.InitKey[i].value)
            let keys= Object.keys(parmes);
            for(let j=0;j<keys.length;j++){
              parmes[keys[i]] = value
            }
          } else {
            parmes[item.InitKey[i].value] = allValue[item.InitKey[i].key]
          }
          
          inputDom&&inputDom.initRequest(parmes);
        }
      } else {
        inputDom&&inputDom.initRequest(allValue);
      }
      if(resolve) resolve()
    }
  }

function doPromiseArray(array){
    let sequence = Promise.resolve();
    array.forEach(function (item) {
        sequence = sequence.then(item);
    });
    return sequence;
}

function loop(arr, self, value, parmes, allValue='', callback, rowIdx){
    let array = [];
    for(let i=0;i<arr.length;i++){
      let p = function (data) {
        // console.log('data',  data)
        return new Promise(function (resolve, reject) {
          doChange(arr[i], self, value, parmes, allValue, callback, resolve, rowIdx)
        })
      }
      array.push(p);
    }
    try{
      doPromiseArray(array)
    }catch(err){
      // console.log('err', err)
    }
}

export { loop, doRequest }