function validLocalStorageLimit(key) {
    const stora = JSON.parse(localStorage[key]);
    const zeroDate = new Date().getTime();
    if ((zeroDate - stora.limitTime) > stora.limit) {
      localStorage[key] = '';
    }
  }
  function randomString(len) {
    len = len || 32;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
  export function getStorage(key) {
    if(localStorage['userid']&&localStorage['userid']!==null){
      let groupKey = localStorage['userid'];
      let stora = JSON.parse(localStorage[groupKey]);
      if(stora[key]&&stora[key]!==''){
          return stora[key].item;
      }
      return ''
    }
    return {};
  }
  
  export function setStorage(key, value) {
    if(localStorage['userid']&&localStorage['userid']!==null){
      let groupKey = localStorage['userid'];
      let stora = JSON.parse(localStorage[groupKey]);
      stora[key] ={
        item: value,
        type: typeof value
      }
      localStorage[groupKey] = JSON.stringify(stora);
    } else{
      let groupKey = randomString(10);
      localStorage['userid'] = groupKey;
      localStorage[groupKey]=JSON.stringify({
        [key]: {
          item: value,
          type: typeof value
        }
      })
    }
  }
    
  export function setStorageWithExp(key, value, exp) {
    if(localStorage['userid']&&localStorage['userid']!==null){
      let groupKey = localStorage['userid'];
      let stora = JSON.parse(localStorage[groupKey]);
      stora[key] ={
        item: value,
        type: typeof value,
        exp: exp ? new Date().getTime() + (exp * 1000) : 0
      }
      localStorage[groupKey] = JSON.stringify(stora);
    } else{
      let groupKey = randomString(10);
      localStorage['userid'] = groupKey;
      localStorage[groupKey]=JSON.stringify({
        [key]: {
          item: value,
          type: typeof value,
          exp: exp ? new Date().getTime() + (exp * 1000) : 0
        }
      })
    }
  }
  
  export function getStorageWithExp(key) {
    if(localStorage['userid']&&localStorage['userid']!==null){
      let groupKey = localStorage['userid'];
      let stora = JSON.parse(localStorage[groupKey]);
      if(stora[key]&&stora[key]!==''){
        const now = new Date().getTime();
        if (now >= stora[key].exp) {
          delete stora[key];
          localStorage[groupKey] = JSON.stringify(stora);
          return '';
        }
        return stora[key].item;
      }
      return '';
    }
    return null;
  }
  
  export function removeAllStorage() {
    let groupKey = localStorage['userid'];
    localStorage.removeItem(groupKey)
    localStorage.removeItem('userid');
    localStorage.clear()
  }
  
  export function removeStorage(key) {
    let groupKey = localStorage['userid'];
    let stora = JSON.parse(localStorage[groupKey]);
    delete stora[key];
    localStorage[groupKey] = JSON.stringify(stora);
  }
  