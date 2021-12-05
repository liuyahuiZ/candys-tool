import axios from 'axios';
import {Toaster, Loader, Modal, PopModal, PopContainer} from '../Components';
import {getDateTimeStr} from './timeStamp';
import * as arryUtil from './array';
import * as sessions from './sessions';
import * as storage from './storage';
import sysConfig from './config';

const cacheConfig={
    cacheTime: 10000,
    mangeCacheTime: 3600*1000,
    mangeKeyWords: '/api/admin/',
    expectURL: ['api/admin/api/page/page_modify', 'api/admin/api/pageConfig/pageConfig_add',
'api/admin/api/pageConfig/pageConfig_modify'],
    enable: false
}
function setReq(obj, header) {
    return {
      'chCode': sessions.getStorage('userInfo').channelId||'',
      'reqNo': parseInt(Math.random() * Math.pow(10, 15)),
      'source': 'candys',
      'reqTime': getDateTimeStr(),
      'version': '1.0',
      'data': obj,
      ...header
    }
  }  

function codeTip(code, dataArr){
    let check = arryUtil.checkInArrIndex(dataArr, 'text', code)
    if(check.status){
        let obg = dataArr[check.index]
        Modal.alert({ title: obg.title,
        content: obg.value,
        style: '',
        type: obg.type||'small',
        btnConStyle: 'right',
        btn: {
          text: '确认',
          type: 'primary',
          style: { 'height': '2rem', 'minWidth': '100px'}
        }
      },
      (id, callback) => { 
          callback(id);
      },
      (id, callback) => { callback(id); });
    }
}

function setDirect(data, config){
    if(config&&config.isDirect&&config.directName){
        const Dictionaries = sessions.getStorage('Dictionaries')||{};
        let resData = arryUtil.getOptions(data, config.textKey, config.valueKey)
        Dictionaries[config.directName] = resData;
        sessions.setStorage('Dictionaries', Dictionaries);
    }
}

export default function (url, options = {}, header, config) {
    Loader.showProgress();
    return new Promise((resolve, reject)=>{
        let headers = Object.assign({
            // 'Content-Type': 'application/json',
            'token': sessions.getStorage('token'),
        }, arryUtil.resetHeader(header))
        let reqData = options.data;
        if(config&&config.requestType){
            if(config.requestType=='transKey'){
                reqData = arryUtil.transData(config.requestOption, reqData||{})
            }
            if(config.requestType=='fromKey'){
                reqData = arryUtil.fromData(config.requestOption, reqData)
            }
        }
        // 开启字典数据
        if(config&&config.isDirectRead&&config.directName){
            const Dictionaries = sessions.getStorage('Dictionaries');
            let datas = Dictionaries[config.directName];
            if(datas&&JSON.stringify(datas)!=='{}'){
                Loader.hideProgress();
                resolve({code: sysConfig.SUCCESS, data: datas})
                return; 
            }
        }
        let requestData = setReq(reqData, arryUtil.resetHeader(header));
        
        // 缓存api数据 暂时隐藏
        // if(cacheConfig.enable){
        //     if(sessions.getStorage(`${url}-Data-${JSON.stringify(reqData)}`)) {
        //         let cacheTime = sessions.getStorage(`${url}-Data-${JSON.stringify(reqData)}-time`)
        //         let limitTime = cacheConfig.cacheTime
        //         if(url.indexOf(cacheConfig.mangeKeyWords)>=0){
        //             limitTime = cacheConfig.mangeCacheTime
        //         } 

        //         if(arryUtil.checkInOfArr(cacheConfig.expectURL,url)){
        //             limitTime = 0
        //         }
        //         if(((new Date()).getTime() - cacheTime) <= limitTime) {
        //             resolve(sessions.getStorage(`${url}-Data-${JSON.stringify(reqData)}`))
        //             Loader.hideProgress();
        //             return; 
        //         }
        //     }
        // }

        // requestData = arryUtil.clearData(requestData, '')
        let Content = Object.assign({}, options, {
            method: options.method,
            url: url,
            headers: headers,   
            data: requestData
        })
        axios(Content).then((response) => {
            Loader.hideProgress();
            if (response.status !== 200) {
                Toaster.toaster({ type: 'error', content: '系统错误',time: 3000 },true)
                reject(response)
            } else {
                if( response.data.code=='99995'|| response.data.code === '9992' ){
                    Toaster.toaster({ type: 'error', content: response.data.msg,time: 3000 },true);
                    PopModal.closeAll();
                    PopContainer.closeAll();
                    storage.removeAllStorage();
                    sessions.removeAllStorage();
                    reject();
                    setTimeout(()=>{
                        // return top.document.location.replace('/LoginPage')
                        // hashHistory.push({
                        //     pathname: 'LoginPage',
                        //     query: ''
                        // });
                        location.hash="/LoginPage"
                    },1000)
                }
                let resultData = {}
                if(config&&config.codeTip){
                    codeTip(response.data.code, config.codeTip)
                }
                // 缓存api数据 暂时隐藏
                // sessions.setStorage(`${url}-Data-${JSON.stringify(reqData)}-time`, (new Date()).getTime())
                //{'responTransType': transKey(字段转换)/fromKey(隔层取值), 'transData': []}
                if(config&&config.responType){
                    if(config.responType=='transKey'){
                        resultData = arryUtil.transData(config.transOption, response.data.data||{})
                        setDirect(resultData, config)
                        resolve({...response.data,data: resultData})
                        return 
                    }
                    if(config.responType=='fromKey'){
                        resultData = arryUtil.fromData(config.transOption, response.data.data)
                        setDirect(resultData, config)
                        resolve({...response.data,data: resultData})
                        return
                    }
                    // 缓存api数据 暂时隐藏
                    // sessions.setStorage(`${url}-Data-${JSON.stringify(reqData)}`, {...response.data,data: resultData})
                }
                setDirect(response.data.data, config)
                
                // 缓存api数据 暂时隐藏
                // sessions.setStorage(`${url}-Data-${JSON.stringify(reqData)}`, response.data)
                resolve(response.data)
            }
        }).catch((error) => {
            // console.log('err', error)
            Loader.hideProgress();
            Toaster.toaster({ type: 'error', content: '系统错误',time: 3000 },true)
            reject(error)
        });
    })
    
}