import { isArray, isLikeArray, isString } from './base';
import * as sessions from './sessions';
export function forEach(arr, func) {
  if (!isArray(arr)) {
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    func(arr[i], i);
  }
}

export function uniq(arr) {
  if (!isArray(arr)) {
    return [];
  }

  const hash = {};
  const res = [];

  forEach(arr, (item) => {
    if (item === undefined || item === null) {
      return;
    }
    if (isString(item)) {
      if (hash[item]) {
        return;
      }
      hash[item] = 1;
    }
    res.push(item);
  });
  return res;
}

export function every(arr, func) {
  if (!isArray(arr)) {
    return false;
  }

  for (let i = 0; i < arr.length; i++) {
    if (!func(arr[i], i)) {
      return false;
    }
  }

  return true;
}

export function from(obj, func) {
  if (Array.from) {
    return Array.from(obj, func);
  }
  let array = [];
  if (isArray(obj)) {
    array = obj;
  } else if (isLikeArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      array[i] = obj[i];
    }
  } else if (isString(obj)) {
    array = [obj];
  }

  if (func) {
    array = array.map((val, idx) => func(val, idx));
  }

  return array;
}

export function merge(arr) {
  return Object.assign({}, ...arr);
}

// @cutZero 数字零是否赋值
export function mergeList(array, obj, cutZero = false) {
  if (!obj) {
    return;
  }
  forEach(array, (item) => {
    if (item.items) {
      forEach(item.items, (t) => {
        if (obj[t.key] || (!cutZero && obj[t.key] === 0)) {
          t.value = obj[t.key];
        }
      });
    } else if (obj[item.key] || (!cutZero && obj[item.key] === 0)) {
      item.value = obj[item.key];
    }
  });
}

export function mergeListNew(array, obj, cutZero = false) {
  if (!obj) {
    return;
  }
  forEach(array, (item) => {
    if (item.items) {
      forEach(item.items, (t) => {
        if (obj[t.key] || (!cutZero && obj[t.key] === 0)) {
          t.value = obj[t.key];
        }
      });
    } else if (obj[item.key] || (!cutZero && obj[item.key] === 0)) {
      item.value = obj[item.key];
    }
  });
  return array;
}

export function mergeObg(array, obj) {
  if (!obj) {
    return;
  }
  forEach(array, (item) => {
    if (obj[item.key]) {
      item.value = obj[item.key];
    }
  });
  return array;
}

function clearDatesFunc(data, str) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const map = new Map();
  for (let i = 0; i < keys.length; i++) {
    if(!(values[i] === '' || values[i] === null || values[i]===undefined)) {
      map.set(keys[i], values[i])
    }
    if (typeof (values[i]) === 'object' && JSON.stringify(values[i]) !== '{}') {
      let res= clearDatesFunc(values[i], str);
      map.set(keys[i],res)
    }
  }
  return Object.fromEntries(map);
}

export function clearData(data, str){
  return clearDatesFunc(data, str);
}

function getDates(data, key) {
  if (data[key]) {
    return data[key];
  }
  let res = '';
  const keys = Object.keys(data);
  const values = Object.values(data);

  for (let i = 0; i < keys.length; i++) {
    if (typeof (values[i]) === 'object' && JSON.stringify(values[i]) !== '{}') {
      res = getDates(values[i], key);
      if (res !== '') break;
    }
  }
  return res;
}

export function getDate(data, key) {
  const result = getDates(data, key);
  return result;
}

export function arrDeleteRepeat(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '' || arr[i] === null || typeof (arr[i]) === 'undefined') {
      arr.splice(i, 1);
    }
  }
  return arr;
}

export function arrayToObg(arr, key, value) {
  let item = {};
  for (let i = 0; i < arr.length; i++) {
    item[arr[i][key]] = arr[i][value];
  }
  return item;
}

export function getItemForKey(arr, key, keyName) {
  let item = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][keyName] === key) {
      item = arr[i]; break;
    }
  }
  return item;
}

export function getItemKeyForValue(arr, key, keyName, valueName) {
  let item = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][keyName] === key) {
      item = arr[i][valueName]; break;
    }
  }
  return item;
}

function setType(valueType, value){
  switch(valueType){
    case 'Number':
        return Number(value);
    case 'String':
        return value.toString();
    case 'Object':
        return JSON.parse(value);
    case 'JSON':
        return JSON.parse(value);
    default: 
        return value
    }
}

export function setObjectType(valueType, value){
  switch(valueType){
    case 'Number':
        return Number(value);
    case 'String':
        return value.toString();
    case 'Object':
        return JSON.parse(value);
    case 'JSON':
        return JSON.parse(value);
    default: 
        return value
    }
}

