import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { Buttons, Toaster, LoadPage } from '../../Components';
import isValid from '../../utils/validFuncs';
import styles from './style';
import * as arrayUtils from '../../utils/array';
import genInput from '../factory';
import md5 from 'js-md5';
import * as sessions from '../../utils/sessions';
import formatPart from '../FormatPart';
import ButtonTools from '../ButtonTools';
const showError = (msg) => { console.log(msg); };

export default class SearchPart extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchStatus: false,
      conditions: this.props.conditions || {},
      cachData: this.props.cachData,
      listStatus: {},
      checkStatus: ''
    };
    this.search = this.search.bind(this);
    this.genInput = genInput.bind(this);
    this.getSearchData = this.getSearchData.bind(this);
    this.getData = this.getData.bind(this);
    this.checkValid = this.checkValid.bind(this);
  }
  componentWillReceiveProps(nextProps){
    this.mergeList(nextProps.conditions, nextProps.searchParams);
    this.setState({
      conditions: nextProps.conditions,
    })
  }
  getSearchData() {
    const { conditions } = this.state;
    const data = {};
    arrayUtils.forEach(conditions, (condition) => {
      if (condition.items) {
        arrayUtils.forEach(condition.items, (item) => {
          const $$dom = this[`$$${item.key}`];
          let value = $$dom.getValue ? $$dom.getValue() : $$dom.value;
          if(condition.cacheKey){
            let cache = sessions.getStorage('caches')
            value = cache[condition.cacheKey.keyName]
          }
          item.value = value
          data[item.key] = item.format ? item.format(value) : value;
        });
      } else {
        const $$dom = this[`$$${condition.key}`];
        let value = $$dom.getValue ? $$dom.getValue() : $$dom.value;
        if(condition.cacheKey){
          let cache = sessions.getStorage('caches')
          value = cache[condition.cacheKey.keyName]
        }
        condition.value = value
        if(condition.formatModel){
          value = formatPart(condition, value, condition.formatStr, condition.replaceStr)
        }
        data[condition.key] =  value;
      }
    });
    return data;
  }


  checkRequired(valid, conditionValid) {
    if (valid) {
      return (
        <span style={styles.require}>*</span>
      );
    }

    return null;
  }

  getDomData(item, format) {
    const $$dom = this[`$$${item.key}`];
    let value = $$dom.getValue ? $$dom.getValue() : $$dom.value;
    if(item.cacheKey){
      let cache = sessions.getStorage('caches')
      value = cache[item.cacheKey.keyName]
    }
    if (format && item.format && value !== '') {
      return item.format(value);
    }

    return value;
  }
  getData() {
    const { conditions } = this.state;
    const data = {};
    arrayUtils.forEach(conditions, (item) => {
      arrayUtils.forEach(item.items, (it) => {
        data[it.key] = this.getDomData(it, true);
      });
    });

    return data;
  }
  doToaster(errorArr){
    if(errorArr.length>0)
    Toaster.toaster({ type: 'error', content: errorArr[0].errorMsg|| '系统错误' }, true);
  }
  // 表单验证
  // 每一项：
  // getValue: 获取输入值
  // valid: string/function/reg
  // errorMsg: 报错文字
  isValid() {
    const { conditions } = this.state;
    let hasShowError = false;
    return arrayUtils.every(conditions, (item) => {
      const { valid, errorMsg } = item;
      const $$dom = this[`$$${item.key}`];
      const value = $$dom.getValue ? $$dom.getValue() : $$dom.value;
      const res = isValid(value, valid);

      if (!hasShowError && !res && errorMsg) {
        showError(errorMsg);
        hasShowError = true;
      }
      return res;
    });
  }
  checkItemValid(item) {
    const { valid, validDiy } = item;
    const $$dom = this[`$$${item.key}`];
    const value = $$dom.getValue ? $$dom.getValue() : $$dom.value;
    let newVaild = valid;
    if(valid == 'diy'){
      newVaild = new RegExp(validDiy) ;
    }
    return {status: isValid(value, newVaild), value: value};
  }
  checkValid() {
    const { listStatus, conditions } = this.state;
    let status =  true;
    let newEditItemList = JSON.parse(JSON.stringify(conditions));
    let newListStatus = JSON.parse(JSON.stringify(listStatus));
    let errorArr = []
    // 单个校验
    for(let i=0;i<newEditItemList.length;i++){
      const res = this.checkItemValid(newEditItemList[i]);
      if (!res.status) {
        status = false;
        newEditItemList[i].isValid = true
        newEditItemList[i].value = res.value
        newListStatus[new Date().getTime()] = true;
        // this.setState({
        //   conditions:  newEditItemList,
        //   listStatus: newListStatus,
        // })
        errorArr.push({
          errorKey: newEditItemList[i],
          errorMsg: newEditItemList[i].errorMsg
        })
        // console.log(newEditItemList[i]);
      } else{
        newEditItemList[i].isValid = false
        newEditItemList[i].value = res.value
      }
    }
    if(status){
      this.setState({
        conditions:  newEditItemList
      })
    }

    this.doToaster(errorArr)
    return status;
  }

  mergeList(array, obj) {
    this.array = array;
    if (!obj) {
      return;
    }
    arrayUtils.forEach(array, (item) => {
      if (item.items) {
        arrayUtils.forEach(item.items, (t) => {
          t.value = obj[t.key];
        });
      } else {
        item.value = obj[item.key];
      }
    });
  }
  search() {
    const { beforeSearch, onSearch } = this.props;
    const { conditions } = this.state
    // if (!this.isValid()) {
    //   return;
    // }
    if (this.checkValid()) {
      if (beforeSearch) {
        beforeSearch();
      }
      const data = this.getSearchData();
      onSearch(data);
      this.mergeList(conditions, data);
    }
  }

  resetSearchData(){
    let  newConditions  = this.state.conditions;
    for(let i=0;i<newConditions.length;i++){
      newConditions[i].value = ''
    }
    this.setState({
      doReset: true,
      conditions: newConditions
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    const { conditions } = this.state;
    // console.log(listStatus);
    // console.log(nextState.listStatus)
    // console.log('componentWillUpdate', md5(JSON.stringify(nextState.listStatus)), md5(JSON.stringify(listStatus)));
    if(nextState.doReset) { setTimeout(()=>{ this.setState({doReset: false}) }, 1000); return true; }
    if(nextState.conditions.length == conditions.length) {
      return false
    }
    return true
  }
  render() {
    const { buttonsContainerStyle, buttons,  loadingStatus} = this.props;
    const { conditions } = this.state;
    const self = this;
    return (
          <div style={styles.searchContainer}>
            {loadingStatus == 'LOADING' ? <div className="width-100"><LoadPage /></div> : ''}
            {
              conditions&&conditions.length>0? conditions.map((condition, idx) => {
                // const key = `${idx}-${condition.text}`;
                const dispStyle = {};
                if (condition.isShow!==undefined) {
                  if (condition.isShow==false) {
                    dispStyle.display = 'none';
                  }
                }
              
                let contStyle = {}
                if(condition.contStyle) {
                  contStyle = arrayUtils.arrToObg(condition.contStyle, 'text', 'value')
                  // console.log(contStyle);
                }
                let textContStyle= {}
                if(condition.textContStyle) {
                  textContStyle = arrayUtils.arrToObg(condition.textContStyle, 'text', 'value')
                  // console.log(contStyle);
                }
                let labelStyle = {}
                if(condition.labelStyle) {
                  labelStyle = arrayUtils.arrToObg(condition.labelStyle, 'text', 'value')
                  // console.log(contStyle);
                }
                let inputStyle = {}
                if(condition.type=="date"){
                  inputStyle = {'width': 'auto'}
                }
                return (
                <div
                  style={Object.assign({}, styles.line, condition.wrapStyle, contStyle, dispStyle)}
                  key={condition.key}
                  ref={(dom) => {
                    this[`$$wrap-${condition.key}`] = dom;
                  }}
                >
                  <span className={'font-size-normal'} style={Object.assign({}, styles.label, labelStyle)}>
                    {this.checkRequired(condition.valid)} {condition.text} 
                  </span>
                  <div key={condition.key} style={Object.assign({}, styles.keys,  inputStyle, textContStyle)}>
                    {
                      this.genInput(condition)
                    }
                    <span style={styles.after}>{condition.after || ''}</span>
                  </div>
                </div>)
              }) : <div className="width-100"></div>
            }
            <div style={arrayUtils.merge([styles.buttons, buttonsContainerStyle])} >
            <Buttons
              text="查询"
              type={'primary'}
              style={styles.button}
              plain={false}
              onClick={this.search}
              disabled={this.state.searchStatus}
              iconName={'search'}
              hasIcon
            />
            { conditions&&conditions.length>0? <Buttons
              text="重置"
              type={'error'}
              style={styles.button}
              plain={true}
              onClick={()=>{ this.resetSearchData();}}

            /> : ''}
            <ButtonTools options={buttons} styles={styles.button} getSearchData={()=>{
              return self.getSearchData()
            }} />
            </div> 
            
      </div>
    );
  }
}

SearchPart.propTypes = {
  title: PropTypes.string,
  conditions: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    key: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    format: PropTypes.func,
  })),
  buttons: PropTypes.arrayOf(PropTypes.shape({})),
  beforeSearch: PropTypes.func,
  onSearch: PropTypes.func,
  valid: PropTypes.arrayOf(PropTypes.shape({})),
  buttonsContainerStyle: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array,PropTypes.string]),
};

SearchPart.defaultProps = {
  title: '查询列表',
  method: 'get',
  conditions: [],
  buttons: null,
  buttonsContainerStyle: {},
  beforeSearch: () => {},
  onSearch: () => {},
  valid: []
};
