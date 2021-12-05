import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../EditConditionPart/style';
import { Toaster, Row, Col } from '../../Components/';
import isValid from '../../utils/validFuncs';
import Theme from '../../Components/Style/theme';
import * as arrayUtils from '../../utils/array';
import genInput from '../factory';
import md5 from 'js-md5';
import { ThemeContext } from  'context';
import ButtonTools from '../ButtonTools';
import * as sessions from '../../utils/sessions';

class EditPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasItems: true,
      respData: this.props.respData,
      valid: this.props.valid,
      editItemList: this.props.editItemList || {},
      cachData: this.props.cachData,
      funcButton: this.props.funcButton,
      listStatus: {},
      validStatus:{},
    };
    this.getData = this.getData.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.genInput = genInput.bind(this);
  }
  componentDidMount(){
    this.setlistStatus()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      respData: nextProps.respData,
      valid: nextProps.valid,
      editItemList: nextProps.editItemList,
      cachData: nextProps.cachData,
      funcButton: nextProps.funcButton
    });
  }
  setlistStatus(){
    const { editItemList, listStatus } = this.state;
    let newlistStatus = JSON.parse(JSON.stringify(listStatus)) 
    for(let i =0; i< editItemList.length;i++){
      if (editItemList[i].isShow!==undefined) {
        newlistStatus[editItemList[i].key] = editItemList[i].isShow
      }
    }
    this.setState({
      listStatus: newlistStatus
    })
  }
  checkRequired(valid, conditionValid) {
    if (valid) {
      return (
        <span style={styles.require}>*</span>
      );
    }

    return null;
  }
  //获取每个表单元素的值
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
    const { editItemList } = this.state;
    const data = {};
    editItemList&&arrayUtils.forEach(editItemList, (item) => {
      data[item.key] = this.getDomData(item, true);
      item.value = this.getDomData(item, true);
    });

    return data;
  }

  checkItemValid(item) {
    const { valid, validDiy } = item;
    const { listStatus } = this.state;
    const $$dom = this[`$$${item.key}`];
    // 判断当前表单元素是否是隐藏的
    if (listStatus&&listStatus[item.key]===false) {
      return true;  //如果是隐藏的则不校验
    }
    const value = $$dom.getValue ? $$dom.getValue() : $$dom.value;
    item.value = value
    let newVaild = valid;
    if(valid == 'diy'){
      newVaild = new RegExp(validDiy) ;
    }

    const remarkDom = this[`$$${item.key}-remark`];
    let vaildStatus = isValid(value, newVaild);
    if(vaildStatus===false||vaildStatus===''){
      remarkDom.style.display = 'inline-block';
    } else{
      remarkDom.style.display = 'none';
    }
    return vaildStatus;
  }
  checkValid() {
    const { editItemList, listStatus } = this.state;
    let status =  true;
    let newEditItemList = JSON.parse(JSON.stringify(editItemList));
    let newListStatus = JSON.parse(JSON.stringify(listStatus));
    // 单个校验
    for(let i=0;i<newEditItemList.length;i++){
      const res = this.checkItemValid(newEditItemList[i]);
      if (!res) {
        status = false;
        newEditItemList[i].isValid = true
        newListStatus[new Date().getTime()] = true;
        this.setState({
          editItemList:  newEditItemList,
          listStatus: newListStatus
        })
        // console.log(newEditItemList[i]);
        Toaster.toaster({ type: 'error', content: newEditItemList[i].errorMsg|| '系统错误' }, true);
        break;
      } else{
        newEditItemList[i].isValid = false
        this.setState({
          editItemList:  newEditItemList
        })
      }
    }
    return status;
  }
  setShow(status, linkDomKey){
    const { listStatus } = this.state;
    let newlistStatus = JSON.parse(JSON.stringify(listStatus));
    newlistStatus[linkDomKey] = status
    this.setState({
      listStatus: newlistStatus
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    const { listStatus } = this.state;
    // console.log(listStatus);
    // console.log(nextState.listStatus)
    // console.log('componentWillUpdate', md5(JSON.stringify(nextState.listStatus)), md5(JSON.stringify(listStatus)));
    if(md5(JSON.stringify(nextState.listStatus)) == md5(JSON.stringify(listStatus))) {
      return true
    }
    return false
  }

  save(callback) {
    if (this.checkValid()) {
      const comdata = this.getData();
      callback(comdata)
    }
  }

  mergeData(arr, res){
    let newArr = JSON.parse(JSON.stringify(arr));
    let newEditItemList = arrayUtils.mergeListNew(newArr, res);
    return newEditItemList
  }
  render() {
    const { editItemList, pageData, cachData, respData, funcButton } = this.state;
    const self = this;
    const that = this;
    let newEditItemList = this.mergeData(editItemList, respData);
    if(cachData) {
      newEditItemList = this.mergeData(newEditItemList, cachData);
    }

    return (
      <div>
        {
          newEditItemList&&newEditItemList.length>0? newEditItemList.map((editItem, idx) => {
            const key = `${idx}-${editItem.text}`;
            const dispStyle = {};
            if (editItem.isShow!==undefined) {
              if (editItem.isShow==false) {
                dispStyle.display = 'none';
              }
            }
           
            let contStyle = {}
            if(editItem.contStyle) {
              contStyle = arrayUtils.arrToObg(editItem.contStyle, 'text', 'value')
              // console.log(contStyle);
            }
            let textContStyle= {}
            if(editItem.textContStyle) {
              textContStyle = arrayUtils.arrToObg(editItem.textContStyle, 'text', 'value')
              // console.log(contStyle);
            }
            // console.log('editItem', editItem);
            return (
              <div
                key={key}
                ref={(dom) => {
                  this[`$$wrap-${editItem.key}`] = dom;
                }}
                style={Object.assign({}, styles.container, contStyle, dispStyle)}
              >
                <Row>
                  <Col span={JSON.stringify(contStyle)!=='{}' ? 8 : ''} style={Object.assign({}, styles.text, textContStyle) }  className="text-align-right maxwidthx-130 text-overflow padding-right-3" title={editItem.text}>
                  {
                    this.checkRequired(editItem.valid, editItem.conditionValid)
                  }
                  <span style={editItem.textStyle}>
                    {editItem.text} 
                  </span>
                </Col>
                <Col span={14}>
                {editItem ? <Row>
                          <Col span={22} style={editItem.isValid ? { 'border': `1px solid ${Theme.error}`,
                          'display': 'inline-flex', 'borderRadius': '0.2rem'
                          }: {} }>{
                            editItem.hasTmplate ? '' :this.genInput(editItem, idx, (res, linkDomKey)=>{
                            // console.log('checkStatus', res, linkDomKey);
                            self.setShow(res, linkDomKey)
                            }, (itm, valueBack)=>{  return self.props.getPages(itm, valueBack) })
                          }</Col>
                          <Col span={2} className="text-align-center" >{editItem.after || ''}{editItem.remark || ''}</Col>
                          <Col>{
                            editItem.hasTmplate ? self.props.getPages(editItem): ''
                          }</Col>
                          <div style={{'color': Theme.error, 'display': 'none'}} ref={(r) => { this[`$$${editItem.key}-remark`] = r; }}>{editItem.errorMsg}</div> 
                  </Row>: ''}
                
                </Col>
                </Row>
                
              </div>
            );
          }) : ''
        }
        <Row justify={'flex-start'} className="padding-left-1r display-inline-block">
          <ThemeContext.Consumer>
                { context => {return (<ButtonTools options={funcButton} styles={styles.btn} pageData={pageData}
            callback={()=>{that.props.callback()}}   doParentAction={()=>{
              that.save((res)=>{
                // sessions.setStorage(`${that.props.pageData.url}-forData`, res)
                context.parentCall(res, that.props.pageData)
              })  
            }} doParentSubmitAction={(btn, resolve, reject)=>{
              that.save((res)=>{
                context.parentSubmitCall(res, btn, resolve, reject)
              })
            }}/>)
          }}
          </ThemeContext.Consumer>
          </Row>
      </div>
    );
  }
}

EditPart.propTypes = {
  editItemList: PropTypes.oneOfType([PropTypes.shape({}),PropTypes.array, PropTypes.func]),
  valid: PropTypes.arrayOf(PropTypes.shape()),
  respData: PropTypes.oneOfType([PropTypes.shape({}),
  PropTypes.arrayOf(PropTypes.shape({})), PropTypes.func]),
  callback: PropTypes.func
};

EditPart.defaultProps = {
  valid: [],
  respData: {},
  editItemList: [],
  callback:()=>{}
};

export default EditPart;
