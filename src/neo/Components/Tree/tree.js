import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import styles from './style';
import TreeNode from './treeNode';
import { sessions } from '../../utils';
class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkArr: [],
      parent: {},
      parents: [],
      contradiction: '',
      parentsArr: [],
      data: this.props.Date
    };
    this.onCheck = this.onCheck.bind(this);
    this.checkInChildres = this.checkInChildres.bind(this);
    this.chargeTree = this.chargeTree.bind(this);
    this.onDelAmb = this.onDelAmb.bind(this);
    this.getValue = this.getValue.bind(this);
    this.checkAll = this.checkAll.bind(this);
  }

  componentDidMount(){
  }

  resetCheckArr(data, prekey, level, newData){
    for(let i =0;i<data.length; i++){
      let item = data[i]
      item.prekey = prekey;
      item.preKey = prekey;
      item.level = level;
      if(item.checkStatus=='checked'||item.checkStatus=='ambivalent'){
        // console.log(item);
        newData[item.tkey] = { checkStatus: item.checkStatus, item:  item};
        if(item.children){
          this.resetCheckArr(item.children, item.tkey, level+1, newData)
        }
      }
    }
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({
      data: nextProps.Date
    },()=>{
      const { data } = this.state;
      let newData = {}
      let result = this.resetCheckArr(data, '', 1, newData);
      //  console.log('newData', newData);
       this.setState({
        checkArr: newData
       })
    })
  }
  getValue(){
    // console.log('checkArr', checkArr)
    setTimeout(()=>{
      sessions.setStorage('checkArr', {})
    }, 2000)
    let resultTree = this.resetTree();
    return resultTree;
  }

  resetTree(){
    let checkArr = this.state.checkArr;
    // let arr = sessions.getStorage('checkArr')||[];
    // if(arr){
    //   checkArr = Object.assign({},checkArr, arr );
    // }
    let keys = Object.keys(checkArr);
    let values = Object.values(checkArr);
    let result = []
    const self = this;
    
    try {
    for(let i=0;i<keys.length;i++){
      if(values[i].item&&values[i].item.prekey==''){
        // console.log('prekey', values[i].item);
        let child = self.getTreeChild(values[i].item.tkey, checkArr)
        if(child.length>0){
          result.push({
            pNode: values[i].item,
            child: child
          })
        }
        
      }
    }
    }catch(e){
      // console.log('e', e)
    }
    // console.log('result', result)
    return result
  }
  getTreeChild(prekey, checkArr){
    let keys = Object.keys(checkArr);
    let values = Object.values(checkArr);
    let child = []
    for(let i=0;i<keys.length;i++){
      let valuePreKey = values[i].item.prekey
      if(valuePreKey.indexOf('-t')<0){
        valuePreKey = valuePreKey + '-t'
      }
      if(values[i].item&&(valuePreKey)==prekey&&values[i].checkStatus=='checked'){
        // console.log('prekey', values[i].item);
        child.push(values[i].item)
      }
    }
    return child
  }
  // setInCheckArr(item){
  //   let arr = sessions.getStorage('checkArr')||{};
  //   const self = this;
  //   arr[item.tkey] = { checkStatus: item.checkStatus, item:  item};
  //   sessions.setStorage('checkArr', arr)
  // }
  onCheck(item) {
    // console.log(item);
    let arr = this.state.checkArr;
    if (item.checkStatus === 'unchecked') {
      arr[item.tkey] = { checkStatus: 'checked', item:  item};
    } else {
      arr[item.tkey] = { checkStatus: 'unchecked', item:  item };
    }
    if (item.children.length > 0) {
      arr = this.chargeChildren(item.children, arr);
    }
    this.props.onTreeCheck(item)
    this.setState({ checkArr: arr });
    const self = this;
    // self.getAllFatherNode(this.props.Date, item.title, arr, self);
    this.getFatherNode(this.props.Date, item.tkey).then((res) => {
      // console.log(this.state.parent);
      // console.log(this.state.parents);
      // console.log('res', res);

      const parents = this.state.parents;
      for (let i = 0; i < parents.length; i++) {
        const res = self.chargeTree(parents[i].children, this.state.checkArr);
        // console.log(res, parents, parents[i].key);
        if (res.statu) {
          arr[parents[i].tkey] = { checkStatus: 'ambivalent', item:  parents[i] };
        } else {
          arr[parents[i].tkey] = { checkStatus: res.contrad, item:  parents[i] };
        }
      }
      this.setState({ checkArr: arr, parents: [] });
    });
  }
  onDelAmb(itm) {
    let arr = this.state.checkArr;
    if (itm.children.length > 0) {
      arr = this.chargeChildren(itm.children, arr, 'checked');
    }
    arr[itm.tkey] = { checkStatus: 'checked' };
    this.setState({ checkArr: arr });
  }
  getFatherNode(arr, tkey) {
    return new Promise((resolve) => {
      const result = this.checkInChildres(arr, tkey);
      resolve(result);
    });
  }
  chargeTree(treeArr, checkArr) {
    this.treeArr = treeArr;
    let contradiction = '';
    let status = false;
    for (let i = 0; i < treeArr.length; i++) {
      const theCheck = checkArr[treeArr[i].tkey];
      if (theCheck) {
        if (contradiction !== '') {
          if (theCheck.checkStatus !== contradiction) {
            status = true;
            break;
          } else {
            status = false;
          }
        } else {
          status = true;
          contradiction = theCheck.checkStatus;
        }
      } else if (!theCheck && contradiction === 'unchecked') {
        status = false;
      } else {
        status = true;
      }
    }
    return { statu: status, contrad: contradiction };
  }
  // 递归遍历是否在子数组中，setState 找到的父节点
  checkInChildres(arr, tkey) {
    const theArrS = [];
    let checkArrS = false;
    let result = '';
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].tkey !== tkey) {
        if (arr[i].children) {
          result = this.checkInChildres(arr[i].children, tkey);
          const arrs = this.state.parents;
          if (result.theArr && result.theArr.length === 0 && result.checkArr) {
            // console.log(arr[i]);
            theArrS.push(arr[i]);
            arrs.push(arr[i]);
            checkArrS = result.checkArr;
            this.setState({ parent: { checkArr: result.checkArr, theArr: arr[i] } });
            break;
          } else if (result.checkArr && result.theArr.length > 0) {
            arrs.push(arr[i]);
            theArrS.push(arr[i]);
            checkArrS = result.checkArr;
            break;
          }
          this.setState({ parents: arrs });
        }
      } else {
        checkArrS = true;
        break;
      }
    }
    return { checkArr: checkArrS, theArr: theArrS, results: result };
  }
  // 改变checkArr数组 key为 arr数组的每一个状态
  chargeChildren(arr, checkArr, status) {
    for (let i = 0; i < arr.length; i++) {
      if (status) {
        checkArr[arr[i].props.tkey] = { checkStatus: status, item:arr[i].props };
      } else if (arr[i].props.checkStatus === 'unchecked') {
        checkArr[arr[i].props.tkey] = { checkStatus: 'checked', item:arr[i].props };
      } else {
        checkArr[arr[i].props.tkey] = { checkStatus: 'unchecked', item:arr[i].props };
      }

      if (arr[i].props.children.length > 0) {
        checkArr = this.chargeChildren(arr[i].props.children, checkArr, status);
      }
    }
    return checkArr;
  }
  chargeChildrenStatus(arr, checkArr, status, prekey) {
    for (let i = 0; i < arr.length; i++) {
      if (status) {
        checkArr[arr[i].tkey] = { checkStatus: status, item:arr[i] };
      } else if (arr[i].checkStatus === 'unchecked'|| arr[i].checkStatus==undefined) {
        checkArr[arr[i].tkey] = { checkStatus: 'checked', item:arr[i] };
        arr[i].checkStatus = 'checked';
      } else {
        arr[i].checkStatus = 'unchecked';
        checkArr[arr[i].tkey] = { checkStatus: 'unchecked', item:arr[i] };
      }

      if (arr[i].children&&arr[i].children.length > 0) {
        checkArr = this.chargeChildrenStatus(arr[i].children, checkArr, status, arr[i].keyID);
      }
    }
    return checkArr;
  }
  checkAll(){
    const data = this.state.data;
    let arr = this.state.checkArr;
    data&&data.length>0? data.map((item, idx)=>{
      if (item.checkStatus === 'unchecked'|| item.checkStatus==undefined) {
        item.checkStatus = 'checked';
        arr[item.tkey] = { checkStatus: 'checked', item:  item};
      } else {
        item.checkStatus = 'unchecked';
        arr[item.tkey] = { checkStatus: 'unchecked', item:  item };
      }
      if (item.children&&item.children.length > 0) {
        arr = this.chargeChildrenStatus(item.children, arr, null ,item.keyID);
      }
    }) : '';
    this.setState({ checkArr: arr, data: data });
  }
  loop = (data, prekey, level) => data.map((item) => {
    const arr = this.state.checkArr;
    const { checkable, display, activeNode, transKey } = this.props;
    const actived = activeNode && activeNode === item.title;
    let checkStatus = arr[item.tkey] ? arr[item.tkey]&&arr[item.tkey].checkStatus : (item.checkStatus || 'unchecked');
    
    if(transKey){
      let keys = Object.keys(transKey);
      let values = Object.values(transKey);
      for(let i = 0; i<keys.length;i++){
        if(item[values[i]]){
          item[keys[i]] = item[values[i]]
        }
      }
    }
    // console.log('prekey', prekey, level)
    item.tkey = item.tkey + '-t'
    item.prekey = prekey;
    item.preKey = prekey;
    item.level = level;
    // if(item.checkStatus=='checked'||item.checkStatus=='ambivalent'){
    //   console.log(item);
    //   this.setInCheckArr(item)
    // }
    if (item.children) {
      return (
        <TreeNode
          prekey={item.preKey} key={item.tkey} tkey={item.tkey} title={item.title} link={item.link}
          onCheck={this.onCheck}
          onDelAmb={this.onDelAmb} checkStatus={checkStatus} checkable={checkable}
          display={display} active={actived}
        >
          {this.loop(item.children, item.tkey, level+1)}
        </TreeNode>
      );
    }
    return (<TreeNode
      prekey={item.preKey} key={item.tkey} tkey={item.tkey} title={item.title} link={item.link} onCheck={this.onCheck}
      onDelAmb={this.onDelAmb} checkStatus={checkStatus} checkable={checkable} active={actived}
      display={display}
    />);
  });

  render() {
    const { data }= this.state;
    return (
      <ul style={arrayUtils.merge([styles.ul])}>
        {this.loop(data, '', 1)}
      </ul>
    );
  }
}

Tree.propTypes = {
  Date: PropTypes.arrayOf(PropTypes.shape({})),
  checkable: PropTypes.bool,
  display: PropTypes.string,
  activeNode: PropTypes.string,
  onTreeCheck: PropTypes.func,
};

Tree.defaultProps = {
  Date: [],
  checkable: false,
  display: 'hide',
  activeNode: '',
  onTreeCheck: ()=>{}
};


export default Tree;
