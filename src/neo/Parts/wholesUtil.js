import { Toaster } from '../Components/';
import { doRequest } from './changeAction';
function exChangeFormula(itm){
    let result = '';
    switch (itm) {
        case 'gt':
            result = '>'; break;
        case 'lt':
            result = '<'; break;
        case 'ltq':
            result = '>='; break;
        case 'gtq':
            result = '<='; break;
        case 'eq':
            result = '=='; break;
        default:
            result = ''
    }
    return result
}

function exChangeCalculation(itm){
    let result = '';
    switch (itm) {
        case 'add':
            result = '+'; break;
        case 'reduce':
            result = '-'; break;
        case 'ride':
            result = '*'; break;
        case 'division':
            result = '/'; break;
        case 'leftBrackets':
            result = '('; break;
        case 'rightBrackets':
            result = ')'; break;
        default:
            result = ''
    }
    return result
}

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

function checkRuleItem(op, self){
    let showStatus = true;
    let statusArr = []
    if(!op.rule||op.rule.length==0) return false;
    for(let i=0;i < op.rule.length;i++){
      // console.log('pageDatassss', pageData[btn.rule[i].text])
      if(self[`$$${op.linkDomKey}`]&&(self[`$$${op.linkDomKey}`].getValue() == op.rule[i].value) ) {
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

function checkRules(op, self){
    let statusArr = []
    let showStatus = true;
    if(!(op&&op.ruleArr)) return true;
    for(let i=0;i < op.ruleArr.length;i++){
      statusArr[i] = checkRuleItem(op.ruleArr[i], self)
    }
    showStatus = checkArrStatus(statusArr, op.ruleModalType);
    return showStatus
}

function getFactor(factors, self, rowIx){
    if(factors&&factors.length>0) {
        let factorStr = '';
        const limitArr = ['Factor', 'ConstValue'];
        if(limitArr.indexOf(factors[0].factorType)<0||limitArr.indexOf(factors[factors.length-1].factorType)<0){
            return false
        }
        for(let i=0;i<factors.length;i++){
            if(factors[i].factorType == 'Factor'){
                let result = 0;
                if(self[`$$${factors[i].linkDomKey}`]){
                    result =  Number(self[`$$${factors[i].linkDomKey}`].getValue())
                }
                if(rowIx!==undefined){
                    if(self[`$$${factors[i].linkDomKey}-${rowIx}`]){
                        result =  Number(self[`$$${factors[i].linkDomKey}-${rowIx}`].getValue())
                    } 
                }
                factorStr = factorStr + result;
            }
            if(factors[i].factorType == 'ConstValue'){
                factorStr = factorStr + factors[i].value;
            }
            if(factors[i].factorType == 'Formula'){
                factorStr = factorStr + exChangeFormula(factors[i].value);
            }
            if(factors[i].factorType == 'Calculation'){
                factorStr = factorStr + exChangeCalculation(factors[i].value);
            }
        }
        // console.log('factorStr', factorStr);
        return eval(factorStr);
    }
    return ''
}

function getObjValue(arr, self){
    let obg = {}
    if(arr&&arr.length>0) {
        for(let i=0;i<arr.length;i++){
            obg[arr[i].key] = self[`$$${arr[i].linkDomKey}`].getValue()
        }
        return obg
    }
    return obg;
}

function getFactorChange(wholeRules, self){
    for(let i=0;i<wholeRules.length;i++){
        // 校验类型为因式计算
        if(wholeRules[i].vaildType=='Factor'&&wholeRules[i].changeType=='onChange'){
            if(wholeRules[i].actionType=='valid'){
                let factorIn = getFactor(wholeRules[i].factors, self)
                // console.log('factorIn', factorIn)
                if (!factorIn) {
                  status = false;
                  Toaster.toaster({ type: 'error', content: wholeRules[i].errorMsg|| '表单填写错误' }, true);
                  break;
                }
            }
            if(wholeRules[i].actionType=='toValue'){
                let factorIn = getFactor(wholeRules[i].factors, self)
                // console.log('factorIn', factorIn)
                let passiveFactor = wholeRules[i].passiveFactor;
                if(passiveFactor&&passiveFactor.length>0&&factorIn){
                    for(let i=0;i<passiveFactor.length;i++){
                        let inputDom = self[`$$${passiveFactor[i].linkDomKey}`]; 
                        inputDom&&inputDom.setValue(factorIn);
                    }
                }
            }
        } else if(wholeRules[i].vaildType=='Rules'){ // 校验类型为满足规则
            const nowRule = wholeRules[i]
            let showStatus = checkRules(nowRule, self);
            // console.log('showStatus', showStatus);
            // console.log('nowRule', nowRule);
            let passiveFactor = nowRule.passiveFactor;
            let parames = getObjValue(nowRule.ruleArr, self)
            if(passiveFactor&&passiveFactor.length>0){
                for(let i=0;i<passiveFactor.length;i++){
                    let inputDom = self[`$$wrap-${passiveFactor[i].linkDomKey}`];
                    let innerInputDom = self[`$$${passiveFactor[i].linkDomKey}`];
                    if((nowRule.ruleModal - showStatus) !== 0){
                        if(nowRule.ruleActionType==="checkShow"){
                            if(inputDom&&inputDom.style) inputDom.style.display = 'inline-block';
                        } else if(nowRule.ruleActionType==="toDisable"){
                            if(innerInputDom&&innerInputDom.setDisable){
                                innerInputDom.setDisable(true);
                            }
                        } else if(nowRule.ruleActionType==="toApi"){
                            doRequest(nowRule.changeRequest, parames).then((res)=>{
                                // console.log(res);
                                innerInputDom&&innerInputDom.setValue(res);
                            }).catch((err)=>{
                                // console.log(err);
                            })
                        } else if(nowRule.ruleActionType==="toValue"){

                        } else if(nowRule.ruleActionType==="toInit"){
                            innerInputDom&&innerInputDom.initRequest(parmes);
                        }
                    } else{
                        if(nowRule.ruleActionType==="checkShow"){
                            if(inputDom&&inputDom.style) inputDom.style.display = 'none';
                        }
                        if(nowRule.ruleActionType==="toDisable"){
                            if(innerInputDom&&innerInputDom.setDisable){
                                innerInputDom.setDisable(false);
                            }
                        }
                    }
                }
            }
            
        }
    }
}

function getFactorChangeForEdit(wholeRules, self, rowIx, items, callBack){
    for(let i=0;i<wholeRules.length;i++){
        // 校验类型为因式计算
        if(wholeRules[i].vaildType=='Factor'&&wholeRules[i].changeType=='onChange'){
            if(wholeRules[i].actionType=='valid'){
                let factorIn = getFactor(wholeRules[i].factors, self, rowIx)
                // console.log('factorIn', factorIn)
                if (!factorIn) {
                  status = false;
                  Toaster.toaster({ type: 'error', content: wholeRules[i].errorMsg|| '表单填写错误' }, true);
                  break;
                }
            }
            if(wholeRules[i].actionType=='toValue'){
                let factorIn = getFactor(wholeRules[i].factors, self, rowIx)
                // console.log('factorIn', factorIn)
                let passiveFactor = wholeRules[i].passiveFactor;
                if(passiveFactor&&passiveFactor.length>0&&factorIn){
                    for(let i=0;i<passiveFactor.length;i++){
                        items[passiveFactor[i].linkDomKey] = factorIn
                        callBack(items)
                    }
                }
            }
        }
    } 
}
export { getFactor, getFactorChange, getFactorChangeForEdit }