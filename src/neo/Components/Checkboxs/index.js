import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonCheckbox from './box';
import * as arrayUtils from '../../utils/array';
import fetch from '../../utils/request';
import config from '../../utils/config';
import styles from './style';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    const { value, options, hasRequest, initRequest, disabled, hasDefaultCheckAll } = this.props;
    let newOptions = eval(options);
    this.state = {
      value: value || (newOptions && newOptions[0] && newOptions[0].value),
      checkArr: {},
      options: newOptions || [{}],
      hasRequest: hasRequest,
      initRequest: initRequest,
      disabled: disabled,
      checkAllStatus: hasDefaultCheckAll ? 'checked' : false
    };
    this.getValue = this.getValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkAll = this.checkAll.bind(this);
  }
  componentDidMount() {
    const { onChange, hasRequest, enableOptionInitRequest, hasDefaultCheckAll } = this.props;
    this.initState(this.props.options);
    if(hasRequest==true&&enableOptionInitRequest==true){
      this.initRequest()
    }
    if(hasDefaultCheckAll){
      this.checkAll('checked');
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      options: nextProps.options,
      checkArr: {}
    });
  }
  getValue() {
    const { labelFiled, valueFiled } = this.props;
    let checkData = this.getCheckedData()
    let result = arrayUtils.getOptionsWidthFiled(checkData, 'text', 'value', labelFiled, valueFiled)
    return result;
  }
  getCheckedData(){
    const arr = this.state.checkArr;
    let newArr = []
    let keys = Object.keys(arr);
    let values = Object.values(arr);
    for (let i = 0; i < keys.length; i++) {
      if (values[i].checkStatus == 'checked') {
        newArr.push(values[i]);
      }
    }
    return newArr;
  }
  initState(options) {
    const arr = this.state.checkArr;
    console.log('options', options);
    for (let i = 0; i < options.length; i++) {
      if (options[i].disabled !== true) {
        if (options[i].checkStatus === 'checked') {
          arr[options[i].value] = { value: options[i].value, text: options[i].text, checkStatus: 'checked' };
        } else {
          arr[options[i].value] = { value: options[i].value, text: options[i].text, checkStatus: 'unchecked' };
        }
      }
    }
    this.setState({ checkArr: arr });
  }

  initRequest(parems, defaultValue){
    const { initRequest } = this.props;
    // console.log('initRequest', initRequest);
    
    const self = this;
    if(initRequest&&initRequest.url) {
      fetch(initRequest.url, {
        method: initRequest.method,
        data: Object.assign({}, self.setReqs(initRequest.options, {}), parems||{})
      }, initRequest.header||{}, initRequest).then((res) => {
        if (res.code === config.SUCCESS) {
          let options = arrayUtils.getOptions(res.data, initRequest.textKey, initRequest.valueKey)
          let allOptions = [{text: '请选择', value: ''}]
          allOptions.push(...options);
          
          self.initState(allOptions);
        } else {
          // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch((err)=>{
        // console.log(err);
      });
    }
  }

  handleChange(item) {
    if (item.disabled) {
      return;
    }
    const arr = this.state.checkArr;
    if (item.checkStatus === 'unchecked') {
      arr[item.value] = { value: item.value, text: item.text, checkStatus: 'checked' };
    } else {
      arr[item.value] = { value: item.value, text: item.text, checkStatus: 'unchecked' };
    }
    this.setState({ checkArr: arr });
    this.props.onChange(arr);
  }
  checkAll(status) {
    const arr = this.state.checkArr;
    const keys = Object.keys(arr);
    for (let i = 0; i < keys.length; i++) {
      if (arr[keys[i]].disabled) {
        return;
      }
      if (status) {
        arr[keys[i]].checkStatus = 'checked';
      } else {
        arr[keys[i]].checkStatus = 'unchecked';
      }
    }
    this.setState({ checkArr: arr });
    this.props.onChange(arr);
  }
  render() {
    const { disabled, style, hasCheckAll, hasDefaultCheckAll } = this.props;
    const { options, checkAllStatus } = this.state;
    const containerStyle = Object.assign({}, styles.container, style);

    // const name = Base.genRandomId();
    const self = this;
    const compon = options.map((item, idex) => {
      const keys = `${idex}-checkbox`;
      const inputDisabled = disabled || item.disabled;
      const arr = this.state.checkArr;
      let checkStatus = item.checkStatus;
      if (arr[item.value]) {
        checkStatus = arr[item.value].checkStatus;
      }
      return (<CommonCheckbox
        key={keys}
        disabled={inputDisabled}
        change={self.handleChange}
        checkStatus={checkStatus}
        value={item.value}
        text={item.text}
      />);
    });

    const checkAllDom = hasCheckAll ? <CommonCheckbox
        change={(res)=>{
           console.log('res', res);
          if (checkAllStatus === 'unchecked') {
            self.setState({
              checkAllStatus: 'checked'
            },()=>{self.checkAll('checked')})
            
          } else{
            self.setState({
              checkAllStatus: 'unchecked'
            },()=>{self.checkAll()})
          }
        }}
        checkStatus={checkAllStatus}
        value={'checkAll'}
        text={'全选'}
      /> : ''

    return (
      <div
        style={containerStyle}
        ref={(commonCheckbox) => { this.commonCheckbox = commonCheckbox; }}
      >
        {checkAllDom}
        {compon}
      </div>
    );
  }
}

Checkbox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})),
  disabled: PropTypes.bool,
  style: PropTypes.shape({}),
  onChange: PropTypes.func,
  hasCheckAll: PropTypes.bool,
  hasDefaultCheckAll: PropTypes.bool,
};

Checkbox.defaultProps = {
  options: [{ value: 'checked', text: ''}],
  disabled: false,
  style: {},
  onChange: () => {},
  hasCheckAll: false,
  hasDefaultCheckAll:false,
};

export default Checkbox;
