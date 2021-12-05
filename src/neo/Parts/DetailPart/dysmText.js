import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../utils/config';
import fetch from '../../utils/request';
import * as arrayUtils from '../../utils/array';

class DysmText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: this.props.option||{},
      value: ''
    };
  }
  componentDidMount() {
    this.fetchData()
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      option: nextProps.option
    },()=>{ this.fetchData() })
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
      reqData = arrayUtils.comSetReqs(urlInfo.options, reqData, arrayUtils.arrayToObg(option.pageData, 'key', 'value'));
      fetch(urlInfo.url, {
        method: urlInfo.method,
        data: reqData
      }, urlInfo.header||{}, urlInfo).then((res) => {
        if (res.code === config.SUCCESS) {
          self.setState({
            value: urlInfo.textKey ? res.data[urlInfo.textKey] : res.data
          })
        }
      }).catch((err)=>{
        // console.log('err',err);
      });
    }
  }

  render() {
    const { value } = this.state;
   
    return (
      <div>{value}</div>
    );
  }
}

DysmText.propTypes = {
  option: PropTypes.shape(),
};

DysmText.defaultProps = {
  option: {},
};


export default DysmText;
