// const env = process.env.NODE_ENV || 'local';
import {Toaster, Loader} from '../../neo/Components';
import * as storage from './storage';
import * as sessions from './sessions';
import * as arryUtil from './array';

export default function (url, options = {}, header, config) {
  let headers = Object.assign({
    'token': sessions.getStorage('token'),
  }, arryUtil.resetHeader(header))
  let reqData = options.data;
  if(config&&config.requestType){
    if(config.requestType=='transKey'){
        reqData = arryUtil.transData(config.requestOption, reqData)
    }
    if(config.requestType=='fromKey'){
        reqData = arryUtil.fromData(config.requestOption, reqData)
    }
  }

  const content = {
    method: options.method || 'GET',
    headers: headers
  };
  if (options.method === 'POST') {
    content.body = reqData;
  } else if (options.method === 'GET') {
    // 如果发送字段为空 则不发该字段，此处处理为了兼容后端。可能会有坑
    const params = Object.entries(options.data).filter(param => param[1] !== '').map(param => `${param[0]}=${param[1]}`).join('&');
    // const params = Object.entries(options.data).map(para
    // m => `${param[0]}=${param[1]}`).join('&');
    if (params !== '') {
      url += url.indexOf('?') > -1 ? `&${params}` : `?${params}`;
    }
  }
  Loader.showProgress();

  return fetch(`${url}`, content).then((response) => {
    Loader.hideProgress();
    if (response.status !== 200) {
      Toaster.toaster({ type: 'error', content: '系统错误',time: 3000 },true)
      throw new TypeError('系统错误!');
    } else {
      const res = response.json();
      return res;
    }
  }
  )
  .catch(error => {Loader.hideProgress(); return error;});
}
