import { getDateTimeStr } from './timeStamp';
import { hashHistory } from 'react-router';
import { utils } from 'neo';
import Hex from './Hex';
import SM2 from './sm2';
import PublicKey from '../config/publishKey';

const { storage, sessions } = utils;

export function setReq(obj) {
    return {
        "appUser": 'jfxqj_wx',
        "requestData": obj,
        "requestNo": parseInt(Math.random()*Math.pow(10,15)),
        "requestTime": getDateTimeStr(),
        "source": "jfxqj_wx",
        "version": "1.2",
        "productCode": "2000",
        "channelCode": 'jbs2000',
        "accessMode": 'wx',
        "clientType": 'wx',
        "osType": 'weichart',
        "appVersion": '1.0',
        "jfpalVersion": '1.0',
        "mobileSerialNum": storage.getStorage('userId'),
        "phone": storage.getStorage('userId')
    }
}

export function goLink(link, itm){
    if(link) {
      hashHistory.push({
        pathname: link,
        query: itm || ''
      });
    }
}

export function checkAdminUser(pathname, callBack){
  const userInfo = sessions.getStorage('userInfo')
  if(pathname !== '/LoginPage') {
    if(!userInfo||(JSON.stringify(userInfo)==='{}')){
        location.hash="/LoginPage"
        return false
    }
    let userNature= userInfo.role;
    const manageUrl = ['/Projects', '/ProjectManage'];
    const userWhite = ['admin']
    const IpwhiteList = ['121.89.184.22','localhost'];
    if(IpwhiteList.indexOf(window.location.hostname)>=0){
        return true;
    }
    // 判断非开发人员进入项目管理页面
    if(manageUrl.indexOf(pathname)>=0&&(userWhite.indexOf(userNature)<0)){
        location.hash="/404"
        return false
    }
  }
}

export function setCache(data){
    sessions.setStorage('caches', data)
    sessions.setStorage('userInfo', data)
    sessions.setStorage('token', data.token)
}

export function sm2encrypt(str){
    const publicKey = PublicKey.PUBLISH_KEY
    const sm2DataHex = Hex.utf8StrToHex(str)
    // 加密结果
    const result = SM2.encrypt(publicKey, sm2DataHex)
    return result;
}