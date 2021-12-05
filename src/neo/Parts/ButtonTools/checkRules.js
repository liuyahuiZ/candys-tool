function checkArrStatus(arr, type){
    let result = arr[0];
    for(let i=1;i<arr.length;i++){
      if(type=='OR') {
        result = result || arr[i]
      } else if(type=='AND'){
        result = result && arr[i]
      }
    }
    return result
}

function checkRuleItem(op, obg){
    let showStatus = true;
    let statusArr = []
    if(!op.rule||op.rule.length==0) return false;
    for(let i=0;i < op.rule.length;i++){
        // console.log('pageDatassss', pageData[btn.rule[i].text])
        if(obg[op.rule[i].text]&&(obg[op.rule[i].text] == op.rule[i].value) ) {
        showStatus = true;
        statusArr[i] = true;
        } else{
        showStatus = false;
        statusArr[i] = false;
        }
    }
    showStatus = checkArrStatus(statusArr, op.moldal)
    return showStatus
}

export { checkArrStatus, checkRuleItem }