/**
 * 根据时间戳返回24小时制时间
 *  ex: 2017-12-26 19:40:04
 * @param t
 * @returns {string}
 */
export function getTime(t) {
  var timeStr = new Date(t).toLocaleString();
  var arr1 = timeStr.split(" ");
  var arr2 = arr1[0].split("/");
  for(var i = 1; i <= 2; i++) {
    if(parseInt(arr2[i], 10) < 10) {
      arr2[i] = "0" + arr2[i];
    }
  }
  var str1 = arr2.join("-");
  var arr3 = arr1[1].split(":");
  if(arr3[0].indexOf("上午") !== -1) {
    if(parseInt(arr3[0].replace(/上午/g, ""), 10) < 10) {
      arr3[0] = "0" + arr3[0].replace(/上午/g, "");
    } else {
      arr3[0] = arr3[0].replace(/上午/g, "");
    }
  }
  if(arr3[0].indexOf("下午") !== -1) {
    arr3[0] = (12 + parseInt(arr3[0].replace(/下午/g, ""), 10)).toString();
  }
  var str2 = arr3.join(":");
  return str1 + " " + str2;
}

/**
 * 根据正常时间返回时间戳
 *  这里除不除一千看后台返回数据(按理说要除)
 * @param tm
 * @returns {number}
 */
export function getTimeStamp(tm) {
 return (new Date(tm)).getTime() ;
}

/**
 * 根据正常时间字符串
 * @param tm
 * @returns {number}
 */
export function getDateTimeStr(tm) {
  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  let hours= d.getHours()<10 ?"0"+d.getHours(): d.getHours();
  let minutes=d.getMinutes()<10 ?"0"+d.getMinutes(): d.getMinutes();
  let seconds=d.getSeconds()<10 ?"0"+d.getSeconds(): d.getSeconds();
  let hms = hours.toString()+minutes.toString()+seconds.toString();
  let YMDHMS = year.toString() + month.toString() + day.toString() + hms;
  return  YMDHMS;
 }
 export function formatDateTime(t) {
  const d = new Date(t).toJSON();
  return new Date(+new Date(d) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '');
}
export function createTime(t) {
  const d = new Date(t);
  let year = d.getFullYear();
  let month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
  let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  let YMD = year + '-' + month + '-' + day;

  return YMD;
}
