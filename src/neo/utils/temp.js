const map = new Map([
    ['10001', '刷卡'],
    ['10002', '微信支付']
]);
  
function checkInMap(val, map){
    let status = map.has(val);
    if(status){
        return map.get(val)
    }else {
        return ''
    }
}

