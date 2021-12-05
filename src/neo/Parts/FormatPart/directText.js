import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../utils/config';
import fetch from '../../utils/request';
import * as arrUtil from '../../utils/array';

class DirectText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: this.props.option||{},
      value: ''
    };
    this.getValue = this.getValue.bind(this);
  }
  componentDidMount() {
    this.fetchData()
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      option: nextProps.option
    },()=>{ this.fetchData() })
  }
  getValue(){
    return this.state.value
  }
  setReq(condition, parmes){
    if(!parmes) return;
    let resp = {}
    for(let i=0;i<condition.length;i++){
      resp[condition[i].key] = condition[i].value&&condition[i].value!=='' ? condition[i].value : parmes
    }
    return resp
  }

  fetchData(){
    const { option } = this.state;
    let urlInfo = option.urlInfo
    const self = this;
    if(!option.value) return;
    if(urlInfo&&urlInfo.url) {
      let reqData = urlInfo.options&&urlInfo.options.length>0 ? self.setReq(urlInfo.options, option.value): {};
      fetch(urlInfo.url, {
        method: urlInfo.method,
        data: reqData
      }, urlInfo.header||{}, urlInfo).then((res) => {
        if (res.code === config.SUCCESS) {
          let optionData = res.data&&res.data.data ? res.data.data: res.data
          if(urlInfo.textKey){
            optionData = arrUtil.getOptions(optionData, urlInfo.textKey, urlInfo.valueKey)
          }

          let values = arrUtil.getItemKeyForValue(optionData, option.value, 'value', 'text')
          self.setState({
            value: values
          })
        }
      }).catch((err)=>{
        // console.log('err',err);
      });
    }
  }

  render() {
    const { value } = this.state;
    let result = typeof value == 'object' ? JSON.stringify(value): value;
    if(JSON.stringify(value)=='{}'||result=='') { result = '—'}
    return (
      <div>{result}</div>
    );
  }
}

DirectText.propTypes = {
  option: PropTypes.shape(),
};

DirectText.defaultProps = {
  option: {},
};


export default DirectText;
