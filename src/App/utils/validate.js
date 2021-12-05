export default {
  // 手机号
  isPhone: value => /^1[3456789]\d{9}$/.test(value),
  // 身份证
  isIDCard: value => /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value),
  // 银行卡
  isBankCard: value => /^(\d{16}|\d{18}|\d{19})$/.test(value),
  // 邮箱
  isEmail: value => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value),

  isMoney: value => /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/.test(value),
  // 真实姓名
  isName: value => /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/.test(value),
  //座机区号
  isAreaCode:value=>/^\d{3,4}$/.test(value),
  //座机号
  isFixedPhone:value=>/^\d{7,8}$/.test(value),
  //座机分号
  isTreePhone:value=>/^\d{1,6}$/.test(value),
  //最大金额
  // isFinaceMoney: value => /^([1-9]\d{7})$/.test(value),
  isFinaceMoney: value => /^([1-9]\d{3,7})$/.test(value),
  //字母数字汉字
  isTextExp:value=>/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(value),
  //汉字
  isChinese:value=>/^[\u4E00-\u9FA5]+$/.test(value),
  //数字
  isNum:value=>/^[0-9]+$/.test(value),
    //单位名称
  isComName:value=>/^[\u4E00-\u9FA5\(（）()·\)A-Za-z0-9]+$/.test(value),
};