export function setReqs(condition, parmes){
  if(!parmes) return;
  let resp = {}
  if(!(condition&&condition.length)) return;
  for(let i=0;i<condition.length;i++){
    let resValue = condition[i].value ? condition[i].value :parmes[condition[i].key]
    if(condition[i].valueType){
      resValue = setType(condition[i].valueType, condition[i].value)
    }
    resp[condition[i].text] = resValue
  }
  return resp
}

export function comSetReqs(condition, parmes, pageData){
  if(!parmes) return {};
  let resp = {}
  if(!(condition&&condition.length)) return resp;
  for(let i=0;i<condition.length;i++){
    let resValue = condition[i].value ? condition[i].value :parmes[condition[i].key]
    if(condition[i].value&&condition[i].value.indexOf('$P.')>=0){
      if(pageData){
        resValue = pageData[condition[i].value.replace('$P.', '')] 
      }
    }
    if(condition[i].valueType){
      resValue = setType(condition[i].valueType, condition[i].value)
    }
    if(condition[i].optionCacheKey){
      let cache = sessions.getStorage('caches')
      resValue = cache[condition[i].optionCacheKey.keyName]
    }
    resp[condition[i].text] = resValue
  }
  return resp
}

export function setReq(condition, parmes){
  if(!parmes) return;
  let resp = {}
  if(!(condition&&condition.length)) return;
  for(let i=0;i<condition.length;i++){
    resp[condition[i].key] = condition[i].value ? condition[i].value :parmes[condition[i].key]
  }
  return resp
}

export function getOptions(arr, key, value){
  let newArr = [];
  if(!arr) return newArr;
  for(let i=0;i<arr.length;i++){
      newArr.push({
        text: arr[i][key],
        value: arr[i][value],
        ...arr[i]
      })
  }
  return newArr
}

export function getOptionsWidthFiled(arr, key, value, keyFiled, valueFiled){
  let newArr = [];
  if(!arr) return newArr;
  for(let i=0;i<arr.length;i++){
      newArr.push({
        [keyFiled]: arr[i][key],
        [valueFiled]: arr[i][value],
      })
  }
  return newArr
}

export function checkInArr(arr, key, value){
  let status = false;
  for(let i=0;i<arr.length;i++){
      if(arr[i][key]== value) {
          status = true
      }
  }
  return status
}

export function checkInOfArr(arr, value){
  let status = false;
  for(let i=0;i<arr.length;i++){
      if(arr[i].indexOf(value) >= 0) {
          status = true
      }
  }
  return status
}

export function checkInArrIndex(arr, key, value){
  let status = false;
  let index = 0
  for(let i=0;i<arr.length;i++){
      if(arr[i][key]== value) {
          status = true
          index = i
      }
  }
  return {status: status, index: index}
}

export function changeNode(arr, key, node){
  for(let i=0;i<arr.length;i++){
      if(arr[i][key]== node[key]) {
          arr[i] = node
      }
  }
  return arr;
}

export function delNode(arr, key, value){
  // let newData = JSON.parse(JSON.stringify(datas));
  for(let i=0;i<arr.length;i++){
      if(arr[i][key]== value) {
        arr.splice(i, 1)
      }
  }
  return arr;
}

export  function arrToObg(arr, key, value){
  if(!(arr&&arr.length)) {return []}
  let obg = {}
  for(let i=0;i<arr.length;i++){
      obg[arr[i][key]] = arr[i][value] 
  }
  return obg;
}


let lastTime = 0;
export  function throttle(delay, action){
  return function(){
    var curr = +new Date();
    if (curr - lastTime > delay){
      action()
      lastTime = curr 
    }
  }
}


export function fromData(transForm, dataArr){
  let data = []
  for(let i=0;i<transForm.length;i++){
      data = dataArr[transForm[i].text]
  }
  return data
}

export function resetHeader(headers){
  if(!headers) return {};
  let newHeader = {}
  for(let i=0;i<headers.length;i++){
      newHeader[headers[i].text] = headers[i].value
  }
  return newHeader;
}

function getLengthData(obg, arr, length, num){
  if(num == length) {
      return obg[arr[num]]
  }
  return getLengthData(obg[arr[num]], arr, length, num+1)
}

export function transData(transForm, dataArr){
  for(let i=0;i<transForm.length;i++){
      let transValue = ''
      if(transForm[i].text.indexOf('$')>=0){
          let newStrArr = transForm[i].text.replace('$', '').split('.') || [];
          transValue = getLengthData(dataArr, newStrArr, (newStrArr.length - 1), 0)
      } else {
          transValue = dataArr&&dataArr[transForm[i].text]
      }
      if(transForm[i].valueType&&transValue){
          transValue = this.setObjectType(transForm[i].valueType, transValue)
      }
      dataArr[transForm[i].value] = transValue
  }
  return dataArr
}